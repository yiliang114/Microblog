var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var settings = require('./db/settings');

var index = require('./routes/index');
var user = require('./routes/user');
var post = require('./routes/post');
var reg = require('./routes/reg');
var doReg = require('./routes/doReg');
var login = require('./routes/login');
var doLogin = require('./routes/doLogin');
var logout = require('./routes/logout');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// cookieParser
// app.use(session({
//   secret: settings.cookieSecret,
//   store: new MongoStore({
//     db: settings.db
//   })
// }))

// 路由设置
app.get('/', index);
app.get('/u/:user', user);
app.post('/post', post);
app.get('/reg', reg);
app.post('/reg', doReg);
app.get('/login', login);
app.post('/login', doLogin);
app.get('/logout', logout);

// 路由的高级匹配
// app.use('/user/:username', function (req, res) {
//   res.send('user:' + req.params.username)
// })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
