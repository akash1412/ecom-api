const Cart = require('../models/cartModel');
const AppError = require('../utils/appError');

exports.getAllCartItems = async (req, res, next) => {
  try {
    // let filter = {};
    // only logged in "users" can access allCartProducts,admin can acces all the items
    // if (req.user.role === 'user') filter.user = req.user.id;

    const cartItems = await Cart.find({ user: req.user.id });

    res.status(200).json({
      status: 'success',
      data: {
        results: cartItems.length,
        cartItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.addItemToCart = async (req, res, next) => {
  try {
    if (!req.body.product) req.body.product = req.params.id;
    if (!req.body.user) req.body.user = req.user.id;

    let CartItem = await Cart.findOne({
      user: req.user.id,
      productId: req.body.productId,
    });

    if (!CartItem) {
      CartItem = new Cart(req.body);
    } else {
      CartItem.quantity = CartItem.quantity + 1;
    }

    await CartItem.save();

    res.status(201).json({
      status: 'success',
      CartItem,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCartItem = async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.productId) req.body.productId = req.params.id;

  try {
    const cartItem = await Cart.findOne(req.body);

    if (!cartItem) {
      return next(new AppError('cart item with this id not found ', 404));
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity = cartItem.quantity - 1;

      await cartItem.save();
    } else {
      await cartItem.deleteOne(req.body);
    }

    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAllCartItems = async (req, res, next) => {
  try {
    await Cart.deleteMany({ user: req.user.id });

    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};
