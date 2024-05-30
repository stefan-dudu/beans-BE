const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: {
      values: ['Farm', 'Country'],
      message: 'Please choose between the a Farm and a Country location type',
    },
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  subtitle: String,
  description: String,
  image: String,
  mainTypes: String,
  altitude: String,
  worldShare: Number,
  processing: String,
  challenges: [String],
});

const Locations = mongoose.model('Locations', locationSchema);

module.exports = Locations;
