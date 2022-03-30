import { useState, useEffect } from "react";
import OrderView from "./OrderView";
import { fetchSingleOrder } from "../api";

const Cart = ({ cart, setCart }) => {
  const handleFetchSingleOrder = async () => {
    const order = await fetchSingleOrder(cart.id);
    setCart(order);
    console.log(order);
  };
  useEffect(() => {
    handleFetchSingleOrder();
  }, []);

  return (
    <>
      <h2>Your Order</h2>
      <OrderView cart={cart} setCart={setCart} />
    </>
  );
};

export default Cart;
