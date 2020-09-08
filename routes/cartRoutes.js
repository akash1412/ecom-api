const router = require('express').Router({ mergeParams: true });
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const Cart = require('../models/cartModel');

router.route('/').get(authController.protect, cartController.getAllCartItems);

router
  .route('/:id')
  .post(authController.protect, cartController.addItemToCart)
  .delete(authController.protect, cartController.deleteCartItem);

router.delete('/', authController.protect, cartController.deleteAllCartItems);

module.exports = router;
