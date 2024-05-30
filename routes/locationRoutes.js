const express = require('express');
const locationController = require('../controllers/locationController');

const router = express.Router();

router
  .route('/')
  .get(locationController.getAllLocations)
  .post(locationController.createLocations);

router.route('/:isoCode').get(locationController.getLocations);

// router
//   .route('/:id')
//   .get(savedBeansController.getSavedBeans)
//   .patch(savedBeansController.updateSavedBeans)
//   .delete(savedBeansController.deleteSavedBeans);

// router
//   .route('/:beanId/:userId')
//   .get(savedBeansController.getSavedStatusForBean);

module.exports = router;
