import axios from 'axios';

export const getAllUsers = async (token) => {
  try {
    const { data } = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return data;
  } catch (error) {
    console.error(error);
  }
}