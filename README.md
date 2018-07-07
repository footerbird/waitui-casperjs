# waitui-casperjs
python爬虫框架

入门介绍可参考[https://www.jianshu.com/p/46b9d255cecb](https://www.jianshu.com/p/46b9d255cecb)

CasperJs 是一个基于 PhantomJs 的工具，其比起 PhantomJs 可以更加方便的进行 navigation。

#1、安装

CasperJS 依赖于 PhantomJS >= 1.3，强烈建议使用 PhantomJS1.5 版本，PhantomJS 的安装非常简单，下载后解压就可以使用，或者直接使用 npm 安装。

安装 phantomjs 环境

`$ npm install -g phantomjs`

接下来，我们安装 CasperJS：

`$ npm install -g casperjs`

安装 CasperJS 必须确保在 Python 环境下，Python下载之后直接安装即可。

确认环境是否安装成功：

```
$ phantomjs --version
$ python --version
$ casperjs --version
```
