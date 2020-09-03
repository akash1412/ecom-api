const Product = require('../models/productsModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');

exports.onSaleProducts = (req, res, next) => {
  req.query.priceDiscount = { gt: 0 };
  next();
};

exports.getAllProducts = async (req, res, next) => {
  try {
    let filter = {};

    if (req.params.type) filter.type = req.params.type;

    const Query = new ApiFeatures(Product.find(filter), req.query);
    const Features = Query.filter().sort().limitFields().paginate();

    const products = await Features.query;

    const count = await Product.countDocuments();
    const curPage = req.query.page || 1;
    const totalPages = Math.ceil(count / req.query.limit || 1);
    const hasNextPage = curPage >= totalPages ? false : true;
    const nextPage = hasNextPage ? curPage * 1 + 1 : '';

    res.status(200).json({
      totalPages,
      curPage,
      hasNextPage,
      nextPage,
      status: 'success',
      results: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        new AppError(`No product found with this id:${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    req.body.photo = await cloudinary.v2.uploader.upload(req.body.photo);

    const product = await Product.create(req.body);
    res.status(201).json({
      status: 'Success',
      message: 'product created',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });

    res.status(200).json({
      status: 'Success',
      message: 'product updated',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      message: 'product deleted',
    });
  } catch (err) {
    next(err);
  }
};

// exports.productStats = async (req, res) => {

//     try {
//         const stats = await Product.aggregate([
//             {
//                 $match: { price: { $gte: 100 } }
//             },
//             // {
//             //     $group: {
//             //         _id: "$price"

//             //     }
//             // }
//         ])

//         res.status(200).json({
//             status: "Success",
//             data: {
//                 stats
//             }
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(400).json({
//             status: "Fail",
//             message: err.message
//         });
//     }
// }

exports.getShopProducts = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      {
        $match: { _id: { $ne: null } },
      },
      {
        $group: {
          _id: '$type',
        },
      },
    ]);

    console.log(products);

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};
