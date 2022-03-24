import { useState } from "react";
import SingleProduct from "./SingleProduct";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Card from "../shared/Card";

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
    <div className="products-by-category">
      <div>{category}</div>
      {filteredProducts.map(product => {
        return (
          <>
            {/* <Card key={`${product.id}-${product.title}`}>
              <button className="cart">
                <AiOutlineShoppingCart color='purple' />
              </button>
              <SingleProduct product={product} />
            </Card> */}
          </>
        )
      })}
    </div>
  )
}

export default GenreList;