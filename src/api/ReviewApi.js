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
};

export const addReview = async (token, productId, rating, description) => {
  try {
    const {data} = await axios.post(`/api/reviews`, {
      productId, rating, description
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return data
  } catch (error) {
    console.error(error)
  }
};