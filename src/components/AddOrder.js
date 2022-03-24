import { useState } from "react";
import OrderForm from "./OrderForm";
import { addOrder, fetchOrders } from "../api";

const AddOrder = ({ setOrders }) => {
  const blankOrder = {
    subtotal: 0,
  };
  const [order, setOrder] = useState(blankOrder);

  const handleAdd = async (event) => {
    try {
      event.preventDefault();
      await addOrder(order);
      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders);
      setOrder(blankOrder);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <h2>Place Order</h2>
      <OrderForm handleSubmit={handleAdd} order={order} setOrder={setOrder} />
    </>
  );
};

export default AddOrder;
