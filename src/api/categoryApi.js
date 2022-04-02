import axios from 'axios';

export const getAllCategories = async () => {
  try {
    const { data: categories } = await axios.get('/api/categories');

    return categories;
  } catch (error) {
    console.error(error);
  }
}