import axios from "axios";

//fetch review
export const fetchReview = async (productId) => {
  try {
    const { data } = await axios.get(`api/reviews/${productId}`)

    return data
  } catch (err) {
    console.error(err)
  }
};

export const addReview = async (token, productId, rating, description) => {
  try {
    const { data } = await axios.post(`/api/reviews`, {
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

export const deleteReview = async (token, productId, rating, description) => {
  try {
    const { data } = await axios.delete(`/api/reviews/${productId}`, {
      rating,
      description,
      token
    })
    return data
  }catch(error){
    console.error(error)
  }
};

