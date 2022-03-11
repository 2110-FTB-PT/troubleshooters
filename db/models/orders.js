const client = require("../client.js");

const getAllOrders = async () => {
  try {
    const { rows: orders } = await client.query(`
      SELECT orders.*, users.username AS "creatorName"
      FROM orders
      JOIN users ON orders."creatorId" = users.id; 
          `);

    return orders;
  } catch (error) {
    console.log("Error at getAllOrders", error);
    throw error;
  }
};

const getOrderById = async (id) => {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
              SELECT * 
              FROM orders
              WHERE id = $1;
          `,
      [id]
    );

    return order;
  } catch (error) {
    console.log("Error at getOrderById", error);
    throw error;
  }
};
const createOrder = async ({ creatorId, name, subtotal }) => {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
              INSERT INTO orders("creatorId", name, subtotal)
              VALUES($1, $2, $3)
              RETURNING *
          `,
      [creatorId, name, subtotal]
    );
    console.log("hello")

    return order;
  } catch (error) {
    console.log("Error at createOrder", error);
    throw error;
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
};
