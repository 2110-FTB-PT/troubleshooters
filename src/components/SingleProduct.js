import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { capitalizeFirstLetter } from "../api/utils";
import SingleReview from "./SingleReview";
import ReviewForm from "./ReviewForm";
import RatingDisplay from "./RatingDisplay";
import Card from "../shared/Card";
import { useUserContext } from "../context/UserContext";
import Button from "../shared/Button";

const SingleProduct = ({ product, products }) => {
  const { productId, editProductId } = useParams();
  const [singleProduct, setSingleProduct] = useState({
    title: '',
    artist: '',
    price: '',
    imgURL: '',
    description: '',
    inventoryQuantity: 0,
    categories: []
  });
  const { user } = useUserContext();

  useEffect(() => {
    if (productId && products.length) {
      console.log(products)
      const [product] = products.filter(product => product.id === Number(productId));
      setSingleProduct(product)
    }
  }, [products])

  const { title, artist, price, imgURL, description, inventoryQuantity, categories } = product ? product : singleProduct;
  // if the categories exist, we reformat them to be capitalized
  if (categories) {
    categories.forEach(category => {
      const capitalizedName = capitalizeFirstLetter(category.name)
      category.name = capitalizedName;
    });
  }

  return (
    <div className='singleProduct'>
      <div className="album-image">
      {!editProductId && <RatingDisplay product={product} singleProduct={singleProduct}/>}
      {imgURL && <img src={require(`../assets/${imgURL}`)} />}
      </div>
      <h3 className="title">{title}</h3>
      <div className="artist">{artist}</div>
      {(productId || editProductId) &&
        <>
          <p className="description">{description}</p>
          <div className="logistics">Amount in Stock: {inventoryQuantity}</div>
        </>
      }
      <div className="logistics">{categories?.map(category => <span key={`${category.id}-${category.name}`}>{category.name} </span>)}</div>
      <div className="logistics">${price}</div>

      {productId && <ReviewForm singleProduct={singleProduct} setSingleProduct={setSingleProduct} />}
      
      {singleProduct.reviews?.map(review => {
        return (
          <Card key={`${review.id}-${review.name}`}>
          <SingleReview singleProduct={singleProduct} setSingleProduct={setSingleProduct} review={review} />
        </Card>
        )
      })}
      { !productId && !editProductId && user?.isAdmin && 
      <>
        <Button>Edit</Button>
        <Button>Delete</Button>
      </>
      }
    </div>
  )
}

export default SingleProduct;