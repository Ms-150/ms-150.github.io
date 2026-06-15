# js 核心

## 作用域链
JS 的本质，其实就是“变量查找规则”。

而作用域链：

就是 JS 的“变量搜索系统”。

作用域链 = 当前执行环境能“向外一层层”查找变量的那条链式结构。

### 作用域链到底是什么（底层定义）
当 JS 执行一段代码时，会创建一个 执行上下文（Execution Context）。
每个执行上下文都有一个 词法环境（Lexical Environment）。

词法环境包含两部分：

+ Environment Record（当前作用域的变量）
+ Outer Environment Reference（指向外层作用域）

作用域链就是：沿着 Outer Environment Reference 一层层向外查找变量的链。

“由内向外找。”

```js
let a = 1

function test() {
  let b = 2

  console.log(a)
  console.log(b)
}

test()
// a 是全局作用域
// b 是函数作用域
```

::: code-group 

```js [全局作用域]
const name = 'Tom'
// 全局都能访问
```

```js [函数作用域]
function test() {
  const age = 18
}
// 外部访问不到
```

```js [块级作用域（ES6）]
if (true) {
  let a = 1
}
// 外部访问不到
```

::: 

### 作用域链与 this 完全无关。

+ 作用域链：由代码结构决定（静态）
+ this：由调用方式决定（动态）

### 词法作用域

在“定义时”决定。
不是"调用位置"决定

```js
const a = 1

function test() {
  console.log(a)
}

function outer() {
  const a = 2

  test()
}

outer()
// 1
```
作用域链本质图

```
inner
  ↓
outer
  ↓
global
  ↓
null
```