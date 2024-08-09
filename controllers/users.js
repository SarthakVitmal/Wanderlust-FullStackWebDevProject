const { sendWelcomeEmail } = require('../utils/mailer.js');
const User = require('../models/user')
const Listing = require('../models/listing')


  module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
  };
  module.exports.signup = async (req, res, next) => { 
      try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email, password });
        const registeredUser = await User.register(newUser, password);
        
        await sendWelcomeEmail(username,email)
        
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

  module.exports.userProfile = async (req, res) => {
    let userId = req.user._id;
    let userListings = await Listing.find({ owner: userId });
    res.render("users/profile.ejs", { currentUser: req.user, userListings });
  };
