const Bean = require('../models/beanModel');
const factory = require('./handlerFactory');

exports.getFarms = factory.getFarm(Bean);
