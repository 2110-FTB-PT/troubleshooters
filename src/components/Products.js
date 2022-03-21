import { useEffect } from "react";
import { getAllProducts } from "../api/productsApi";

const Products = ({ products, setProducts }) => {
  const fetchProducts = async () => {
    setProducts(await getAllProducts());
  }

  useEffect(() => {
    fetchProducts();
  }, [])

  return (
    <></>
  )
}

export default Products;