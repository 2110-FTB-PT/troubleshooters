import { deleteOrderProduct, stripeCheckout, updateOrderProduct } from "../api";
import Button from "../shared/Button";
import { useUserContext } from "../context/UserContext";

const OrderView = ({ cart, setCart }) => {
  const { token } = useUserContext();
  const handleCheckout = async () => {
    try {
      cart.products.forEach(async (product) => {
        await updateOrderProduct(
          product.quantity,
          product.orderProductId,
          token
        );
      });
      await stripeCheckout(cart.products);
    } catch (error) {
      console.error(error);
    }
  };
  const handleRemoveProduct = async (product) => {
    try {
      const { id: deletedOrderProductId } = await deleteOrderProduct(
        token,
        product.orderProductId
      );
      const remainingProductsInCart = cart.products.filter(
        (product) => product.orderProductId !== deletedOrderProductId
      );
      setCart({ ...cart, products: remainingProductsInCart });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div>
        {Object.keys(cart).length &&
          cart.products.map((product) => {
            let optionsArray = [];
            for (let i = 1; i <= product.inventoryQuantity; i++) {
              optionsArray.push(i);
            }
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
                <Button
                  onClick={() => {
                    handleRemoveProduct(product);
                  }}
                >
                  Remove from cart
                </Button>
              </div>
            );
          })}
      </div>
      <Button onClick={handleCheckout}>Checkout</Button>
    </>
  );
};

export default OrderView;
