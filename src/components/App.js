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
  Login,
} from "./";
import { fetchOrders, getUser } from "../api";

const App = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
  console.log(searchTerm)

  return (
    <Router>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={<Products products={products} setProducts={setProducts} />}
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
            path="/myorders/:creatorId"
            element={
              <MyOrders
                token={token}
                user={user}
                orders={orders}
                setOrders={setOrders}
              />
            }
          />
          <Route path="/login" element={<Login setToken={setToken}/>} />
          <Route path="/myprofile" element={<MyProfile />} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;
