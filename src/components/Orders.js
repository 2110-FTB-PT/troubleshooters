import { SingleProduct } from "./";
const Orders = ({ orders }) => {
  return (
    <div>
      <h2>Orders</h2>
      <hr />
      {orders.map((order) => {
        return (
          <div key={order.id}>
            <div>Customer Number : {order.creatorId}</div>
            <div>Subtotal: {order.subtotal}</div>
            <h2>Products</h2>
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
    </div>
  );
};

export default Orders;
