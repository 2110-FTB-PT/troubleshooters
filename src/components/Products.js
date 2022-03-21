import { useEffect } from "react";
import SingleProduct from "./SingleProduct";
import { getAllProducts } from "../api/productsApi";

const Products = ({ products, setProducts }) => {
  const fetchProducts = async () => {
    setProducts(await getAllProducts());
  }

  useEffect(() => {
    fetchProducts();
  }, [])

  return (
    <div className='allproducts'>
      {products.map(product => <SingleProduct key={`${product.id}-${product.title}`} product={product}/>)}
    </div>
  )
}

export default Products;