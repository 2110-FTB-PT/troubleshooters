const express = require('express');
const { createReview, getReviewsByUser, getReviewById, getReviewByProductId, updateReview } = require('../db');
const router = express.Router();
const { requireUser } = require('./utils');

// get reviews
router.get('/reviews', async (req, res, next) => {
    try{        
        const reviews = await getReviewById();
        res.send(getReviewById)
    }catch(error){
        next(error)
    }
})