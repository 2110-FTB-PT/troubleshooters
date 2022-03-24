const SingleReview = ({review: {creatorName:name, description, rating}}) => {
    return (
        <>
        <div>{name}</div>
        <div>{rating}</div>
        <div>{description}</div>
        </>
    )
}

export default SingleReview