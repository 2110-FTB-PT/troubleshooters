import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
  getUser,
  addOrder,
  addProductToOrder,
  updateOrderProduct,
} from "../api";

const App = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});

  const handleUser = async (token) => {
    try {
      const fetchedUsers = await getUser(token);
      setUser(fetchedUsers);
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
        console.log(orderData);
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
        await updateOrderProduct(productToUpdate.quantity, productToUpdate.id, token);
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
        console.log(cart);
        // this OR statement accounts for the cart being undefined on first click
        let cartProductsArray = cart.products || [];
        cartProductsArray.push(productData);
        const setter = Object.keys(cart).length === 0 ? orderData : cart;
        setCart({ ...setter, products: cartProductsArray });
        console.log(productData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleOrders();
  }, []);

  useEffect(() => {
    if (token) {
      handleUser(token);
    }
  }, [token]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  return (
    <Router>
      <Header cart={cart} />
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
                token={token}
                handleAdd={handleAdd}
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
                token={token}
                user={user}
                orders={orders}
                setOrders={setOrders}
              />
            }
          />
          <Route
            path="/myorders"
            element={
              <MyOrders
                token={token}
                user={user}
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
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route
            path="/addproduct"
            element={
              <AddProduct
                token={token}
                products={products}
                setProducts={setProducts}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};
export default App;
