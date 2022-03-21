import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";

const SingleProduct = ({ product, products }) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [singleProduct, setSingleProduct] = useState({});

  useEffect(() => {
    if (productId) {
      const [ product ] = products.filter(product => product.id === Number(productId));
      console.log(product)
      setSingleProduct(product)
    }
  }, [])

  const handleClick = () => {
    navigate(`/products/${product.id}`)
  }

  const { title, artist, price, imgURL, description, inventoryQuantity } = product || singleProduct;
  return (
    <div className='singleProduct' onClick={handleClick}>
      <div>{title}</div>
      <div>{artist}</div>
      {imgURL && <img src={require(`../assets/${imgURL}`)}/> }
      {productId && 
      <>
        <div>{description}</div>
        <div>Amount in Stock: {inventoryQuantity}</div>
      </>
      }
      <div>${price}</div>
    </div>
  )
}

export default SingleProduct;