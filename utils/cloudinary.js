const { compareSync } = require('bcryptjs');
const cloudinary = require('cloudinary');
const fs = require('fs');
const url = '../img/shop';

const shopProducts = JSON.parse(
  fs.readFileSync(`../data/products.json`, 'utf-8')
);

// console.log(shopProducts);

cloudinary.config({
  cloud_name: 'dhqp2dd6b',
  api_key: 974623625436173,
  api_secret: 'KY_3PkbwRe_CyeLgyGin8C4gCoA',
});

let updatedArray = [];

(() => {
  const values = shopProducts.map((product) => {
    cloudinary.v2.uploader
      .upload(`${url}/${product.Image}`, { upload_preset: 'shop' })
      .then((res) => {
        product.Image = res.url;
        console.log('log');

        updatedArray.push(product);
        fs.writeFileSync(
          '../data/updated.json',
          JSON.stringify([...updatedArray])
        );
        return product;
      })
      .catch((err) => console.log(err));
  });
})();

// fs.writeFileSync('../data/updated.json', JSON.stringify(values));
module.exports = cloudinary;

// ,
//   {
//     "name": "Cap 1",
//     "price": 200,
//     "description": "good Product",
//     "Image": "cap-1.jpg",

//     "quantity": 30,
//     "type": "cap",
//     "priceDiscount": 300
//   },
//   {
//     "name": "Cap 2",
//     "price": 150,
//     "description": "good Product",
//     "Image": "cap-2.jpg",

//     "quantity": 30,
//     "type": "cap",
//     "priceDiscount": 300
//   },
//   {
//     "name": "Cap 3",
//     "price": 145,
//     "description": "good Product",
//     "Image": "cap-3.jpg",

//     "quantity": 30,
//     "type": "cap",
//     "priceDiscount": 300
//   },
//   {
//     "name": "Cap 4",
//     "price": 150,
//     "description": "good Product",
//     "Image": "cap-4.jpg",

//     "quantity": 30,
//     "type": "cap",
//     "priceDiscount": 300
//   },
//   {
//     "name": "Cap 5",
//     "price": 100,
//     "description": "good Product",
//     "Image": "cap-5.jpg",

//     "quantity": 30,
//     "type": "cap",
//     "priceDiscount": 300
//   },
//   {
//     "name": "Cap 6",
//     "price": 90,
//     "description": "good Product",
//     "Image": "cap-6.jpg",

//     "quantity": 30,
//     "type": "cap",
//     "priceDiscount": 300
//   },
//   {
//     "name": "Cap 7",
//     "price": 150,
//     "description": "good Product",
//     "Image": "cap-7.jpg",

//     "quantity": 30,
//     "type": "cap",
//     "priceDiscount": 300
//   },
//   {
//     "name": "Cap 8",
//     "price": 130,
//     "description": "good Product",
//     "Image": "cap-8.jpg",

//     "quantity": 30,
//     "type": "cap",
//     "priceDiscount": 300
//   },
//   {
//     "name": "Cap 9",
//     "price": 110,
//     "description": "good Product",
//     "Image": "cap-9.jpg",

//     "quantity": 30,
//     "type": "cap",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 1",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-1.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 2",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-2.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 3",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-3.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 4",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-4.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 5",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-5.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 6",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-6.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 7",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-7.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 8",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-8.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 9",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-9.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 10",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-10.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 11",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-11.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 12",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-12.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   },
//   {
//     "name": "shoe 13",
//     "price": 110,
//     "description": "good Product",
//     "Image": "shoe-13.jpg",

//     "quantity": 30,
//     "type": "shoe",
//     "priceDiscount": 300
//   }
