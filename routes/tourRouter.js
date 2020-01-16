const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')

//routing
router.route('/expensive-tour').get(tourController.getExpensiveTour , tourController.getAllTours);
router.route('/getStats').get(tourController.getTourStat);

router.route('/')
.get(authController.protectRoute, authController.restrictTo('admin'), tourController.getAllTours)
.post(authController.protectRoute, tourController.postSingleTour)

router.route('/:id')
.get(tourController.getSingleTour)
.patch(tourController.updateSingleTour)

module.exports = router;