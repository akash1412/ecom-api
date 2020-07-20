const productsController = require('../controllers/productsController')

const express = require('express');

const router = express.Router();

// router.route('/product-stats').get(productsController.productStats)

router
    .route('/')
    .get(productsController.getProducts)
    .post(productsController.addProduct);


router
    .route('/:id')
    .get(productsController.getProduct)
    .patch(productsController.updateProduct)
    .delete(productsController.deleteProduct)


module.exports = router;