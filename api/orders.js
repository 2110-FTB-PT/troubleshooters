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
  try {
    const orders = await getAllOrders();
    if (!orders) {
      next({
        name: "NoOrdersExist",
        message: "There are no orders to retrieve.",
      });
    }
    res.send(orders);
  } catch ({ name, message }) {
    next({ name, message });
  }
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
        name: "ErrorCreatingOrder",
        message: "There was a problem creating this order.",
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

    if (!orderById.creatorId === req.user.id) {
      const updatedGuestOrder = await updateOrder({
        id: orderId,
        subtotal,
      });
      res.send(updatedGuestOrder);
    } else if (orderById.creatorId === req.user.id) {
      const updatedUserOrder = await updateOrder({
        id: orderId,
        subtotal,
      });
      res.send(updatedUserOrder);
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
    if (!orderById.creatorId === req.user.id) {
      const destroyedGuestOrderId = await destroyOrder(orderId);
      res.send(destroyedGuestOrderId);
    } else if (orderById.creatorId === req.user.id) {
      const destroyedUserOrderId = await destroyOrder(orderId);
      res.send(destroyedUserOrderId);
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
