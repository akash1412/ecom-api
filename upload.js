const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productsModel')
dotenv.config({
    path: './config.env'
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB CONNECTED SUCCESSFULY'))

const products = JSON.parse(fs.readFileSync(`${__dirname}/data/products.json`, 'utf-8'))

console.log(process.argv)

const importData = async () => {
    try {
        await Product.create(products);
        console.log('products added succesfully ✔');
    } catch (error) {
        console.log(error)
    }

}


const deleteData = async () => {
    try {
        await Product.deleteMany();
        console.log('products deleted succesfully ✔');
    } catch (error) {
        console.log(error)
    }

}


if (process.argv[2] === '--import') {
    importData()

} else if (process.argv[2] === '--delete') {
    deleteData()
}