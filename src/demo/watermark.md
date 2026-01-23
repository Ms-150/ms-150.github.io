# watermark 水印

## 生成水印
1. CSS 背景图
2. Canvas
3. Shadow DOM

### Css background
### canvas
### Shadow DOM

::: code-group

```html [css]
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div class="watermark-container"></div>

    <div>
        <h1>Welcome to My Website</h1>
        <p>This content is protected by a watermark.</p>
    </div>

    <style>
        .watermark-container {
            position: fixed;
            inset: 0;
            /* 等同于 top:0; left:0; right:0; bottom:0; */
            pointer-events: none;
            /* 防止内容遮挡 */
            z-index: 9999;
            /* 直接在 SVG 里处理旋转，效率最高，且无边缘空白 */
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><text x="50%" y="50%" fill="rgba(0,0,0,0.5)" font-size="16" font-family="Arial" text-anchor="middle" transform="rotate(-30 100 75)">这是水印</text></svg>');
            background-repeat: repeat;
            will-change: transform;
            /* 硬件加速 层是独立渲染的，减少对主线程的干扰。*/
        }
    </style>
</body>

</html>
```

```html [canvas]
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="watermark"></div>

    <div class="content">
        <h1>这是一个受保护的页面</h1>
        <p>Canvas 水印现在应该已经平铺在整个页面上了。</p>
    </div>

    <style>
        #watermark {
            position: fixed;
            inset: 0 !important; /* 强制铺满 */
            pointer-events: none;
            z-index: 999999;     /* 提高层级 */
            background-repeat: repeat;
            display: block !important;
            will-change: transform; /* 硬件加速 */
        }
    </style>
    <script>
        function showWatermark(text) {
            // 2. 在内存中创建一个隐形的 canvas
            const canvas = document.createElement('canvas');
            canvas.width = 200;  // 水印块的宽度
            canvas.height = 150; // 水印块的高度
            
            const ctx = canvas.getContext('2d');

            // 3. 绘制水印内容
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // 颜色和透明度
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 4. 旋转逻辑：移动到中心再旋转
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((-30 * Math.PI) / 180);
            ctx.fillText(text, 0, 0);

            // 5. 导出为图片 Base64 字符串
            const base64Url = canvas.toDataURL();

            // 6. 将图片应用到 div 容器上
            const wmDiv = document.getElementById('watermark');
            wmDiv.style.backgroundImage = `url(${base64Url})`;
        }

        // 调用函数
        showWatermark('这是水印');
    </script>
</body>

</html>
```


```html [Shadow DOM]
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
</body>
<script>
    (function () {
        // 1. 创建宿主元素 (Host)
        const host = document.createElement('div');
        host.id = 'wm-host'; // 这个 ID 外部可见，但内部不可见

        // 2. 创建影子根 (Shadow Root)
        // mode: 'closed' 意味着外部无法通过 host.shadowRoot 访问内部节点
        const shadow = host.attachShadow({ mode: 'closed' });

        // 3. 生成水印素材 (SVG)
        const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150">
            <text x="50%" y="50%" fill="rgba(0,0,0,0.12)" font-size="16" 
                  text-anchor="middle" transform="rotate(-30 100 75)">
                Shadow DOM 水印
            </text>
        </svg>`;
        const bgUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

        // 4. 在影子内部创建样式 (样式隔离)
        const style = document.createElement('style');
        style.textContent = `
        .wm-inner {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 999999;
            background-image: url("${bgUrl}");
            background-repeat: repeat;
            will-change: transform;
        }
    `;

        // 5. 在影子内部创建水印层
        const wmInner = document.createElement('div');
        wmInner.className = 'wm-inner';

        // 6. 组装：将样式和水印层塞进影子
        shadow.appendChild(style);
        shadow.appendChild(wmInner);

        // 7. 将宿主挂载到页面 body
        document.body.appendChild(host);

        console.log('Shadow DOM 水印已安全挂载');
    })();
</script>

</html>
```
:::


## 修改水印
+ 删除 div
+ display: none !important;
+ opacity: 0 !important;
+ transform: rotate(90deg); 
+ transform: scale(0.1);

## 防篡改
`MutationObserver`

Web API 提供的一种强大机制，用于监听 DOM 树的变化。当 DOM 节点的属性、子节点或文本内容发生变化时，它会异步触发回调函数。

::: code-group
```js [MutationObserver]
let waterMarkContainer = document.getElementById('waterMark');

function createWatermark() {
    const div = document.createElement('div');
    div.id = 'waterMark';
    div.setAttribute('style', `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 999999;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><text x="50%" y="50%" fill="rgba(0,0,0,0.15)" font-size="16" text-anchor="middle" transform="rotate(-30 100 75)">你的水印</text></svg>');
        background-repeat: repeat;
    `);
    document.body.appendChild(div);
    waterMarkContainer = div; // 更新引用
}

let observer = new MutationObserver((mutations) => {    

    mutations.forEach((mutation) => {
        // ⭐ 正确判断 removedNodes
        if (mutation.type === 'childList') {
            mutation.removedNodes.forEach(node => {
                if (node === waterMarkContainer) {
                    console.log('检测到水印被移除，正在恢复...');                   
                    createWatermark();                    
                }
            });
        }

        // ⭐ 属性被修改
        if (mutation.type === 'attributes' && mutation.target === waterMarkContainer) {
            console.log('检测到水印属性被修改，正在恢复...');           
            const parent = mutation.target.parentElement;
            parent.removeChild(mutation.target)
            createWatermark();            
        }
    });
});

observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
});
```

```html [css]
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <title>防篡改水印</title>
</head>

<body>
    <h1>这是你的页面</h1>
    <p>下面是你要求的完整水印防篡改方案。</p>
    <script>
        let wm = null;
        let isRestoring = false;

        function createWatermark() {
            wm = document.createElement('div');
            wm.setAttribute('style', `
                position: fixed;
                inset: 0;
                pointer-events: none;
                z-index: 999999;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><text x="50%" y="50%" fill="rgba(0,0,0,0.15)" font-size="16" text-anchor="middle" transform="rotate(-30 100 75)">这是水印</text></svg>');
                background-repeat: repeat;
            `);
            document.body.appendChild(wm);
        }

        function restore() {
            if (isRestoring) return;
            isRestoring = true;

            if (wm && wm.isConnected) wm.remove();
            createWatermark();

            setTimeout(() => isRestoring = false, 50);
        }

        createWatermark();

        new MutationObserver((mutations) => {
            for (const m of mutations) {
                // 删除检测
                if (m.type === 'childList') {
                    m.removedNodes.forEach(node => {
                        if (node === wm) restore();
                    });
                }
                // 属性修改检测
                if (m.type === 'attributes' && m.target === wm) {
                    restore();
                }
            }
        }).observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });
    </script>
</body>

</html>
```

```html [shadow dom]
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <title>防篡改水印</title>
</head>

<body>
    <h1>这是你的页面</h1>
    <p>下面是你要求的完整水印防篡改方案。</p>

    <script>
        let host = null;
        let isRestoring = false;

        // ⭐ 正确编码 SVG（不会破坏 CSS）
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150">
                <text x="50%" y="50%" fill="rgba(0,0,0,0.15)" 
                    font-size="16" text-anchor="middle" 
                    transform="rotate(-30 100 75)">
                    你的水印
                </text>
            </svg>
        `;
        const encodedSvg = encodeURIComponent(svg.trim());

        const waterMarkStyle = `
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 999999;
            background-image: url("data:image/svg+xml;utf8,${encodedSvg}");
            background-repeat: repeat;
        `;

        function createWatermark() {
            if (host && host.isConnected) host.remove();

            host = document.createElement('div');
            const shadow = host.attachShadow({ mode: 'closed' });

            const inner = document.createElement('div');
            inner.setAttribute('style', waterMarkStyle);

            shadow.appendChild(inner);
            document.body.appendChild(host);
        }

        function restore() {
            if (isRestoring) return;
            isRestoring = true;

            console.warn("水印被篡改，正在恢复...");
            createWatermark();

            setTimeout(() => isRestoring = false, 50);
        }

        createWatermark();

        new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'childList') {
                    m.removedNodes.forEach(node => {
                        if (node === host) restore();
                    });
                }
                if (m.type === 'attributes' && m.target === host) {
                    restore();
                }
            }
        }).observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });
    </script>
</body>

</html>
```
:::