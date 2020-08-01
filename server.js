const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  const { name, message } = err;
  console.log({ name, message });
});

dotenv.config({
  path: './config.env',
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('DB CONNECTED SUCCESSFULY'));

const port = process.env.PORT || 90;
const server = app.listen(port, () => {
  console.log(`Connected to port ${port} 💜`);
});

process.on('unhandledRejection', (err) => {
  console.log({ name: err.name, message: err.message }, err);
  console.log('UNHANDLED_REJECTION, SHUTTING DOWN SERVER !!');
  server.close();
});
