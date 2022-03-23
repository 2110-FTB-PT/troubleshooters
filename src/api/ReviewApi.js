import axios from "axios";
const BASE_URL = 'http://localhost:4000/api'

export const getReviewByProductId = async (productId) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/reviews/${productId}`);
        return data;
      } catch (error) {
        throw error;
    }
    };
