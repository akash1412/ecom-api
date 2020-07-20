const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Product msut have a name'],
        unique: [true, ' Provided name must be Unique '],
        trim: true,
        minlength: [10, 'A Producr must have have more or equal to 10 Characters'],
        maxlength: [40, 'A Producr must have have less or equal to 40 Characters']
    },
    slug: String,
    price: {
        type: Number,
        required: [true, 'A Product must have a Price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price
            },
            message: 'discount price {VALUE} must be less than actual price'
        },
    },
    description: {
        type: String,
        // required: {
        //     value: true,
        //     message: 'A product must have a description'
        // },
        //👇 this is shorthand syntax 
        required: [true, 'A product must have a description']
    },
    coverImage: String,
    images: [String],

    createdAt: {
        type: Date,
        default: Date.now(),
    },
    quantity: Number
});

productSchema.pre('save', function (next) {
    this.slug = slugify(this.name);

    next();
})

const Product = new mongoose.model('Product', productSchema);

module.exports = Product;