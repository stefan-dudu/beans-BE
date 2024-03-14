const Bean = require('../models/beanModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopBeans = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  // what fields to return if we use the down below
  // req.query.fields = 'name, price'
  next();
};

// Controllers
exports.getAllBeans = catchAsync(async (req, res) => {
  const features = new APIFeatures(Bean.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const allBeans = await features.query;

  res.status(200).json({
    status: 'success',
    results: allBeans.length,
    data: { allBeans },
  });
});

exports.createBean = catchAsync(async (req, res, next) => {
  const newBean = await Bean.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      beans: newBean,
    },
  });
});

exports.getBeanById = catchAsync(async (req, res, next) => {
  const bean = await Bean.findById(req.params.id).populate('reviews');

  if (!bean) {
    return next(new AppError('No bean found with this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { bean },
  });
});

exports.updateBean = catchAsync(async (req, res, next) => {
  const bean = await Bean.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bean) {
    return next(new AppError('No bean found with this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      bean,
    },
  });
});

exports.deleteBean = factory.deleteOne(Bean);

// exports.deleteBean = catchAsync(async (req, res, next) => {
//   const bean = await Bean.findByIdAndDelete(req.params.id);
//   if (!bean) {
//     return next(new AppError('No bean found with this id', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

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
