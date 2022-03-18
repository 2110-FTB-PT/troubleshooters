const express = require("express");
const router = express.Router();

const {
  destroyOrderProduct,
  updateOrderProduct,
  getOrderProductById,
  getOrderById,
} = require("../db");

router.patch("/:orderProductId", async (req, res, next) => {
  const { orderProductId } = req.params;
  const { quantity } = req.body;
  try {
    const orderProductById = await getOrderProductById(orderProductId);
    const order = await getOrderById(orderProductById.orderId);
    if (!order.creatorId) {
      const updatedGuestOrderProduct = await updateOrderProduct({
        id: orderProductId,
        quantity,
      });
      res.send(updatedGuestOrderProduct);
    } else if (!req.user) {
      next({
        name: "IncorrectCredentials",
        message: "You are not the owner of this order"
      })
    } else if (order.creatorId === req.user.id) {
      const updatedUserOrderProduct = await updateOrderProduct({
        id: orderProductId,
        quantity,
      });
      res.send(updatedUserOrderProduct);
    } else {
      next({
        name: "ErrorUpdatingOrderProduct",
        message: "An error occured when trying to update this order.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
router.delete("/:orderProductId", async (req, res, next) => {
  const { orderProductId } = req.params;
  try {
    const orderProductById = await getOrderProductById(orderProductId);
    const order = await getOrderById(orderProductById.orderId);
    if (!order.creatorId) {
      const destroyedGuestOrderProductId = await destroyOrderProduct(
        orderProductId
      );
      res.send(destroyedGuestOrderProductId);
    } else if (order.creatorId === req.user.id) {
      const destroyedUserOrderProductId = await destroyOrderProduct(
        orderProductId
      );
      res.send(destroyedUserOrderProductId);
    } else {
      next({
        name: "ErrorDeletingOrderProduct",
        message:
          "An error occured when attempting to delete this order product.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
