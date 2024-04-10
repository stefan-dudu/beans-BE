const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSantize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const beansRouter = require('./routes/beansRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewsRoutes');

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://fotbalist.net/',
      'https://baristretto.com',
    ],
    credentials: true,
  }),
);

//  1) GLOBAL MIDDLEWARES

// set securitiy http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests from the same API
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Try again over an hour!',
});
app.use('/api', limiter);

// body parser eading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL QUERY INJECTION
app.use(mongoSantize());

// Data sanitization against XSS
app.use(xss());

// Test MW
// app.use((req, res, next) => {
//   req.requesTime = new Date().toISOString();
//   // console.log('req ---', req.cookies);
//   // console.log('test mw');
//   next();
// });

// Routes
app.use('/api/v1/beans', beansRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// prevent prarameter polution
app.use(
  hpp({
    whitelist: [
      'origin',
      'ratingsAverage',
      'ratingsQuantity',
      'roastLevel',
      'flavorNotes',
      'aroma',
      'acidity',
      'body',
      'price',
    ],
  }),
);

module.exports = app;
