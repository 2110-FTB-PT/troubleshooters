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
} from "./";
import { fetchOrders } from "../api";

const App = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <Router>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={<Products products={products} setProducts={setProducts} searchTerm={searchTerm} />}
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
          <Route path="/login" element={<Login />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/addproduct" element={<AddProduct  products={products} setProducts={setProducts} />} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;
