var chalk = require('chalk');
console.log(chalk.bgBlack.white("Starting app..."));

console.log(chalk.bgYellow.black("Loading packages..."));
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Yelp = require('yelp');

console.log(chalk.bgYellow.black("Loading settings..."));
var port = process.env.PORT || 8080;
var app = express();
app.locals.title = "freeCodeCamp Nightlife Coordination App"

console.log(chalk.bgBlue.white("Checking for environment setup..."));
if (typeof process.env.YELP_CONSUMER_KEY == "undefined") {
    console.log("No environment setup.  Loading environment from config...");
    require('./config/config.js');
    console.log("Checking again for environment...");
    if (typeof process.env.APP_ENV !== "undefined") {
        app.set('env', process.env.APP_ENV);
    }
    if (typeof process.env.YELP_CONSUMER_KEY == "undefined") {
        console.log(chalk.bgRed.black("No environment found.  Exiting..."));
        process.exit();
    }
}

console.log(chalk.bgGreen.black("Environment found."));
console.log("Checking for " + chalk.bgRed.white("Yelp API") + " settings...");
if (typeof process.env.YELP_CONSUMER_KEY != "string"    ||
    typeof process.env.YELP_CONSUMER_SECRET != "string" ||
    typeof process.env.YELP_TOKEN != "string"           ||
    typeof process.env.YELP_TOKEN_SECRET != "string") 
{
    console.log(chalk.bgRed.black("Required Yelp settings missing.  Exiting..."));
    process.exit();
}
else {
    // The Yelp settings must be defined BEFORE require()ing the routes, as the routes use those settings.
    console.log(chalk.bgGreen.black("All Yelp settings defined."));
    console.log(chalk.bgYellow.black("Loading routes..."));
    var routes = require('./routes/index');
    var users = require('./routes/users');
}


// view engine setup
console.log(chalk.bgYellow.black("Loading view engine and views..."));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

console.log(chalk.bgYellow.black("Loading middleware..."));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
console.log(chalk.bgBlue.white("Environment setting is " + app.get('env') + "."));
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//*** Routes are in /routes/index.js ***
console.log(chalk.bgYellow.black("Connecting to MongoDB..."));
mongoose.connect(process.env.MONGO_URI);
global.db = mongoose.connection;

global.db.on('error', function(error) {
    console.error("Mongoose connection error: ");
    console.dir(error);
    console.log("Exiting...");
});

global.db.once('open', function () {
    console.log(chalk.bgGreen.black("Connected to MongoDB."));
    app.listen(port, function() {
        console.log(chalk.bgGreen.black(`Listening on port ${port}.`));
    });
});

module.exports = app;
