const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
    });

    newUser.password = undefined;

    const token = createToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
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

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    console.log({ user });

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
        new AppError('User belonging to this token, no longer exists', 404)
      );
    }

    if (!user.changedPasswordAfterGeneratingToken(decoded.iat)) {
      return next(new AppError('Token Expired,Please login again', 401));
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
