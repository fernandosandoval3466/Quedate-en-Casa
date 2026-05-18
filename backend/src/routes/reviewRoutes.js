const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

router.get('/:productId', reviewController.getProductReviews);
router.post('/', authMiddleware, reviewController.addReview);

module.exports = router;