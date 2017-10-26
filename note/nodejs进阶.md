# 模块的加载机制

模块加载对于用户来说只需调用`require`即可，但其内部机制较为复杂。

## 1.1 模块的类型

nodejs的模块分为两大类。一类是核心模块，另一类是文件模块。

核心模块就是Nodejs标准api,如`fs`,`http`,`net`,`vm`,这些都是由nodejs官方提供的模块，编译成了二进制代码。我们可以直接通过`require`获取核心模块，例如,`require('fs')`。核心模块拥有最高加载优先级，换言之如果有模块与其命名冲突，nodejs总是会加载核心模块。

文件模块则是储存为单独的文件（文件夹）的模块，可能是JS代码，JSON或者编译好的C、C++代码。加载时如果不显示指定文件模块扩展名的时候，Nodejs会分别试图加上`.js`,`.json`和`.node`扩展名来寻找。`.js`是js代码,`.json`是JSON格式的文本，`.node`是编译好的c/c++代码。

## 1.2 按路径加载模块

如果`require`参数以`/`开头，那么就以绝对路径的方式查找模块名称。如`require('/home/zzj/module')`将会按照优先级依次尝试加载`/home/zzj/module.js`,`/home/zzj/module.json`和`/home/zzj/module.node`。

如果`require`参数以`./`或`../`开头，那么就以相对路径的方式查找模块名称。、

## 1.3 通过查找node_modules目录加载模块

如果`require`参数不以绝对路径或者相对路径查找，而模块又不是核心模块，那么就通过查找`node_modules`来加载模块。

在`node_modules`最外面一层，可以直接通过`require('express')`来代替`require('./node_modules/express')`。如果没有找到，则会在当前目录的上一层的`node_modules`目录中寻找,反复执行这一过程，直到遇到根目录为止。

## 1.4 加载缓存

Nodejs模块不会被重复加载，这事因为nodejs通过文件名缓存所有加载过的文件模块，所以以后再访问时就不会重新加载。

nodejs是根据实际的文件名缓存的，而不是`require()`提供的参数缓存的，也就是说即使分别通过`require('express')`和`require('./node_modules/express')`加载两次，也不会重复加载，因为尽管参数不同，解析到的文件却是同一个。


# 2 控制流

基于异步I/O的事件式编程容易将程序的逻辑拆的七零八落，给控制流的梳理制造障碍。

## 2.1 循环的陷阱

循环中的回掉函数，初学者经常容易陷入陷阱。

```
// forloop.js

var fs = require('fs')
var files = ['a.txt','b.txt','c.txt']

for(var i = 0;i < files.length;i++){
    fs.readFile(files[i],'utf-8',function(err,contents){
        console.log(files[i]+': '+contents)
    })
}
```
实际的会输出三次`undefined`因为此时的`i`是3，for循环已经结束。

```
// forloop.js

var fs = require('fs')
var files = ['a.txt','b.txt','c.txt']

files.forEach(function(filename){
    fs.readFile(filename,'utf-8',function(err,contents){
        console.log(filename+': '+contents)
    })
})
```

## 2.2 解决控制流难题

除了循环的陷阱，nodejs异步式编程还有一个显著的问题，即深层次的回调函数嵌套。很难像看清基本控制流结构一样一眼看清回调函数之间的关系，因此当程序规模不断扩大时必须采取手段降低耦合度，以实现更加优美、可读的代码。这个问题没有立竿见影的解决办法，只能通过改变设计模式，时刻注意降低逻辑之间的耦合关系来解决。

`async`是一个控制流解耦模块，提供了`async.series`,`async.parallel`,`async.waterfall`等函数，在实现复杂的逻辑时使用这些函数代替回调函数可以让程序变得更清晰可读，但必须遵循它的编程风格。

`streamlinejs`和`jsces`则采用了更高级的手段，它的思想是“变同步为异步”，实现了一个JS到JS的编译器，使用户可以用同步的编程模式写代码，编译后执行却是异步的。

无论哪种解决办法，都不是“非侵入性”，也就是说对你编程模式的影响是非常大的。它们几乎都是解决了深层嵌套的回调函数可读性的问题的同时，引入了其他复杂的语法，带来了另一种可读性的降低。


# nodejs应用部署

之前的项目不适合在产品环境下使用。因为这个项目还有几个重大缺陷:

- 不支持故障恢复： 错误发生时整个进程就会停止，需要重新在终端启动服务器。
- 没有日志： 对开发这来说，日志，尤其是错误日志是及其重要的。
- 无法利用多和提高性能： nodejs一个进程只能使用一个cpu核心。在多核时代，只能利用一个核心所带来的浪费比较严重，需要使用多进程来提高系统的性能。
- 独占端口：有必要通过反向代理来实现基于域名的端口共享。
- 需要手动启动：制作自动启动服务器的脚本。


## 日志模式

express产品模式：`NODE_ENV=production node app.js`

运行服务器之后可以看到：`Express server listening on port 3000 in production mode`

### 实现

访问日志就是记录用户对服务器的每个请求，包括客户端的IP地址，访问时间，访问路径，服务器响应及客户端代理字符串。而错误日志则记录程序发生错误时的信息，由于调试中需要即时查看错误信息，将所有错误直接显示到终端即可，而在产品模式中，需要写入错误日志文件。




## 使用cluster模块

cluster模块的功能是生成与当前进程相同的子进程，并且允许父进程和子进程之间共享端口。nodejs的另一个核心模块`child_process`也提供了相似的进程生成功能，但最大的却比在于`cluster`允许跨进程端口复用，给我们的网络服务器开发带来了很大的方便。

`cluster.js·`的功能是创建与cpu核心个数相同的服务器进程，以确保充分利用多和cpu的资源。

主进程生成若干个工作进程，并监听工作进程结束事件，当工作进程结束时，重新启动一个工作进程。分支进程产生时会自顶向下重新执行当前程序，并通过分支判断进入工作进程的分支，在其中读取模块并启动服务器。通过cluster启动的工作进程可以直接实现端口复用，因此所有工作进程只需要监听同一端口。当主进程终止时，还要主动关闭所有工作进程。

## 共享80端口

到目前为止网站都是运行在3000端口下，也就是说，用户必须在网址中加入3000才能访问网站。默认HTTP端口是80。

nginx中设置反向代理和虚拟主机非常简单。
```
server {
    listen 80;
    server_name mysite.com;

    location / {
        proxy_pass http://localhost:3000
    }
}
```
这个配置文件的功能就是监听访问`mysite.com` 80 端口的请求，并将所有的请求都转发给`http://localhost:3000`,即Nodejs服务器。现在访问`mysite.com`就相当于访问`http://localhost:3000`了。

在添加了虚拟主机之后，还可以在nginx配置文件中添加访问静态文件的规则，删除`app.js`中的`app.use(express.static(__dirname+'/public'))`。这样可以直接让nginx来处理金泰文件，减少反向代理以及nodejs的开销。


