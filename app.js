var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var socketio = require('socket.io');


//configuracion
var config = require('./config');

var app = express();
app.locals = config // seteo la configuracion para que sea accesible mas tarde
io = socketio();
app.io = io;

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

fs.readdirSync('./controllers').forEach(function(file){
  if(file.substr(-3) == '.js'){
    route = require('./controllers/' + file);
    route.controller(app);
  }
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
  mongoose.connect(app.locals.database);
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

///////////////////////////////////////////////////
// CODIGO PARA DISTRO
//////////////////////////////////////////////////
/*"use strict";
const
  zmq = require('zmq'),
  subscriber = zmq.socket('sub');

// Subscribe to all messages.
subscriber.subscribe('');

// Handle messages from publisher.
subscriber.on('message', function(data) {
  var msg = JSON.parse(data);
  console.log(msg.pid + ': ' + new Date(msg.timestamp) + ' at SERVER_1');
});

// Connect to publisher.
subscriber.connect('tcp://localhost:5432');*/
//////////////////////////////////////////////////////////////

module.exports = app;
