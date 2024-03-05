const Bean = require('../models/beanModel');

// Controllers
exports.getAllBeans = async (req, res) => {
  try {
    const allBeans = await Bean.find();

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
      message: 'Invalid data sent',
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
      message: 'Invalid data sent',
    });
  }
};

exports.updateBean = async (req, res) => {
  try {
    const bean = await Bean.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
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
      message: 'Invalid data sent',
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
