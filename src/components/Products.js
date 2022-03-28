import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productsApi";
import Spinner from "../shared/Spinner";
import GenreList from "./GenreList";

const Products = ({ products, setProducts }) => {
  const [isLoading, setIsLoading] = useState(true)

  const fetchProducts = async () => {
    setProducts(await getAllProducts());
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProducts();
  }, [])

  if (!isLoading && (!products || products.length === 0)) {
    return <p>No Products to Display</p>
  }

  return isLoading ? (
    <Spinner />
  ) : (
    <div className='allproducts'>
        <GenreList products={products} category="Rock" />
        <GenreList products={products} category="Jazz" />
        <GenreList products={products} category="R&B" />
        <GenreList products={products} category="Pop" />
    </div>
  )
}

export default Products;