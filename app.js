const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");
const http = require("http").createServer(app);
const indexRouter = require('./routes/index');
const videoRouter = require('./routes/videos');
const audioRouter = require('./routes/audio');
const imageRouter = require('./routes/images');

var app = express();

var mainURL = "http://localhost:3000";
global.__basedir = __dirname;

app.use(bodyParser.json( { limit: "10000mb" } ));
app.use(bodyParser.urlencoded( { extended: true, limit: "10000mb", parameterLimit: 1000000 } ));

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter);
app.use('/video', videoRouter);
app.use('/music', audioRouter);
app.use('/images', imageRouter);
app.use("/public", express.static(__dirname + "/public"));
app.use("/media", express.static(__dirname + "/public/media"));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;