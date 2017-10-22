# 快速开始

## 安装express

全局模式安装express，`npm install express -g`，即可使用express提供的快速开始工具，这个工具的功能通常是建立一个网站最小的基础框架，开发者再在此基础上完成开发。

## 建立工程

`express microblog`

## 启动服务器

`npm start`，打开浏览器输入地址`http://localhost:3000`，就可以看到一个简单的welcome to express的页面了。

需要注意的是，如果对代码进行了修改，要想看到修改后的结果必须重启浏览器。如果觉得麻烦，可以使用`supervisor`来实现监视代码修改和自动重启。

## 工程的结构

express依赖connect，提供了大量的中间件，通过`app.use()`来使用。

# 路由控制

## express的工作原理

当通过浏览器访问`app.js`建立的服务器的时候，会看到一个简单的页面，事实上它已经帮我们做了很多工作。

访问`http://localhost:3000`，浏览器会向服务器发送以下请求：
```
GET / HTTP/1.1
Host: localhost:3000
Connection: keep-alive
Cache-Control: max-age=0
...

```


## REST风格的路由规则

REST的意思是**表征状态转移**，是一种基于HTTP协议的网络应用接口协议。


## 控制权转移

express提供了路由控制权转移的办法，即回调函数的第三个参数next，通过调用`next()`，会将路由控制权转移给后面的规则。

```
app.all('./user/:username',function(req,res,next){
    console.log('all method captured')
    next()
})

app.get('./user/:username',function(req,res){
    res.send('user:'+req.params.username)
})
```