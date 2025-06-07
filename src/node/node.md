# Node

## npm npx

随同 NodeJS 一起安装的包管理工具。

详见 [npm](./npm&yarn&npx&pnpm.md)

## 模块化

::: code-group

```json [commonjs]
type: "commonjs" // 默认

// require 导入，module.exports 或 exports 导出。
```

```json [module]
type: "module"

// import 导入，export 导出
```

:::

- 内置模块

```js
const fs = require("fs");
const path = require("path");
```

- 第三方模块

```sh
npm install express
const express = require('express');
```

- 自定义模块

::: code-group

```js [math.js]
function add(a, b) {
  return a + b;
}

module.exports = { add };
```

```js [app.js]
const math = require("./math");
console.log(math.add(2, 3)); // 输出: 5
```

:::

- JSON 模块

```js
const config = require("./config.json");
console.log(config);
```

### CommonJS 和 ESModule 的区别

- CommonJS 是基于 `运行时的同步加载`，ESModule 是基于 `编译时的异步加载`
- CommonJS 是可以修改值的，ESModule 值并且不可修改（可读的）
- CommonJS 不可以 tree shaking，ESModule 支持 tree shaking
- CommonJS 中顶层的 this 指向这个模块本身，而 ES6 中顶层 this 指向 undefined

## 全局变量

Node 中没有 `DOM` 和` BOM`，除了这些 API，其他的 `ECMAscript API` 基本都能用

- global
- globalThis // ECMAScript 2020 nodejs 环境会指向 `global` ，浏览器环境指向 `window`

```js
global.xxx = "123";
// or
globalThis.xxx = "123";
```

### 内置 API

- `__dirname` // 当前模块文件所在目录的绝对路径
- `__filename` // 当前模块文件的绝对路径，包括文件名本身。
- process // 处理进程相关 [见](#process-模块)
- Buffer

## CSR SSR SEO

node 环境中无法操作 DOM 和 BOM，但是如果非要操作 DOM 和 BOM 也是可以的我们需要使用第三方库 `jsdom` 帮助我们。

- 客户端渲染（CSR，Client-Side Rendering）
  初始 HTML 由服务器发送，内容为空或很少。大部分内容由 JavaScript 在客户端加载和渲染。
  优点：页面切换快，用户体验好。
  缺点：首次加载慢，对 SEO 不友好。

- 服务器端渲染（SSR，Server-Side Rendering）
  HTML 内容由服务器生成并发送给客户端。
  优点：首次加载快，对 SEO 友好。
  缺点：每次页面切换都需要从服务器获取新的 HTML，用户体验不如 CSR。

- 搜索引擎优化 (SEO - Search Engine Optimization)
  通过优化网站内容、结构和技术来提高在搜索引擎中的排名。SEO 直接影响网站的可见度和流量，是所有 Web 应用程序的重要考虑因素。

### SSR example

```sh
npm install jsdom
```

```js
const fs = require("node:fs");
const { JSDOM } = require("jsdom");

const dom = new JSDOM(`<!DOCTYPE html><div id='app'></div>`);

const document = dom.window.document;

const window = dom.window;

fetch("https://api.thecatapi.com/v1/images/search?limit=10&page=1")
  .then((res) => res.json())
  .then((data) => {
    const app = document.getElementById("app");
    data.forEach((item) => {
      const img = document.createElement("img");
      img.src = item.url;
      img.style.width = "200px";
      img.style.height = "200px";
      app.appendChild(img);
    });
    // serialize 序列化字符串
    fs.writeFileSync("./index.html", dom.serialize());
  });
```

## 核心模块

### path 模块

提供了一些用于处理和操作文件路径的实用工具。

- `path.basename()`
  // 返回路径的最后一部分，即文件名。
- `path.dirname()`
  // 返回路径的目录名，即路径中最后一个部分之前的部分。
- `path.extname()`
  // 返回路径中文件的扩展名。
- `path.json()`
  // 用于将多个路径片段拼接成一个完整路径。
- `path.resolve()`
  // 将路径片段解析为一个绝对路径。
- `path.parse()`
  // 将一个路径解析为一个对象，包含根目录、目录、文件名和扩展名等信息。
- `path.format()`
  // 将一个路径对象转换为字符串路径，与 path.parse() 相反。
- `path.sep()`
  // 返回当前操作系统使用的路径分隔符。
  - Windows 上，路径分隔符是 `\`
  - Unix/Linux 和 macOS 上，路径分隔符是 `/`

```js
const path = require("path");

console.log(path.basename("/users/documents/file.txt")); // 输出：'file.txt'
console.log(path.dirname("/users/documents/file.txt")); // 输出：'/users/documents'
console.log(path.extname("/users/documents/file.txt")); // 输出：'.txt'
console.log(path.join("/users", "documents", "file.txt")); // 输出：'/users/documents/file.txt'
console.log(path.resolve("documents", "file.txt")); // 输出类似：'/当前工作目录/documents/file.txt'

console.log(path.parse("/users/ms/documents/file.txt"));
/* 输出：
{
  root: '/',
  dir: '/users/ms/documents',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
*/

const pathObject = {
  root: "/",
  dir: "/users/ms/documents",
  base: "file.txt",
  ext: ".txt",
  name: "file",
};

console.log(path.format(pathObject)); // 输出：'/users/ms/documents/file.txt'

console.log(path.sep); // 输出（在 Unix 上）：'/'
```

### os 模块

用于提供与操作系统相关的基本信息和功能。

- `os.paltform()` // 返回 Node.js 进程的操作系统平台。例如：'darwin' (macOS), 'win32' (Windows), 'linux' (Linux)
- `os.release()` // 返回操作系统的发布版本。例如：'20.6.0' (macOS 版本), '10.0.19042' (Windows 版本)
- `os.type()` // 返回操作系统名称。例如：'Darwin', 'Windows_NT', 'Linux'
- `os.version()` // 返回操作系统的版本。例如：'Version 10.15.7 (Build 19H2)' (macOS), 'Version 2004 (Build 19041.572)' (Windows)

- `os.homedir()` // 返回获取当前用户的主目录路径。
  - Windows 系统中，`%USERPROFILE%` 环境变量指向当前用户的主目录。
  - Linux 系统中，`$HOME` 环境变量指向当前用户的主目录。
- `os.arch()` // 返回一个表示操作系统 CPU 架构的字符串，常见的值包括 x64（64 位系统）和 arm（ARM 架构）等。
- `os.cpus()` // 返回关于每个逻辑 CPU 内核的信息。
- `os.networkInterfaces()` // 返回一个对象，其中的每个属性都是一个网络接口的名称，每个属性值是一个数组，包含有关该接口的网络信息。每个数组项是一个包含网络接口详细信息的对象。

```js
const os = require("os");

console.log(os.platform()); // 输出操作系统平台。例如：'darwin' (macOS), 'win32' (Windows), 'linux' (Linux)
console.log(os.release()); // 输出操作系统的发布版本。例如：'20.6.0' (macOS 版本), '10.0.19042' (Windows 版本)
console.log(os.type()); // 输出操作系统名称。例如：'Darwin', 'Windows_NT', 'Linux'
console.log(os.version()); // 输出操作系统的版本。例如：'Version 10.15.7 (Build 19H2)' (macOS), 'Version 2004 (Build 19041.572)' (Windows)
```

#### example

```bash
npm install open

# 打开默认浏览器
const open = require('open');

open('http://localhost:3000').catch(err => {
  console.error(`Error opening browser: ${err.message}`);
});
```

#### 模拟 open 打开不同操作系统的浏览器

```js
const os = require("os");
const { exec } = require("child_process");

// 要打开的 URL
const url = "http://localhost:3000";

// 根据操作系统平台选择打开浏览器的方式
if (os.platform() === "win32") {
  // Windows
  exec(`start ${url}`);
} else if (os.platform() === "darwin") {
  // macOS
  exec(`open ${url}`);
} else if (os.platform() === "linux") {
  // Linux
  exec(`xdg-open ${url}`);
} else {
  console.error("Unsupported OS");
}
```

### process 模块

提供了与当前 Node.js 进程交互的功能。它是一个全局对象，允许你获取进程信息、控制进程的生命周期、管理环境变量等。

- `process.arch()` // 返回当前 Node.js 进程的操作系统架构（如 'x64', 'arm', 'ia32'）。
- `process.platform()` // 返回当前操作系统平台的字符串（如 'win32', 'darwin', 'linux'）。
- `process.argv()` // 返回一个包含启动 Node.js 进程时传入的命令行参数的数组。
- `process.env()` // 返回一个包含用户环境信息的对象（环境变量）
- `process.cwd()` // 返回 Node.js 进程的当前工作目录 同`__dirname` esm 使用不了 用 `__dirname` 代替 cwd()
- `process.memoryUsage()` // 返回一个对象，显示 Node.js 进程的内存使用情况（单位为字节）。
- `process.exit([code])` // 以给定的退出码退出当前 Node.js 进程。code 是一个整数，默认值为 0（表示成功）
- `process.on(event, listener)` // 指定的事件注册一个监听器。常用于监听进程级别的事件，如 exit、uncaughtException 等。
- `process.kill(process.pid)` // 发送信号给进程，通常用来结束进程。process.pid 是当前进程的 PID。

```js
// 假设运行命令为: node app.js arg1 arg2

console.log(process.argv);
// 输出: [ '/path/to/node', '/path/to/app.js', 'arg1', 'arg2' ]

// 设置环境变量
process.env.NODE_ENV = "production";

console.log(process.env.NODE_ENV); //  production

if (someCondition) {
  console.log("Exiting process");
  process.exit(1); // 非零退出码表示错误
}

console.log(process.cwd()); // /path/to/app.js

process.on("exit", (code) => {
  console.log(`About to exit with code: ${code}`);
});

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error:", err);
  process.exit(1); // 非零退出码表示错误
});
```

#### corss-env 库

一个用于在不同操作系统上设置环境变量的工具。它可以帮助你在开发和构建过程中设置环境变量，而不需要考虑操作系统之间的差异。

##### 原理

- Windows: 使用 `set VAR_NAME=value` 语法设置环境变量。
- 类 Unix 系统（如 Linux 和 macOS）: 使用` export VAR_NAME=value` 或直接使用 `VAR_NAME=value` 语法来设置环境变量。

```bash
npm install cross-env --save-dev
```

```json
{
  "scripts": {
    "start:dev": "cross-env NODE_ENV=development node app.js",
    "start:prod": "cross-env NODE_ENV=production node app.js"
  }
}
```

```js
// app.js
console.log(
  `The current environment is ${process.env.NODE_ENV || "undefined"}`
);
```

```sh
npm run start:dev   # 输出: The current environment is development
npm run start:prod  # 输出: The current environment is production
```

### child_process 子进程 模块

允许创建子进程来执行系统命令、运行其他脚本或程序。它提供了多种方式来管理和控制子进程，从而实现并发处理或利用操作系统的功能。

- `exec(command [, options], callback)` // 执行一个 shell 命令，适合运行简单的命令。
- `execSync(command [, options])` // 同步执行一个 shell 命令，返回标准输出的结果。
- `spawn(command [, args [, options]])` // 启动一个新进程来执行命令，适合长时间运行的进程或需要与进程进行交互的场景。
- `spawnSync(command [, args [, options]])` // 同步启动一个新进程来执行命令，返回结果。

| options 配置项             | 说明                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `cwd`                      | 指定子进程的当前工作目录。默认为 `process.cwd()`。                                         |
| `env`                      | 环境变量的键值对对象。默认为 `process.env`。                                               |
| `encoding`                 | 用于 stdout 和 stderr 的字符编码。默认为 `'utf8'`。                                        |
| `timeout`                  | 进程的最大执行时间（毫秒）。超时后进程会被终止。默认为 `0`，表示没有超时限制。             |
| `maxBuffer`                | stdout 或 stderr 可以占用的最大内存（字节）。默认值为 `1024 * 1024`（1MB）。               |
| `killSignal`               | 终止进程时使用的信号。默认值为 `'SIGTERM'`。                                               |
| `shell`                    | 指定要执行命令的 shell。默认值为 `'/bin/sh'` (POSIX) 或 `'cmd.exe'` (Windows)。            |
| `windowsHide`              | 在 Windows 上隐藏子进程的控制台窗口。默认为 `false`。                                      |
| `argv0`                    | 覆盖子进程的 `argv[0]`，通常用于修改命令名称显示。                                         |
| `stdio`                    | 子进程的标准输入输出配置，可以是 `'pipe'`（默认）、`'ignore'`、`'inherit'`，或文件描述符。 |
| `detached`                 | 子进程与父进程分离，在父进程退出后继续运行。默认为 `false`。                               |
| `uid`                      | 设置子进程的用户 ID（仅适用于 POSIX）。                                                    |
| `gid`                      | 设置子进程的组 ID（仅适用于 POSIX）。                                                      |
| `windowsVerbatimArguments` | 在 Windows 上不对参数进行转义或引用。默认为 `false`。                                      |

- `execFile(file [, args [, options]], callback)` // 执行可执行文件，适用于 `.sh` 文件（macOS、Linux）或 `.cmd` 文件（Windows）。
- `execFileSync(file [, args [, options]])` // 同步执行可执行文件，返回标准输出的结果。

- `fork()` // 创建一个新的 Node.js 子进程，并且通过建立 IPC（进程间通信）通道，使父进程和子进程能够相互发送消息。

#### example

- exec execSync

```js
const {
  exec,
  execSync,
  spawn,
  spawnSync,
  execFile,
  execFileSync,
  fork,
} = require("child_process");

// exec 异步 回调函数 默认返回 buffer 可以执行 shell 命令 或者软件交互
// execSync 同步 默认返回 buffer

exec("node -v", (err, stdout, stderr) => {
  if (err) return;

  console.log(stdout.toString()); // 输出 Node.js 版本号
});

execSync("mkdir aa"); // 创建目录

// spawn
const { stdout } = spawn("ls", ["-l"]);

stdout.on("data", (data) => {
  console.log(`输出: ${data}`);
});

stdout.on("close", (code) => {
  console.log(`子进程退出，退出码 ${code}`);
});
```

- execFile

```js
//  a.sh
//  #!/bin/bash
//  echo "start"
//  mkdir a
//  cd a
//  echo "console.log('print aaa')" > a.js
//  echo "end"
//  node ./a.js

execFile(path.resolve(__dirname, "./a.sh"), null, (error, stdout) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log(stdout.toString());
});
```

- fork

::: code-group

```js [parent.js]
// 创建子进程
const child = fork("child.js");
// 向子进程发送消息
child.send({ hello: "world" });
// 接收子进程发来的消息
child.on("message", (message) => {
  console.log("Received from child:", message);
});
```

```js [child.js]
process.on("message", (message) => {
  console.log("Received from parent:", message);

  // 向父进程发送消息
  process.send({ reply: "Hi parent!" });
});
```

:::

#### 底层

实现顺序 exec -> execFile -> spawn

- spawn 是最底层的实现，直接调用操作系统的底层 API 来启动子进程。
- execFile 是基于 spawn 封装的一个更高效的 API，用于执行特定的可执行文件。
- exec 是基于 spawn 和 execFile 封装的 API，用于通过 shell 执行命令。

- fork 调用 进程间通信（IPC）-> libuv 来处理跨平台的异步 I/O 操作
  libuv
  - Windows: 使用命名管道（Named Pipes）
  - POSIX: 使用 Unix 域套接字（Unix Domain Sockets）

### ffmpeg

用于录制、转换和传输音频和视频的完整跨平台解决方案。 [详见](../media/ffmpeg.md)

```js
// child_process exec 调用 ffmpeg 处理视频
const { execSync } = require("child_process");

execSync(
  // 格式转换
  "ffmpeg -i input.mp4 output.avi",
  // # 提取音频
  // "ffmpeg -i input.mp4 -vn -acodec copy output.mp3",
  // # 裁剪 10-20s `-ss 10 -to 20`
  // "ffmpeg -i input.mp4 -ss 10 -to 20 -c copy output.mp4"
  // 子进程将直接继承父进程的标准输入（stdin）、标准输出（stdout）和标准错误（stderr）流。
  // 子进程的输出会直接显示在父进程的终端窗口中，就像是父进程自己输出的一样。
  { stdio: "inherit" }
);
```

### pngquant

用于压缩 PNG 图像的开源工具。[详见](../media/pngquant.md)

```js
// child_process exec 调用 pngquant 压缩 png 图片
const { exec } = require("child_process");

exec(
  "pngquant input.png --quality 30-50 --speed 1 -o ouput.png ",
  (error, stdout) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log(stdout);
  }
);
```

## Event 事件触发器

Node.js 提供了内置的 EventEmitter 类，几乎所有的核心模块（如 http、fs、net 等）都依赖于它。

### 发布订阅模式

- 类似 vue2 event bus 第三方库 mitt

- on(event, listener) 注册事件监听器
- off(event, listener) 移除事件监听器
- emit(event, listener) 触发事件
- once(event, listener) 注册一次性事件监听器

```js
const EventEmitter = require("events");
const emitter = new EventEmitter();

// 监听事件 on
emitter.on("sayHello1", (name) => {
  console.log(`Hello, ${name}`);
});

// 触发事件 emit
emitter.emit("sayHello1", "Node.js");

// 使用 once 注册一次性监听器
emitter.once("sayHello1", (name) => {
  console.log(`Hello once, ${name}`);
});

// 再次触发事件
emitter.emit("sayHello1", "Node.js"); // 第二次不会触发 once 监听器

console.log(` on off -----`);

const fn = (data) => {
  console.log(`Hello, ${data}`);
};

emitter.on("sayHello2", fn);

emitter.emit("sayHello2", "Node.js emit");
// 移除事件监听器 off
emitter.off("sayHello2", fn);

emitter.emit("sayHello2", "Node.js emit"); // 第二次不会触发 emit 监听器
```

## util

提供了一些实用的功能，用于帮助开发者进行常见的任务，如格式化、继承、调试等

- util.promisify() 将回调风格的函数转换为返回 Promise 的函数。
- util.callbackify() 将返回 Promise 的函数转换为传统的基于回调的函数。
- util.format() 用于格式化字符串，类似于在 C 语言中的 printf() 函数。

### example

- util.promisify

```js
// 使用 util.promisify 将 exec 转换为返回 Promise 的函数
const { exec } = require("child_process");
const util = require("util");

exec("node -v", (error, stdout) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log(stdout);
});

// 使用 util.promisify
const execPromise = util.promisify(exec);

execPromise("node -v")
  .then((res) => {
    console.log({ ...res });
  })
  .catch((error) => {
    console.log(error);
  });

// 模拟 util.promisify
const promisify = (fn) => {
  return (...arg) => {
    return new Promise((resolve, reject) => {
      fn(...arg, (err, ...values) => {
        if (err) {
          reject(err);
        }
        if (values && values.length > 1) {
          let obj = {};
          for (const key in values) {
            obj[key] = values[key];
          }
          resolve(obj);
        } else {
          resolve(values[0]);
        }
      });
    });
  };
};

const execPromise1 = promisify(exec);

execPromise1("node -v")
  .then((res) => {
    console.log({ ...res });
  })
  .catch((error) => {
    console.log(error);
  });
```

- util.callbackify

```js
const util = require("util");

// util.callbackify 将返回 promise 风格的函数转换为 回调函数风格
const fn = (type) => {
  if (type == 1) {
    return Promise.resolve("yes");
  } else {
    return Promise.reject("no");
  }
};

const callback = util.callbackify(fn);

callback(1, (err, value) => {
  console.log(err, value);
});
```

- util.format()

```js
const util = require("util");

const name = "Alice";
const age = 25;
const info = { city: "Wonderland" };

const formattedString = util.format(
  "My name is %s, I am %d years old, and I live in %j.",
  name,
  age,
  info
);

console.log(formattedString);
// 输出: My name is Alice, I am 25 years old, and I live in {"city":"Wonderland"}.
```

| 占位符 | 匹配                 |
| ------ | -------------------- |
| %s     | 字符串               |
| %d     | 数字（整数或浮点数） |
| %j     | JSON                 |
| %%     | 字符 %               |

## fs (File System)

fs 是 Node.js 中用于与文件系统进行交互的核心模块之一。它提供了多种方法来读取、写入、删除和操作文件与目录。
fs 模块有同步（阻塞）和异步（非阻塞）两种接口，适应不同的编程需求。还可以通过 fs/promises 以 Promise 方式操作文件系统。

### 编程方式

- 异步方式: 通过回调函数处理结果，避免阻塞主线程。 // 非阻塞
- 同步方式: 操作会阻塞，代码执行会等待文件操作完成。 // 阻塞
- Promise 方式: 使用 fs/promises 提供的 Promise API，可结合 async/await 进行异步操作。

## 文件操作 API

### 读取文件

- `fs.readFile(path[, options], callback)` // 异步读取文件
- `fs.readFileSync(path[, options])` // 同步读取文件

### 写入文件

- `fs.writeFile(path, data[, options], callback)` // 异步写入文件
- `fs.writeFileSync(path, data[, options])` // 同步写入文件

### 追加文件

如果文件不存在，会自动创建文件。

- `fs.appendFile(path, data[, options], callback)` // 异步追加到文件的末尾
- `fs.appendFileSync(path, data[, options])` // 同步追加到文件的末尾

#### options 类型

- `string | object`
  - `encoding`: 文件编码，默认值为 `null`，返回 Buffer。
  - `flag`: 文件系统标志，类型为 `string`。

| 标志 | 英文        | 解释                                                                 |
| ---- | ----------- | -------------------------------------------------------------------- |
| `r`  | read        | 以读取模式打开文件。如果文件不存在则报错。                           |
| `w`  | write       | 以写入模式打开文件。如果文件不存在则创建文件，文件已存在则清空。     |
| `a`  | append      | 以追加模式打开文件。如果文件不存在则创建文件，数据写入文件末尾。     |
| `x`  | exclusive   | 以独占写入模式打开文件。如果文件已存在则操作失败。                   |
| `+`  | plus        | 结合使用 `r`、`w` 或 `a` 标志，表示可以同时进行读取和写入操作。      |
| `s`  | synchronous | 同步模式，文件的所有操作（包括数据写入和文件元数据更新）都同步完成。 |

### 文件流操作

- `fs.createReadStream(path[, options])` // 创建可读文件流，适合处理大文件或逐块读取文件内容。
  - `options` 选项:

| 选项            | 类型      | 解释                                                                | 默认值    |
| --------------- | --------- | ------------------------------------------------------------------- | --------- |
| `flags`         | `string`  | 文件系统标志，'r' 表示以读取模式打开文件。                          | `'r'`     |
| `encoding`      | `string`  | 指定字符编码，如 `'utf8'`。                                         |           |
| `fd`            | `number`  | 文件描述符，指定文件的打开方式。如果指定了此选项，`path` 将被忽略。 |           |
| `mode`          | `number`  | 文件模式（权限），仅在文件创建时生效。                              | `0o666`   |
| `autoClose`     | `boolean` | 当流关闭时，自动关闭文件描述符。                                    | `true`    |
| `start`         | `number`  | 指定文件读取的起始字节位置。                                        |           |
| `end`           | `number`  | 指定文件读取的结束字节位置。                                        |           |
| `highWaterMark` | `number`  | 控制流在读取过程中缓冲的字节数，默认是 64KB。                       | `64*1024` |

- `fs.createWriteStream(path[, options])` // 创建可写文件流，适合逐块写入文件内容。
  - `options` 选项:

| 选项            | 类型      | 解释                                                                | 默认值    |
| --------------- | --------- | ------------------------------------------------------------------- | --------- |
| `flags`         | `string`  | 文件系统标志，'w' 表示以写入模式打开文件，'a' 表示追加模式。        | `'w'`     |
| `encoding`      | `string`  | 指定字符编码，如 `'utf8'`。                                         | `'utf8'`  |
| `fd`            | `number`  | 文件描述符，指定文件的打开方式。如果指定了此选项，`path` 将被忽略。 |           |
| `mode`          | `number`  | 文件模式（权限），仅在文件创建时生效。                              | `0o666`   |
| `autoClose`     | `boolean` | 当流关闭时，自动关闭文件描述符。                                    | `true`    |
| `highWaterMark` | `number`  | 控制流在写入过程中缓冲的字节数，默认是 16KB。                       | `16*1024` |

### 创建与删除目录

- `fs.mkdirSync(path[, options])` // 同步创建目录
- `fs.mkdir(path[, options], callback)` // 异步创建目录
- `fs.rmSync(path[, options])` // 同步删除文件或目录
- `fs.rm(path[, options], callback)` // 异步删除文件或目录

### 重命名与移动文件

- `fs.renameSync(oldPath, newPath)` // 同步重命名文件或移动文件

### 文件监听

- `fs.watch(path[, options], callback)` // 监听文件或目录的变化

### 链接操作

- `fs.link(path, path, callback)` // 异步创建硬链接
- `fs.linkSync(path, path)` // 同步创建硬链接
- `fs.symlink(path, path[, type], callback)` // 异步创建符号链接（软链接）
- `fs.symlinkSync(path, path[, type])` // 同步创建符号链接（软链接）
  - `type`: 可选，可以是 `'file'` 或 `'dir'`。

#### example

- readFile

```js
const fs = require("fs");
const fs2 = require("fs/promises"); // promise 方式引入

// readFile 异步
fs.readFile("./example.txt", { encoding: "utf-8" }, (err, data) => {
  console.log(data);
});

// readFileSync 同步
try {
  const data = fs.readFileSync("example.txt", "utf8");
  console.log("文件内容:", data);
} catch (err) {
  console.error("读取文件出错:", err);
}

// promise 方式
fs2
  .readFile("./example.txt")
  .then((data) => {
    console.log(data.toString());
  })
  .catch((error) => {
    console.log(error);
  });
```

- fs.writeFile

```js
fs.writeFile("./index.text", "index write", () => {});
```

- fs.appendFile

```js
fs.appendFile("./index.text", "index append", "utf-8", () => {});
```

- fs.createReadStream

```js
const fs = require("fs");

const readStream = fs.createReadStream("./example.txt", { encoding: "utf8" });

readStream.on("data", (chunk) => {
  console.log("读取到的数据:", chunk);
});

readStream.on("end", () => {
  console.log("文件读取完毕");
});

readStream.on("error", (err) => {
  console.error("读取文件时出错:", err);
});
```

- fs.createWriteStream

```js
const fs = require("fs");

const lines = [
  "这是写入的第一行内容。\n",
  "这是写入的第二行内容。\n",
  "这是写入的第三行内容。\n",
];

const writeStream = fs.createWriteStream("./output.txt", { encoding: "utf8" });

lines.forEach((line) => {
  writeStream.write(line);
});

writeStream.end();

writeStream.on("finish", () => {
  console.log("写入操作完成");
});

writeStream.on("error", (err) => {
  console.error("写入文件时出错:", err);
});
```

- fs.mkdirSync

```js
const fs = require("fs");

// 创建文件夹
fs.mkdirSync("./dir");

// recursive 递归创建文件夹
fs.mkdirSync("./dir_out/dir_inner", {
  recursive: true,
});
```

- fs.rmSync

```js
const fs = require("fs");

// 删除文件夹
fs.rmSync("./dir");

// recursive 递归删除文件夹
fs.rmSync("./dir_out", {
  recursive: true,
});
```

- fs.watch

```js
const fs = require("fs");

// 监听文件变化
fs.watch("./example.txt", (event, filename) => {
  console.log(event, filename);
});
```

- fs.link

```js
fs.link("index.text", "index2.text", (err) => {
  if (err) throw err;
  console.log("硬链接创建成功");
});
```

- fs.linkSync

```js
try {
  fs.linkSync("targetPath", "linkPath");
  console.log("硬链接创建成功");
} catch (err) {
  console.error("创建硬链接时出错:", err);
}
```

- fs.symlink

```js
fs.symlink("./index.text", "./index2.text", (err) => {
  if (err) throw err;
  console.log("软链接创建成功");
});
```

- fs.symlinkSync

```js
try {
  fs.symlinkSync("targetPath", "linkPath");
  console.log("硬链接创建成功");
} catch (err) {
  console.error("创建硬链接时出错:", err);
}
```

### 原理 libuv

fs 底层使用 libuv。

fs 源码是通过 C++ 层的 FSReqCallback 这个类 对 libuv 的 uv_fs_t 的一个封装，其实也就是将我们 fs 的参数透传给 libuv 层

一个多平台支持库，主要用于提供异步 I/O 操作，它是 Node.js 的核心依赖之一。

[https://libuv.org/](https://libuv.org/)

#### example

```c++
// mkdir
// 创建目录的异步操作函数，通过uv_fs_mkdir函数调用
// 参数：
// - loop: 事件循环对象，用于处理异步操作
// - req: 文件系统请求对象，用于保存操作的状态和结果
// - path: 要创建的目录的路径
// - mode: 目录的权限模式 777 421
// - cb: 操作完成后的回调函数
int uv_fs_mkdir(uv_loop_t* loop,
                uv_fs_t* req,
                const char* path,
                int mode,
                uv_fs_cb cb) {
  INIT(MKDIR);
  PATH;
  req->mode = mode;
  if (cb != NULL)
    if (uv__iou_fs_mkdir(loop, req))
      return 0;
  POST;
}
```

#### 注意

setImmediate 先执行，而不是 fs

Node.js 读取文件 I/O 操作 都是使用 libuv 进行调度的

而 setImmediate 是由 V8 进行调度的

文件读取完成后 libuv 才会将 fs 的结果 推入 V8 的队列

```js
const fs = require("fs");

fs.readFile(
  "./index.txt",
  {
    encoding: "utf-8",
    flag: "r",
  },
  (err, dataStr) => {
    if (err) throw err;
    console.log("fs");
  }
);

setImmediate(() => {
  console.log("setImmediate");
});
>>>
setImmediate
index
```

## crypto 加密

提供了多种加密、解密、生成哈希、HMAC、签名和验证签名的方法。

- ### 哈希

哈希（Hashing）是一种将输入数据（无论长度如何）转换为固定长度字符串或数字的过程。这个过程使用哈希函数（Hash Function）来进行。哈希函数将输入的数据称为“消息”或“消息摘要”，通过一系列复杂的计算生成一个唯一的输出值，称为哈希值或哈希码。

#### 常见的哈希算法

- MD5（Message Digest Algorithm 5）：输出 128 位（16 字节）的哈希值。已被认为不再安全，容易发生碰撞。
- SHA-1（Secure Hash Algorithm 1）：输出 160 位（20 字节）的哈希值，也已被认为不再安全。
- SHA-256：输出 256 位（32 字节）的哈希值，是目前较为安全的选择之一，属于 SHA-2 系列。

#### 使用场景

1. 密码存储：传统上用于避免明文存储密码（不再推荐使用 MD5，因其易受碰撞攻击和暴力破解的影响）。
2. 文件完整性验证：确保文件在传输或存储过程中未被篡改。

#### example

```js
const crypto = require("crypto");

const hash = crypto.createHash("sha256");
hash.update("hello");
console.log(hash.digest("hex"));
// 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
```

- ### HAMC (Hash-based Message Authentication Code)

使用一个密钥对消息进行加密，生成一个哈希值，用于消息完整性和身份验证。

```js
const crypto = require("crypto");

const hmac = crypto.createHmac("sha256", "a secret");
hmac.update("hello");
console.log(hmac.digest("hex"));
// f4e44dfb5af3e6399ff5f6c4d35faedeb7e339d2cc1a2c89eb42ff08464d09da
```

- ### 对称加密算法

对称加密算法使用同一个密钥来进行加密和解密。它们通常用于数据保护和安全传输。

#### 常见对称加密算法

- AES：高级加密标准（Advanced Encryption Standard），目前最广泛使用的对称加密算法，适合大多数安全需求。
- DES：数据加密标准（Data Encryption Standard），由于密钥长度较短，已被淘汰，通常使用其增强版 3DES。

#### example

```js
const crypto = require("crypto");

// 生成随机密钥和初始化向量
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

// 加密
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
let encrypted = cipher.update("hello", "utf-8", "hex");

encrypted += cipher.final("hex");
console.log("Encrypted:", encrypted);

// 解密
const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
let decrypted = decipher.update(encrypted, "hex", "utf-8");

decrypted += decipher.final("utf-8");
console.log("Decrypted:", decrypted);
```

- ### 非对称加密

使用一对密钥：公钥用于加密，私钥用于解密。它通常用于安全的密钥交换、数字签名和身份验证。

#### 常见非对称加密算法

- RSA：一种广泛使用的非对称加密算法，具有高安全性。RSA 密钥的长度通常为 2048 位或 4096 位。
- DSA（Digital Signature Algorithm）：主要用于数字签名。

```js
const crypto = require("crypto");

// 生成 RSA 密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

// 使用公钥加密
let encrypted = crypto.publicEncrypt(publicKey, Buffer.from("hello"));
console.log("Encrypted:", encrypted.toString("hex"));

// 使用私钥解密
let decrypted = crypto.privateDecrypt(privateKey, encrypted);
console.log("Decrypted:", decrypted.toString("utf-8"));
```

## cli 脚手架

- `commander` 一个强大的命令行参数解析工具，适用于处理命令、选项和参数。
- `inquirer` 一个用于与命令行用户进行交互的库，能够创建漂亮的命令行提示。
- `ora` 一个用于在命令行中显示加载动画（spinner）的库，常用于显示异步操作的进度。
- `download-git-repo` 一个用于从 Git 仓库（如 GitHub、GitLab 等）下载项目模板的库，常用于脚手架工具中自动拉取模板。

### install

```bash
npm i commander inquirer ora download-git-repo
```

### 编写脚手架

1. 自定义命令

```js
// cli.js
#!/usr/bin/env node
// Node.js 脚本的一个标准开头，它确保脚本可以在不同的环境和系统上找到正确的 Node.js 解释器来运行。

console.log("mycli run");
```

2. 挂载自定义命令 -> 创建软连接 挂载到全局

```diff
# package.json
+ "bin": {
+    "mycli": "src/cli.js"
+  },
```

```bash
npm link # 创建软连接 挂载到全局
```

3. 编写脚手架

::: code-group

```js [cli.js]
#!/usr/bin/env node
// Node.js 脚本的一个标准开头，它确保脚本可以在不同的环境和系统上找到正确的 Node.js 解释器来运行。

import { program } from "commander";
import inquirer from "inquirer";
import fs from "node:fs";
import { checkPath, downloadTemp } from "./util.js";

// console.log("mycli run");

let package_json = fs.readFileSync("./package.json");
package_json = JSON.parse(package_json);

program.version(package_json.version);

program
  .command("create <projectName>")
  .alias("c")
  .description("创建项目")
  .action((name) => {
    console.log(name);
    inquirer
      .prompt([
        {
          type: "input",
          name: "projectName",
          message: "请输入项目名名称",
          default: name,
        },
        { type: "confirm", name: "isTS", message: "是否启用 TS" },
      ])
      .then((res) => {
        // console.log(res);
        if (checkPath(res.projectName)) {
          console.log("文件夹已存在");
          return;
        }
        if (res.isTS) {
          downloadTemp("ts", res.projectName);
        } else {
          downloadTemp("js", res.projectName);
        }
      })
      .catch(() => {
        console.error("操作被取消");
        process.exit(1); // 处理异常后退出
      });
  });

program.parse(process.argv);
```

```js [util.js]
import fs from "fs";
import download from "download-git-repo";
import ora from "ora";

export const checkPath = (path) => {
  if (fs.existsSync(path)) {
    return true;
  } else {
    return false;
  }
};

export const downloadTemp = (branch, name) => {
  return new Promise((resolve, reject) => {
    const spinner = ora("Loading...").start();
    download(
      `direct:https://gitee.com/chinafaker/vue-template.git#${branch}`,
      name,
      { clone: true },
      function (err) {
        if (err) reject(err);
        resolve();
        spinner.succeed("下载完成");
      }
    );
  });
};
```

:::

4. login

```bash
npm login
```

::: warning
note npm registry

```bash
npm config get registry

npm config set registry https://registry.npmjs.org/

# taobao
npm config set registry https://registry.npmmirror.com/
```

:::

5. publish

```bash
npm publish
```

## zlib

用于提供文件压缩和解压缩功能，支持多种压缩算法，如 gzip 和 deflate。

### 算法

- `gzip` 算法 后缀 `.gz` 常用于 文件压缩
- `deflate` 算法 后缀 `.flate` 常用于 网络传输 动态资源的压缩传输
- `brotli` 算法 后缀 `.br` 常用于 网络传输 静态资源的压缩传输

### API

它们都有 同步、异步版本

- zlib.gzip() 压缩
- zlib.gunzip() 解压

- zlib.defalte() 压缩
- zlib.infalte() 解压

- zlib.brotliCompress() 压缩
- zlib.brotliDdcompress() 解压

### example

- 文件压缩与解压缩

```js
const zlib = require("node:zlib");
const fs = require("fs");

// gzip
const readStream = fs.createReadStream("./example.txt");
const writeStream = fs.createWriteStream("./example.txt.gz");

readStream.pipe(zlib.createGzip()).pipe(writeStream);

const readStream = fs.createReadStream("./example.txt.gz");
const writeStream = fs.createWriteStream("./example1.txt");

readStream.pipe(zlib.createGunzip()).pipe(writeStream);

// deflate
const readStream = fs.createReadStream("./example.txt");
const writeStream = fs.createWriteStream("example.txt.flate");

readStream.pipe(zlib.createDeflate()).pipe(writeStream);

const readStream = fs.createReadStream("example.txt.flate");
const writeStream = fs.createWriteStream("example2.txt");

readStream.pipe(zlib.createInflate()).pipe(writeStream);

// Brotli
const inputBrotli = fs.createReadStream("./example.txt");
const writeStream = fs.createWriteStream("./example.txt.br");

inputBrotli.pipe(zlib.createBrotliCompress()).pipe(writeStream);

const readStream = fs.createReadStream("./example.txt.br");
const writeStream = fs.createWriteStream("./example-decompressed.txt");

readStream.pipe(zlib.createBrotliDecompress()).pipe(writeStream);
```

- HTTP 压缩与解压缩

```js
const fs = require("fs");
const http = require("http");
const zlib = require("zlib");

// gzip
const server = http.createServer((req, res) => {
  const text = "123".repeat(10000);
  res.setHeader("Content-Type", "text/plain;charset=utf-8");
  res.setHeader("Content-Encoding", "gzip");
  const result = zlib.gzipSync(text);
  res.end(result);
});

// deflate
const server = http.createServer((req, res) => {
  const text = "123".repeat(10000);
  res.setHeader("Content-Type", "text/plain;charset=utf-8");
  res.setHeader("Content-Encoding", "deflate");
  const result = zlib.deflateSync(text);
  res.end(result);
});

const server = http.createServer((req, res) => {
  const text = "123".repeat(10000);
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.setHeader("Content-Encoding", "br");
  const result = zlib.brotliCompressSync(text);
  res.end(result);
});

server.listen(3000);
```

## http

构建 HTTP 服务器和客户端的核心模块之一。它允许你轻松创建服务器来处理 HTTP 请求和响应，也可以用来发起 HTTP 请求。

```js
const http = require("http");
const url = require("url");

http
  .createServer((req, res) => {
    const { method } = req;
    const { pathname, query } = url.parse(req.url, true);
    if (method == "GET") {
      if (pathname === "/get") {
        console.log(query);
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.statusCode = 200;
        res.end(JSON.stringify(query));
      }
    } else if (method == "POST") {
      if (pathname === "/login") {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });

        req.on("end", () => {
          res.setHeader("Content-Type", "appliaction/json");

          res.statusCode = 200;
          res.end(data);
        });
      } else {
        res.statusCode = 404;
        res.end("404");
      }
    }
  })
  .listen(3000);
```

### 反向代理

```bash
npm i http-proxy-middleware
```

代理 80 /api 服务到 3000 端口

::: code-group

```js [index.js]
const http = require("http");
const url = require("url");
const fs = require("fs");
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("./proxy.config.js");

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    console.log(pathname);

    const proxyList = Object.keys(config.server.proxy);
    console.log(proxyList);

    if (proxyList.includes(pathname)) {
      const proxy = createProxyMiddleware(config.server.proxy[pathname]);
      return proxy(req, res);
    }
    const html = fs.readFileSync("./index.html");

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  })
  .listen(80);
```

```js [proxy.config.js]
module.exports = {
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/",
        changeOrgin: true,
      },
    },
  },
};
```

```js [server.js]
const http = require("http");
const url = require("url");

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url);

    if (pathname == "/api") {
      res.writeHead(200, { "Content-Type": "text/plan; charset=utf-8" });

      res.end("proxy success");
    }
  })
  .listen(3000, () => {
    console.log("3000");
  });
```

:::

### 动静分离

动静分离是一种在 Web 服务器架构中常用的优化技术，旨在提高网站的性能和可伸缩性。
它基于一个简单的原则：将动态生成的内容（如动态网页、API 请求）与静态资源（如 HTML、CSS、JavaScript、图像文件）分开处理和分发。

```bash
npm i mime
```

```js
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import mime from "mime"; // 导入mime模块

const server = http.createServer((req, res) => {
  const { url, method } = req;

  // 处理静态资源
  if (method === "GET" && url.startsWith("/static")) {
    const filePath = path.join(process.cwd(), url); // 获取文件路径
    const mimeType = mime.getType(filePath); // 获取文件的MIME类型
    console.log(mimeType); // 打印MIME类型

    fs.readFile(filePath, (err, data) => {
      // 读取文件内容
      if (err) {
        res.writeHead(404, {
          "Content-Type": "text/plain", // 设置响应头为纯文本类型
        });
        res.end("not found"); // 返回404 Not Found
      } else {
        res.writeHead(200, {
          "Content-Type": mimeType, // 设置响应头为对应的MIME类型
          "Cache-Control": "public, max-age=3600", // 设置缓存控制头
        });
        res.end(data); // 返回文件内容
      }
    });
  }

  // 处理动态资源
  if ((method === "GET" || method === "POST") && url.startsWith("/api")) {
    // ...处理动态资源的逻辑
  }
});

server.listen(80);
```

### 邮件服务

- js-yaml 用于在 JavaScript 中解析和生成 YAML 数据
- nodemailer 用于在 Node.js 环境下发送电子邮件的库，它支持多种传输方式，如 SMTP。

```bash
npm i js-yaml nodemailer
```

```js
const yaml = require("js-yaml");
const fs = require("node:fs");
const http = require("node:http");
const url = require("node:url");
const nodemailer = require("nodemailer");

// 加载邮箱配置信息
const email = yaml.load(fs.readFileSync("email.yaml", "utf-8"));

console.log(email);

let transporter = nodemailer.createTransport({
  host: "smtp.qq.com", // QQ 邮箱 SMTP 服务器
  port: 465,
  secure: true,
  auth: {
    user: email.emailconfig.user,
    pass: email.emailconfig.pass,
  },
});

http
  .createServer((req, res) => {
    const { method } = req;
    const { pathname } = url.parse(req.url);

    if (method === "POST" && pathname == "/post/email") {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });

      req.on("end", () => {
        console.log("接收到的数据:", data);

        try {
          const postData = JSON.parse(data);
          console.log("解析后的数据:", postData);

          // 准备发送邮件
          transporter.sendMail(
            {
              from: email.emailconfig.user, // 发件人
              to: postData.user, // 收件人
              subject: postData.subject, // 邮件主题
              text: postData.content, // 邮件内容
            },
            (error, info) => {
              if (error) {
                console.error("邮件发送失败:", error);
                res.statusCode = 500;
                res.end(`邮件发送失败: ${error.toString()}`);
              } else {
                console.log("邮件发送成功:", info);
                res.statusCode = 200;
                res.end(`邮件发送成功: ${info.messageId}`);
              }
            }
          );
        } catch (err) {
          console.error("数据解析错误:", err);
          res.statusCode = 400;
          res.end("请求数据格式错误");
        }
      });
    } else {
      res.statusCode = 404;
      res.end("路径或方法不正确");
    }
  })
  .listen(3000, () => {
    console.log("服务器在端口 3000 上运行");
  });
```

## 请求头 响应头

### Access-Control-Allow-Origin 跨域

::: code-group

```js [允许所有域访问]
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
```

```js [指定域名访问]
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
  next();
});
```

:::

::: warning
`res.setHeader("Access-Control-Allow-Origin", "*");`
浏览器出于安全考虑，不会发送或接收 cookies，包括 session cookies。
这是因为跨域请求中，cookies 被视为敏感信息，只有当 Access-Control-Allow-Origin 设置为具体的域时，浏览器才允许携带和共享 cookies。
:::

### Access-Control-Allow-Methods 允许的请求方法

指定在跨域请求中允许的 HTTP 方法

::: code-group

```js [frontend]
fetch("http://localhost:3000/patch", { method: "PATCH" })
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
  });
```

```js [backend]
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  next();
});
```

:::

::: warning
如果服务器没有明确设置 `Access-Control-Allow-Methods` 头，浏览器在处理跨域请求时会阻止非简单请求（例如 POST 以外的方法或者携带自定义请求头的请求），并且浏览器会返回跨域请求错误。

[简单请求](../http/http.md#请求方法)
:::

### Access-Control-Allow-Headers

- Content-Type 允许客户端指定请求体的类型
- Authorization 允许客户端发送认证相关的头字段

::: code-group

```js [backend]
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
```

```js [frontend]
fetch("http://localhost:3000/post", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    hello: "post",
  }),
})
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    console.log(res);
  });
```

:::

### Access-Control-Expose-Headers 自定义响应头 暴露自定义响应头

::: code-group

```js [backend]
app.post("/post", (req, res) => {
  res.set({ "X-Custom-Header": "test" });
  res.setHeader("Access-Control-Expose-Headers", "X-Custom-Header");
  res.json({
    code: 200,
    hello: "post",
  });
});
```

```js [frontend]
fetch("http://localhost:3000/post", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    hello: "post",
  }),
})
  .then((res) => {
    console.log(res.headers.get("X-Custom-Header"));
    return res.json();
  })
  .then((res) => {
    console.log(res);
  });
```

:::

### SSE 响应

::: code-group

```js [frontend]
const sse = new EventSource("http://localhost:3000/sse");

sse.addEventListener("message", (e) => {
  console.log(e.data);
});

// 接受自定义事件名称
sse.addEventListener("xxx", (e) => {
  console.log(e.data);
});
```

```js [backend]
app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.status(200);

  const intervalId = setInterval(() => {
    res.write("event: xxx\n"); // 自定义事件名称 默认为 message
    res.write("data: " + Date.now() + "\n\n");
  }, 2000);

  // 当客户端断开连接时清除定时器
  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});
```

:::

## 串口 Serial Port

Node SerialPort 是一个用于连接串行端口的 JavaScript 库，可在 NodeJS 和 Electron 中运行。

```bash
npm install serialport
```

::: code-group

```js [查看可用的串口端口]
import { SerialPort } from "serialport";

SerialPort.list()
  .then((ports) => {
    console.log(ports); // 输出全部串口
  })
  .catch((err) => {
    console.error("获取串口列表失败:", err.message);
  });
```

```js [创建串口端口]
import { SerialPort } from "serialport";

// 创建端口
const port = new SerialPort({
  path: "/dev/tty-usbserial1", //
  baudRate: 57600, // 波特率
});
```

```js [监听 通讯]
import { SerialPort } from "serialport";

const serialPort = new SerialPort({
  path: "COM4", //单片机串口
  baudRate: 9600, //波特率
});

serialPort.on("data", () => {
  console.log("data"); //监听单片机的消息
});

let flag = 1;
setInterval(() => {
  serialPort.write(flag + ""); //跟单片机进行通讯 传值
  flag = Number(!flag);
  console.log(flag == 0 ? "开" : "关"); //进行开关的切换
}, 2000);
```

:::

## net

- 用于创建底层的 TCP 或 IPC 服务器和客户端。
- 提供了对原始数据流的操作，适合实现自定义协议或需要直接操作 TCP 连接的场景。
- 不包含 HTTP 协议相关的解析和封装，开发者需要自己处理数据格式。
- 示例用途：Socket 通信、聊天服务器、消息推送等。

::: code-group

```js [tcp 服务器]
const net = require("net");

const server = net.createServer((socket) => {
  console.log("客户端已连接");
  socket.on("data", (data) => {
    console.log("接收到数据:", data.toString());
  });
  socket.on("end", () => {
    console.log("客户端已断开连接");
  });
  socket.write("欢迎连接到服务器！\n");
});

server.listen(8080, () => {
  console.log("服务器正在监听端口 8080");
});
```

```js [tcp 客户端]
const net = require("net");

const client = net.createConnection({ port: 8080 }, () => {
  console.log("已连接到服务器");
  client.write("你好，服务器！");
});

client.on("data", (data) => {
  console.log("接收到数据:", data.toString());
  client.end();
});

client.on("end", () => {
  console.log("已从服务器断开连接");
});
```

:::
