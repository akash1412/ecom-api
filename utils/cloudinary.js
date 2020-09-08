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
      .then(async (res) => {
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
