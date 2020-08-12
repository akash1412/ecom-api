const express = require('express');

const productsController = require('../controllers/productsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.route('/product-stats').get(productsController.productStats)

router
  .route('/on-sale')
  .get(productsController.onSaleProducts, productsController.getAllProducts);

router
  .route('/')
  .get(productsController.getAllProducts)
  .post(authController.protect, productsController.createProduct);

router.route('/s/:type').get(productsController.getAllProducts);
// router.route('/aggregate').get(productsController.getShopProducts);

router
  .route('/:id')
  .get(productsController.getProduct)
  .patch(productsController.updateProduct)
  .delete(
    authController.protect,
    // authController.restrictTo('admin'),
    productsController.deleteProduct
  );

module.exports = router;
