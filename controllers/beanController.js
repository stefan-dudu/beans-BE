const Bean = require('../models/beanModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopBeans = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  // what fields to return if we use the down below
  // req.query.fields = 'name, price'
  next();
};

// Controllers
exports.getAllBeans = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createBean = async (req, res) => {
  try {
    const newBean = await Bean.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        beans: newBean,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getBeanById = async (req, res) => {
  try {
    const bean = await Bean.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { bean },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateBean = async (req, res) => {
  try {
    const bean = await Bean.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        bean,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteBean = async (req, res) => {
  try {
    await Bean.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Unable to delete',
    });
  }
};

exports.getBeanStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Unable to delete',
    });
  }
};

exports.getFlavourNotes = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Unable to delete',
    });
  }
};
