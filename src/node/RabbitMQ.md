## RabbitMQ

[https://www.rabbitmq.com/](https://www.rabbitmq.com/)

基于 AMQP 协议的高可靠消息队列，用于实现服务之间的异步通信、削峰填谷、解耦、提高系统吞吐等。

它由 Erlang 编写，具备高可用、可扩展、可靠性强等特点。

## 核心概念（必须掌握）

| 概念           | 说明                             |
| -------------- | -------------------------------- |
| `Producer`     | 生产者，发送消息                 |
| `Consumer`     | 消费者，接收消息                 |
| `Queue`        | 队列，消息存储的地方             |
| `Exchange`     | 交换机，决定消息路由方式         |
| `Binding`      | 绑定规则（队列如何绑定到交换机） |
| `Routing Key`  | 路由键，用于匹配消息路由         |
| `Virtual Host` | 虚拟空间，用于权限隔离           |

RabbitMQ 的强大之处在于：生产者不会直接把消息发到队列，而是发到 Exchange，由 Exchange 决定消息路由到哪个队列。

### 常见用法

1. 异步任务处理
    例如：发送邮件、生成报告、图像处理。
2. 事件驱动架构（EDA）
    服务之间通过事件解耦。
3. 延迟队列
    订单超时取消、支付超时等。
4. RPC（远程调用）
    RabbitMQ 支持 RPC 模式，但不推荐用于高并发。

## install 

```bash [Docker]
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:4-management

# 可视化面板 http://localhost:15672
# 用户名/密码 guest
```

## usage

1. 安装依赖
```bash
npm install express amqplib

```

2. 创建 RabbitMQ 客户端（连接池）

```js [rabbitmq.js]
import amqp from 'amqplib';

let connection;
let channel;

export async function getChannel() {
  if (channel) return channel;

  connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();

  // 保证队列存在
  await channel.assertQueue('demo.queue', { 
    durable: true  // 队列持久化（重启后队列还在）
  });

  return channel;
}
```

3. Express 服务：提供一个发送消息的 API

```js
import express from 'express';
import { getChannel } from './rabbitmq.js';

const app = express();
app.use(express.json());

app.post('/send', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  const ch = await getChannel();
  ch.sendToQueue('demo.queue', Buffer.from(message), { 
    persistent: true  // 消息持久化（重启后消息还在）消息会写入磁盘
  });

  res.json({ status: 'sent', message });
});

app.listen(3000, () => {
  console.log('Express server running on http://localhost:3000');
});
```

4. 消费者（独立进程）

```js
import { getChannel } from './rabbitmq.js';

const run = async () => {
  const ch = await getChannel();

  console.log('Waiting for messages...');

  ch.consume('demo.queue', msg => {
    const content = msg.content.toString();
    console.log('Received:', content);

    // 业务逻辑处理
    // ...

    ch.ack(msg);
  });
};

run();
```

5. 运行

```bash
node server.js
node consumer.js

curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"message": "hello rabbit"}'
```

## 发布订阅

一条消息 → 多个消费者都能收到（广播）。

### 发布订阅模式的结构
RabbitMQ 在 Pub/Sub 中引入了 Exchange（交换机）：

| 角色       | 说明                          |
| ---------- | ----------------------------- |
| `Producer` | 发布消息到 Exchange（交换机） |
| `Exchange` | 将消息广播到所有绑定队列      |
| `Queue`    | 每个消费者一个独立队列        |
| `Consumer` | 从自己的队列消费消息          |

### 模式

| 类型      | 行为                   | 是否用 routing key | 常见用途                 |
| --------- | ---------------------- | ------------------ | ------------------------ |
| `fanout`  | 广播消息到所有绑定队列 | ❌ 忽略             | 发布订阅、日志广播       |
| `direct`  | 精准匹配 routing key   | ✅ 精准匹配         | 事件分发、按级别路由     |
| `topic`   | 模糊匹配（支持通配符） | ✅ 支持 `*` `#`     | 微服务事件总线、复杂路由 |
| `headers` | 按消息头匹配           | ❌ 不用 routing key | 元数据路由、复杂过滤     |

#### example

::: code-group

```js [produce.js]
import amqplib from 'amqplib';

// 1. 连接 MQ
const connection = await amqplib.connect('amqp://localhost:5672');

// 2. 创建频道
const channel = await connection.createChannel();

// 3. 创建交换机
/**
 * @param {string} exchangeName 交换机名称
 * @param {string} type 交换机类型 direct|topic|headers|fanout
 * @param  {options} options 可选 交换机配置
 */
// 4 种模式创建交换机
await channel.assertExchange('direct_exchange', 'direct');
await channel.assertExchange('topic_exchange', 'topic');
await channel.assertExchange('headers_exchange', 'headers');
await channel.assertExchange('fanout_exchange', 'fanout');

// 4. 发送消息
/**
 * @param {string} exchange 交换机名称
 * @param {string} routingKey 路由键 
 * @param {Buffer} content 消息内容
 * @param {options} options 可选 消息配置
 */

// 4 种模式发送消息
channel.publish('direct_exchange', 'routing_key_1', Buffer.from('Hello Direct Exchange!'));
channel.publish('topic_exchange', 'user.update.info', Buffer.from('Hello Topic Exchange!'));
channel.publish('headers_exchange', '', Buffer.from('Hello Headers Exchange!'), {
    headers: {
        type: 'log',
        level: 'info'
    }
});
channel.publish('fanout_exchange', '', Buffer.from('Hello Fanout Exchange!'));

// 5. 关闭连接 
await channel.close();
await connection.close();

process.exit(0);
```

```js [customer.js]
import amqplib from 'amqplib';

// 1. 连接 MQ
const connection = await amqplib.connect('amqp://localhost:5672');

// 2. 创建频道
const channel = await connection.createChannel();

// 3. 创建交换机
// 4 种模式创建交换机
await channel.assertExchange('direct_exchange', 'direct');
await channel.assertExchange('topic_exchange', 'topic');
await channel.assertExchange('headers_exchange', 'headers');
await channel.assertExchange('fanout_exchange', 'fanout');

// 4. 创建队列
/**
 * @param {string} queue 队列名称
 * @param {options} options 可选 队列配置
 * @return {object} string 队列信息
 */
const { queue } = await channel.assertQueue('demo.queue', { durable: true });

// 5. 绑定队列到交换机，指定路由键
/**
 * @param {string} queue 队列名称
 * @param {string} exchange 交换机名称
 * @param {string} pattern 路由键
 * @param {object} args 绑定参数
 */
// 4 种模式绑定队列
channel.bindQueue(queue, 'direct_exchange', 'routing_key_1');
channel.bindQueue(queue, 'topic_exchange', 'user.*');
channel.bindQueue(queue, 'headers_exchange', '', {
    type: 'log',
    level: 'info'
});
channel.bindQueue(queue, 'fanout_exchange', '');

// 6. 消费消息
channel.consume(queue, (msg) => {
    console.log(msg.content.toString());
}, {
    noAck: true // 是否自动确认消息
}
);
```

```js [customer2.js]
import amqplib from 'amqplib';

// 1. 连接 MQ
const connection = await amqplib.connect('amqp://localhost:5672');

// 2. 创建频道
const channel = await connection.createChannel();

// 3. 创建交换机
// 4 种模式创建交换机
await channel.assertExchange('direct_exchange', 'direct');
await channel.assertExchange('topic_exchange', 'topic');
await channel.assertExchange('headers_exchange', 'headers');
await channel.assertExchange('fanout_exchange', 'fanout');

// 4. 创建队列
/**
 * @param {string} queue 队列名称
 * @param {options} options 可选 队列配置
 * @return {object} string 队列信息
 */
const { queue } = await channel.assertQueue('demo.queue2', { durable: true });

// 5. 绑定队列到交换机，指定路由键
/**
 * @param {string} queue 队列名称
 * @param {string} exchange 交换机名称
 * @param {string} pattern 路由键
 */
// 4 种模式绑定队列
channel.bindQueue(queue, 'direct_exchange', 'routing_key_1');
channel.bindQueue(queue, 'topic_exchange', 'user.*');
channel.bindQueue(queue, 'headers_exchange', '', {
    type: 'log',
    level: 'info'
});
channel.bindQueue(queue, 'fanout_exchange', '');

// 6. 消费消息
channel.consume(queue, (msg) => {
    console.log(msg.content.toString());
}, {
    noAck: true // 是否自动确认消息
}
);
```

:::

::: warning
topic 路由键必须是以 点号 `.` 分隔的单词列表。

+ `*` (星号)：正好匹配一个单词。
+ `#` (井号)：匹配零个或多个单词。
:::

### 延迟消息

::: code-group

```bash [1. 下载插件 宿主机执行]
curl -L -O https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v4.2.0/rabbitmq_delayed_message_exchange-4.2.0.ez
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 42795  100 42795    0     0  33690      0  0:00:01  0:00:01 --:--:--  484k
```

```bash [2. 拷贝到容器中]
docker cp rabbitmq_delayed_message_exchange-4.2.0.ez rabbitmq:/opt/rabbitmq/plugins/
Successfully copied 44.5kB to rabbitmq:/opt/rabbitmq/plugins/
```

```bash [3. 启动]
docker exec -it rabbitmq /bin/bash

rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

:::

#### example

::: code-group

```js [producer.js]
import amqplib from 'amqplib';

// 1. 连接 MQ
const connection = await amqplib.connect('amqp://localhost:5672');

// 2. 创建频道
const channel = await connection.createChannel();

// 3. 创建交换机
/**
 * @param {string} exchangeName 交换机名称
 * @param {string} type 交换机类型 direct|topic|headers|fanout
 * @param  {options} options 可选 交换机配置
 */

await channel.assertExchange('delayed_exchange', 'x-delayed-message', {
    durable: true,
    arguments: { 'x-delayed-type': 'direct' } // 指定底层交换机类型
});

// 4. 发送消息
/**
 * @param {string} exchange 交换机名称
 * @param {string} routingKey 路由键 
 * @param {Buffer} content 消息内容
 * @param {options} options 可选 消息配置
 */

channel.publish('delayed_exchange', 'delayed_key', Buffer.from('Hello Delayed Message!'), {
    headers: {
        'x-delay': 5000 // 延迟时间，单位毫秒
    }
});

// 5. 关闭连接 
await channel.close();
await connection.close();

process.exit(0);
```

```js [consumer.js]
import amqplib from 'amqplib';

// 1. 连接 MQ
const connection = await amqplib.connect('amqp://localhost:5672');

// 2. 创建频道
const channel = await connection.createChannel();

// 3. 创建交换机
await channel.assertExchange('delayed_exchange', 'x-delayed-message', {
    durable: true,
    arguments: { 'x-delayed-type': 'direct' } // 指定底层交换机类型 
});

// 4. 创建队列
/**
 * @param {string} queue 队列名称
 * @param {options} options 可选 队列配置
 * @return {object} string 队列信息
 */
const { queue } = await channel.assertQueue('demo.queue', { durable: true });
  
// 5. 绑定队列到交换机，指定路由键
/**
 * @param {string} queue 队列名称
 * @param {string} exchange 交换机名称
 * @param {string} pattern 路由键
 * @param {object} args 绑定参数
 */
channel.bindQueue(queue, 'delayed_exchange', 'delayed_key');

// 6. 消费消息
channel.consume(queue, (msg) => {
    console.log(msg.content.toString());
}, {
    noAck: true // 是否自动确认消息
}
);

```

:::

