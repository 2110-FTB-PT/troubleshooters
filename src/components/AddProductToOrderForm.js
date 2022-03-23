import { useState } from "react";
import { addProductToOrder } from "../api";

const AddProductToOrderForm = ({ products, orderId, handleOrders }) => {
  const [productId, setProductId] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addProductToOrder(orderId, productId * 1, quantity * 1, price * 1);
      await handleOrders();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a product to your order</h2>
      <label>Product</label>
      <select
        value={productId}
        onChange={(event) => {
          setProductId(event.target.value);
        }}
      >
        {products.map((product) => {
          return (
            <option value={product.id} key={product.id}>
              {product.title}
            </option>
          );
        })}
      </select>
      <label>Quantity</label>
      <input
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        type="number"
      />
      <label>Price</label>
      <input
        value={product.price}
        onChange={(event) => setPrice(event.target.value)}
        type="number"
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddProductToOrderForm;
