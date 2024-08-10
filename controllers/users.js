const { sendWelcomeEmail, sendEmailVerificationEmail } = require('../utils/mailer.js');
const User = require('../models/user')
const Listing = require('../models/listing')
const jwt = require('jsonwebtoken')
const passport = require('passport');


  module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
  };
  module.exports.signup = async (req, res, next) => { 
      try {
        let { username, email, password } = req.body;
        const existingUser = await User.findOne({$or:[{email},{password}]})

        if(existingUser){
          req.flash('error',"Username or email already exists");
          return res.redirect('/signup');
        }
        let newUser = new User({ username, email, password });
        const token = jwt.sign(
          {email},
          process.env.JWT_SECRET,
          {expiresIn:'1h'}
        )

        const verificationLink = `${req.protocol}://${req.get('host')}/verify-email?token=${token}`;
        sendEmailVerificationEmail(email,verificationLink);
      
        await User.register(newUser, password);
        newUser.isEmailVerified = false;
        await newUser.save();
        req.flash('success', 'Please check your email to verify your account.');
        res.redirect('/login');    
      } catch (error) {
        req.flash("error","Some internal error occurred");
        res.redirect("/signup");
      }
    };    

  module.exports.renderLoginForm = async (req, res) => {
    res.render("users/login.ejs");
  };

  module.exports.login = (req, res, next) => { 
    passport.authenticate('local', function(err, user, info) {
      if (err) { 
        return next(err); 
      }
      if (!user) {
        req.flash('error', info.message);
        return res.redirect('/login');
      }
      if (!user.isEmailVerified) {
        req.flash('error', 'Please verify your email before logging in.');
        return req.logout(() => res.redirect('/login'));
      }

      req.logIn(user, function(err) {
        if (err) { 
          return next(err); 
        }
        req.flash('success', `Welcome back ${user.username}`);
        return res.redirect('/listings');
      });
    })(req, res, next);
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

  module.exports.verifyEmail = async(req,res) => {
    try {
      const {token} = req.query;
      const decoded = jwt.verify(token,process.env.JWT_SECRET)

      const user = await User.findOne({email:decoded.email});
      if(!user){
        req.flash('error',"Invalid or expired verification token")
        return res.redirect('/signup');
      }

      user.isEmailVerified = true;
      await user.save();
      req.flash('success', 'Your email has been verified! You can now log in.');
      res.redirect('/login');
    } catch (error) {
      req.flash('error', 'Invalid or expired verification token.');
      res.redirect('/signup');  
    }
  }