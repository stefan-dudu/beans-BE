const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document found with that id', 404));
    }
    res.status(204).json({
      status: 'success',
      message: 'all done',
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const document = await query;

    if (!document) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // to allow for nested Get reviews on bean
    let filter = {};
    if (req.params.beanId) filter = { bean: req.params.beanId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const document = await features.query.explain();
    const document = await features.query;

    // C. SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });

exports.getAllBeans = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find({ inReview: false }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const document = await features.query;

    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });

exports.getBeansInReview = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find({ inReview: true }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const document = await features.query;

    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });

exports.getBeanSelector = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = { inReview: false };
    if (req.params.beanId) {
      filter = { bean: req.params.beanId };
    }

    const { roastLevel, type } = req.body;

    // Construct filter based on request body data
    if (roastLevel) {
      filter.roastLevel = roastLevel;
    }

    if (type && type.length > 0) {
      filter.type = { $in: type };
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const document = await features.query;

    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });

exports.getFarm = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findOne({ slug: req.params.slug });

    if (!document) {
      return next(new AppError('Bean not found', 404));
    }

    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document.locations,
      },
    });
  });

exports.getLocation = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findOne({ name: req.params.isoCode });

    if (!document) {
      return next(new AppError('Bean not found', 404));
    }

    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });

exports.searchBean = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = { inReview: false };

    if (req.params.term) {
      const regex = new RegExp(req.params.term, 'i');
      filter.$or = [{ slug: { $regex: regex } }, { brand: { $regex: regex } }];
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const document = await features.query;

    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });

exports.getReviewForBeanAndUser = (Model) =>
  catchAsync(async (req, res, next) => {
    // Extract beanId and userId from request parameters
    const { beanId, userId } = req.params;

    // Find the review for the specified beanId and userId
    const review = await Model.find({ bean: beanId, user: userId });

    // If no review found, send 404 error
    if (!review) {
      return next(
        new AppError('No review found for the specified bean and user', 404),
      );
    }

    // Send the review data in the response
    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
  });

exports.getSavedStatusForBeanAndUser = (Model) =>
  catchAsync(async (req, res, next) => {
    // Extract beanId and userId from request parameters
    const { beanId, userId } = req.params;

    // Find the review for the specified beanId and userId
    const savedItem = await Model.find({ bean: beanId, user: userId });

    // If no savedItem found, send 404 error
    if (!savedItem) {
      return next(
        new AppError('No savedItem found for the specified bean and user', 404),
      );
    }

    // Send the savedItem data in the response
    res.status(200).json({
      status: 'success',
      data: {
        savedItem,
      },
    });
  });
