const { sendEmail } = require('../utils/mailer'); // Adjust the path as needed
const User = require('../models/user')

  module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
  };
  module.exports.signup = async (req, res, next) => { 
      try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email, password });
        const registeredUser = await User.register(newUser, password);
    
        const welcomeMessage = `Hello ${username},\n\nWelcome to Wanderlust! We're glad to have you here.\nWe are thrilled to have you join our community. Whether you are here to explore new destinations, share your experiences, or connect with fellow travelers, we're excited to be part of your journey.
\nThank you for signing up, and happy exploring!
\nRegards,\nSarthak Vitmal - Team Wanderlust`;
        await sendEmail({
          to: registeredUser.email,
          subject: 'Welcome to Wanderlust',
          text: welcomeMessage
        });
    
        req.login(registeredUser, (err) => {
          if (err) {
            return next(err); 
          }
          req.flash("success", "Welcome To Wanderlust");
          res.redirect("/listings");
        });
      } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
      }
    };    

  module.exports.renderLoginForm = async (req, res) => {
    res.render("users/login.ejs");
  };

  module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back To Wanderlust!");
    res.redirect("/listings");
  };

  module.exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    });
  };
