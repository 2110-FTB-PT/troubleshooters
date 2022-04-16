import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { capitalizeFirstLetter } from "../api/utils";
import SingleReview from "./SingleReview";
import ReviewForm from "./ReviewForm";
import RatingDisplay from "./RatingDisplay";
import Card from "../shared/Card";
import { useUserContext } from "../context/UserContext";
import Button from "../shared/Button";

const SingleProduct = ({ product, products, handleAdd }) => {
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
  const [rating, setRating] = useState(10);
  const [reviewDescription, setReviewDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [reviewId, setReviewId] = useState(0)

  useEffect(() => {
    if (productId && products.length) {
      const [product] = products.filter(product => product.id === Number(productId));
      setSingleProduct(product)
    }
  }, [products]);

  const { title, artist, price, imgURL, description, inventoryQuantity, categories = [] } = product ? product : singleProduct;
  // if the categories exist, we reformat them to be capitalized
  if (categories.length) {
    categories.forEach(category => {
      const capitalizedName = capitalizeFirstLetter(category.name)
      category.name = capitalizedName;
    })
  };

  return (
    <div className='singleProduct'>
      <div className="album-image">
        {/* this conditional render avoids rendering RatingDisplay when we are adding or editing a product */}
        {(product?.reviews || singleProduct?.reviews) && <RatingDisplay product={product} singleProduct={singleProduct} />}
        {/* imgURL will only fire off once the jpg/png part is applied to avoid errors */}
        {imgURL && (imgURL.includes('jpg') || imgURL.includes('png') || imgURL.includes('PNG')) && <img src={require(`../assets/${imgURL}`)} />}
      </div>
      {/* ONLY renders as admin, prevents render in single product view and during add/edit product */}
      {!productId && !editProductId && product.reviews && user?.isAdmin &&
        <>
          <Button>Edit</Button>
          <Button>Delete</Button>
        </>
      }
      <h3 className="title">{title}</h3>
      <div className="artist">{artist}</div>
      {/* only renders in single product view or during an add/edit product */}
      {(productId || editProductId || !product.reviews) &&
        <>
          {/* limits product preview to 200 characters when edit/add a product */}
          {!product?.reviews ? <p className="description">{description?.substring(0, 200)}{description?.length > 200 && "..."}</p> : <p className="description">{description}</p>}
          <div className="logistics">Amount in Stock: {inventoryQuantity}</div>
        </>
      }
      <div className="logistics">{categories?.map(category => <span key={`${category.id}-${category.name}`}>{category.name} </span>)}</div>
      <div className="logistics">${price}</div>
      {handleAdd && <Button onClick={() => handleAdd(singleProduct)}>Add To Cart</Button>}
      {/* only renders in single product view */}
      {productId && <ReviewForm isEditing={isEditing} setIsEditing={setIsEditing} singleProduct={singleProduct} setSingleProduct={setSingleProduct} description={reviewDescription} setDescription={setReviewDescription} rating={rating} setRating={setRating} reviewId={reviewId} setReviewId={setReviewId} />}

      {singleProduct.reviews?.map(review => {
        return (
          <Card key={`${review.id}-${review.name}`}>
            <SingleReview setIsEditing={setIsEditing} singleProduct={singleProduct} setSingleProduct={setSingleProduct} review={review} setDescription={setReviewDescription} setRating={setRating} setReviewId={setReviewId} />
          </Card>
        )
      })}
    </div>
  )
};

export default SingleProduct;