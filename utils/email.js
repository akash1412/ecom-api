const NodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = NodeMailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: 'Akash Prasad <akashorasad2000@gmail.com>',
    to: options.to,
    text: options.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
