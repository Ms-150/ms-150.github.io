# wordcloud

在 Canvas 元素上生成漂亮的词云。

## install

```bash
npm install wordcloud
```

## example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>WordCloud2.js 示例</title>
    <style>
      canvas {
        border: 1px solid black;
      }
    </style>
  </head>

  <body>
    <canvas id="myCanvas" width="600" height="400"></canvas>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/wordcloud2.js/1.2.2/wordcloud2.min.js"></script>
    <script src="script.js"></script>
  </body>

  <script>
    const canvas = document.getElementById("myCanvas");
    const wordFrequencyList = [
      ["hello", 12],
      ["world", 8],
      ["javascript", 15],
      ["cloud", 5],
      ["example", 10],
    ];

    WordCloud(canvas, {
      list: wordFrequencyList,
      minFontSize: 10, // 最小字体大小
      weightFactor: 10, // 字体大小的权重因子
      clearCanvas: true, // 每次渲染前清空画布
    });
  </script>
</html>
```
