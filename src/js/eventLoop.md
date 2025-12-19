# JavaScript 事件循环：异步调度机制

## 单线程与事件循环

JavaScript 是单线程语言，这意味着它在任意时刻只能执行一个任务。为了处理耗时的异步操作（如网络请求、定时器），同时避免阻塞用户界面，浏览器或 Node.js 等宿主环境引入了 `事件循环（Event Loop）` 机制。

事件循环是一个永不停止的循环，它协调 调用栈（Call Stack） 和 任务队列 之间的工作。

## `宏任务` 与 `微任务`

异步任务在执行前会被放入不同的队列，这两种任务类型决定了它们的执行优先级。

| 任务类型 | 描述 | 示例 |
| ---- | --- | --- |
| 微任务 | 优先级高 | 在当前宏任务执行完毕后，立即执行所有微任务 |
| 宏任务 | 优先级低 | 每次事件循环只取一个宏任务执行 |

### 宏任务（Macrotasks）

+ 整个 `script` 脚本（即你的初始代码块）。
+ `setTimeout()`
+ `setInterval()`
+ `I/O` 操作（如文件读写、网络请求回调）
+ UI 交互事件（如 `click、scroll` 事件的回调）

### 微任务 （Microtasks）

+ `Promise` 的回调（.then(), .catch(), .finally()）。
+ `MutationObserver`（DOM 变化观察器）。
+ `queueMicrotask()`（现代浏览器提供的API，用于明确添加微任务）。
+ `process.nextTick()` (仅 Node.js 环境，优先级比 Promise 更高)。

### `requestAnimationFrame` (特殊任务，执行时机在渲染前)

## 事件循环执行流程

一次完整的事件循环迭代（Tick）遵循以下严格的步骤：

1. 执行一个宏任务：从宏任务队列中取出第一个任务（如整个主脚本），推入调用栈执行。
2. 清空微任务队列：当前宏任务执行完毕后，检查微任务队列。如果有任务，则依次全部执行完毕。
3. UI 渲染：如果浏览器判断需要更新页面，则进行重排（Reflow）和重绘（Repaint）。
4. 开始下一个宏任务：进入下一次事件循环，从宏任务队列中取出下一个任务。

### 示例

```js
console.log('A: 同步代码 - Start');

setTimeout(() => {
    console.log('D: 宏任务 - setTimeout 1'); // 宏任务 A
    Promise.resolve().then(() => {
        console.log('E: 微任务 - 宏任务中产生的微任务'); // 微任务 Z
    });
}, 0);

Promise.resolve().then(() => {
    console.log('B: 微任务 - Promise 1'); // 微任务 X
    setTimeout(() => {
        console.log('F: 宏任务 - 微任务中产生的宏任务'); // 宏任务 B
    }, 0);
});

Promise.resolve().then(() => {
    console.log('C: 微任务 - Promise 2'); // 微任务 Y
});

console.log('A: 同步代码 - End');
```

```md
A: 同步代码 - Start
A: 同步代码 - End
B: 微任务 - Promise 1
C: 微任务 - Promise 2
D: 宏任务 - setTimeout 1
E: 微任务 - 宏任务中产生的微任务
F: 宏任务 - 微任务中产生的宏任务
```

+ 阶段一：第一次宏任务（主脚本）执行

    1. A (Start) 和 A (End)：同步代码最先执行，立即输出。
    2. setTimeout 1 (D)：进入 Web API，计时结束后，回调函数进入 宏任务队列 (队列末尾：[D])。
    3. Promise 1 (B)：then 回调进入 微任务队列 (队列末尾：[B])。
    4. Promise 2 (C)：then 回调进入 微任务队列 (队列末尾：[B, C])。

+ 阶段二：清空微任务队列
当前宏任务（主脚本）执行完毕，立即清空微任务队列：

    5. 执行 B：输出 B。在 B 中，setTimeout 2 (F) 被调用，其回调进入 宏任务队列 的末尾 (队列变为：[D, F])。
    6. 执行 C：输出 C。

+ 阶段三：下一轮宏任务（执行 D）
微任务队列清空后，事件循环进入下一轮，取出宏任务队列的第一个任务 D：

    7. 执行 D：输出 D。在 D 中，Promise 被调用，其 then 回调 (E) 进入 微任务队列 (队列变为：[E])。

+ 阶段四：清空微任务队列
宏任务 D 执行完毕，再次检查并清空微任务队列：

    8. 执行 E：输出 E。

+ 阶段五：下一轮宏任务（执行 F）
微任务队列清空后，事件循环进入下一轮，取出宏任务队列的下一个任务 F：

    9. 执行 F：输出 F。
