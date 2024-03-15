const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
// const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res) => {
  // const features = new APIFeatures(Review.find(), req.query);

  let filter = {};
  if (req.params.beanId) filter = { bean: req.params.beanId };
  const reviews = await Review.find(filter);
  res.status(201).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.bean) req.body.bean = req.params.beanId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
