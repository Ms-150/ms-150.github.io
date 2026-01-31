# Fastify

高性能、低开销、插件化 的 Node.js  Web 框架。

[https://fastify.dev/](https://fastify.dev/)

## 核心特点

1. 极快（比 `Express` 快很多）
    Fastify 内部使用高性能 JSON 序列化器、schema 编译器等优化手段，吞吐量非常高。
    极快：吞吐量比 Express 高 2–4 倍

2. Schema 驱动（自动校验 + 自动生成文档）
    可以给路由加 JSON Schema：
    + 自动校验请求参数
    + 自动生成 Swagger 文档
    + 自动序列化响应（更快）

3. 插件化架构（比 `Express` 更干净）
     Fastify 的插件系统非常强大：
   + 业务模块可以拆成独立插件
   + 生命周期清晰
   + 插件之间隔离性强

4. TypeScript 支持一流
    如果你写 TS，Fastify 的类型体验比 `Express` 好太多。

5. 生态完善
   + `fastify-cors`
   + `fastify-jwt`
   + `fastify-static`
   + `fastify-swagger`
   + `fastify-multipart`
   + `fastify-redis`
   + `fastify-mongodb`

适合你在生产环境中构建：
+ REST API
+ 微服务
+ BFF（Backend For Frontend）
+ Serverless 函数

## install

```bash
npm i fastify
```

```bash
# 推荐项目结构
project/
  ├── src/
  │     ├── app.js               # Fastify 实例
  │     ├── server.js            # 启动入口
  │     ├── plugins/
  │     │     ├── db.js          # 数据库插件
  │     │     ├── jwt.js         # JWT 插件
  │     │     └── cors.js        # CORS
  │     ├── routes/
  │     │     ├── user.route.js  # 用户路由
  │     │     └── auth.route.js  # 登录路由
  │     ├── services/
  │     │     └── user.service.js
  │     ├── schemas/
  │     │     └── user.schema.js
  │     ├── utils/
  │     │     └── password.js
  │     └── config/
  │           └── index.js        # 配置管理
  ├── .env
  └── package.json
```

## usage

```js
import Fastify from 'fastify';

const app = Fastify({
//  开启日志 
//   logger: true
});

app.get('/', async (req, reply) => {
  return { hello: 'world' };
});

app.listen({ port: 3000 }, () => {
  console.log('Fastify running at http://localhost:3000');
});
```

### 路由（Routes）

+ app.get()
+ app.post()
+ app.put()
+ app.delete()
+ app.patch()
+ app.options()
+ app.head()

::: code-group

```js [1. 基础路由]
app.get('/hello', async (req, reply) => {
  return { msg: 'Hello Fastify' };
});
```

```js [2. 路由参数]
app.get('/user/:id', async (req, reply) => {
  const { id } = req.params;
  return { userId: id };
});

// GET /user/123
```

```js [3. Query 参数]
app.get('/search', async (req, reply) => {
  const { keyword } = req.query;
  return { keyword };
});

// GET /search?keyword=fastify
```

```js [4. POST body]
// Fastify 默认支持 JSON body：

app.post('/login', async (req, reply) => {
  const { username, password } = req.body;
  return { username };
});
```

```js [5. 路由分组]
app.register(async function (router) {
  router.get('/a', async () => ({ msg: 'A' }));
  router.get('/b', async () => ({ msg: 'B' }));
}, { prefix: '/api' });

// /api/a
// /api/b
```
:::

### Schema（Fastify 的核心优势之一）

Fastify 强调 JSON Schema，用于：
+ 请求校验 
+ 响应校验 
+ 自动生成 API 文档（Swagger） 
+ 性能优化（提前编译序列化器）

::: code-group

```js [校验 body]
app.post('/login', {
  schema: {
    body: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      }
    }
    response: { 
        201: { 
            type: 'object', 
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' }
            } 
        }
    }
  }
}, async (req, reply) => {
  return { ok: true }
})

// 如果 body 不符合 schema，Fastify 会自动返回 400。
```
:::


### 插件（Plugin）系统
 插件机制是它的灵魂，适合构建大型项目。

::: code-group

```js [server.js]
import Fastify from 'fastify';
import userRoutes from './routes/user.js';

const app = Fastify();

app.register(userRoutes, { prefix: '/user' });

app.listen({ port: 3000 });
```

```js [routes/user.js]
export default async function (app) {
  app.get('/info', async () => ({ user: 'Tom' }));
}

// /user/info
```

```js [通配符路由]
app.get('/files/*', async (req, reply) => {
  return { path: req.params['*'] };
});

// /files/a/b/c.txt
```

```js [路由级别的钩子（beforeHandler）]
app.get('/admin', {
  preHandler: async (req, reply) => {
    if (!req.headers.token) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  }
}, async () => {
  return { admin: true };
});
```
:::

### Fastify 生命周期（Hooks）

| Hook               | 说明       |
| ------------------ | ---------- |
| `onRequest`        | 请求刚进入 |
| `preParsing`       | 解析前     |
| `preValidation`    | 校验前     |
| `preHandler`       | 处理前     |
| `preSerialization` | 序列化前   |
| `onSend`           | 发送前     |
| `onResponse`       | 响应结束   |
| `onError`          | 出错时     |


::: code-group
```js [错误处理]
app.setErrorHandler((error, req, reply) => {
  reply.code(500).send({
    error: error.message
  });
});
```

```js [404 处理]
app.setNotFoundHandler((req, reply) => {
  reply.code(404).send({ error: 'Not Found' });
});

```

:::

### CORS、静态资源、文件上传

1. CORS（跨域）
::: code-group

```bash 
npm i @fastify/cors
```

```js
// 启用跨域
app.register(import('@fastify/cors'), {
  origin: '*', // 或指定域名
  methods: ['GET', 'POST']
});
```
:::

1. 静态资源托管（Static）
::: code-group
```bash
npm i @fastify/static
```

```js
import path from 'path';
import fastifyStatic from '@fastify/static';

// 静态资源目录：public/
app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'public'),
  prefix: '/static/' // 访问路径前缀
});

// 访问示例：/static/logo.png
```
:::

3. 文件上传（Multipart）

::: code-group
```bash
npm i @fastify/multipart
```

```js
import multipart from '@fastify/multipart';

app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制 10MB
  }
});

// 接收文件
app.post('/upload', async (req, reply) => {
  const data = await req.file(); // 单文件
  const buffer = await data.toBuffer();

  return { filename: data.filename, size: buffer.length };
});
```
:::

### 自动生成 Swagger 文档

::: code-group

```bash
npm install @fastify/swagger @fastify/swagger-ui
```

```js
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

app.register(swagger, {
  openapi: {
    info: {
      title: 'API Docs',
      version: '1.0.0'
    }
  }
})

app.register(swaggerUI, { routePrefix: '/docs' })

// 访问 /docs
```

:::