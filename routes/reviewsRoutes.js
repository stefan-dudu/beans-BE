const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setBeanUserIds,
    reviewController.createReview,
  );

router.use(authController.protect);
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.restrictTo('user'), reviewController.updateReview)
  .delete(authController.restrictTo('user'), reviewController.deleteReview);

router.route('/:beanId/:userId').get(reviewController.getReviewForBean);

module.exports = router;
