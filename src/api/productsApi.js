import axios from 'axios';

export const getAllProducts = async () => {
  try {
    const { data } = await axios.get(`/api/products`);
    return data;
  } catch (error) {
    console.error("Error at fetchProducts", error);
  }
};

export const addProduct = async (productToAdd, token) => {
  try {
    const { data } = await axios.post(`/api/products`, productToAdd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch ({ response }) {
    console.error("Error at addProduct", response);
  }
};

export const updateProduct = async (title, artist, description, price, inventoryQuantity, imgURL, productId) => {
  try {
    const { data } = await axios.patch(`/api/products/${productId}`, {
      title,
      artist,
      description,
      price,
      inventoryQuantity,
      imgURL,
    });
    return data;
  } catch (error) {
    console.error("Error at updateProduct", error);
  }
};