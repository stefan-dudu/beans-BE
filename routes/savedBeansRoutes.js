const express = require('express');
const reviewController = require('../controllers/reviewController');
const savedBeansController = require('../controllers/savedBeansController');

const router = express.Router();

router
  .route('/')
  .get(savedBeansController.getAllSavedBeans)
  .post(reviewController.setBeanUserIds, savedBeansController.createSavedBeans);

router
  .route('/:id')
  .get(savedBeansController.getSavedBeans)
  .patch(savedBeansController.updateSavedBeans)
  .delete(savedBeansController.deleteSavedBeans);

module.exports = router;
