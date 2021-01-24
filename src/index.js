const express = require('express');
const morgan = require('morgan');
const exhb = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const {database} =  require('./keys');
const passport =  require('passport');


//initializations
const app = express();
//passport config
require('./lib/passport');

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

//guardando en Mysql sesion
app.use(session({
    secret: 'dashfuentes',
    resave:false,
    saveUninitialized: false,
    store: new mysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
//accept format request
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//Global ENV
app.use((req,res,next) =>{
    //puedo utilizar el flash message en todas las vistas
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  //obtener el usuario en sesion auth:user 
  app.locals.user = req.user;
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