// from nodemailer
const User = require('../models/user');
const nodemailer = require('nodemailer');

const sendMail = async (email, tokens) => {
  try {
    // Fetch the user from the User model using the provided email
    const result = await User.findOne({ where: { email: email } });

    // Check if the user exists and has an email
    if (!result || !result.email) {
      console.error('User not found or email is missing');
      return;
    }
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE_PROVIDER,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const clientURL = 'http://localhost:3000'; // Replace with your actual client URL
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: 'Reset Password Request',
      html: `
        <p>Hello,</p>
        <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
        <p>To reset your password, click the link below:</p>
        <p><a href="${clientURL}/reset-password/${tokens}">${clientURL}/reset-password/${tokens}</a></p>
        <p>Please note that this link will expire in 10 minutes for security reasons.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,</p>
        <p>PlayMania Team</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = sendMail;
