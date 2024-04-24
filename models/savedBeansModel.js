const mongoose = require('mongoose');

const savedBeansSchema = new mongoose.Schema({
  bean: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bean',
    required: [true, 'Saved item must belong to a bean type'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Saved item must belong to a user'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // triedIt: {
  //   type: Boolean,
  //   required: [true, 'We got to know if you tried it or not'],
  // },
  favourite: {
    type: Boolean,
    default: true,
  },
});

savedBeansSchema.index({ bean: 1, user: 1 }, { unique: true });

savedBeansSchema.pre(/^find/, function (next) {
  // this points to the current query
  // this.populate('user').populate({
  this.populate({
    path: 'bean',
    // select: 'name',
  });
  next();
});

const SavedBeans = mongoose.model('SavedBeans', savedBeansSchema);

module.exports = SavedBeans;
