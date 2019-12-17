const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController')


//routing
router.route('/expensive-tour').get(tourController.getExpensiveTour , tourController.getAllTours);

router.route('/')
.get(tourController.getAllTours)
.post(tourController.postSingleTour)

router.route('/:id')
.get(tourController.getSingleTour)
.patch(tourController.updateSingleTour)

module.exports = router;