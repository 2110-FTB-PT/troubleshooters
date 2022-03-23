import { useEffect } from "react";
import SingleProduct from "./SingleProduct";
import { getAllProducts } from "../api/productsApi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Card from "../shared/Card";

const Products = ({ products, setProducts }) => {
  const fetchProducts = async () => {
    setProducts(await getAllProducts());
  }

  useEffect(() => {
    fetchProducts();
  }, [])

  return (
    <div className='allproducts'>
      {products.map(product => {
        return (
          <Card key={`${product.id}-${product.title}`}>
            <button className="cart">
              <AiOutlineShoppingCart color='purple' />
            </button>
            <SingleProduct product={product} />
          </Card>
        )
      })}
    </div>
  )
}

export default Products;