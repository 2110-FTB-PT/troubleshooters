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
  Cart,
} from "./";
import {
  fetchOrders,
  addOrder,
  addProductToOrder,
  updateOrderProduct,
} from "../api";
import AboutIconLink from "../shared/AboutIcon";
import AboutPage from "./AboutPage";

const App = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useUserContext();

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

  useEffect(() => {
    handleOrders();
  }, []);

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
              />
            }
          />
          <Route
            path="/products/:productId"
            element={<SingleProduct products={products} />}
          />
          <Route
            path="/orders"
            element={
              <Orders
                orders={orders}
                setOrders={setOrders}
              />
            }
          />
          <Route
            path="/myorders"
            element={
              <MyOrders
                orders={orders}
                setOrders={setOrders}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart cart={cart} setCart={setCart} setOrders={setOrders} />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route
            path="/addproduct"
            element={
              <AddProduct
                products={products}
                setProducts={setProducts}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <AboutIconLink />
      </div>
    </Router>
  );
};
export default App;
