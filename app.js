var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./db/settings');

var index = require('./routes/index');
var user = require('./routes/user');
var post = require('./routes/post');
var reg = require('./routes/reg');
var login = require('./routes/login');
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

app.use(session({
  secret: settings.cookieSecret,
  store: new MongoStore({
    url: settings.url,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true
  })
}))

app.use(flash());
// set flash
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  console.log('res.locals.user:', res.locals.user)
  var err = req.flash('error');
  var success = req.flash('success');

  res.locals.error = err.length ? err : null;
  console.log('res.locals.error:', res.locals.error)

  res.locals.success = success.length ? success : null;
  console.log('res.locals.success:', res.locals.success)

  console.log('....flash().....')
  next();
});

// 路由设置
app.get('/', index);
app.get('/u/:user', user);
app.post('/post', post);
app.get('/reg', reg);
app.post('/reg', reg);
app.get('/login', login);
app.post('/login', login);
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

// 创建动态视图助手
// app.dynamicHelpers({
//   user: function (req, res) {
//     return req.session.user
//   },
//   error: function (req, res) {
//     var err = req.flash('error')
//     if (err.length) {
//       return err
//     } else {
//       return null
//     }
//   },
//   success: function (req, res) {
//     var succ = req.flash('success')
//     if (succ.length) {
//       return succ
//     } else {
//       return null
//     }
//   }
// })

module.exports = app;
