import axios from 'axios';

export const getAllCategories = async () => {
  try {
    const { data: categories } = await axios.get('/api/categories');

    return categories;
  } catch (error) {
    console.error(error);
  }
}

export const addCategoryToProduct = async (productId, categoryId, token) => {
  try {
    const { data: category } = await axios.post(`/api/product_categories/${productId}/${categoryId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return category;
  } catch (error) {
    console.error(error);
  }
}