const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  addProductToOrder,
  destroyOrder,
} = require("../db");

router.get("/", async (req, res, next) => {
  const orders = await getAllOrders();

  res.send(orders);
});

router.post("/", async (req, res) => {
  const { subtotal } = req.body;
  const orderData = {};

  try {
    orderData.creatorId = req.user.id;
    orderData.subtotal = subtotal;

    const order = await createOrder(orderData);

    if (!order) {
      next({
        name: "UserNotAuthorized",
        message: "User is not authorized to create an order.",
      });
    }

    res.send(order);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.patch("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;
  const { subtotal } = req.body;

  try {
    const orderById = await getOrderById(orderId);

    if (orderById.creatorId === req.user.id) {
      const updatedOrder = await updateOrder({
        id: orderId,
        subtotal,
      });
      res.send(updatedOrder);
    } else {
      next({
        name: "userUnauthorizeToUpdate",
        message: "User is not authorized to update this order.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.delete("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const orderById = await getOrderById(orderId);
    if (orderById.creatorId === req.user.id) {
      const destroyedOrder = await destroyOrder(orderId);
      res.send(destroyedOrder);
    } else {
      next({
        name: "UserUnauthorizeToDelete",
        message: "User is not authorized to delete this order.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.post("/:orderId/products", async (req, res, next) => {
  const { orderId } = req.params;
  const { productId, quantity, price } = req.body;
  try {
    const product = await addProductToOrder({
      orderId,
      productId,
      quantity,
      price,
    });
    res.send(product);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
