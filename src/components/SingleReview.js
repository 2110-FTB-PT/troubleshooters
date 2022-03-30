import RatingDisplay from "./RatingDisplay"

const SingleReview = ({product, review: {creatorName:name, description, rating}}) => {

    console.log('>>>>>>>>>', product && product.reviews?.length)
    // if (!rating || rating.length === 0){
    //     return <p>No Products to Display</p>
    // }

    return (
        <>
        <RatingDisplay rating={rating}/>
        <div className="rev-name">{name}</div>
        <div className="rev-description">{description}</div>
        </>
    )
}

export default SingleReview