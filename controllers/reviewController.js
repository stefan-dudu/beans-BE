const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllReviews = catchAsync(async (req, res) => {
  const features = new APIFeatures(Review.find(), req.query);
  //   const allReviews = await features.query;
  const allReviews = await Review.find();
  res.status(201).json({
    status: 'success',
    data: {
      allReviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      reviews: newReview,
    },
  });
});
