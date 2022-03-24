import { FaCartPlus } from "react-icons/fa";
import Card from "../shared/Card";
import { motion, AnimatePresence } from 'framer-motion'
import SingleProduct from "./SingleProduct";
import "./GenreList.css";

const GenreList = ({ products, category }) => {
  const lowerCaseCategory = category.toLowerCase();

  // filters the products to be only products that contain the specified category
  const filteredProducts = products.filter(product => {
    let containsCategory = false
    product.categories.forEach(category => {
      if (category.name.toLowerCase() === lowerCaseCategory) {
        containsCategory = true;
      }
    })
    return containsCategory;
  })

  return (
    <>
      <div>{category}</div>
      <div className="products-by-category">
        <AnimatePresence >
          {filteredProducts.map(product => {
            return (
              <motion.div
                key={`${product.id}-${product.title}-${category}`}
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
        </AnimatePresence >
      </div>
    </>
  )
}

export default GenreList;