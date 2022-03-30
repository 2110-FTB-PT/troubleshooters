const OrderView = ({ cart, setCart }) => {
  return (
    <>
      <div>
        {Object.keys(cart).length &&
          cart.products.map((product) => {
            let optionsArray = [];
            for (let i = 1; i <= product.inventoryQuantity; i++) {
              optionsArray.push[i];
            }
            console.log(optionsArray);
            return (
              <div key={`${product.id}-${product.title}`}>
                <div>{product.title}</div>
                <div>{product.price}</div>
                <select
                  value={product.quantity}
                  onChange={(event) => {
                    let tempArray = cart.products;
                    tempArray.forEach((item) => {
                      if (item.id === product.id) {
                        item.quantity = Number(event.target.value);
                      }
                    });
                    setCart({ ...cart, products: tempArray });
                    console.log(cart);
                  }}
                >
                  {optionsArray.map((number) => {
                    return (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          })}
      </div>

      <button>Checkout</button>
    </>
  );
};

export default OrderView;