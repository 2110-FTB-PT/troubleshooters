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

router.get("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const order = await getOrderById(orderId);
    if (!order) {
      next({
        name: "NoOrderExists",
        message: "There is no order to retrieve.",
      });
    }
    res.send(order);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.post("/", async (req, res, next) => {
  const { subtotal } = req.body;
  const orderData = {};

  try {
    if (req.user) {
      orderData.creatorId = req.user.id;
    }
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

    if (!orderById.creatorId) {
      const updatedGuestOrder = await updateOrder({
        id: orderId,
        subtotal,
      });
      res.send(updatedGuestOrder);
    } else if (req.user && orderById.creatorId === req.user.id) {
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
    if (!orderById.creatorId) {
      const destroyedGuestOrderId = await destroyOrder(orderId);
      res.send(destroyedGuestOrderId);
    } else if (req.user && orderById.creatorId === req.user.id) {
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
  try {
    const orderById = await getOrderById(orderId);
    if (!orderById.creatorId) {
      const product = await addProductToOrder({ orderId, ...req.body });
      res.send(product);
    } else if (req.user && orderById.creatorId === req.user.id) {
      const product = await addProductToOrder({ orderId, ...req.body });
      res.send(product);
    } else {
      next({
        name: "UserUnauthorizeToDelete",
        message: "User is not authorized to add products to this order.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
