# Jade模板引擎

## 步骤

1. express使用jade模板的用法：`app.set('view engine','jade')`

2. 如果要进行样式的定义，需要先**创建静态文件目录**，这个目录中的内容，可以直接使用浏览器获取：`app.use(express.static(路径))`

3. 设置视图的目录： 
```
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
```

4. 向特定路径的视图返回数据：`res.render('index', { title: 'Express' });`

5. 虽然平常我们修改 node.js 代码之后需要重启来查看变化，但是 jade 引擎不在此列，因为是动态加载的，所以我们修改完 jade 文件之后可以直接刷新网页来查看效果的。

## 创建模板

注意模板中只能使用空格来进行格式化。不能同时使用制表符('|')和空格(' ')。

```
doctype html
html
  head
  title Jade Example
  link(rel="stylesheet", href="/stylesheets/style.css")
  style.
    body{
        background-color:pink;
    }
  script.
    function submitData(){

    }

  body
    h1 Users
    #users
    for user in users
      h2= user.name
      .email= user.email
    
    block content
    foot copyright:mrj@sunnynetwork

```

index.jade:
```
extend layout
block content
    h1 你好
    p jade引擎使用
    input(type='text' id='txtFirstName' name='firstname' value='zzj')
```

## jade语法

### 标签

- 以p标签为例，`p`转化为`<p></p>`
- jade自动识别自闭和标签。`input`转化为`<input/>`

### 文本

- 标签中添加文本,`p 欢迎使用jade`转化为`<p>欢迎使用jade</p>`
- 标签中嵌套标签，写全标签。`p 欢迎使用jade的<b>b标签</b>`转化为`<p>欢迎使用jade的<b>b标签</b>`</p>`
- 标签中有大段的块内容，在标签后使用`.`或者在每段前面添加`|`。
```
script. 
    console.log('Welcome to join wandoujia-fe') 
    console.log('We want you')

script
    | console.log('Welcome to join wandoujia-fe') 
    | console.log('We want you')

// 转化为
<script>
    console.log('Welcome to join wandoujia-fe') 
    console.log('We want you')
</script>

p
  | foo bar baz
  | rawr rawr
p.
  foo bar baz
  rawr rawr
// 两种情况都会转化为
<p>foo bar baz rawr rawr</p>
```

### 变量调用

- #{表达式}
- =表达式
- !=表达式

### 属性

以`()`来分割属性。

`a(rel="nofollow", href="http://www.wandoujia.com/join#getJobInfo=1") 招聘`转换为`<a rel="nofollow" href="http://www.wandoujia.com/join#getJobInfo=1">招聘</a>`

### 注释

- 单行注释 `// zhushi`转化为`<!-- zhushi -->`
- 多行注释
```
body
    //
        多行注释

// 转化为
<body>
<!-- 多行注释
-->
</body>
```

- 不输出的注释，在单行注释上加上`-`，`//- 这段输出不会输出`
- 很多文档里提到的条件注释已经不再支持

### 设置id或class


### 引用其他模板

1. include

2. extends


### 循环

将 JavaScript 嵌入到 Jade 中，一共有三种方法。第一种方式是使用 -，代码中的特殊字符不会被转义：
```
- for (var x = 0; x < 3; x++) 
  li <a></a>
```
生成的HTML：
```
<li><a></a></li>
<li><a></a></li>
<li><a></a></li>
```
