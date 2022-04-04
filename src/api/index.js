import axios from "axios";

export const register = async (username, password, email) => {
  try {
    const { data } = await axios.post("/api/users/register", {
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
    const { data } = await axios.post(`/api/users/login`, {
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
    const { data } = await axios.get(`/api/users/myaccount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("error at getUser", error);
  }
};

export const fetchOrders = async () => {
  try {
    const { data } = await axios.get(`/api/orders`);
    return data;
  } catch (error) {
    console.error("Error at fetchOrders", error);
  }
};
export const fetchSingleOrder = async (orderId) => {
  try {
    const { data } = await axios.get(`/api/orders/${orderId}`);
    return data;
  } catch (error) {
    console.error("Error at fetchSingleOrder", error);
  }
};

export const addOrder = async (orderToAdd, token) => {
  try {
    const { data } = await axios.post(`/api/orders`, orderToAdd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch ({ response }) {
    console.error("Error at addOrder", response);
  }
};

export const updateOrder = async (subtotal, currentStatus, orderId, token) => {
  try {
    const { data } = await axios.patch(
      `/api/orders/${orderId}`,
      {
        subtotal,
        currentStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error at updateOrder", error);
  }
};

export const deleteOrder = async (token, orderId) => {
  try {
    const { data } = await axios.delete(`/api/orders/${orderId}`, {
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
      `/api/orders/${orderId}/products`,
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

export const updateOrderProduct = async (quantity, orderProductId, token) => {
  try {
    const { data } = await axios.patch(
      `/api/order_products/${orderProductId}`,
      {
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      `/api/order_products/${orderProductId}`,
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

export const stripeCheckout = async (items) => {
  try {
    const { data } = await axios.post(`/api/orders/checkout`, {
      items,
    });
    window.location = data.url;
  } catch (error) {
    console.error("Error at stripeCheckout", error);
  }
};
