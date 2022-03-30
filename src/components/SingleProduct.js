import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { capitalizeFirstLetter } from "../api/utils";
import SingleReview from "./SingleReview";
import ReviewForm from "./ReviewForm";
import RatingDisplay from "./RatingDisplay";
import Card from "../shared/Card";

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
      <div className="album-image">
      <RatingDisplay product={product} singleProduct={singleProduct}/>
      {imgURL && <img src={require(`../assets/${imgURL}`)} />}
      </div>
      <h3 className="title">{title}</h3>
      <div className="artist">{artist}</div>
      {productId &&
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
          <SingleReview  review={review} />
        </Card>
        )
      })}
      <button>Edit</button>
      <button>Delete</button>
      
    </div>
  )
}

export default SingleProduct;