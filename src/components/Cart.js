import { useState, useEffect } from "react";
import OrderView from "./OrderView";
import { fetchSingleOrder, getUser, updateOrder } from "../api";
import { useUserContext } from "../context/UserContext";

const Cart = ({ cart, setCart, orders, setOrders }) => {
  const { user, token } = useUserContext();
  const handleFetchSingleOrder = async () => {
    const order = await fetchSingleOrder(cart.id);
    setCart(order);
  };
  const fetchOrderInProcess = async () => {
    let fetchedUser;
    if (token) {
      fetchedUser = await getUser(token);
    }
    const filteredOrders = orders.filter(
      (order) => order.creatorId === fetchedUser.id
    );
    filteredOrders.forEach(async (order) => {
      if (order.currentStatus === "processing") {
        setCart(order);
        const updatedOrder = await updateOrder(0, "created", order.id, token);
        const allOtherOrders = orders.filter(
          (orderItem) => orderItem.id !== order.id
        );
        setOrders([...allOtherOrders, updatedOrder]);
      }
    });
  };

  useEffect(() => {
    fetchOrderInProcess();
  }, [orders]);

  useEffect(() => {
    if (Object.keys(cart).length) {
      handleFetchSingleOrder();
    }
  }, []);

  return (
    <>
      <h2>Your Order</h2>
      <OrderView cart={cart} setCart={setCart} />
    </>
  );
};

export default Cart;
