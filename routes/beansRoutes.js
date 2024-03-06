const express = require('express');
const beanController = require('../controllers/beanController');

const router = express.Router();

// router.param('id', beanController.checkID);

router
  .route('/top-5')
  .get(beanController.aliasTopBeans, beanController.getAllBeans);

router.route('/beans-stats').get(beanController.getBeanStats);
router.route('/flavour-notes/:flavour').get(beanController.getFlavourNotes);

router
  .route('/')
  .get(beanController.getAllBeans)
  .post(beanController.createBean);
router
  .route('/:id')
  .get(beanController.getBeanById)
  .patch(beanController.updateBean)
  .delete(beanController.deleteBean);

module.exports = router;
