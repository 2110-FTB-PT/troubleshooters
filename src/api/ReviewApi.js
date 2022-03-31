import axios from "axios";

//fetch review
export const fetchReview = async (productId) => {
  try {
    const { data } = await axios.get(`api/reviews?_sort=${productId}&_order=asc`)

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

export const deleteReview = async (token, productId) => {
  try {
    if (window.confirm('Are you sure you want to delete?')) {
    const response = await axios.delete(`/api/reviews/${productId}`, 
    { 
      data: {
        reviews: id}
      }
    )}
  }catch(error){
    console.error(error)
  }
};

export const editReview = async (token, productId, rating, description) => {
  try{

  }catch(error){
    console.error(error)
  }
}