import React, { useState, useEffect } from "react";
import { Route, Routes, Link } from "react-router-dom";
import HomePage from "./HomePage";
import Orders from "./Orders";
import { fetchOrders, getUser } from "../api";

const App = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState({});

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

  return (
    <div className="App">
      <nav className="navbar">
        <Link to="/">Home</Link>
        {<Link to="/orders">Orders</Link>}
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
      </Routes>
    </div>
  );
};

export default App;
