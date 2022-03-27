import { useState } from "react";
import { fetchReview } from "../api/ReviewApi";

const AddReviewToSingleProduct = ({ id, reviews, addReview }) => {
    const [rating, setRating] = useState(10);
    const [review, setReview] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            AddReviewToSingleProduct(creatorId.name, description, rating);
            await addReview();
        } catch (error) {
            throw (error)
        }
    };

    const handleTextChange = ({target: {value}}) => {
        if (value === '') {
            setMessage(null)
        } else if (value.trim().length < 10) {
            setMessage('Text must be ate least 10 characters')
        } else {
            setMessage(null)
        }
        setText(value)
    }


    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <h2>Add a review to this product</h2>
                {/* <RatingSelect/> */}
                <div className="input-group">
                    <input
                        onChange={handleTextChange}
                        type="text"
                        placeholder="Write a review"
                        value={text}
                    />
                </div>
                {message && <div className="message">{message}</div>}
            </form>
        </Card>

    )
}