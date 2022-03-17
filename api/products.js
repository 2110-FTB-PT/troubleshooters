const express = require('express')
const router = express.Router();
const { getAllProducts, createProduct, getProductById, updateProduct } = require('../db/models/products');
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

// GET /api/products/:productId
router.get('/:productId', async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await getProductById(productId);

    // next custom error if it returns undefined
    if (!product) {
      next({
        name: "InvalidProductId",
        message: "That product does not exist"
      });
      return;
    }

    res.send(product);
  } catch ({ name, message }) {
    next({ name, message });
  }
})

// PATCH /api/products/:productId
router.patch('/:productId', requireAdminUser, async (req, res, next) => {
  // build our values to update object to pass into updatedProduct
  const { productId } = req.params;
  const productValuesToUpdate = { id: productId, ...req.body };
  try {
    const updatedProduct = await updateProduct(productValuesToUpdate);

    res.send(updatedProduct);
  } catch ({ name, message }) {
    next({ name, message });
  }
})

module.exports = router;