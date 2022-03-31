import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productsApi";
import Spinner from "../shared/Spinner";
import GenreList from "./GenreList";
import SingleProduct from "./SingleProduct";
import Card from "../shared/Card";

const Products = ({ products, setProducts, handleAdd, searchTerm }) => {
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
        <Card>
          <SingleProduct product={product} />
        </Card>
      );
    })
  ) : (
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
  );
};

export default Products;
