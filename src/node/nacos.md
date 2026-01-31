# Nacos 注册中心

一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。

[https://nacos.io/](https://nacos.io/)

## 核心功能
+ 配置管理
+ 服务发现

### 配置管理 (Config Service)  
+ 动态更新： 客户端通过 `subscribe`（推模式+长轮询）实时感知服务器端配置的变化，无需重启应用。
+ 配置隔离： 
    `Namespace` (命名空间)： 用于隔离环境（如：开发/测试/生产）。
    `Group` (分组)： 用于隔离业务或项目。
    `DataID` 具体的配置文件名。
+ 灰度发布： 可以只让一部分实例先应用新配置。

### 服务发现 (Naming Service)
+ 服务注册： 服务实例启动时把自己的 IP 和端口报给 Nacos。 
+ 服务发现： 消费者从 Nacos 拉取可用的服务列表。
+ 健康检查： Nacos 会定时检查服务还在不在，不在就把它踢出去。

## install

```bash
docker run --name nacos-standalone-derby \
    -e MODE=standalone \
    -e NACOS_AUTH_TOKEN=${your_nacos_auth_secret_token} \
    -e NACOS_AUTH_IDENTITY_KEY=${your_nacos_server_identity_key} \
    -e NACOS_AUTH_IDENTITY_VALUE=${your_nacos_server_identity_value} \
    -p 8080:8080 \
    -p 8848:8848 \
    -p 9848:9848 \
    -d nacos/nacos-server:latest

```

::: warning
+ 8080	Web 控制台 UI
+ 8848	HTTP API（服务注册、配置管理） 各语言 SDK、微服务
+ 9848	gRPC 长连接，用于心跳、推送、服务变更通知	Java/Go 客户端、Nacos 内部通信
:::

### usage

::: code-group

```bash
npm i nacos
```

```js [port.js]
import http from 'http'

http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ "message": "Hello World Port" }))
}).listen(8081, () => {
    console.log(`Server running at http://localhost:8081/`)
})
```

```js [user.js]
import http from 'http'

http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ "message": "Hello World user" }))
}).listen(8082, () => {
    console.log(`Server running at http://localhost:8082/`)
})
```

```js [register.js]
import Nacos from "nacos";

// 1. 创建 Nacos 实例
const nacos = new Nacos.NacosNamingClient({
    serverList: ["localhost:8848"],
    namespace: "public",
    logger: console
});

// 2. 等待就绪
await nacos.ready();

// 3. 注册服务
await nacos.registerInstance("port-service", {
    ip: "127.0.0.1",     // 服务 IP 
    port: 8081,     // 服务端口
    weight: 1,      // 服务权重
    enabled: true,  // 是否启用
    healthy: true,  // 是否健康
    metadata: {
        'nacos.healthcheck.type': "HTTP",   // 健康检查方式
        'nacos.healthcheck.url': "/health", // 健康检查地址
        'nacos.healthcheck.interval': "5",  // 健康检查间隔，单位为秒
        'nacos.healthcheck.timeout': "3"    // 健康检查超时时间，单位为秒
    },
});

await nacos.registerInstance("user-service", {
    ip: "127.0.0.1",     // 服务 IP 
    port: 8082,     // 服务端口
    weight: 1,      // 服务权重
    enabled: true,  // 是否启用
    healthy: true,  // 是否健康
    metadata: { 
        'nacos.healthcheck.type': "HTTP",   // 健康检查方式
        'nacos.healthcheck.url': "/health", // 健康检查地址
        'nacos.healthcheck.interval': "5",  // 健康检查间隔，单位为秒
        'nacos.healthcheck.timeout': "3"    // 健康检查超时时间，单位为秒
    },
}); 
```

```bash
node ./port.js
node ./user.js
node ./register.js
# http://localhost:8080/
# 服务管理 > 服务列表
```

:::

### 动态配置

1. 手动创建

    配置管理 > 配置列表 > 新建配置

2. 代码管理

::: code-group

```js [app.js]
import Express from 'express';
import Nacos from 'nacos';

const app = new Express();

const nacos = new Nacos.NacosConfigClient({
    serverAddr: "localhost:8848",
    namespace: 'public'
});

// 等待就绪
await nacos.ready();

/**
 * 发布配置
 * @param {string} DataID 配置内容
 * @param {string} Group 分组
 * @param {string} Content 配置值
 */
await nacos.publishSingle('type2', 'DEFAULT_GROUP', JSON.stringify({ "type": "666" }));

// 删除配置
await nacos.remove("type2", "DEFAULT_GROUP");

// 监听配置变化
await nacos.subscribe({ 'dataId': 'type', 'group': 'DEFAULT_GROUP' }, content => {
    console.log('配置有更新:', content);
});

app.get("/", async (req, res) => {
    /** 
     * 获取配置
     * @param {string} DataID 配置内容
     * @param {string} Group 分组
    */

    let content = await nacos.getConfig("type", "DEFAULT_GROUP");

    res.json({
        content: JSON.parse(content)
    });
});

app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000/`);
});
```

:::
