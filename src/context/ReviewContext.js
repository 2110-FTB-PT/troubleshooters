import { createContext, useEffect, useState } from 'react';

const ReviewContext = createContext()

export const ReviewProvider = ({children}) => {
    const [ratings, setRatings] = useState([]);


    useEffect(() => {
        fetchReview()
    }, []);

return (
    <ReviewContext.Provider
    value={{
        
    }}>
        {children}
    </ReviewContext.Provider>
)
}

export default ReviewContext