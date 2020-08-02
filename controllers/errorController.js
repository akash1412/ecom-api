const AppError = require('../utils/appError');

const HandleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;

  err = new AppError(message, 400);

  return err;
};

const handleValidationErrorDB = (err) => {
  const value = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data:${value.join(', ')}`;
  err = new AppError(message, 400);

  return err;
};

const handleDuplicateFieldsDB = (err) => {
  const values = Object.values(err.keyValue);
  const message = `Duplicate field [${values}].Please use another value`;

  err = new AppError(message, 400);
  return err;
};

const handleJWTError = (err) => {
  const message = 'Invalid Token,Please login again.';
  err = new AppError(message, 401);

  return err;
};

const handleJWTTokenExpiredError = (err) => {
  const message = 'Token expired, Please login again to get access';
  err = new AppError(message, 401);

  return err;
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  console.log(err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
};

const globalErrorHandling = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = HandleCastErrorDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
    if (err.name === 'TokenExpiredError') err = handleJWTTokenExpiredError(err);

    sendErrorProd(err, res);
  }
};

module.exports = globalErrorHandling;
