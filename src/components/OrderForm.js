const OrderForm = ({ order, setOrder, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={order.name}
        placeholder="Name"
        onChange={(event) => {
          setOrder({ ...order, name: event.target.value });
        }}
      />
      <input
        value={order.subtotal}
        placeholder="Subtotal"
        onChange={(event) => {
          setOrder({ ...order, subtotal: event.target.value });
        }}
      />
      <button>Submit</button>
    </form>
  );
};

export default OrderForm;
