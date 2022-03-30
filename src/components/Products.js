import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productsApi";
import Spinner from "../shared/Spinner";
import GenreList from "./GenreList";
import SingleProduct from "./SingleProduct";
import Card from "../shared/Card";

const Products = ({ products, setProducts, token, handleAdd, searchTerm }) => {
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

  const filteredProducts = products.filter((product) => {
    const stringCategories = product.categories
      .map((category) => category.name)
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
        <Card>
          <SingleProduct product={product} />
        </Card>
      );
    })
  ) : (
    <div className="allproducts">
      <GenreList
        handleAdd={handleAdd}
        token={token}
        products={products}
        category="Rock"
      />
      <GenreList
        handleAdd={handleAdd}
        token={token}
        products={products}
        category="Jazz"
      />
      <GenreList
        handleAdd={handleAdd}
        token={token}
        products={products}
        category="R&B"
      />
      <GenreList
        handleAdd={handleAdd}
        token={token}
        products={products}
        category="Pop"
      />
    </div>
  );
};

export default Products;
