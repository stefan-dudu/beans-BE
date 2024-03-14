const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const beanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A bean must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A bean name can have no more then 40 characters'],
      minlength: [5, 'A bean name can have no less then 5 characters'],
      // validate: [validator.isAlpha, 'The bean name cannot contain numbers'],
    },
    slug: String,
    origin: {
      type: String,
      required: [true, 'A bean must have an origin'],
    },
    roastLevel: {
      type: String,
      enum: {
        values: ['Light', 'Light-Medium', 'Medium', 'Medium-Dark', 'Dark'],
        message: 'Please choose between the preselected options',
      },
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
    ratingsAverage: {
      type: Number,
      default: 3.01,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be bellow 5.0'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    summary: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual populate
beanSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'bean',
  localField: '_id',
});

beanSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Bean = mongoose.model('Bean', beanSchema);

module.exports = Bean;
