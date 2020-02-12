const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

router.route('/')
.get(authController.protectRoute, reviewController.getAllReview)
.post(authController.protectRoute, authController.restrictTo('user'), reviewController.createReview)
module.exports = router;


