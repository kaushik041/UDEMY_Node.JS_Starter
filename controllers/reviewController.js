const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReview = catchAsync ( async (req, res, next) => {
    const reviews = await Review.find();
    res.status(200).json({
        status:'success',
        result: reviews.length,
        data: {
            reviews
        }
    });
});

exports.createReview = catchAsync ( async (req, res, next) => {
    const new_review = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            review : new_review
        }
    });
});