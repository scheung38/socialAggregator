var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var nconf = require('nconf');
var config = require('./config.json');

// First consider commmandline arguments and environment variables
nconf.argv().env();

// Then load configuration from a designated file
nconf.file({file: 'config.json'});

// Provide default values for settings not provided aboe
nconf.defaults({
    'http': {
        'port': 1337
    }
});

passport.use(new GoogleStrategy({
    clientID:config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL},
    function(req, accessToken, refreshToken, profile, done){
        done(null, profile);
    }

));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'anything'}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user)
});

passport.deserializeUser(function (user, done) {

    done(null, user);
});
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
