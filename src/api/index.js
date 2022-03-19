import axios from "axios";

const BASE_URL = "https://<<ourURLgoesHere>>.herokuapp.com/api";

export const register = async (username, password, email) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/users/register`, {
      username,
      password,
      email,
    });
    const { token, message } = data;
    return [token, message];
  } catch (error) {
    console.dir(error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/users/login`, {
      username,
      password,
    });
    const { token, message } = data;
    return [token, message];
  } catch (error) {
    console.dir(error);
    throw error;
  }
};

export const getUser = async (token) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/users/myaccount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("error at getUser", error);
  }
};

export const fetchProducts = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/products`);
    return data;
  } catch (error) {
    console.error("Error at fetchProducts", error);
  }
};

export const addProduct = async (productToAdd, token) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/products`, productToAdd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch ({ response }) {
    console.error("Error at addProduct", response);
  }
};

export const updateProduct = async (
  title,
  artist,
  description,
  price,
  inventoryQuantity,
  imgURL,
  productId
) => {
  try {
    const { data } = await axios.patch(`${BASE_URL}/products/${productId}`, {
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

export const fetchOrders = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/orders`);
    return data;
  } catch (error) {
    console.error("Error at fetchOrders", error);
  }
};

export const addOrder = async (orderToAdd, token) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/orders`, orderToAdd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch ({ response }) {
    console.error("Error at addOrder", response);
  }
};

export const updateOrder = async (subtotal, orderId) => {
  try {
    const { data } = await axios.patch(`${BASE_URL}/orders/${orderId}`, {
      subtotal,
    });
    return data;
  } catch (error) {
    console.error("Error at updateOrder", error);
  }
};

export const deleteOrder = async (token, orderId) => {
  try {
    const { data } = await axios.delete(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error at deleteOrder", error);
  }
};

export const addProductToOrder = async (
  orderId,
  productId,
  quantity,
  price,
  token
) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/orders/${orderId}/products`,
      {
        productId,
        quantity,
        price,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error at addProductToOrder", error);
  }
};

export const updateOrderProduct = async (quantity, orderProductId) => {
  try {
    const { data } = await axios.patch(
      `${BASE_URL}/order_products/${orderProductId}`,
      {
        quantity,
      }
    );
    return data;
  } catch (error) {
    console.error("Error at updateOrderProduct", error);
  }
};

export const deleteOrderProduct = async (token, orderProductId) => {
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/order_products/${orderProductId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error at deleteOrderProduct", error);
  }
};
