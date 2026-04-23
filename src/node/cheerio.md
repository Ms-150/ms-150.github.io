 # Cheerio
 
 Node.js 环境下的 HTML/XML 解析库，提供 jQuery 风格的选择器 API。

 [https://cheerio.js.org/](https://cheerio.js.org/)

 ## feature

+ 速度极快
+ 适合爬虫、静态页面解析
+ 适合结构化提取

::: warning
它不执行 JS、不渲染页面，因此：
:::

## install

```bash
npm install cheerio
```

## usage

::: code-group

```js [ES Module]
import * as cheerio from 'cheerio';
```

```js [CommonJS]
const cheerio = require('cheerio');
```

:::

### API

::: code-group

```js [选择器]
$('h1')
$('.item')
$('#main')
$('ul li:first-child')
```

```js [获取文本]
$('h1').text()
```

```js [获取属性]
$('img').attr('src')
```

```js [遍历节点]
$('li').each((i, el) => {
  console.log($(el).text());
});
```

```js [修改 DOM]
$('title').text('New Title');
$('body').append('<p>Hello</p>');
```

```js [输出 HTML]
$.html()
```

:::

## example


```js
import * as cheerio from 'cheerio';

const html = `
<ul id="fruits">
  <li class="apple">Apple</li>
  <li class="orange">Orange</li>
  <li class="pear">Pear</li>
</ul>
`;

const $ = cheerio.load(html);

console.log($('.apple').text()); // Apple
console.log($('#fruits li').length); // 3
```
