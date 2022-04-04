import { useUserContext } from "../context/UserContext";
import Card from "../shared/Card";

const MyOrders = ({ orders, setOrders }) => {
  const { user } = useUserContext();

  const filteredOrders = orders.filter((order) => order.creatorId === user.id);

  return (
    <>
      <h2>My Orders</h2>
      {filteredOrders.map((order) => {
        return (
          <Card key={order.id}>
            <div>
              <div>Order Number : {order.id}</div>
              <div>Subtotal: {order.subtotal} </div>
              <h2>Items</h2>
              {order.products.map((product) => {
                return (
                  <Card>
                    <div key={product.id}>
                      <div>Artist: {product.artist}</div>
                      <div>Title: {product.title}</div>
                      <div>Price: {product.price}</div>
                      <div>Quantity: {product.quantity}</div>
                      <br></br>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        );
      })}
    </>
  );
};

export default MyOrders;
