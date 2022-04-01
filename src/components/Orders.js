import Card from "../shared/Card";

const Orders = ({ orders }) => {
  return (
    <div>
      <h2>Orders</h2>
      <hr />
      {orders.map((order) => {
        return (
          <Card key={`${order.id}-${order.subtotal}`}>
            <div >
              <div>Order Number: {order.id}</div>
              <div>Customer Number : {order.creatorId}</div>
              <div>Subtotal: {order.subtotal}</div>
              <h2>Products</h2>
              {order.products.map((product) => {
                return (
                  <Card key={`${order.id}-${product.id}-${product.title}`}>
                    <div >
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
    </div>
  );
};

export default Orders;
