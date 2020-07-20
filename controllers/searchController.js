const Product = require('../models/productsModel');

exports.search = async (req, res) => {
    try {
        const searchText = req.query.q;

        console.log(/searchText/i)

        const Products = await Product.find({ name: { $regex: /product one/i } })

        res.json({
            status: 'success',
            results: Products.length,
            data: {
                Products
            }
        })

    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        });
    }
}
