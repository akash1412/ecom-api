const express = require('express');

const productsController = require('../controllers/productsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.route('/product-stats').get(productsController.productStats)

router
  .route('/')
  .get(authController.protect, productsController.getAllProducts)
  .post(
    authController.protect,

    productsController.addProduct
  );

router
  .route('/:id')
  .get(productsController.getProduct)
  .patch(productsController.updateProduct)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productsController.deleteProduct
  );

module.exports = router;
