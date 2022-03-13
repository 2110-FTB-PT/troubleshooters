const express = require('express');
const { createReview, getReviewsByUser, getReviewById, updateReview, destroyReview } = require('../db');
const router = express.Router();