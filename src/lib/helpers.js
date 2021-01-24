const bcrypt = require('bcryptjs');

const helpers = {};

//SignUp
helpers.generatePassword = async (password) =>{
    //generate patron
    const salt = await bcrypt.genSalt(10);
    //generate password by patron
    const hash =  await bcrypt.hash(password,salt);
    return hash;
}

//Login (compare password)

helpers.matchPassword = async (password,savedPassword) =>{
    try {
        await bcrypt.compare(password,savedPassword);
    } catch (e) {
        console.log(e)
        
    }
}

module.exports = helpers;