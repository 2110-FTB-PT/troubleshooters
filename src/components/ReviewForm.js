import { useState, useEffect } from "react";
import { addReview, editReview } from "../api/ReviewApi";
import Card from "../shared/Card";
import RatingSelect from "./RatingSelect";
import Button from "../shared/Button";
import { useUserContext } from "../context/UserContext";


const ReviewForm = ({ reviewId, isEditing, singleProduct, setSingleProduct, description, setDescription, rating, setRating, singleProduct: { id: productId } }) => {
    const { token } = useUserContext();
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isEditing) {
            setBtnDisabled(false)
        }
    }, [isEditing]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const addedReview = await addReview(token, productId, rating, description);
            const newReviews = singleProduct.reviews
            newReviews.push(addedReview)
            setSingleProduct({ ...singleProduct, reviews: newReviews })
        } catch (error) {
            throw (error)
        }
    };

    const handleEdit = async (event) => {
        event.preventDefault();
        try {
            const editedReview = await editReview({ reviewId: reviewId, rating: rating, description: description }, token)
            const newReviews = singleProduct.reviews.filter(review => review.id !== reviewId)
            newReviews.push(editedReview)
            setSingleProduct({ ...singleProduct, reviews: newReviews })
        } catch (error) {
            console.error(error);
        }
    };

    const handleTextChange = ({ target: { value } }) => {
        if (value === '') {
            setMessage(null)
        } else if (value.trim().length < 10) {
            setMessage('Text must be ate least 10 characters')
            setBtnDisabled(true)
        } else {
            setMessage(null)
            setBtnDisabled(false)
        }
        setDescription(value)
    };



    return (
        <Card>
            <form onSubmit={isEditing ? handleEdit : handleSubmit}>
                <h2>Add a review to this product</h2>
                <RatingSelect select={setRating} selected={rating} className="rate-select" />
                <div className="input-group">
                    <input
                        onChange={handleTextChange}
                        type="text"
                        placeholder="Write a review"
                        value={description}
                    />
                </div>
                {message && <div className="message">{message}</div>}
                <div className="sub-button">
                    <Button type="submit" isDisabled={btnDisabled}>{isEditing ? "edit" : "submit"}</Button>
                </div>
            </form>
        </Card>

    )
};

export default ReviewForm