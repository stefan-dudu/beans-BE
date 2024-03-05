const mongoose = require('mongoose');

const beanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A bean must have a price'],
    unique: true,
  },
  rating: { type: Number, default: 3.33 },
  price: {
    type: Number,
    required: true,
  },
});

const Bean = mongoose.model('Bean', beanSchema);

module.exports = Bean;
