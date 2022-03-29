import { useState, useEffect } from "react";
import { fetchReview, addReview } from "../api/ReviewApi";
import Card from "../shared/Card";
import RatingSelect from "./RatingSelect";
import Button from "../shared/Button";

const ReviewForm = ({ singleProduct, setSingleProduct, singleProduct: {id: productId} }) => {
    const [rating, setRating] = useState(10);
    const [review, setReview] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    // useEffect(() => {
    //     if(reviewEdit.edit === true){
    //         setBtnDisabled(false)
    //         setDescription(reviewEdit.id.description)
    //         setRating(reviewEdit.id.rating)
    //     }
    // }, [reviewEdit])
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const addedReview = await addReview(token, productId, rating, description);
            const newReviews = singleProduct.reviews
            newReviews.push(addedReview)
            setSingleProduct({...singleProduct, reviews: newReviews})
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
        setDescription(value)
    }
console.log(rating)
    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <h2>Add a review to this product</h2>
                <RatingSelect select={setRating} selected={rating}/>
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
                <Button type="submit" isDisabled={btnDisabled}>submit</Button>
                </div>
            </form>
        </Card>

    )
}

export default ReviewForm