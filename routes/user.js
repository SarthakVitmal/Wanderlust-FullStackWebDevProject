const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const userSchema = require("../schema");
const passport = require("passport");
const userControllers = require("../controllers/users");

//Signup
router.get("/signup", userControllers.renderSignupForm);
router.post("/signup", wrapAsync(userControllers.signup));

//Login
router.get("/login", wrapAsync(userControllers.renderLoginForm));

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControllers.login
);

//Logout
router.get("/logout", userControllers.logout);

module.exports = router;
