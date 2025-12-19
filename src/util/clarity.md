# clarity

一个免费的用户行为分析工具，可以帮助你了解网站访客是如何与页面交互的。

[https://clarity.microsoft.com](https://clarity.microsoft.com)

## feature

- 热图地图：显示用户点击、滚动、停留位置
- 会话录制：回放用户访问网站的全过程
- 用户路径分析：了解用户行为路径
- 性能分析：发现页面加载和交互问题

## usage

::: code-group

```[1. New Project]
Project Name（项目名称）
Website URL（网站地址）
```

```js [2. Add Clarity to Your Website]
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "你的项目ID");
</script>
```

:::
