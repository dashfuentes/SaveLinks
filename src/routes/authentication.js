const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn} =  require('../lib/helpers');

router.get('/signup',(req,res) =>{
  
    res.render('auth/signup');
});

//signUp with passport
router.post('/signup',passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash : true
}));

//check is loggedIn first
router.get('/profile', isLoggedIn ,(req,res) =>{
    res.render('auth/profile');
});

//SignIn
router.get('/signin',(req,res) =>{
  
    res.render('auth/signin');
});

router.post('/signin',(req,res,next) =>{
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
      })(req, res, next);
});

//logout
router.get('/logout', (req,res) =>{
    //passport logout methor
    req.session.destroy();
  res.redirect('/');
})

module.exports =  router;