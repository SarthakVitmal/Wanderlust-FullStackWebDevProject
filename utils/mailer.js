const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_NPASSWORD,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    let mailOptions = {
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      text,
    };
    await transporter.sendMail(mailOptions);
    console.log('Mail sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};
    