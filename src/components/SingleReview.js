import RatingDisplay from "./RatingDisplay"
import { FaTimes, FaEdit } from 'react-icons/fa'
import { deleteReview, editReview } from "../api/ReviewApi";
import { useState, useEffect } from "react";


const SingleReview = ({ review: { creatorName: name, description, rating } }) => {

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
            <button onClick={() => reviewDelete(review)} className="close">
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