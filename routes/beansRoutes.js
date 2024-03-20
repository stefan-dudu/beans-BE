const express = require('express');
const beanController = require('../controllers/beanController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewsRoutes');

const router = express.Router();

router.use('/:beanId/reviews', reviewRouter);

router
  .route('/top-5')
  .get(beanController.aliasTopBeans, beanController.getAllBeans);

router.route('/beans-stats').get(beanController.getBeanStats);
router
  .route('/flavour-notes/:flavour')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    beanController.getFlavourNotes,
  );
router.route('/search-bean/:term').get(beanController.searchBeans);

router
  .route('/')
  .get(beanController.getAllBeans)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    beanController.createBean,
  );
router
  .route('/:id')
  .get(beanController.getBeanById)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    beanController.updateBean,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    beanController.deleteBean,
  );

module.exports = router;
