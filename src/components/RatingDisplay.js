const RatingDisplay = ({product, singleProduct}) => {
    let averageReview
 
    if((product && product.reviews?.length === 0) || (singleProduct && singleProduct.reviews?.length === 0)){
        averageReview = "NEW"
    } else if (product ){
        averageReview = product && product.reviews.reduce((accumulator, review) => {
            return accumulator + review.rating
        }, 0) / product.reviews.length
        averageReview = averageReview?.toFixed(1).replace(/[.,]0$/, '')
    } else {
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