import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import {
  HomePage,
  Orders,
  Products,
  SingleProduct,
  MyProfile,
  MyOrders,
  Header,
  AddProduct,
  Login,
  Register,
  Cart,
  EditProduct,
  Users,
  MyReviews
} from "./";
import {
  fetchOrders,
  addOrder,
  addProductToOrder,
  updateOrderProduct,
} from "../api";
import { getAllProducts } from "../api/productsApi";
import { getAllCategories } from "../api/categoryApi";
import AboutIconLink from "../shared/AboutIcon";
import AboutPage from "./AboutPage";

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const { token, user } = useUserContext();

  const fetchCategories = async () => {
    try {
      setCategories(await getAllCategories());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      setProducts(await getAllProducts());
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrders = async () => {
    try {
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error at fetchedOrders", error);
    }
  };

  const handleAdd = async (event, product) => {
    let orderData = {};
    try {
      if (Object.keys(cart).length === 0) {
        orderData = await addOrder({ subtotal: 0 }, token);
        setCart(orderData);
      } else {
        orderData = cart;
      }
      let isInCart = false;
      orderData.products.forEach((item) => {
        if (product.id === item.productId) {
          isInCart = true;
          item.quantity += 1;
        }
      });
      if (isInCart) {
        const [productToUpdate] = orderData.products.filter(
          (item) => product.id === item.productId
        );
        await updateOrderProduct(
          productToUpdate.quantity,
          productToUpdate.id,
          token
        );
        setCart(orderData);
      } else {
        const productData = await addProductToOrder(
          orderData.id,
          product.id,
          1,
          product.price,
          token
        );
        if (!productData) {
          return;
        }
        // this OR statement accounts for the cart being undefined on first click
        let cartProductsArray = cart.products || [];
        cartProductsArray.push(productData);
        const setter = Object.keys(cart).length === 0 ? orderData : cart;
        setCart({ ...setter, products: cartProductsArray });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUserOrders = async () => {
    try {
      if (Object.keys(user).length) {
        const userOrders = orders.filter(
          (order) => order.creatorId === user.id
        );
        userOrders.forEach((order) => {
          if (order.currentStatus === "created") {
            setCart(order);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleOrders();
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchUserOrders();
  }, [orders, user]);

  return (
    <Router>
      <Header
        cart={cart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={
              <Products
                products={products}
                setProducts={setProducts}
                cart={cart}
                setCart={setCart}
                handleAdd={handleAdd}
                searchTerm={searchTerm}
                orders={orders}
                setOrders={setOrders}
              />
            }
          />
          <Route
            path="/products/:productId"
            element={<SingleProduct products={products} />}
          />
          <Route
            path="/myorders"
            element={<MyOrders orders={orders} setOrders={setOrders} />}
          />
          <Route path="/myreviews" element={<MyReviews />} />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                setCart={setCart}
                setOrders={setOrders}
                orders={orders}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myprofile" element={<MyProfile setCart={setCart} />} />
          {user?.isAdmin && (
            <>
              <Route
                path="/addproduct"
                element={
                  <AddProduct
                    products={products}
                    setProducts={setProducts}
                    categories={categories}
                  />
                }
              />
              <Route path="/admin/users" element={<Users />} />
              <Route
                path="/admin/orders"
                element={<Orders orders={orders} />}
              />
            </>
          )}
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/products/edit/:editProductId"
            element={
              <EditProduct
                products={products}
                setProducts={setProducts}
                categories={categories}
              />
            }
          />
        </Routes>
        <AboutIconLink />
      </div>
    </Router>
  );
};
export default App;
