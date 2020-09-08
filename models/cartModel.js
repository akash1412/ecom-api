const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A cart item must have a name'],
    },
    imgUrl: {
      type: String,
      required: [true, ' a cart item must have a image'],
    },
    price: {
      type: Number,
      required: [true, 'A cart item must have a price'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please enter quantity'],
      default: 1,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'A Cart product must have a id'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Cart Must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.index({ id: 1, user: 1 });

// cartSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'product', select: 'name type price' });
//   next();
// });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
