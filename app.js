const express = require('express'), expressLayouts = require('express-ejs-layouts'), cookieParser = require('cookie-parser'), logger = require('morgan'), bodyParser = require("body-parser"), session = require('express-session'), path = require('path'), indexRouter = require('./routes/index'), videoRouter = require('./routes/videos'), audioRouter = require('./routes/audio'), imageRouter = require('./routes/images');

global.appRoot = path.resolve(__dirname);

var app = express();

app.use(bodyParser.json( { limit: "10000mb" } ));
app.use(bodyParser.urlencoded( { extended: true, limit: "10000mb", parameterLimit: 1000000 } ));

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(cookieParser());

// Express session
app.use(
  session({
    secret: "-Z`8&<xzF#jBBE!3",
    name: 'SITP',
    resave: true,
    saveUninitialized: true,
    cookie : {
      sameSite: 'strict'
    }
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);
app.use('/video', videoRouter);
app.use('/music', audioRouter);
app.use('/images', imageRouter);
app.use("/public", express.static(__dirname + "/public"));
app.use("/modules", express.static(__dirname + "/node_modules/material-design-icons-iconfont/dist"));
app.use("/media", express.static(__dirname + "/public/media"));

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  res.redirect('/error');
  next(err);
});

module.exports = app;