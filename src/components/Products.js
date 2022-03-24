import { useEffect, useState } from "react";
import SingleProduct from "./SingleProduct";
import { getAllProducts } from "../api/productsApi";
import { motion, AnimatePresence } from 'framer-motion'
import { FaCartPlus } from "react-icons/fa";
import Card from "../shared/Card";
import Spinner from "../shared/Spinner";

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
      <AnimatePresence>
        {products.map(product => {

          return (
            <motion.div
              key={`${product.id}-${product.title}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              >
              <Card>
                <button className="cart">
                  <FaCartPlus color='purple' />
                </button>
                <SingleProduct product={product} />
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default Products;