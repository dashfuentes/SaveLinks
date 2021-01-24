const passport = require('passport');
const bcrypt = require('bcryptjs');

const localStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');

//Metodo de autenticacion con nuestra propia BD,existen mas que ofrece passport como OAUTH,Bearer etc

//SignIn
passport.use('local.signin', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(password, user.password)
    //const validPassword = await bcrypt.compare(req.body.password, user.password);
    
      if (validPassword) {
        done(null, user, req.flash('success', 'Welcome ' + user.username));
      } else {
        done(null, false, req.flash('message', 'Incorrect Password'));
      }
    } else {
      return done(null, false, req.flash('message', 'The Username does not exists.'));
    }
  }));


//SignUp
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
    newUser.password =  await helpers.encryptPassword(password);
    const result= await pool.query('INSERT INTO users set ? ', [newUser]);
  // console.log(result);
  //get the id from the object passport
    newUser.id = result.insertId;
    //if no error,return the newUser for the session
    return done(null,newUser);


}));

//serializar el usuario y guardar la sesion en memoria de nuestra aplicacion
passport.serializeUser((user,done) =>{
    done(null,user.id);
});
//deserializar el usuario y consultar en la BD con su id
passport.deserializeUser(async (id,done) =>{
    const rows = await pool.query('SELECT * from users where id = ?',[id]);
    done(null,rows[0]);
});
