const mongoose = require('mongoose');

const beanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A bean must have a name'],
    unique: true,
    trim: true,
  },
  origin: {
    type: String,
    required: [true, 'A bean must have an origin'],
  },
  roastLevel: {
    type: String,
  },
  flavorNotes: [String],
  aroma: {
    type: String,
  },
  acidity: {
    type: Number,
  },
  body: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  ratingsAverage: { type: Number, default: 3.01 },
  ratingsQuantity: { type: Number, default: 0 },
  summary: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
});

const Bean = mongoose.model('Bean', beanSchema);

module.exports = Bean;
