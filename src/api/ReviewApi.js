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

export const deleteReview = async (token, reviewId) => {
  try {
    if (window.confirm('Are you sure you want to delete?')) {
      const response = await axios.delete(`/api/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    }
  } catch (error) {
    console.error(error)
  }
};

export const editReview = async ({ reviewId, rating, description }, token) => {
  try {
    const { data } = await axios.patch(`api/reviews/${reviewId}`, {
      rating,
      description
    },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
    return data;
  } catch (error) {
    console.error(error)
  }
}

export const fetchReviewByUser = async ({ id }) => {
  try {
    const { data } = await axios.get(`/api/reviews/user/${id}`);

    return data;
  } catch (error) {
    console.error(error);
  }
}