// const AppError = require('../utils/appError');

// const handleCastErrorDB = (err) => {
//   const message = `Invalid ${err.path}`;
//   return new AppError(message, 400);
// };

// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//     stack: err.stack,
//     error: err,
//   });
// };

// const sendErrorProd = (err, res) => {
//   // operational, send info to client
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//       stack: err.stack,
//       error: err,
//     });
//     // programming, dont leak data to client
//   } else {
//     console.error('THERE BEEN AN ERROR 💥');
//     res
//       .status(500)
//       .json({ status: 'error', message: 'Something went really bad' });
//   }
// };

// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   console.log('process.env.NODE_ENV', process.env.NODE_ENV);

//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV.trim() === 'production') {
//     let error = { ...err };
//     if (error.name === 'CastError') {
//       error = handleCastErrorDB(error);
//     }
//     sendErrorProd(err, res);
//   }
// };

const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} is ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another name!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data with the followings: ${errors.join(
    '. ',
  )}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operationa trusted error:  send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // progaming or other error : Not sent to client
  } else {
    // 1) log error
    console.error('ERROR MATE 🚅', err);
    // 2) send genric message
    res.status(500).json({
      status: 'error',
      message: 'Something went veery wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.satus || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = Object.assign(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
