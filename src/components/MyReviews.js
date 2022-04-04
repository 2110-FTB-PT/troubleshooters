import { useEffect, useState } from "react";
import { fetchReviewByUser } from "../api/ReviewApi";
import { useUserContext } from "../context/UserContext";
import Card from "../shared/Card";
import SingleReview from "./SingleReview";

const MyReviews = () => {
  const { user } = useUserContext();
  const [reviews, setReviews] = useState([]);

  const handleFetchUserReviews = async () => {
    try {
      if (user) {
        const userReviews = await fetchReviewByUser(user);
        setReviews(userReviews);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleFetchUserReviews();
  }, [user]);

  return (
    <>
    <h2>My Reviews</h2>
      {reviews?.map(review => {
        return (
          <Card key={`${review.id}`}>
            <SingleReview review={review}/>
          </Card>
        )
      })}
    </>
  )
}

export default MyReviews;