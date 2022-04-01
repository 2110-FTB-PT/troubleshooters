import RatingDisplay from "./RatingDisplay"
import { FaTimes, FaEdit } from 'react-icons/fa'

const SingleReview = ({ review: { creatorName: name, description, rating } }) => {

    return (
        <>
            <RatingDisplay rating={rating} />
            <button onClick={() => deleteFeedback(item.id)} className="close">
                <FaTimes color='purple' />
            </button>
            <button onClick={() => editFeedback(item)} className="edit">
                <FaEdit color='purple' />
            </button>
            <div className="rev-description">{description}</div>
            <div className="rev-name">{name}</div>
        </>
    )
}

export default SingleReview