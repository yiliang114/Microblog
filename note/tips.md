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

以上代码一定要放在指定路由的语句之前，不然页面中访问user、error、success变量会出错，提示：user is not defined。

## Flash
新版本的express取消了req.flash，如果需要使用，需要安装`connect-flash`。

flash 是 session 中一个用于存储信息的特殊区域。消息写入到 flash 中，在跳转目标页中显示该消息。flash 是配置 redirect 一同使用的，以确保消息在目标页面中可用。

flash 可用于一次性的消息提示，比如注册，登录页面，当你再次刷新时，flash就没有提示消息了。

1. Express使用这个插件 
```
npm install connect-flash
npm install express-session //因为connect-flash 是需要存储在 session 模块

```

2. 配置 app.js 文件
```
var settings = require('./settings'); //配置信息
var flash = require('connect-flash');
var session = require('express-session');

app.use(session({
  secret: settings.cookieSecret,  //加密
  key: settings.db, 
  cookie: {maxAge: 60000},
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

// set flash
app.use(function (req, res, next) {
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});
```

3. 使用

以登录的路由代码为例,在要显示信息的地方添加形如：`req.flash('error','用户不存在');`
```
// 登录
router.get('/login', function(req, res, next) {
  res.render('login', { title: '欢迎登录' });
});
router.post('/login', function(req, res, next) {
  User.get(req.body.username,function(err,user){
      if(!user || user.name === ''){
        req.flash('error','用户不存在');
        return res.redirect('login');
      }
      if(req.body.password != user.password){
        req.flash('error','密码不对');
        return res.redirect('login');
      }
      req.flash('info','登录成功');
      res.redirect('login');
  })
});

```

通常需要在html文件中使用session中保存的值。以ejs模板为例：
```
<div class="wrap-right">
	<h1><%= title %></h1>
	<div class="wrap-content">
	<form method="post">
		<ul>
			<li>用户名：<input type="text" name="username"></li>
			<li>密码：<input type="text" name="password"></li>
			<li><button>登录</button></li>
			<li><%= errors %></li>
		</ul>
	</form>	
	</div>
</div>
```

`<%= errors %>`,就是调用相应的信息的方法。在`index.js`中传递了`req.flash('error','用户不存在');`,在`app.js`中，把`req.flash('error');`的提示信息赋值给了`res.locals.errors`，而我们如果要调用`locals`中的 `errors`变量，不需要写成`locals.errors`，而是直接写变量名`errors`就可以了。



