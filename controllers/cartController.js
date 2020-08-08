const Cart = require('../models/cartModel');

exports.getAllCartItems = async (req, res, next) => {
  try {
    let filter = {};
    // only logged in "users" can access allCartProducts,admin can acces all the items
    if (req.user.role === 'user') filter.user = req.user.id;

    const cartItems = await Cart.find(filter);

    res.status(200).json({
      status: 'success',
      cartItems,
    });
  } catch (error) {
    next(error);
  }
};

exports.addItemToCart = async (req, res, next) => {
  try {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user.id;

    let CartItem = await Cart.findOne({ product: req.body.product });

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
  try {
    await Cart.findByIdAndDelete(req.params.productId);

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
    next();
  }
};
