const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const SendEmail = require('../utils/email');

const AppError = require('../utils/appError');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (res, user, statusCode) => {
  const token = createToken(user.id);

  res.cookie('jwt', token, {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === 'production' ? true : false,
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    createSendToken(res, newUser, 201);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  //1) get email and password from user,if not present send error
  //2)check ,user with the given email exists or not
  //3) compare both  passwords
  //4) send token

  try {
    const { email, password } = req.body;

    console.log(email, password);

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePasswords(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = createToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.protect = async (req, res, next) => {
  try {
    //1)get token from request header,if not present send error
    //2)verify token
    //3)check if the user still exists in the db
    //4) check if the passwords is changed ,after generating the token
    //5) Give access to the route

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in,please login to access', 401)
      );
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new AppError('The user belonging to this token,no longer exist', 401)
      );
    }

    if (!user.changedPasswordAfterGeneratingToken(decoded.iat)) {
      return next(new AppError('Token Expired,Please login again', 401));
    }

    req.user = user;

    console.log(req.user);

    next();
  } catch (error) {
    next(error);
  }
};

exports.restrictTo = (role) => {
  return (req, res, next) => {
    if (!(role === req.user.role)) {
      return next(
        new AppError('You are not Authorized to accessed this route', 401)
      );
    }

    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  //1) get user email
  // 2) check user exist or not
  //3)create token
  //4) send it to email address
  if (!req.body.email) {
    return next(new AppError('Please provide your email address', 400));
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('User with this email,does not exists', 404));
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const message = `Forgot Your password? Submit a PATCH request with your new password and 
  passwordConfirm to:${req.protocol}://localhost:82/api/v1/users/resetPassword/${resetToken}.
If you didn't forget your password,Please ignore this email`;

  try {
    await SendEmail({ to: user.email, message });
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;

    user.save({ validateBeforeSave: false });

    return next(
      new AppError('Error Sending Email,Please try again later.', 500)
    );
  }

  res.status(200).json({
    status: 'success',
    message: `token sent to email:${user.email}`,
  });
};

exports.resetPassword = async (req, res, next) => {
  try {
    //1) Verify reset token,
    //2)get user
    //)change password
    //4) send login token again

    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresIn: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token Expired,Please try again', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'password successfully changed!,Please login again',
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    //1) confirm previous password
    //2)updatePassword
    //3)send JWT token

    const user = await User.findById(req.user._id).select('+password');

    console.log(user);

    if (
      !(await user.comparePasswords(req.body.currentPassword, user.password))
    ) {
      return next(new AppError('passwords do not match', 400));
    }

    (user.password = req.body.password),
      (user.passwordConfirm = req.body.passwordConfirm);

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'password updated!,Please login again.',
    });
  } catch (error) {
    next(error);
  }
};
