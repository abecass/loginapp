//instantiate dependencies

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

//routes
var routes = require('./routes/index');
var users = require('./routes/users');

//initialize app
var app = express();

//view engine
	//a folder called 'views' will handle views
app.set('views', path.join(__dirname, 'views'));
	//use handlebars, and the default layout we use will be called 'layout'
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
	//set the view engine to handlebars
app.set('view engine', 'handlebars');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//set static folder (for things publicly accessible to the browser)
app.use(express.static(path.join(__dirname, 'public')));

//Express Session middleware
//**secret
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator middleware (from GithHub page)
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect Flash middleware
app.use(flash());

//Global variables for flash messages
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	//passport sets its own error messages to 'error'
	res.locals.error = req.flash('error');
	next();
});

//middleware for route files (see '//routes' above)
app.use('/', routes);
app.use('/users', users);

//Set Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function(){
	console.log('Server started on port' + app.get('port'));
});