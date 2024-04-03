const Bean = require('../models/beanModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopBeans = (req, res, next) => {
  req.query.limit = '7';
  req.query.sort = '-ratingsAverage,price';
  // what fields to return if we use the down below
  // req.query.fields = 'name, price'
  next();
};

// Controllers
exports.searchBeans = factory.searchBean(Bean);
exports.getBeanSelector = factory.getBeanSelector(Bean);
exports.getAllBeans = factory.getAllBeans(Bean);
exports.getBeansInReview = factory.getBeansInReview(Bean);
exports.getBeanById = factory.getOne(Bean, { path: 'reviews' });
exports.updateBean = factory.updateOne(Bean);
exports.deleteBean = factory.deleteOne(Bean);
exports.createBean = factory.createOne(Bean);

exports.getBeanStats = catchAsync(async (req, res, next) => {
  const stats = await Bean.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$roastLevel',
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //   $match: { _id: { $ne: 'MEDIUM' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

exports.getFlavourNotes = catchAsync(async (req, res, next) => {
  const flavourParam = req.params.flavour;
  const flavour = await Bean.aggregate([
    {
      $unwind: '$flavorNotes',
    },
    { $match: { flavorNotes: { $eq: flavourParam } } },
    // for the moment we have all the flav that are passed as params
    // we can chain them here by adding new obj for sort, group etc..
  ]);
  res.status(200).json({
    status: 'success',
    data: flavour,
  });
});
