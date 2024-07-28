const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/auth/google',passport.authenticate('google',{
    scope: ['profile,email']
}))

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/listings'
}));

module.exports = router