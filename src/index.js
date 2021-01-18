const express = require('express');
const morgan = require('morgan');
const exhb = require('express-handlebars');
const path = require('path');

//initializations
const app = express();

//settings
app.set('port', process.env.PORT || 4000);
//set absolute path to views folder
app.set('views',path.join(__dirname, 'views'));
//handlebar conf
app.engine('.hbs',exhb({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
    
}));
app.set('view engine', '.hbs');

//Middelwares
app.use(morgan('dev'));
//accept format request
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Global ENV
app.use((req,res,next) =>{
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication.js'));
app.use('/links',require('./routes/link.js'));
//Public
app.use(express.static(path.join(__dirname,'public')))
//Start Server
app.listen(app.get('port'), () =>{
    console.log('server on port',app.get('port') )
})