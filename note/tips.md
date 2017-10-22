## 页面重定向

`res.redirect` 是重定向功能，通过它会向用户返回一个303 see other状态，通知浏览器转向对应的页面。

## connect-mongo的使用

Express 4.x, 5.0 and Connect 3.x:
```
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
 
app.use(session({
    secret: 'foo',
    store: new MongoStore(options)
}));
```

## Connection strategy not found

我用的express是4.x版本，使用的`connect-mongo`也是最新的。

运行node bin/www时控制台出现：
`Error: Connection strategy not found`

解决方案：

1. connect-mongo@0.8.2版本之前是没问题的，可以直接换成0.8.2之钱版本。

2. new MongoStore里面要有一个url属性
```
store: new MongoStore({  
    /*其他属性*/  
    url: 'mongodb://localhost/blog'  
  })  
```

# 新版本nodejs废弃api解决方案

## dynamicHelpers

在NodeJS - Express 4.0下使用app.dynamicHelpers发生错误：
```
app.dynamicHelpers({
    ^
TypeError: Object function (req, res, next) {
    app.handle(req, res, next);
  } has no method 'dynamicHelpers'
```

查阅资料发现新版本的Express已经不支持dynamicHelpers方法了。可以用locals来替代。
原来代码如下：
```
app.dynamicHelpers({
    user: function(req, res) {
        return req.session.user;
    },
    error: function(req, res) {
        var err = req.flash('error');

        if (err.length)
            return err;
        else
            return null;
    },
    success: function(req, res) {
        var succ = req.flash('success');
        if (succ.length)
            return succ;
        else
            return null;
    }
});
```

用locals方式替换为：
```
app.use(function(req,res,next){
  res.locals.user=req.session.user;

  var err = req.flash('error');
  var success = req.flash('success');

  res.locals.error = err.length ? err : null;
  res.locals.success = success.length ? success : null;
   
  next();
});
```

## req.flash
