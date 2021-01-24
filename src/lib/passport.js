const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');

//Metodo de autenticacion con nuestra propia BD,existen mas que ofrece passport como OAUTH

passport.use('local.signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username,password,done) =>{
    // console.log(req.body);
    //get fullname
    const {fullname} = req.body;
    //new User
    const newUser = {
        username,
        password,
        fullname
    };
    //encrypt password
    newUser.password =  await helpers.generatePassword(password);
   const result= await pool.query('INSERT INTO users set ? ', [newUser]);
   console.log(result);


}));

//seriaizar el usuario y guardarlo en una sesion
