/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//var methodOverride = require('method-override');
var session = require('express-session');
var app = express();
var mysql = require('mysql');
var bodyParser=require("body-parser");
//var cookieParser = require('cookie-parser');
var connection = mysql.createConnection({
            host     : 'localhost', 
            user     : 'tkche870302',
            password : 'Mq870955677765',
            database : 'test',
            //socketPath : '/tmp/mysql.sock'
            });
connection.connect();
connection.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

global.db = connection;
 
// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: false,
              cookie: { maxAge: 60000 }
            }))
app.use(function(req, res, next) {
  res.locals.login = req.session.login;
  res.locals.user = req.session.user;
  next();
});
 
// development only
 
app.get('/', user.index);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', user.login);//call for login page
app.post('/login', user.login);//call for login post
app.get('/logout', user.logout);//call for logout page
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile
app.get('/events',user.events);//to render eventlist
app.get('/anncs/:annc_id',user.anncs);//to render eventlist
app.post('/anncs',user.index);
app.get('/anncsadd',user.signup);
app.get('/anncs/:annc_id/delete', user.anncDelete);//to delete the announce with annc_id
//Middleware
app.listen(8080)
