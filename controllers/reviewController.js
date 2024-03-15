const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setBeanUserIds = (req, res, next) => {
  if (!req.body.bean) req.body.bean = req.params.beanId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
