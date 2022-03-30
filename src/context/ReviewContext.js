import { createContext, useState } from 'react';

const ReviewContext = createContext()

export const ReviewProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [feedback, setFeedback] = useState([]);
    const [reviewEdit, setReviewEdit] = useState({
        item: {},
        edit: false
    });

    //add review
    const addReview = async (newReview) => {
        const response = await fetch('/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReview)
        })
        const data = await response.json()
        setFeedback([data, ...reviews])
    };

    //delete review
    const deleteReview = async (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            await fetch(`/feedback/${id}`, { method: 'DELETE'})
            setFeedback(feedback.filter((item) => item.id !== id))
        }
    };

    //update review
    const updateReview = async (id, updItem) => {
        const response = await fetch(`/feedback/${id}`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json',
        },
        body: JSON.stringify(updItem)
    })
        editReview(reviews.map((item) => item.id === id ? { ...item, ...data } : item))
    }

    const editReview = (item) => {
        setReviewEdit({
            item,
            edit: true
        })
    }
    // whatever context i add, make sure to return it here
    return (
        <ReviewContext.Provider
            value={{
                review,
                deleteReview,
                addReview,
                editReview,
                reviewEdit,
                updateReview,
                isLoading,
            }}>
            {children}
        </ReviewContext.Provider>
    )
}

export default ReviewContext