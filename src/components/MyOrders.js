import { useNavigate } from "react-router-dom";
import { AddOrder } from "./";
import { deleteOrder } from "../api";
import { useUserContext } from "../context/UserContext";

const MyOrders = ({ orders, setOrders }) => {
  const navigate = useNavigate();
  const { token, user } = useUserContext();

  const handleDelete = async (id) => {
    try {
      await deleteOrder(token, id);
      const newOrdersObject = orders.filter((order) => {
        return order.id !== id;
      });
      setOrders(newOrdersObject);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {token && <AddOrder token={token} order={order} setOrder={setOrder} />}
      <h2>My Orders</h2>
      {orders.map((order) => {
        return (
          <div key={order.id}>
            <div>Order Number : {order.id}</div>
            <div>Subtotal: {order.subtotal} </div>
            {user?.id === order.creatorId && (
              <button onClick={() => navigate(`/orders/${order.id}`)}>
                {" "}
                Edit{" "}
              </button>
            )}
            {user?.id === order.creatorId && (
              <button onClick={() => handleDelete(order.id)}> Delete </button>
            )}
            <h2>Items</h2>
            {order.products.map((product) => {
              return (
                <div key={product.id}>
                  <div>Artist: {product.artist}</div>
                  <div>Title: {product.title}</div>
                  <div>Price: {product.price}</div>
                  <div>Quantity: {product.quantity}</div>
                  <br></br>
                </div>
              );
            })}
            <hr />
          </div>
        );
      })}
    </>
  );
};

export default MyOrders;
