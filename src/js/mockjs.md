# Mockjs

一个用于生成随机数据和拦截 Ajax 请求的库。

[http://mockjs.com/](http://mockjs.com/)

[https://github.com/nuysoft/Mock](https://github.com/nuysoft/Mock)

## install

```bash
npm install mockjs —D
```

## usage

- 基本使用

1. 生成随机数据

```js
import Mock from "mockjs";

// 生成一个随机的名字
const name = Mock.mock("@name");
console.log(name);

// 生成一个随机的年龄
const age = Mock.mock("@integer(20, 50)");
console.log(age);

// 生成一个随机的对象
const user = Mock.mock({
  "id|1-100": 1,
  name: "@name",
  age: "@integer(20, 50)",
});
console.log(user);
```

2. 拦截 Ajax 请求

```js
import Mock from "mockjs";

// 拦截 GET 请求并返回模拟数据
Mock.mock("/api/user", "get", {
  code: 200,
  message: "success",
  data: {
    "id|1-100": 1,
    name: "@name",
    age: "@integer(20, 50)",
  },
});

// 发起请求
fetch("/api/user")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Fetch error:", error));
```

### example

::: code-group

```js [vite.config.js]
import { viteMockServe } from "vite-plugin-mock";

viteMockServe({
  mockPath: "mock",
  localEnabled: true, // 开发环境启用 mock
}),
```

```js [mock/index.js]
export default [
  {
    url: "/api/user",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "success",
        data: {
          id: 1,
          name: "John Doe",
          age: 30,
        },
      };
    },
  },
];
```

```js [main.js]
import "../mock";
```

```js [app.jsx]
useEffect(() => {
  fetch("/api/user")
    .then((response) => response.json())
    .then((data) => console.log(data));
}, []);
```

:::

## 数据生成

基本数据类型

前端 模拟数据生成器
后台 帮助编写单元测试

根据数据模版生成模拟数据
模拟（拦截）Ajax 请求 生成并返回模拟数据
基于 HTML 模版生成模拟数据

Mock.mock(rurl,rtype?,template|function(options))
rurl 要拦截的 url 地址
rtype 拦截的 Ajax 的请求方式 get|post
template | function(options) 模版数据 | 生成响应数据的函数

模版定义规范
数据模版定义 DTD,数据占位符定义

数据模版定义规范（DTD）
每个属性由三部分构成：属性名 生成规则 属性值

```js
<script src="mock-min.js"></script>	//先引入mock.js
<script src="1.js"></script>		//再引入生成数据的js

var data2 = {
        "userInfo|4":[{    //生成|num个如下格式名字的数据
            "id|+1":1,  	//数字从当前数开始后续依次加一
            "name":"@cname",    //名字为随机中文名字
            "ago|18-28":25,   	 //年龄为18-28之间的随机数字
            "sex|1":["男","女"], 	//性别是数组中的一个，随机的
            "job|1":["web","UI","python","php"]    //工作是数组中的一个

        }]
      }

Mock.mock(
  "http://www.qhdlink-student.top/student/coacha.php","post", data2
)
```
