const express = require('express');
const { addCategoryToProduct } = require('../db/models/product_categories');
const router = express.Router();

router.use((req, res, next) => {
  console.log("A request is being made to /product_categories");

  next();
})

// POST /api/product_categories/:productId/:categoryId => adds a category to a product
router.post('/:productId/:categoryId', async (req, res, next) => {
  const { productId, categoryId } = req.params;
  try {
    const productCategory = await addCategoryToProduct({ productId, categoryId });

    res.send(productCategory)
  } catch ({ name, message }) {
    next({ name, message });
  }
})

module.exports = router;