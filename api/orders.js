const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  addProductToOrder,
  destroyOrder,
  getAllOrdersByUser,
} = require("../db");
const { requireUser } = require("./utils");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { SERVER_URL } = process.env;
const storeItems = new Map([
  [1, { priceInCents: 1000, name: "In Keeping Secrets Of Silent Earth: 3" }],
  [2, { priceInCents: 1599, name: "always EP" }],
  [3, { priceInCents: 1499, name: "My Way" }],
  [4, { priceInCents: 1299, name: "Live at the Apollo" }],
  [5, { priceInCents: 1299, name: "Let It Bleed" }],
  [6, { priceInCents: 1599, name: "All My Friends We're Glorious" }],
  [7, { priceInCents: 1099, name: "Innervisions" }],
  [8, { priceInCents: 1499, name: "Nevermind" }],
  [9, { priceInCents: 1399, name: "Purple Rain" }],
  [10, { priceInCents: 1499, name: "Thriller" }],
  [11, { priceInCents: 1099, name: "Cold Spring Harbor" }],
  [12, { priceInCents: 1199, name: "Pet Sounds" }],
  [13, { priceInCents: 1299, name: "The Dark Side of the Moon" }],
  [14, { priceInCents: 1299, name: "Ready to Die" }],
  [15, { priceInCents: 1599, name: "The Chronic" }],
  [16, { priceInCents: 1299, name: "Legend" }],
  [17, { priceInCents: 1499, name: "Abbey Road" }],
  [18, { priceInCents: 1299, name: "Back to Black" }],
  [19, { priceInCents: 1499, name: "Songs in the Key of Life" }],
  [20, { priceInCents: 1099, name: "Blonde On Blonde" }],
  [21, { priceInCents: 1299, name: "Random Access Memories" }],
  [22, { priceInCents: 1399, name: "Rumours" }],
  [23, { priceInCents: 1299, name: "A Love Supreme" }],
  [24, { priceInCents: 1499, name: "What's Going On" }],
  [25, { priceInCents: 1399, name: "Kind of Blue" }],
  [26, { priceInCents: 1099, name: "Graceland" }],
  [27, { priceInCents: 1599, name: "Moondance" }],
  [28, { priceInCents: 1299, name: "Is This It" }],
  [29, { priceInCents: 1299, name: "No Fences" }],
]);

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
    orderData.status = "created";

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
  const { subtotal, currentStatus } = req.body;

  try {
    const orderById = await getOrderById(orderId);

    if (!orderById.creatorId) {
      const updatedGuestOrder = await updateOrder({
        id: orderId,
        subtotal,
        currentStatus,
      });
      res.send(updatedGuestOrder);
    } else if (req.user && orderById.creatorId === req.user.id) {
      const updatedUserOrder = await updateOrder({
        id: orderId,
        subtotal,
        currentStatus,
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

router.post("/checkout", async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${SERVER_URL}products`,
      cancel_url: `${SERVER_URL}cart`,
    });
    res.send({ url: session.url });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
