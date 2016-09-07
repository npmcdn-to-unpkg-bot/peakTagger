require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var jwt = require('jsonwebtoken');


var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();

app.use(cookieSession(
  {
    name: 'peakTagger',
    keys: [
      process.env.SESSION_KEY1,
      process.env.SESSION_KEY2
    ]
  }
));

app.use(function(req, res, next) {
  if (req.session.id) {
    knex('users')
    .where({id: req.session.id})
    .first()
    .then(function(data) {
      res.locals.user = data;
      next();
    })
  } else {
    res.locals.user = {
      username: "Guest",
      isadmin: false
    };
    next();
  }
});

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);

app.get("*", function(req,res){
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
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


module.exports = app;
