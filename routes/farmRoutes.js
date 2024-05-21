const express = require('express');
const farmController = require('../controllers/farmController');

const router = express.Router();

router.route('/:slug').get(farmController.getFarms);

module.exports = router;
