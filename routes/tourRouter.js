const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController')


//routing
router.route('/')
.get(tourController.getAllTours)
.post(tourController.nameCheckMiddleware, tourController.postSingleTour)

router.route('/:id')
.get(tourController.getSingleTour)
.patch(tourController.updateSingleTour)

module.exports = router;