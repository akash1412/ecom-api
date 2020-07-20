const express = require('express');
const morgan = require('morgan')


const productsRouter = require('./routes/productRoutes');
const searchController = require('./controllers/searchController');

const app = express();
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json());


app.use('/api/v1/products', productsRouter)

//----SEARCH-----//
app.use('/api/v1/search', searchController.search)




// module.exports = app;
module.exports = app;