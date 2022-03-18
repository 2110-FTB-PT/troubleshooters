const express = require('express');
const { createReview, getReviewsByUser, getReviewById, getReviewByProductId, updateReview } = require('../db');
const router = express.Router();
const { requireUser } = require('./utils');

// get /api/reviews
router.get('/:productId', async (req, res, next) => {
    const { productId } = req.params;
    try{        
        const reviews = await getReviewByProductId(productId);
        res.send(reviews)
    }catch({ name, message }){
        next({ name, message })
    }
});

// post /api/reviews/:productId/reviewId
router.post('/', requireUser, async (req, res, next) => {
    try {
      const review = await createReview(req.body)
  
      res.send(review)
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  // patch 
router.patch('/:productId', requireUser, async (req, res, next) => {
    const { productId } = req.params;
    const reviewValuesToUpdate = { id: productId, ...req.body };
    try {
      const updateReview = await updateReview(reviewValuesToUpdate);
  
      res.send(updateReview);
    } catch ({ name, message }) {
      next({ name, message });
    }
  })

module.exports = router;