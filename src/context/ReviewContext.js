import { createContext, useEffect, useState } from 'react';

const ReviewContext = createContext()

export const ReviewProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [review, setReview] = useState([]);
    const [reviewEdit, setReviewEdit] = useState({
        item: {},
        edit: false
    });

    useEffect(() => {
        fetchReview()
    }, []);

    //fetch review
    const fetchReview = async () => {
        const response = await fetch(`/api/reviews`)
        const data = await response.json()
        setReview(data)
        setIsLoading(false)
    }

return (
    <ReviewContext.Provider
    value={{
        review,
        isLoading
    }}>
        {children}
    </ReviewContext.Provider>
)
}

export default ReviewContext