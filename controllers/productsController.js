const Product = require("../models/productsModel");

exports.getProducts = async (req, res, next) => {
    try {
        let query = Product.find();



        //* sorting 
        if (req.query.sort) {

            const sortQuery = req.query.sort.split(',').join(' ')
            query = query.sort(sortQuery)
        } else {

            query = query.sort('createdAt')
        }


        // //* Pagination

        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);


        // Field limiting
        if (req.query.fields) {

            const fields = req.query.fields.split(',').join(' ')

            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        const products = await query;

        res.status(200).json({
            status: "success",
            results: products.length,
            data: {
                products
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: err.message
        });
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
                product
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: err.message
        });
    }

};

exports.addProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            status: "Success",
            message: "product created",
            data: {
                product
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: err.message
        });
    }

};

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true
        });

        res.status(200).json({
            status: "Success",
            message: "product updated",
            data: {
                product
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: err.message
        });
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "Success",
            message: "product deleted",
            data: {
                product
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: err.message
        });
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