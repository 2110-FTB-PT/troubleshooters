import { useContext, useState, useEffect } from 'react'
import Card from '../shared/Card'
import ReviewContext from '../context/ReviewContext'

function ReviewForm() {
    const [text, setText] = useState('')
    const [rating, setRating] = useState(10)
    const [message, setMessage] = useState('')

    // const {reviewEdit, updateReview} = useContext(ReviewContext)

    // useEffect(() => {
    //  if(reviewEdit.edit === true) {
    //      setText(reviewEdit.item.text)
    //      setRating(reviewEdit.item.rating)
    //  }
    // }, [reviewEdit])

    const handleTextChange = ({ target: { value } }) => {
        if (value === '') {
            setBtnDisabled(true)
            setMessage(null)
        } else if (value.trim().length < 10) {
            setMessage('Text must be at least 10 characters')
            setBtnDisabled(true)
        } else {
            setMessage(null)
            setBtnDisabled(false)
        }
        setText(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (text.trim().length > 10) {
            const newReview = {
                text,
                rating,
            }

            //new
            if (reviewEdit.edit === true) {
                updateReview(reviewEdit.item.id, newReview)
            // } else{
            // addReview(newReview)
            // }
            //NOTE: reset to default state after submission
            setRating(10) // set rating back to 10 
            setText('') // set text to empty
        }
    }

      // NOTE: pass selected to RatingSelect so we don't need local duplicate state
    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <h2>How would you rate this product?</h2>
                <RatingSelect select={setRating} selected={rating} />
                <div className="input-group">
                    <input
                        onChange={handleTextChange}
                        type="text"
                        placeholder='Write a review'
                        value={text}
                    />
                    {/* <Button type="submit" isDisabled={btnDisabled}>Send</Button> */}
                </div>
                {message && <div className='message'>{message}</div>}
            </form>
        </Card>
    )
}
}

export default ReviewForm