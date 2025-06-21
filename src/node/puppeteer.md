# puppeteer

Puppeteer 是一个 JavaScript 库，它提供了高级 API，支持通过 DevTools 协议或 WebDriver BiDi 控制 Chrome 或 Firefox。Puppeteer.
默认在无头模式下运行（无可见 UI）。

[https://pptr.dev/](https://pptr.dev/)

自动下载一个兼容版本的 Chromium，以确保 Puppeteer 的 API 可以正常工作。如果您不想下载 Chromium，可以使用 puppeteer-core 包。

## install

```bash
npm install puppeteer
```

## start

::: code-group

```js [启动和关闭浏览器]
const puppeteer = require("puppeteer");

async function runAutomation() {
  // 启动一个新的浏览器实例
  const browser = await puppeteer.launch({ headless: false }); // 设置 headless: false 可以看到浏览器界面
  const page = await browser.newPage(); // 打开一个新的页面 (tab)

  // 在这里执行自动化操作...

  await browser.close(); // 关闭浏览器
}

runAutomation();
```

```js [导航到页面]
await page.goto("https://example.com");
console.log(`Navigated to ${page.url()}`);
```

```js [与页面元素交互]
//  1. 通过 CSS 选择器

const title = page.locator("#main-title");
const links = page.locator(".nav-link");

const submitButton = page.locator("text=Submit");

const productLink = page.locator("text=Product");
```

```js [点击元素]
await page.click("#submit-button");
```

```js [输入文本]
await page.type("#username", "myusername");
await page.type("#password", "mypassword");
```

```js [选择下拉框]
await page.select("#dropdown", "some_value");
```

```js [获取元素文本内容]
const text = await page.$eval("#some-element", (el) => el.textContent);
console.log(text);
```

```js [获取元素属性]
const href = await page.$eval("a", (el) => el.href);
console.log(href);
```

```js [执行 js 代码]
const result = await page.evaluate(() => {
  return document.title;
});
console.log(`Page title: ${result}`);
```

```js [ 截图和生成 PDF]
await page.screenshot({ path: "example.png" });
await page.pdf({ path: "example.pdf", format: "A4" });
```

:::

### 选择器

1. CSS 选择器 (最常用)
2. XPath 选择器
3. locator 选择器

#### CSS 选择器

CSS 选择器是在网页开发中广泛使用的样式选择器，您可以用它来根据元素的标签名、类名、ID、属性等来定位元素。

- `page.$()` 方法用于选择匹配 CSS 选择器的第一个元素。
- `page.$$()` 方法用于选择匹配 CSS 选择器的所有元素，并返回一个元素句柄数组.

```js
const firstLink = await page.$("a"); // 选取第一个 <a> 标签
const submitButton = await page.$("#submit-button"); // 选取 id 为 "submit-button" 的元素
const importantElements = await page.$$(".important"); // 选取所有 class 为 "important" 的元素
```

#### XPath 选择器

```js
const firstHeading = await page.$x("//h1")[0]; // 选取第一个 <h1> 标签
const specificLink = await page.$x('//a[@href="https://example.com"]')[0]; // 选取 href 属性为 "https://example.com" 的 <a> 标签
```

`page.locator()` 而不是 `page.$()` 和 `page.$$()`

```js
page.locator(); // 选择器
page.$(); // 获取单个元素
page.$$(); // 获取多个元素
```

### example

::: code-group

```js
// 导入 Puppeteer 库
import puppeteer from "puppeteer";

// 定义一个异步函数 autoSearch
async function autoSearch() {
  // 启动浏览器实例，headless: false 表示有界面模式
  const browser = await puppeteer.launch({ headless: false });
  // 创建一个新的页面
  const page = await browser.newPage();

  // 导航到 Google 首页
  await page.goto("https://www.google.com");

  // 输入搜索关键词，设置每个字符输入之间的延迟为 100 毫秒
  await page.type('textarea[name="q"]', "Puppeteer automation", { delay: 100 });

  // 模拟按下 Enter 键进行搜索
  await page.keyboard.press("Enter");

  // 等待搜索结果加载，选择器为 #search
  await page.waitForSelector("#search");

  // 截取搜索结果页面的截图，保存为 google_search_result.png
  await page.screenshot({ path: "google_search_result.png" });

  // 关闭浏览器
  await browser.close();
}

// 调用 autoSearch 函数执行搜索
autoSearch();
```

```js
// 导入 Puppeteer 库
import puppeteer from "puppeteer";

// 启动浏览器并打开一个新页面
const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

// 导航到指定网址
await page.goto("https://developer.chrome.com/");

// 设置屏幕大小
await page.setViewport({ width: 1080, height: 1024 });

// 在搜索框中输入文本
await page.locator("aria/搜索").fill("automate beyond recorder");

// 点击第一个搜索结果
await page.locator(".devsite-result-item-link").click();

// 获取并打印页面标题
const textSelector = await page
  .locator("text/Customize and automate")
  .waitHandle();
const fullTitle = await textSelector?.evaluate((el) => el.textContent);
console.log('The title of this blog post is "%s".', fullTitle);

// 关闭浏览器
await browser.close();
```

:::

## evaluate

`page.evaluate()` 和 `elementHandle.evaluate()` 是 Puppeteer 提供的 API，用来在浏览器页面的上下文中执行 JavaScript 代码，就像你在浏览器控制台里写 JS 一样。

```js
// 在页面中运行函数
const result = await page.evaluate(() => {
  return document.title;
});

// 基于某个元素操作
const el = await page.$(".title");
const text = await el.evaluate((node) => node.innerText);
```

## JSHandle（句柄）对象

JSHandle 是一个对页面中 JS 对象的“引用”或“代理”，类似一个“遥控器”，你可以通过它访问页面里的 DOM 元素、变量或函数。

- `JSHandle<String>` 代表一个字符串
- `JSHandle<Object>` 代表一个对象
- `JSHandle<Element>` 代表 DOM 元素
- `JSHandle<Function>` 代表函数

### 用 JSHandle 的场景：

想“保留”某个 JS 对象引用，后面再多次使用

想访问非 DOM 的 JS 对象（比如 window 的一些属性）

```js
const handle = await page.evaluateHandle(() => window);
const location = await handle.getProperty("location");
const href = await location.getProperty("href");
console.log(await href.jsonValue());
```

## 页面交互

```
page.type()：模拟输入

✅ page.click() / elementHandle.click()

✅ page.select()：选择 <select> 下拉框

✅ page.keyboard.press()：键盘操作

✅ page.mouse.move() / mouse.click()：模拟鼠标动作

✅ 文件上传、表单提交、模态框处理
```

## 异步加载与等待机制

真实网页都是异步的，这部分能让你写的脚本更稳定。

```
✅ page.waitForSelector()：等待元素出现

✅ page.waitForTimeout()：固定时间等待（如模拟人行为）

✅ page.waitForResponse() / waitForRequest()：等待接口返回

✅ 设置 waitUntil: 'networkidle2' 等
```
