const RatingDisplay = ({product}) => {
    let averageReview
    //reviews undefined
    const reviews = [];
    if(product && reviews && product.reviews?.length === 0 ){
        averageReview = "NEW"
    } else {
        averageReview = product && reviews && product.reviews.reduce((accumulator, review) => {
            return accumulator + review.rating
        }, 0) / product.reviews.length
        averageReview = averageReview?.toFixed(1).replace(/[.,]0$/, '')
    };
    
    return(
        <div className="num-display">
                      
        {averageReview}
        </div>
    )
}

export default RatingDisplay