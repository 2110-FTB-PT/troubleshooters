import RatingDisplay from "./RatingDisplay"
import Button from "../shared/Button"

const SingleReview = ({review: {creatorName:name, description, rating}}) => {

    return (
        <>
        <RatingDisplay rating={rating}/>
        <div className="rev-name">{name}</div>
        <div className="rev-description">{description}</div>
        <Button></Button>
        </>
    )
}

export default SingleReview