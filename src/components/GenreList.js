import { useState, useRef } from "react";
import { FaCartPlus } from "react-icons/fa";
import Card from "../shared/Card";
import { motion, AnimatePresence } from 'framer-motion'
import SingleProduct from "./SingleProduct";
import "./GenreList.css";
import { useNavigate } from "react-router-dom";

const GenreList = ({ products, category }) => {
  const [width, setWidth] = useState(0);
  const carousel = useRef();
  const lowerCaseCategory = category.toLowerCase();
  const navigate = useNavigate();

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
        <AnimatePresence>
          <motion.div ref={carousel} className='carousel'>
          <motion.div
          drag="x"
          dragConstraints={{ right: 0 }}
          className="inner-carousel">
            {filteredProducts.map(product => {
              return (

                <motion.div
                  key={`${product.id}-${product.title}-${category}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onTap={() => navigate(`/products/${product.id}`)}
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
            </motion.div>
          </motion.div>
        </AnimatePresence >
      </div>
    </>
  )
}

export default GenreList;