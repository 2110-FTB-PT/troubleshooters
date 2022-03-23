import { createContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getReviewByProductId } from '../api/ReviewApi';


const BASE_URL = "http://localhost:4000/api";


const ReviewContext = createContext()

export const ReviewProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [ratings, setRatings] = useState([]);


    useEffect(() => {
        fetchReview()
    }, []);

    //fetch review
    const fetchReview = async (productId) => {
        axios
        .get(`BASE_URL/reviews/${productId}`)
        .then((res) => {
            setRatings(res.data);
        })
        .catch((err) => {
            console.log(err)
        })
        setIsLoading(false)
    }

return (
    <ReviewContext.Provider
    value={{
        ratings,
        isLoading
    }}>
        {children}
    </ReviewContext.Provider>
)
}

export default ReviewContext