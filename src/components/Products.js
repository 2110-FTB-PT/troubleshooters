import { useEffect, useState } from "react";
import Spinner from "../shared/Spinner";
import GenreList from "./GenreList";
import SingleProduct from "./SingleProduct";
import Card from "../shared/Card";
import crate from "../assets/WebAssets/crate.jpeg";
import { updateOrder, getUser } from "../api";
import { useUserContext } from "../context/UserContext";

const Products = ({
  products,
  setProducts,
  handleAdd,
  searchTerm,
  orders,
  setOrders,
  setCart,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useUserContext();

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
        setCart({});
        const updatedOrder = await updateOrder(0, "completed", order.id, token);
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

  if (!isLoading && (!products || products.length === 0)) {
    return <p>No Products to Display</p>;
  }

  const filteredProducts = products.filter((product) => {
    const stringCategories = product.categories
      ?.map((category) => category.name)
      .join(" ");
    return (
      product.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stringCategories.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return isLoading ? (
    <Spinner />
  ) : searchTerm ? (
    filteredProducts.map((product) => {
      return (
        <Card key={`${product.id}-${product.title}-${product.artist}`}>
          <SingleProduct product={product} />
        </Card>
      );
    })
  ) : (
    <>
      <div className="crateBox">
        <img src={crate} className="crate" />
        <div className="transbox2">
          <span className="welcome2">"Where words fail,</span>
          <br></br>
          <span className="welcome2">music speaks."</span>
          <br></br>
          <span className="welcome2">-Hans Christian Anderson</span>
        </div>
      </div>
      <div className="allproducts">
        <GenreList
          handleAdd={handleAdd}
          products={products}
          setProducts={setProducts}
          category="Rock"
        />
        <GenreList
          handleAdd={handleAdd}
          products={products}
          setProducts={setProducts}
          category="Jazz"
        />
        <GenreList
          handleAdd={handleAdd}
          products={products}
          setProducts={setProducts}
          category="R&B"
        />
        <GenreList
          handleAdd={handleAdd}
          products={products}
          setProducts={setProducts}
          category="Pop"
        />
      </div>
    </>
  );
};

export default Products;
