const express = require('express');
const morgan = require('morgan');

const beansRouter = require('./routes/beansRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlewares
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// Routes
app.use('/api/v1/beans', beansRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});
module.exports = app;
