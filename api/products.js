const express = require('express')
const router = express.Router();
const { getAllProducts, createProduct } = require('../db/models/products');
const { requireAdminUser } = require('./utils');

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

// POST /api/products
router.post('/', requireAdminUser, async (req, res, next) => {
  try {
    const product = await createProduct(req.body)

    res.send(product)
  } catch ({ name, message }) {
    next({ name, message });
  }
})
module.exports = router;