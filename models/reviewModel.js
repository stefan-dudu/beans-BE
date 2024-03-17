const mongoose = require('mongoose');
const Bean = require('./beanModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'There has to be a review'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    bean: {
      type: mongoose.Schema.ObjectId,
      ref: 'Bean',
      required: [true, 'Review must belong to a bean type'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.index({ bean: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (beanId) {
  const stats = await this.aggregate([
    { $match: { bean: beanId } },
    {
      $group: {
        _id: '$bean',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Bean.findByIdAndUpdate(beanId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Bean.findByIdAndUpdate(beanId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.bean);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this keyword would give us access only to the query
  console.log('this - query', this);
  console.log('=========================');
  // this way we have access to the document
  this.r = await this.findOne();
  console.log('document', this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.bean);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
