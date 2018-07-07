# waitui-casperjs (一款python爬虫框架)

CasperJs 是一个基于 PhantomJs 的工具，其比起 PhantomJs 可以更加方便的进行 navigation。

## 1、安装

CasperJS 依赖于 PhantomJS >= 1.3，强烈建议使用 PhantomJS1.5 版本，PhantomJS 的安装非常简单，下载后解压就可以使用，或者直接使用 npm 安装。

安装 phantomjs 环境

```
$ npm install -g phantomjs
```

接下来，我们安装 CasperJS：

```
$ npm install -g casperjs
```

安装 CasperJS 必须确保在 Python 环境下，Python下载之后直接安装即可。

确认环境是否安装成功：

```
$ phantomjs --version
$ python --version
$ casperjs --version
```

## 2、一个简单的 CasperJS 代码

创建一个文件 baidu.js，用来模拟我们访问百度页面

```
var casper = require('casper').create();
casper.start('http://www.baidu.com/', function() {
  this.echo(this.getTitle());
});

casper.run();
```

运行:

```
$ casperjs baidu.js
```

得到输出结果：

```
"百度一下，你就知道"
```

## 3、casper 的串联执行和生成网页图片

CasperJS 的执行脚本是由一个一个的 Step 串联起来的，start 表示第一步，然后后面的 step 用 then 来表示，再依次执行：

```
var casper = require('casper').create();
casper.start('http://www.baidu.com/', function() {
  this.echo(this.getTitle());
});

casper.then(function() {
  this.capture('baidu-homepage.png'); //  生成一个png图片
});

casper.run();
```

完成以后，我们会在 Console 上得到一个 title，同时我们也会得到在 then 中捕捉到的图片 baidu-homepage.png。

## 4、form提交，进行搜索

我们想办法让 CasperJS 完成搜索功能

```
var casper = require('casper').create();
casper.start('http://www.baidu.com/', function() {
  this.echo(this.getTitle());
});

casper.then(function() {
  this.capture('baidu-homepage.png'); //  生成一个png图片
});

casper.then(function() {
   this.fill('form[action="/s"]', { wd: 'thoughtworks' }, true);//填入form，进行搜索
});

casper.then(function() {
   this.capture('thoughtworks-search-results.png');
});

casper.run();
```

## 5、如何引入 jQuery，并且进行数据输出保存

有时候，需要引入一些第三方插件来方便操作，例如：jQuery

```
var casper = require('casper').create({
   clientScripts: ["jquery.js"]
});

casper.start('http://www.baidu.com/', function() {
   this.echo(this.getTitle());
});

casper.then(function() {
   this.fill('form[action="/s"]', { wd: 'thoughtworks' }, true);
});

casper.then(function() {
   search_result_titles = this.evaluate(getTitles)
   this.echo(search_result_titles.join('\n'))
});

function getTitles() {
   var titles = $.map($("h3.t a"), function(link) {
      return $(link).text()
   });
   return titles
}

casper.run();
```

返回结果：

```
thoughtworks_百度百科
成都Thoughtworks-招聘专员--地点:成都招聘信息|ThoughtWorks招聘...
敏捷开发和体验设计 | ThoughtWorks
thoughtworks基本情况及待遇 【懦夫救星_职场古拳法】
和Thoughtworks的一次邂逅(一) - redhat - ITeye技术网站
thoughtworks笔试整理zz_ThoughtWorks招聘经验
关于我们 | ThoughtWorks
ThoughtWorks位列面试难度最高的科技公司之首_百度文库
透明的相册-ThoughtWorks西安办公室
思特沃克软件技术(西安)有限公司ThoughtWorks Software ...
```

需要注意的地方：

1）create casper 的时候，我们 inject 了jquery，这个 jquery 必须是保存在本地的，通过 HTTP 访问是无效的。

2）this.evaluate(getTitles) 可以理解成，我们在 CasperJs 中，将 getTitles 这个方法注入到了访问的页面中，在访问的页面中执行这个方法并反问其返回值。

3）访问页面log的获取：2）中讲到了getTitles其实是在被访问页面中执行的，如果我们在getTitles加入一段console.log的代码话，怎么能够得到被访问页面的console信息呢？

```
casper.then(function() {
   this.page.onConsoleMessage = function(e) {
      console.log(e);
   }
   search_result_titles = this.evaluate(getTitles)
   this.echo(search_result_titles.join('\n'))
})
```

这样就可以侦听被访问页面的console.log事件，比导出到CasperJs中

## 完整案例

( 本人公司内网才能访问，各位同学可以随意模拟一个网站)

```
// 创建 casper 实例
var casper = require('casper').create({
    verbose: true,
    logLevel: 'info',
    onError: function(self, msg) {
        this.capture('error.png');
        console.log('error: ' + msg);
        self.exit();
    },
    pageSettings: {
        loadImages: false, // 不加载图片，为了速度更快
        loadPlugins: false
    },
    verbose: true
    // clientScript: ['jquery.js']
});
phantom.outputEncoding = "utf-8"; //解决中文乱码

/* 打开首页 */
casper.start('https://web.yd.sdy.ppmoney.com/', function() {
    this.echo(this.getTitle());
    this.echo(this.getCurrentUrl());
});
/* 点击登录按钮，去到登录页 */
casper.then(function() {
    this.click('a[title="登录"]');
    this.waitForSelector('form[action="/login/"]');
});

/* 输入登录表单 */
casper.then(function() {
    this.fill('form[action="/login/"]', {
        Phone: '15710376688',
        Password: '12345678'
    }, true);
});
/* 提交表单，登录 */
casper.then(function() {
    this.click('button[id="sendLogin"]');
});

casper.wait(3000); //等待三秒，预防未登录。

/* 充值 */
casper.then(function() {
    this.echo(this.getTitle());
    this.clickLabel('充值', 'a');

    console.log(1234);

    this.waitForSelector('input[id="monetary"]');
});

/* 设置充值金额 */
casper.then(function(){
    this.echo(this.getTitle());

    this.evaluate(function() {
        document.getElementById("monetary").value = 100;
        $("#btnRecharge").attr("class", "pp-btn pp-btn-lg btn-recharge");
    });

    this.wait(2000, function() {
        this.click('input[id="btnRecharge"]');
    });
    
    this.capture('recharge.png');
    this.waitForSelector('input[id="password"]');
});

/* 设置购买金额 */
casper.then(function() {
    this.echo(this.getTitle());

    this.evaluate(function() {
        document.getElementById("password").value = "12345678";
    });

    this.echo("充值金额： 1000元.");
});

casper.then(function() {
    this.click('input[id="nextButton"]');
    this.wait(10000, function() {
        this.capture("recharge.png");
    });
});

casper.on('remote.message', function(msg) {
    this.log(msg, 'info');
});

casper.run(function(){
    this.echo('测试运行完成...', 'INFO').exit();
});
```
以上内容來自：

>作者：Simon王小白
链接：https://www.jianshu.com/p/46b9d255cecb
來源：简书
简书著作权归作者所有，任何形式的转载都请联系作者获得授权并注明出处。
