const client = require("./client");

const getOrderProductById = async (id) => {
  try {
    const {
      rows: [order_product],
    } = await client.query(
      `
        SELECT *
        FROM order_products
        WHERE id = $1
      `,
      [id]
    );
    return order_product;
  } catch (error) {
    console.log("Error at getOrderProductById", error);
    throw error;
  }
};

const addProductToOrder = async ({ orderId, productId, quantity, price }) => {
  try {
    const {
      rows: [order_product],
    } = await client.query(
      `
        INSERT INTO order_products("orderId", "productId", quantity, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
      [orderId, productId, quantity, price]
    );
    return order_product;
  } catch (error) {
    throw error;
  }
};

const updateOrderProduct = async ({ id, ...fields }) => {
  const setString = Object.keys(fields)
    .map((field, index) => {
      return `"${field}" = $${index + 1}`;
    })
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [order_product],
    } = await client.query(
      `
          UPDATE order_products
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
          `,
      Object.values(fields)
    );
    return order_product;
  } catch (error) {
    console.log("Error in updateOrderProduct", error);
    throw error;
  }
};

const destroyOrderProduct = async (id) => {
  try {
    const {
      rows: [order_product],
    } = await client.query(
      `
        DELETE FROM order_products
        WHERE id = $1
        RETURNING *;
      `,
      [id]
    );
    return order_product;
  } catch (error) {
    console.log("Error in destroyOrderProduct", error);
    throw error;
  }
};
const getOrderProductsByOrder = async ({ id }) => {
  try {
    const { rows: order_products } = await client.query(
      `
              SELECT *
              FROM order_products
              WHERE "orderId" = $1;
          `,
      [id]
    );
    return order_products;
  } catch (error) {
    console.log("Error in getOrderProductsByProduct", error);
    throw error;
  }
};

module.exports = {
  client,
  getOrderProductById,
  addProductToOrder,
  updateOrderProduct,
  destroyOrderProduct,
  getOrderProductsByOrder,
};
