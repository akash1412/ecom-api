const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: [true, 'Please enter quantity'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({ path: 'product', select: 'name type price' });
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
