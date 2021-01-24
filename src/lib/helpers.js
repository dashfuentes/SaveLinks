const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

//check is LoggedIn with passport native methods
helpers.isLoggedIn = (req,res,next) => {
  //if true next with the execution
  if(req.isAuthenticated()){
    return next();
  }
  return res.redirect('/signin');
}

module.exports = helpers;