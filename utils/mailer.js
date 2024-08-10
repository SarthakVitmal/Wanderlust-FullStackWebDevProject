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

module.exports.sendWelcomeEmail = async (username, userEmail) => {
  try {
    let mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: userEmail,
      subject: 'Welcome to Wanderlust!',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Dear ${username},</h2>
          <p><b>Welcome to Wanderlust!</b></p>
          <p>We're thrilled to have you join our community of explorers, adventurers, and travel enthusiasts. At Wanderlust, we believe that every journey is a story waiting to be told, and we can't wait to be a part of yours.</p>
          <p>🌍 <b>Discover New Destinations</b><br>
          From the bustling streets of Tokyo to the serene beaches of Bali, our platform offers a diverse range of destinations to satisfy your wanderlust. Whether you're seeking adventure, relaxation, or cultural immersion, Wanderlust has something for every traveler.</p>
          <p>🏡 <b>Stay in Unique Accommodations</b><br>
          We partner with hosts worldwide to bring you unique and memorable stays. From cozy cabins in the mountains to chic apartments in the heart of the city, find the perfect home away from home.</p>
          <p>🗺️ <b>Plan Your Perfect Trip</b><br>
          Our user-friendly platform makes it easy to plan your next adventure. Browse listings, read reviews, and book your stay with confidence. Plus, our dedicated customer support team is here to assist you every step of the way.</p>
          <p><b>Exclusive Welcome Offer</b><br>
          As a token of our appreciation, we're excited to offer you a special discount on your first booking. Use the code <b>WELCOME10</b> at checkout to enjoy 10% off your stay.</p>
          <p>Thank you for choosing Wanderlust. We're here to help you create unforgettable memories and explore the world like never before.</p>
          <p><b>Happy Travels!</b></p>
          <p>Warm regards,<br>
          The Wanderlust Team<br>
          wanderlustteam.explore@gmail.com<br>
      </div>`
    };
    console.log(mailOptions.html)
    await transporter.sendMail(mailOptions);
    console.log('Mail sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports.sendEmailVerificationEmail = async(email,verificationLink)=>{
    const transporter = nodemailer.createTransport({
      service:'Gmail',
      auth:{
        user:process.env.SMTP_EMAIL,
        pass:process.env.SMTP_NPASSWORD,
      }
    })

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to:email,
      subject:'Wanderlust:Verify Your Email',
      text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    }
    await transporter.sendMail(mailOptions);
    console.log("Mail send successfully");
}
