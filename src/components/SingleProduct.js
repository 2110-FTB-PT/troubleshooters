import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { capitalizeFirstLetter } from "../api/utils";
import SingleReview from "./SingleReview";

const SingleProduct = ({ product, products }) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [singleProduct, setSingleProduct] = useState({});

  useEffect(() => {
    if (productId) {
      const [product] = products.filter(product => product.id === Number(productId));
      setSingleProduct(product)
    }
  }, [])

  const handleClick = () => {
    navigate(`/products/${product.id}`)
  }

  const { title, artist, price, imgURL, description, inventoryQuantity, categories } = product || singleProduct;
  // if the categories exist, we reformat them to be capitalized
  if (categories) {
    categories.forEach(category => {
      const capitalizedName = capitalizeFirstLetter(category.name)
      category.name = capitalizedName;
    });
  }

  return (
    <div className='singleProduct'>
      
      {imgURL && <img src={require(`../assets/${imgURL}`)} />}
      <h3>{title}</h3>
      <div>{artist}</div>
      {productId &&
        <>
          <div>{description}</div>
          <div>Amount in Stock: {inventoryQuantity}</div>
        </>
      }
      <div>{categories?.map(category => <span key={`${category.id}-${category.name}`}>{category.name} </span>)}</div>
      <div>${price}</div>
      {singleProduct.reviews?.map(review => {
        return (
          <SingleReview key={`${review.id}-${review.name}`} review={review} />
        )
      })}
    </div>
  )
}

export default SingleProduct;