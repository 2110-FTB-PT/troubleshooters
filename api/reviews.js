const express = require('express');
const { createReview, getReviewsByUser, getReviewById, getReviewByProductId, updateReview } = require('../db');
const router = express.Router();
const { requireUser } = require('./utils');

// get reviews
router.get('/:productId', async (req, res, next) => {
    const { productId } = req.params;
    try{        
        const reviews = await getReviewByProductId(productId);
        res.send(reviews)
    }catch({ name, message }){
        next({ name, message })
    }
})

module.exports = router;