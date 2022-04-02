import RatingDisplay from "./RatingDisplay"
import { FaTimes, FaEdit } from 'react-icons/fa'
import { deleteReview, editReview } from "../api/ReviewApi";
import { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";


const SingleReview = ({ singleProduct, setSingleProduct, review, review: { creatorName: name, description, rating } }) => {
    
    const { token } = useUserContext();

    const handleDelete = async () => {
        try {
            await deleteReview(token, review.id)
            const tempReviews = singleProduct.reviews.filter(singleReview => review.id !== singleReview.id)
            setSingleProduct({...singleProduct, reviews: tempReviews})
        } catch (error) {
            console.error(error)
        }
    }
    /*/////////////////////////////////////////        WIP
    const [reviewEdit, setReviewEdit] = useState({
        review: {},
        edit: false
    });
    
    useEffect(() => {
    if(editReview === true) {
        setBtnDisabled(false)
        setText(reviewEdit.review.description)
        setRating(reviewEdit.review.rating)
    }
    })
    
    
    
    /////////////////////////////////////////*/

    return (
        <>
            <RatingDisplay rating={rating} />
            <button onClick={handleDelete}className="close">
                <FaTimes color='purple' />
            </button>
            <button onClick={() => reviewEdit(review)} className="edit">
                <FaEdit color='purple' />
            </button>
            <div className="rev-description">{description}</div>
            <div className="rev-name">{name}</div>
        </>
    )
}

export default SingleReview