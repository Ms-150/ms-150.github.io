# CACHE 器缓

缓存就是数据交换的缓冲区（称作 Cache），是存贮数据（使用频繁的数据）的临时地方。当用户查询数据，首先在缓存中寻找，如果找到了则直接执行。如果找不到，则去数据库中查找。

缓存的本质
用空间换时间，牺牲数据的实时性，以服务器内存中的数据暂时代替从数据库读取最新的数据，减少数据库 IO，减轻服务器压力，减少网络延迟，加快页面打开速度。

优点

- 减少了不必要的数据传输，节省带宽
- 减少服务器的负担，提升网站性能
- 加快了客户端加载网页的速度
- 用户体验友好

缺点

- 资源如果有更改但是客户端更新不及时，会造成用户获取信息滞后。

## 浏览器缓存机制

包含四个方面，它们按照获取资源时请求的优先级依次排列如下:

1. Memory Cache
2. Service Worker Cache
3. HTTP Cache
4. Push Cache

### HTTP Cache

我们开发中接触最多的缓存，它分为强缓存和协商缓存。

- `强缓存`: 直接从本地副本比对读取，不去请求服务器，返回的状态码是 200。
- `协商缓存`: 会去服务器比对，若没改变才直接读取本地缓存，返回的状态码是 304。

#### 强缓存（Strong Cache）

主要包括 Response Header 里的 `CACHE-CONTROL`、`EXPIRES`、`PRAGMA`

- `CACHE-CONTROL`: public, max-age=3600, s-maxage=3600 // 缓存控制 优先级更高且不依赖客户端时间
  值: MAX-AGE、S-MAXAGE、PUBLIC、PRIVATE、NO-CACHE、NO-STORE 等

  - `max-age` 和 `s-maxage`
    cache-control 的主要字段，它们的值为数字(max-age=1000)表示资源过多少秒之后失效。
    在浏览器中，max-age 和 s-maxage 都起作用，且 s-maxage 的优先级高于 max-age。
    在代理服务器中，只有 s-maxage 起作用。可以通过设置 max-age 为 0，表示立马过期，向服务器请求资源。
  - `public` 和 `private`
    `public` 表示: 该资源可以被所有客户端和代理服务器缓存。
    `private` 表示: 该资源仅能客户端缓存。 (默认值)
    // 当设置了 s-maxage 表示允许代理服务器缓存，相当于 public。
  - `no-cache` 和 `no-store`
    `no-cache` 表示: 不直接询问浏览器缓存情况，去向服务器验证当前资源是否更新(即: 协商缓存)。
    `no-store` 表示: 完全不使用缓存策略，不缓存请求或响应的任何内容，直接向服务器请求最新。
    // 由于两者都不考虑缓存，而是直接与服务器交互，所以当 no-cache 和 no-store 存在时会直接忽略 max-age 等。

- `EXPIRES`: Thu, 03 Jan 2019 11:43:04 GMT //资源的过期时间 (时间戳)
  注 : 再次请求该资源时，使用本地时间与该时间戳进行对比，如果大于该时间戳则已过期，否则直接使用该缓存资源。本地是时间可能不准确 且本地时间 用户可以修改。

- `PRAGMA`: `no-cache` : HTTP/1.0 的标准，用于向后兼容旧版本浏览器
  值: `no-cache` 意思同 CACHE-CONTROL，优先级高于 CACHE-CONTROL 和 EXPIRES。

::: warning

- 优先使用 `CACHE-CONTROL`（HTTP/1.1）
- `EXPIRES` 和 `PRAGMA` 仅用于兼容旧版本（HTTP/1.0） 的客户端，现代浏览器普遍忽略 `PRAGMA`

:::

::: code-group

```bash [ExpCache-Control]
ExpCache-Control: public, max-age=3600
```

```bash [Expires]
Expires: Thu, 03 Jan 2023 11:43:04 GMT
```

```bash [Pragma]
Pragma: no-cache
```

:::

##### example

::: code-group

```js [Cache-Control]
const express = require("express");
const app = express();

app.get("/cache-control-demo", (req, res) => {
  // Cache-Control 是 HTTP/1.1 的强缓存机制
  // public: 资源可被任何缓存区缓存（客户端和代理服务器）
  // max-age=3600: 缓存时间为3600秒（1小时）
  res.setHeader("Cache-Control", "public, max-age=3600");

  res.send("这是设置 Cache-Control 的响应（强缓存）");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

```js [Expires]
const express = require("express");
const app = express();

app.get("/expires-demo", (req, res) => {
  // 设置 Expires 头，表示资源过期时间点（HTTP/1.0 强缓存）
  const expires = new Date(Date.now() + 3600 * 1000).toUTCString(); // 1小时后过期
  res.setHeader("Expires", expires);

  // 设置 Cache-Control 头，表示资源最大缓存时间（秒），优先级高于 Expires
  res.setHeader("Cache-Control", "public, max-age=3600");

  res.send("这是带 Expires 和 Cache-Control 头的强缓存响应");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

```js [Pragma]
const express = require("express");
const app = express();

app.get("/pragma-demo", (req, res) => {
  // Pragma 是 HTTP/1.0 的禁用缓存方式，主要用于向后兼容
  res.setHeader("Pragma", "no-cache");

  // 建议搭配 HTTP/1.1 的 Cache-Control 一起使用，明确禁止缓存
  res.setHeader("Cache-Control", "no-cache");

  // Expires 设置为 0，表示资源立即过期，不使用缓存
  res.setHeader("Expires", "0");

  res.send("这是禁用缓存的响应（Pragma 示例）");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

:::

#### 协商缓存（Negotiated Cache）

协商缓存是浏览器和服务器之间的一种缓存机制，用于判断本地缓存的资源是否是最新的，从而决定是否重新下载资源。

- `Last-Modified` / `If-Modified-Since`
- `ETag` / `If-None-Match`

上面的 expires 和 cache-control 都会访问本地缓存直接验证是否过期，如果没过期直接使用本地缓存，并返回 200。但如果设置了 no-cache 和 no-store 则本地缓存会被忽略，会去请求服务器验证资源是否更新，如果没更新才继续使用本地缓存，此时返回的是 304，这就是协商缓存。

- `last-modified`: Thu, 20 Dec 2018 11:36:00 GMT // 资源最后修改的时间

  - `Last-Modified`（响应头）: 服务器告诉客户端资源最后一次修改时间。
  - `If-Modified-Since`（请求头）: 客户端带着上次服务器返回的 Last-Modified 时间，询问服务器资源是否更新。

  工作流程:

  1. 客户端请求资源，服务器返回资源并带上 `Last-Modified` 时间。
  2. 下次请求带上 `If-Modified-Since`，服务器对比资源修改时间:
     - 若资源未改动，返回 304 Not Modified
     - 若资源改动，返回新资源和 200 OK

- `etag`: "FllOiaIvA1f-ftHGziLgMIMVkVw"

  - `ETag`（响应头）: 服务器为资源生成的唯一标识符（通常是文件内容的 hash 或版本号）。
  - `If-None-Match`（请求头）: 客户端带着上次服务器返回的 ETag，询问资源是否变化。

    工作流程:

    1. 服务器响应时带上 ETag。
    2. 下次请求带上 `If-None-Match`，服务器对比 `ETag`:
       - 若匹配，返回 304 Not Modified
       - 若不匹配，返回新资源和 200 OK

##### example

::: code-group

```js [Last-Modified]
const express = require("express");
const app = express();

app.get("/last-modified-demo", (req, res) => {
  // 资源的最后修改时间（固定时间示例）
  const resourceLastModified = new Date("2025-06-01T10:00:00Z").toUTCString();
  // 取请求头里的 If-Modified-Since
  const ifModifiedSince = req.headers["if-modified-since"];

  if (
    ifModifiedSince &&
    new Date(ifModifiedSince) >= new Date(resourceLastModified)
  ) {
    // 资源未修改，返回 304，客户端使用缓存
    res.status(304).end();
  } else {
    // 资源已更新或无缓存，返回最新内容和 Last-Modified 头
    res.setHeader("Last-Modified", resourceLastModified);
    res.send("这是带 Last-Modified 头的资源内容");
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

```js [ETag]
const express = require("express");
const crypto = require("crypto");

const app = express();

function generateETag(content) {
  // 计算内容的 MD5 哈希，作为 ETag
  return '"' + crypto.createHash("md5").update(content).digest("hex") + '"';
}

app.get("/etag-demo", (req, res) => {
  const content = "这是带 ETag 头的资源内容";
  // 生成当前内容的 ETag
  const resourceETag = generateETag(content);
  // 从请求头取 If-None-Match
  const ifNoneMatch = req.headers["if-none-match"];

  if (ifNoneMatch === resourceETag) {
    // 客户端缓存的资源有效，返回 304，无需发送内容
    res.status(304).end();
  } else {
    // 资源已更新或客户端无缓存，返回最新内容和 ETag
    res.setHeader("ETag", resourceETag);
    res.send(content);
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

:::
www.jianshu.com/p/fb59c770160c
