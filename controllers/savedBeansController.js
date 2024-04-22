const SavedBeans = require('../models/savedBeansModel');
const factory = require('./handlerFactory');

exports.createSavedBeans = factory.createOne(SavedBeans);
exports.getSavedBeans = factory.getOne(SavedBeans);
exports.getAllSavedBeans = factory.getAll(SavedBeans);
exports.updateSavedBeans = factory.updateOne(SavedBeans);
exports.deleteSavedBeans = factory.deleteOne(SavedBeans);
