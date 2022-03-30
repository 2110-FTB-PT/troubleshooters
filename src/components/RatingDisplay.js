const RatingDisplay = ({product, singleProduct, rating}) => {
    let averageReview = rating
 
    if((product && product.reviews?.length === 0) || (singleProduct && singleProduct.reviews?.length === 0)){
        averageReview = "NEW"
    } else if (product ){
        averageReview = product && product.reviews.reduce((accumulator, review) => {
            return accumulator + review.rating
        }, 0) / product.reviews.length
        averageReview = averageReview?.toFixed(1).replace(/[.,]0$/, '')
    } else if (singleProduct && Object.keys(singleProduct).length > 0) {
        averageReview = singleProduct && singleProduct.reviews?.reduce((accumulator, review) => {
            return accumulator + review.rating
        }, 0) / singleProduct.reviews?.length
        averageReview = averageReview?.toFixed(1).replace(/[.,]0$/, '')
    }

    return(
        <div className="num-display">
        {averageReview}
        </div>
    )
}

export default RatingDisplay