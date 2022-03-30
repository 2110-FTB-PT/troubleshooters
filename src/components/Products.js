import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productsApi";
import Spinner from "../shared/Spinner";
import GenreList from "./GenreList";

const Products = ({ products, setProducts, token, handleAdd }) => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setProducts(await getAllProducts());
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  if (!isLoading && (!products || products.length === 0)) {
    return <p>No Products to Display</p>;
  }

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="allproducts">
      <GenreList handleAdd={handleAdd} token={token} products={products} category="Rock" />
      <GenreList handleAdd={handleAdd} token={token} products={products} category="Jazz" />
      <GenreList handleAdd={handleAdd} token={token} products={products} category="R&B" />
      <GenreList handleAdd={handleAdd} token={token} products={products} category="Pop" />
    </div>
  );
};

export default Products;
