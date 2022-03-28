import { useState, useRef } from "react";
import { FaCartPlus } from "react-icons/fa";
import Card from "../shared/Card";
import { motion, AnimatePresence } from 'framer-motion'
import SingleProduct from "./SingleProduct";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import RatingDisplay from "./RatingDisplay";

const GenreList = ({ products, category }) => {
  const [width, setWidth] = useState(0);
  const carousel = useRef();
  const lowerCaseCategory = category.toLowerCase();
  const navigate = useNavigate();
  const [singleProduct, setSingleProduct] = useState({});


  useEffect(() => {
    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
  }, []);

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
      <div className="category">{category}</div>
      <div className="products-by-category">
        <AnimatePresence>
          <motion.div ref={carousel} className='carousel'>
            <motion.div
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              className="inner-carousel">
              {filteredProducts.map(product => {
                return (
                  <motion.div
                    key={`${product.id}-${product.title}-${category}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.99 }}
                    onTap={() => navigate(`/products/${product.id}`)}
                  >
                    <Card>
                      {/* <RatingDisplay product={product}/> */}
                      <button className="cart">
                        <FaCartPlus color='purple' />
                      </button>
                      <div className="record"/>
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