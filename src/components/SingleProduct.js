const SingleProduct = ({ product: { title, artist, description, price, imgURL } }) => {

  return (
    <div className='singleProduct'>
      <div>{title}</div>
      <div>{artist}</div>
      <img src={require(`../assets/${imgURL}`)}/>
      <div>{price}</div>
    </div>
  )
}

export default SingleProduct;