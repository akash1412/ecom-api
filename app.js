const express = require('express');
const morgan = require('morgan');

const productsRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

const searchController = require('./controllers/searchController');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/users', userRouter);

//----SEARCH-----//
app.use('/api/v1/search', searchController.search);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server !.`, 404));
});

app.use(globalErrorHandler);

// Exports express app to the server.js file
module.exports = app;
