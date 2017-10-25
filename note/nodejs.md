
# 深入入口文件
1. 配置路由
```
app.get('/', function(req, res){
    res.type('text/plain');
    res.send('Meadowlark Travel');
});
app.get('/about', function(req, res){
    res.type('text/plain');
    res.send('About Meadowlark Travel');
});
```
在 Express 文档中写的是 app.VERB这并不意味着存在一个叫 VERB 的方法，它是用来指代 HTTP 动词的（最常见的是“get”和“post”）。这个方法有两个参数：一个路径和一个函数。
默认忽略了大小写或反斜杠，并且在进行匹配时也不考虑查询字符串。所以针对关于页面的路由对于 /about、/About、/about/、/about?foo=bar、/about/?foo=bar 等路径都适用。

2. 请求和响应对象
B/S系统的基础都构建于响应与请求基础之上。浏览器发生请求到服务器，服务器处理请求并响应的形式发生数据给浏览器，这样就构成服务器与浏览器的通信基础。express的基础也就是处理请求和响应对象。

路由匹配上之后就会调用你提供的函数，并把请求和响应对象作为参数传给这个函数。这样我们就可以操作请求和响应对象。

Express深度包装了req, res对象。在Express中使用的是Express的请求和响应对象。
res.set 和 res.status 替换了 Node 的 res.writeHead。
Express 还提供了一个 res.type 方法，可以方便地设置响应头ontent-Type。

3. 中间件
app.use是 Express 添加中间件的一种方法。

4. 理由匹配规则
Express的路由规则是从上执行的去匹配app.VERB/app.use如果匹配到后会终止接下来的匹配。所以路由和书写顺序应该注意。
还有点需要注意路由路径支持通配符
```
app.get('/about*',function(req,res){
    // 发送内容……
})
app.get('/about/contact',function(req,res){
    // 发送内容……
})
app.get('/about/directions',function(req,res){
    // 发送内容……
})
```
本例中的 /about/contact 和 /about/directions 处理器永远无法匹配到这些路径，因为第一个处理器的路径中用了通配符：/about*。
可以这样写
```
app.get('/about/directions',function(req,res){
    // 发送内容……
})
app.get('/about/contact',function(req,res){
    // 发送内容……
})
app.get('/about*',function(req,res){
    // 发送内容……
})
```
把子路径写在前面。


# 视图和静态文件
static 中间件可以将一个或多个目录指派为包含静态资源的目录，其中的资源不经过任何特殊处理直接发送到客户端。你可以在其中放图片、CSS 文件、客户端 JavaScript 文件之类的资源。
创建静态资源目录：
/public/
一般会把图片,css,js这样的静态文件放置在public
目录结构如下：
/public/img/
/public/js/
/public/css/
配置静态支援：
```
app.use(express.static(__dirname + '/public'));
```
这段代码相当于把所有public下的文件创建一个路由。
url通过绝对路径的形式访问
`localhost/img/logo.png` 就相当于访问`public/img/logo.png`


# 视图中的动态内容
模板中的类容可以通过模板的形式动态生成，一般需要组成部分：
1. 数据类容
可以通过变量的形式存储，或者通过数据库的形式存储。
```
var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
];（<a href="http://www.lsqifu.com/">注册公司</a>）
```

2. 配置模板
把模板变量放置在需要展示的位置
```
<h1>About Meadowlark Travel</h1>
<p>Your fortune for the day:</p>
<blockquote>{{fortune}}</blockquote>
```

3. 合并数据和模板
在路由里进行配置
```
app.get('/about', function(req, res){
var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
res.render('about', { fortune: randomFortune });
});
```