import RatingDisplay from "./RatingDisplay"
import { FaTimes, FaEdit } from 'react-icons/fa'
import { deleteReview } from "../api/ReviewApi";
import { useUserContext } from "../context/UserContext";


const SingleReview = ({ setReviewId, setIsEditing, singleProduct, setSingleProduct, review, setDescription, setRating, review: { creatorName: name, description, rating } }) => {
    
    const { token, user } = useUserContext();

    const handleDelete = async () => {
        try {
            await deleteReview(token, review.id)
            const tempReviews = singleProduct.reviews.filter(singleReview => review.id !== singleReview.id)
            setSingleProduct({...singleProduct, reviews: tempReviews})
        } catch (error) {
            console.error(error)
        }
    }

    const handleEdit = () => {
        setDescription(description)
        setRating(rating);
        setIsEditing(true); 
        setReviewId(review.id)
    }

    return (
        <>
            <RatingDisplay rating={rating} />
            <button onClick={handleDelete}className="close">
                <FaTimes color='purple' />
            </button>
            <button onClick={handleEdit} className="edit">
                <FaEdit color='purple' />
            </button>
            <div className="rev-description">{description}</div>
            <div className="rev-name">{name}</div>
        </>
    )
}

export default SingleReview