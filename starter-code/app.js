const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");
var debug = require('debug')('express-passport:'+path.basename(__filename));
const {dbURL} = require('./config/db');
const flash = require("connect-flash");
const session = require("express-session");
const passport      = require("passport");

const app = express();

// Controllers
const siteController = require("./routes/siteController");
const auth = require("./routes/auth");
const employee = require("./routes/employee");

// Mongoose configuration
mongoose.connect(dbURL);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

require('./passport/local');

app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/", siteController);
app.use("/auth", auth);
app.use("/employee", employee);

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
  res.render('error',{error:err});
});

module.exports = app;
