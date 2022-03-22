import { useContext } from 'react';
import ReviewContext from '../context/ReviewContext';

function ReviewBuild() {
    const {review} = useContext(ReviewContext)

    let average = review.reduce((accumulator, currentFunction) => {
        return accumulator + currentFunction.rating
    }, 0) / review.length

    average = average.toFixed(1).replace(/[.,]0$/, '')

    return(
        <div className='review-stats'>
            <h4>{review.length} Reviews</h4>
            <h4>Average Rating: {isNaN(average) ? 0 : average}</h4>
        </div>
    )
}

export default ReviewBuild