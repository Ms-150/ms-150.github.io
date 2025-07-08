# Browser-sync

节省时间的同步浏览器测试。

[https://browsersync.io/](https://browsersync.io/)

## 主要功能

- 多设备浏览器同步：点击、滚动、表单输入同步
- 自动刷新（LiveReload）本地网页
- 内置服务器或代理服务器
- 支持 Sass/Less 编译和静态资源监控
- CLI / Gulp / Webpack / Node.js API 多种接入方式

## install

```sh
npm install -g browser-sync

# or
npm install browser-sync --save-dev
```

## usage

- command line

```sh
browser-sync help

browser-sync
```

- 脚本使用

```js
const browserSync = require("browser-sync").create();

// 初始化 BrowserSync 服务器
browserSync.init({
  server: {
    baseDir: "./", // 指定服务器的根目录
  },
});
```
