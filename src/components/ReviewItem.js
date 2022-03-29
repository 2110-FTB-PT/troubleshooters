import { FaTimes, FaEdit } from 'react-icons/fa'
// import FeedbackContext from './context/FeedbackContext'
import PropTypes from 'prop-types'
import SingleReview from "./SingleReview";
import RatingDisplay from './RatingDisplay';
import {useState} from 'react'
import Card from '../shared/Card';


function ReviewItem({}) {
    // const {deleteFeedback, editFeedback} = useContext(FeedbackContext)
    const [singleProduct, setSingleProduct] = useState({});

    return (
      <Card>
            <RatingDisplay/>
            {/* <button onClick={() => deleteFeedback(item.id)} className="close"> */}
                <FaTimes color='purple' />
            {/* </button> */}
            {/* <button onClick={() => editFeedback(item)} className="edit"> */}
                <FaEdit color='purple'/>
            {/* </button> */}
            {singleProduct.reviews?.map(review => {
        return (
          <SingleReview key={`${review.id}-${review.name}`} review={review} />
        )
      })}
    </Card>
    )
}

// ReviewItem.propTypes = {
//     item: PropTypes.object.isRequired,
// }

export default ReviewItem