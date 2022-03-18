const express = require('express');
const { createReview, getReviewsByUser, getReviewById, getReviewByProductId, updateReview, destroyReview } = require('../db');
const router = express.Router();
const { requireUser } = require('./utils');

// get userId /api/reviews
router.get('/:productId', async (req, res, next) => {
    const { productId } = req.params;
    try {
        const reviews = await getReviewByProductId(productId);

        res.send(reviews)
    } catch ({ name, message }) {
        next({ name, message })
    }
});

// post
router.post('/', requireUser, async (req, res, next) => {
    try {
        const review = await createReview(req.body)

        res.send(review)
    } catch ({ name, message }) {
        next({ name, message });
    }
});

// patch 
router.patch('/:reviewId', requireUser, async (req, res, next) => {
    const { reviewId } = req.params;
    const { description } = req.body;

    try {
        const reviewById = await getReviewById(reviewId);
        if (reviewById.creatorId !== req.user.id){
            next({
                name: "IncorrectUserError",
                message: "This user is not authorized to update this review"
            })
            return
        } else if (reviewById.creatorId === req.user.id) {
            next({
                name: "UpdateSuccess",
                message: "The review was updated successfully"
            })
            const reviewUpdate = await updateReview({
                id: reviewId,
                description
            })
            res.send(reviewUpdate)
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

// delete
router.delete('/:reviewId', requireUser, async (req, res, next) => {
    const { reviewId } = req.params;
    
    try {
        const reviewById = await getReviewById(reviewId);

        if (reviewById.creatorId !== req.user.id){
            next({
                name: "IncorrectUserError",
                message: "This user is not authorized to delete this review"
            })
            return
        } else if (reviewById.creatorId === req.user.id) {
            const destroyReviewById = await destroyReview(reviewId);
            res.send(destroyReviewById);
        } next({
                name: "DeleteSuccess",
                message: "The review has been successfully deleted",
            })       
    } catch ({ name, message }) {
        next({ name, message });
    }
})

module.exports = router;