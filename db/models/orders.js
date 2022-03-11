const client = require("../client.js");

// helper function
const addProductsToOrders = async (orders) => {
  try {
    const orderIdArray = orders.map((order) => {
      return order.id;
    });
    // orderProductId created for the frontend
    const { rows: products } = await client.query(`
                  SELECT products.*, order_products.quantity, order_products.price, order_products."orderId", order_products.id AS "orderProductId"
                  FROM products
                  JOIN order_products
                  ON products.id = order_products."productId"
                  WHERE order_products."orderId" IN (${orderIdArray});
              `);

    orders.forEach((order) => {
      order.products = products.filter((product) => {
        return product.orderId === order.id;
      });
    });

    return orders;
  } catch (error) {
    throw error;
  }
};

const getAllOrders = async () => {
  try {
    const { rows: orders } = await client.query(`
        SELECT orders.*, users.username AS "creatorName"
        FROM orders
        JOIN users ON orders."creatorId" = users.id; 
            `);

    return await addProductsToOrders(orders);
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

    return await addProductsToOrders(order);
  } catch (error) {
    console.log("Error at getOrderById", error);
    throw error;
  }
};

const getAllOrdersByUser = async ({ username }) => {
  try {
    const { rows: orders } = await client.query(
      `
              SELECT orders.*, users.username AS "creatorName" 
              FROM orders
              JOIN users ON orders."creatorId" = users.id
              WHERE users.username = $1;
          `,
      [username]
    );

    return await addProductsToOrders(orders);
  } catch (error) {
    console.log("Error at getAllOrdersByUser", error);
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

    return order;
  } catch (error) {
    console.log("Error at createOrder", error);
    throw error;
  }
};

const updateOrder = async ({ id, ...fields }) => {
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
      rows: [order],
    } = await client.query(
      `
            UPDATE orders
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
            `,
      Object.values(fields)
    );
    return order;
  } catch (error) {
    console.log("Error at updateOrder", error);
    throw error;
  }
};

const destroyOrder = async (id) => {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
          DELETE FROM order_products
          WHERE "orderId" = $1
          RETURNING *;
      `,
      [id]
    );

    await client.query(
      `
              DELETE FROM orders
              WHERE id = $1
              RETURNING *;
          `,
      [id]
    );

    return order;
  } catch (error) {
    console.log("Error at destroyOrder", error);
    throw error;
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  addProductsToOrders,
  getAllOrdersByUser,
  createOrder,
  updateOrder,
  destroyOrder,
};
