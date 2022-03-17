const express = require('express')
const router = express.Router();
const { getAllProducts } = require('../db/models/products');

router.use((req, res, next) => {
  console.log("A request is being made to /products");

  next();
})

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const products = await getAllProducts();

    res.send(products);
  } catch ({ name, message }) {
    next({ name, message });
  }
})

module.exports = router;