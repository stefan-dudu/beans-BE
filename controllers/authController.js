const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) =>
  jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    domain: 'baristretto.com',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    credentials: 'include',
  };

  if (process.env.NODE_ENV === 'development') {
    cookieOptions.domain = '';
    cookieOptions.sameSite = 'None';
  }

  res.cookie('jwt', token, cookieOptions);

  // console.log('process.env.NODE_ENV', process.env.NODE_ENV);

  // removes the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role,
  });

  const url = `${process.env.DEV_URL}createbean`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if mail and pass exist

  if (!email || !password) {
    return next(new AppError('Please provide email and pass', 400));
  }
  // 2)check if the user exists and if the pass if correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorect email or password', 401));
  }

  // 3) if all good, send the token to client

  //   createSendToken(user, 200, res);
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000),
    secure: true,
    sameSite: 'None', // Required for cross-site requests
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  console.log('protect 🛡️');
  // 1) get token adn check it it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // console.log('token', token);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exist', 401),
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Log in again', 401),
    );
  }
  //   Grant access to potected route
  req.user = currentUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET,
    );

    // 3) Check if user still exists

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next();
    }
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }
    //   THERE IS A LOGGED IN USER
    req.user = currentUser;
    next();
  }
});

// restrict certain routes for different user roles
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles = ['admin', 'lead-guide'].role ='user

    console.log('roles', roles);
    console.log('req.user.role', req.user.role);

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on POSTed mail
  const user = await User.findOne({ email: req.body.email });
  // console.log('User 🌍🌍', user);
  if (!user) {
    return next(new AppError('There is no user with this email adress', 404));
  }

  // 2) generate the randon reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to users email

  const resetURL = `${process.env.DEV_URL}api/v1/users/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user basedn on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) if token has not expired, and if there is a user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) update changedpassAt poperty for the user

  // 4) Log the user in, send JWT
  // createSendToken(user, 200, res);

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm, passwordCurrent } = req.body;
  // 1) get user from collection
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(
      new AppError('To update the password, you need a valid user', 404),
    );
  }
  // 2) check if POSTed current password is correct

  const postedCurrentPassword = await user.correctPassword(
    passwordCurrent,
    user.password,
  );
  // console.log('postedCurrentPassword', postedCurrentPassword);
  if (!postedCurrentPassword) {
    return next(
      new AppError(
        'Wrong password inserted when trying to update it. Try again',
        401,
      ),
    );
  }

  // 3) if so, update the pass
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will not work : The pre MW will not run nor the passwordConfirm validate
  // 4) log user in, send JWT
  createSendToken(user, 200, res);
});
