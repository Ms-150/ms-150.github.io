# JsBarcode

一个轻量级、零依赖的 JavaScript 条形码生成库，可以在浏览器和 Node.js 中运行。它支持多种主流条码格式，使用非常简单。

[https://lindell.me/JsBarcode/](https://lindell.me/JsBarcode/)

支持的条码格式非常多，包括 `CODE128、EAN-13、EAN-8、UPC、CODE39、ITF、MSI、Pharmacode、Codabar、CODE93` 等

## install

::: code-group

```html [CDN]
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
```

```bash [npm]
npm install jsbarcode
```

:::

## usage

::: code-group

```html
<!DOCTYPE html>
<html>
<body>
  <svg id="barcode"></svg>

  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.12.0/dist/JsBarcode.all.min.js"></script>
  <script>
    JsBarcode("#barcode", "HelloJsBarcode", {
      format: "CODE128",
      width: 2,
      height: 80,
      displayValue: true
    });
  </script>
</body>
</html>
```

```js [node]
const JsBarcode = require("jsbarcode");
const { createCanvas } = require("canvas");
const fs = require("fs");

const canvas = createCanvas(300, 150);

JsBarcode(canvas, "1234567890128", {
  format: "EAN13",
  margin: 10
});

const out = fs.createWriteStream("./barcode.png");
canvas.createPNGStream().pipe(out);

```
:::

| 配置项         | 说明                          | 默认值            |
| -------------- | ----------------------------- | ----------------- |
| `format`       | 条码类型（如 CODE128、EAN13） | auto              |
| `width`        | 每条线宽度                    | 2                 |
| `height`       | 条码高度                      | 100               |
| `displayValue` | 是否显示文字                  | true              |
| `textPosition` | 文字位置（top/bottom）        | bottom            |
| `fontSize`     | 文字大小                      | 20                |
| `lineColor`    | 条码颜色                      | #000              |
| `background`   | 背景色                        | #fff              |
| `margin`       | 外边距                        | 10                |
| `valid`        | 校验回调                      | function(valid){} |
