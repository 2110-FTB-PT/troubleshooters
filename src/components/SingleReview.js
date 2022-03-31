import RatingDisplay from "./RatingDisplay"

const SingleReview = ({review: {creatorName:name, description, rating}}) => {

    return (
        <>
        <RatingDisplay rating={rating}/>
        <div className="rev-name">{name}</div>
        <div className="rev-description">{description}</div>
        </>
    )
}

export default SingleReview