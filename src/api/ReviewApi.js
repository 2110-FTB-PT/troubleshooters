import axios from "axios";
const BASE_URL = 'http://localhost:4000/api'


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