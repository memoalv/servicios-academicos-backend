const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

module.exports = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.SEND_GRID_KEY
      }
    })
  );

// returns a promise
//   transporter.sendMail({
//     to: email,
//     from: 'shop@node-complete.com',
//     subject: 'Signup succeeded!',
//     html: '<h1>You successfully signed up!</h1>'
//   });