import axios from "axios";

//fetch review
export const fetchReview = async (productId) => {
  axios
    .get(`api/reviews/${productId}`)
    .then((res) => {
      setRatings(res.data);
    })
    .catch((err) => {
      console.log(err)
    })
  setIsLoading(false)
}