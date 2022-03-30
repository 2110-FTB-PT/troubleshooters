import { useState, useRef } from "react";
import { FaCartPlus } from "react-icons/fa";
import Card from "../shared/Card";
import { motion, AnimatePresence } from "framer-motion";
import SingleProduct from "./SingleProduct";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AddProductToOrderForm from "./AddProductToOrderForm";
import { useUserContext } from "../context/UserContext";
import { deleteProduct } from "../api/productsApi";

const GenreList = ({ products, setProducts, category, handleAdd }) => {
  const [width, setWidth] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([])
  const carousel = useRef();
  const lowerCaseCategory = category.toLowerCase();
  const navigate = useNavigate();
  const { token } = useUserContext();

  const handleDelete = async (productId) => {
    const {id: deletedProductId } = await deleteProduct(productId, token)
    const productsWithoutDeletedProduct = products.filter(product => product.id !== deletedProductId);
    setProducts(productsWithoutDeletedProduct);
  }

  useEffect(() => {
    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
  }, []);

  useEffect(() => {
    // filters the products to be only products that contain the specified category
    const productsByGenre = products.filter((product) => {
      let containsCategory = false;
      product.categories.forEach((category) => {
        if (category.name.toLowerCase() === lowerCaseCategory) {
          containsCategory = true;
        }
      });
      return containsCategory;
    });
    setFilteredProducts(productsByGenre)

  }, [products])


  return (
    <>
      <div className="category">{category}</div>
      <div className="products-by-category">
        <AnimatePresence>
          <motion.div ref={carousel} className="carousel">
            <motion.div
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              className="inner-carousel"
            >
              {filteredProducts.map((product) => {
                return (
                  <motion.div
                    key={`${product.id}-${product.title}-${category}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.99 }}
                    onTap={(event) => {
                      let cart = event.target.localName;
                      if (event.target.outerText === "Edit") {
                        console.log('hi')
                      } else if (event.target.outerText === "Delete") {
                        handleDelete(product.id)
                      } else if (
                        cart === "button" ||
                        cart === "svg" ||
                        cart === "path"
                      ) {
                        console.log(event)
                        handleAdd(event, product);
                      } else {
                        navigate(`/products/${product.id}`);
                      }
                    }}
                  >
                    <Card>
                      <AddProductToOrderForm product={product}>
                        <FaCartPlus color="purple" />
                      </AddProductToOrderForm>
                      <SingleProduct product={product} />
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default GenreList;
