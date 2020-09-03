const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
  path: './config.env',
});

const Product = require('./models/productsModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB CONNECTED SUCCESSFULY'));

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/data/updated.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Product.create(products);
    console.log('Products added succesfully ✅');
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('Products deleted succesfully ✅');
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
