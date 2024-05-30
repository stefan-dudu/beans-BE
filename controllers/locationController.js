const Locations = require('../models/locationModel');
const factory = require('./handlerFactory');

exports.createLocations = factory.createOne(Locations);
exports.getLocations = factory.getLocation(Locations);
exports.getAllLocations = factory.getAll(Locations);
exports.updateLocations = factory.updateOne(Locations);
exports.deleteLocations = factory.deleteOne(Locations);

// exports.getSavedStatusForBean =
//   factory.getSavedStatusForBeanAndUser(Locations);
