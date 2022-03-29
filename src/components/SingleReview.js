import RatingDisplay from "./RatingDisplay"

const SingleReview = ({review: {creatorName:name, description, rating}}) => {
    return (
        <>
        <RatingDisplay rating={rating}/>
        <div>{name}</div>
        <div>{description}</div>
        </>
    )
}

export default SingleReview