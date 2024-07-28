const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/auth/google',passport.authenticate('google',{
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
}))

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/listings'
}));

module.exports = router