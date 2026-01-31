# kafka

一个开源的分布式事件流媒体平台，被数千家公司用于高性能数据流管线、流分析、数据集成和关键任务应用。

[https://kafka.apache.org/](https://kafka.apache.org/)

## 核心概念
+ `topic`  主题）
    消息分类容器。

+ `Partition`  分区
    + Topic 的水平扩展单位
    + 分区内消息有严格顺序
    + 分区越多，吞吐越高

+ `Broker` 
    服务器节点。

+ `Replication`  副本
  + leader：负责读写
  + follower：同步 leader
  + 副本越多，容错越强
  
+ `Consumer Group`  消费者组
  + 同组消费者共享分区
  + 每个分区同一时刻只会被一个消费者消费
  + 组内自动负载均衡

+ `Offset`  偏移量
    消费者在分区中的位置。

+ `Producer`  生产者
    发送消息。

+ `Consumer`  消费者
    消费消息。


## 架构 KRaft 模式

 现在默认使用 KRaft（不再依赖 Zookeeper）：
+ controller 负责元数据管理
+ broker 负责读写
+ Raft 协议保证一致性
 
### + 单节点：
broker + controller 在同一个节点

### + 多节点：
多个 controller 组成 quorum（多数派）

## install

::: code-group

```yml [docker-compose.yml]
services:
  kafka:
    image: apache/kafka:latest
    container_name: kafka
    hostname: kafka
    ports:
      - "9092:9092"
    environment:
      # KRaft 模式核心配置
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
```

```bash
docker-compose up -d
```

:::


### kafkajs

[https://kafka.js.org/](https://kafka.js.org/)

::: code-group

```bash
npm install kafkajs
```

```js [producer.js]
import { Kafka, CompressionTypes } from "kafkajs";

// 1 创建客户端实例
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
})

// 2 创建生产者
const producer = kafka.producer()

// 3 连接生产者
await producer.connect()

// 4 发送消息
await producer.send({ 
    topic: 'test-topic',
    compression: CompressionTypes.GZIP, // 可选的压缩类型 GZIP | Snappy | LZ4 | ZSTD
    messages: [
        {
            value: 'Hello KafkaJS user!',
            headers: { key1: 'value1', key2: 'value2' } // 可选的消息头
        },
        { value: Buffer.from('Hello KafkaJS buffer!') },
    ],
})
// 批量发送消息
// await producer.sendBatch({
//     topicMessages: [
//         {
//             topic: 'test-topic-1',
//             messages: [
//                 {
//                     value: 'Hello test-topic-1!',
//                     headers: { key1: 'value1', key2: 'value2' } // 可选的消息头
//                 },
//                 { value: Buffer.from('Hello KafkaJS buffer! - batch1') },
//             ],
//         },
//         {
//             topic: 'test-topic-2',
//             messages: [
//                 { value: 'Hello test-topic-2!' },
//             ],
//         },
//     ],
// });

// 5 断开连接
await producer.disconnect()
```

```js [consumer.js]
import { Kafka } from "kafkajs";

// 1. 创建客户端实例
const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
});

// 2. 创建消费者 
const consumer = kafka.consumer({ groupId: "test-groupId" })

// 3. 连接消费者
await consumer.connect();

// 4. 订阅主题
/**
 * @param {string} topic 订阅的主题名称
 * @param {boolean} fromBeginning: true 从头开始消费消息 false  消费订阅之后发送的消息
 */
await consumer.subscribe({ topic: "test-topic-1", fromBeginning: false });

await consumer.subscribe({ topic: "test-topic-2", fromBeginning: false });

// 5. 运行消费者
await consumer.run({
    // 单条消息处理
    eachMessage: async ({ topic, partition, message }) => {
        console.log({
            topic,
            partition,
            value: message.value?.toString(),
            headers: message.headers?.key1?.toString(), // 读取消息头
        });
    }
    // 批量消息处理
    // eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
    //     batch.messages.forEach(message => {
    //         console.log({
    //             topic: batch.topic,
    //             partition: batch.partition,
    //             value: message.value?.toString(),
    //             headers: message.headers?.key1?.toString(), // 读取消息头
    //         });
    //     });
    // }
});
```

:::

### 配置

+ #### CompressionTypes 压缩

| 压缩类型 | 特点                             | 适用场景                     |
| -------- | -------------------------------- | ---------------------------- |
| `GZIP`   | 压缩率最高，但 CPU 开销较大      | 磁盘空间紧张，对延迟要求稍低 |
| `Snappy` | 压缩率适中，速度极快，CPU 开销低 | 最常用，兼顾吞吐量和性能     |
| `LZ4`    | 性能极佳，专门为速度优化         | 对实时性要求极高的场景       |
| `ZSTD`   | 新型算法，压缩率和速度都很平衡   | 较新版本的 Kafka 推荐使用    |

+ #### headers 模式
    Headers 的值可以是 字符串 或 Buffer。

::: code-group

```js [producer.js]
import { Kafka, CompressionTypes } from "kafkajs";

// 1 创建客户端实例
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
})

// 2 创建生产者
const producer = kafka.producer()

// 3 连接生产者
await producer.connect()

// 4 发送消息
await producer.send({
    topic: 'test-topic',
    compression: CompressionTypes.GZIP, // 可选的压缩类型
    messages: [
        {
            value: 'Hello KafkaJS user!',
            headers: { key1: 'value1', key2: 'value2' } // 可选的消息头
        },
        { value: Buffer.from('Hello KafkaJS buffer!') },
    ],
})

// 5 断开连接
await producer.disconnect()
```

```js [consumer.js]
import { Kafka } from "kafkajs";

// 1. 创建客户端实例
const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
});

// 2. 创建消费者 
const consumer = kafka.consumer({ groupId: "test-topic" })

// 3. 连接消费者
await consumer.connect();

// 4. 订阅主题
/**
 * @param {string} topic 订阅的主题名称
 * @param {boolean} fromBeginning: true 从头开始消费消息 false  消费订阅之后发送的消息
 */
await consumer.subscribe({ topic: "test-topic", fromBeginning: false });

// 5. 运行消费者
await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log({
            topic,
            partition,
            value: message.value?.toString(),
            headers: message.headers?.key1?.toString(), // 读取消息头
        });
    }
});
```

:::

### 集群
`KRaft` = Kafka 内置的元数据管理 + Raft 协议 → 完全替代 Zookeeper。

::: code-group

```yml [docker-compose.yaml]
services:
  kafka-1:
    image: apache/kafka:latest
    container_name: kafka-1
    hostname: kafka-1
    environment:
      - KAFKA_NODE_ID=1
      - KAFKA_PROCESS_ROLES=broker,controller
      - KAFKA_CLUSTER_ID=abcdefghijklmnopqrstuv
      - KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka-1:9093,2@kafka-2:9093,3@kafka-3:9093

      - KAFKA_LISTENERS=INTERNAL://:19092,EXTERNAL://:9092,CONTROLLER://:9093
      - KAFKA_ADVERTISED_LISTENERS=INTERNAL://kafka-1:19092,EXTERNAL://localhost:9092
      - KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT,CONTROLLER:PLAINTEXT
      - KAFKA_INTER_BROKER_LISTENER_NAME=INTERNAL

      - KAFKA_LOG_DIRS=/var/lib/kafka/data
    ports:
      - "9092:9092"
    volumes:
      - kafka1_data:/var/lib/kafka/data

  kafka-2:
    image: apache/kafka:latest
    container_name: kafka-2
    hostname: kafka-2
    environment:
      - KAFKA_NODE_ID=2
      - KAFKA_PROCESS_ROLES=broker,controller
      - KAFKA_CLUSTER_ID=abcdefghijklmnopqrstuv
      - KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka-1:9093,2@kafka-2:9093,3@kafka-3:9093

      - KAFKA_LISTENERS=INTERNAL://:19092,EXTERNAL://:9092,CONTROLLER://:9093
      - KAFKA_ADVERTISED_LISTENERS=INTERNAL://kafka-2:19092,EXTERNAL://localhost:9093
      - KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT,CONTROLLER:PLAINTEXT
      - KAFKA_INTER_BROKER_LISTENER_NAME=INTERNAL

      - KAFKA_LOG_DIRS=/var/lib/kafka/data
    ports:
      - "9093:9092"
    volumes:
      - kafka2_data:/var/lib/kafka/data

  kafka-3:
    image: apache/kafka:latest
    container_name: kafka-3
    hostname: kafka-3
    environment:
      - KAFKA_NODE_ID=3
      - KAFKA_PROCESS_ROLES=broker,controller
      - KAFKA_CLUSTER_ID=abcdefghijklmnopqrstuv
      - KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka-1:9093,2@kafka-2:9093,3@kafka-3:9093

      - KAFKA_LISTENERS=INTERNAL://:19092,EXTERNAL://:9092,CONTROLLER://:9093
      - KAFKA_ADVERTISED_LISTENERS=INTERNAL://kafka-3:19092,EXTERNAL://localhost:9094
      - KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT,CONTROLLER:PLAINTEXT
      - KAFKA_INTER_BROKER_LISTENER_NAME=INTERNAL

      - KAFKA_LOG_DIRS=/var/lib/kafka/data
    ports:
      - "9094:9092"
    volumes:
      - kafka3_data:/var/lib/kafka/data

volumes:
  kafka1_data:
  kafka2_data:
  kafka3_data:

```

```bash
docker compose up -d
```

```js [producer.js]
import { Kafka } from "kafkajs";

// 1 创建客户端实例
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
})

// 2 创建客户端管理
const admin = await kafka.admin()
await admin.connect()

// 3 获取集群信息
const cluster = await admin.describeCluster()
console.log(cluster);

await new Promise(resolve => setTimeout(resolve, 5000));

// // 4 创建主题
try {
    await admin.createTopics({
        topics: [
            { topic: 'AAA-topic', numPartitions: 3, replicationFactor: 2 },
            { topic: 'BBB-topic', numPartitions: 2, replicationFactor: 2 },
        ],
        waitForLeaders: true,
    });
    console.log('主题创建成功');
} catch (error) {
    // 错误代码为 36 代表 TopicAlreadyExistsException
    if (error.code === 36) {
        console.log('主题已存在，跳过创建步骤，直接进入生产环节...');
    } else {
        console.error('创建主题时发生其他错误:', error);
    }
}

// // 删除主题
// await admin.deleteTopics({
//     topics: ['test-topic-3']
// })

// 5 获取主题列表
// const topics = await admin.listTopics()
// console.log(topics);

// // 6 断开连接
await admin.disconnect()

// 2 创建生产者
// 事务管理
const producer = kafka.producer({
    transactionalId: `my-transactional-id-${Date.now()}`,  // 事务 ID，全局唯一
    maxInFlightRequests: 1, // 保证消息顺序
    // idempotent: true, // 开启幂等性 
    // retry: {
    //     retries: 5, // 重试次数
    //     initialRetryTime: 300, // 初始重试时间
    // }
})
// 3 连接生产者
await producer.connect()

// await producer.send({ topic: "AAA-topic", messages: [{ value: "test" }] })

// 4 创建事务
const transactional = await producer.transaction()

// 5 发送消息
try {
    await transactional.send({
        topic: 'AAA-topic',
        messages: [
            { value: 'A+100' },
        ],
    })
    await transactional.send({
        topic: 'BBB-topic',
        messages: [
            { value: 'B-100' },
        ],
    })
    // 提交事务
    await transactional.commit()
} catch (error) {
    // 回滚事务
    await transactional.abort()
} finally {
    // 断开连接
    await producer.disconnect()
}

```

```js [consumer.js]
import { Kafka } from "kafkajs";

// 1. 创建客户端实例
const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092", "localhost:9093", "localhost:9094"],
});

// 2. 创建消费者 
const consumer = kafka.consumer({
    groupId: "my-test-group",
    readUncommitted: false, // 读取已提交的消息
})

// 3. 连接消费者
await consumer.connect();

// 4. 订阅主题
/**
 * @param {string} topic 订阅的主题名称
 * @param {boolean} fromBeginning: true 从头开始消费消息 false  消费订阅之后发送的消息
 */
await consumer.subscribe({ topic: "AAA-topic", fromBeginning: false });

await consumer.subscribe({ topic: "BBB-topic", fromBeginning: false });

// 5. 运行消费者
await consumer.run({
    // 单条消息处理
    eachMessage: async ({ topic, partition, message }) => {
        console.log({
            topic,
            partition,
            value: message.value?.toString(),
            headers: message.headers?.key1?.toString(), // 读取消息头
        });
    }
    // 批量消息处理
    // eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
    //     batch.messages.forEach(message => {
    //         console.log({
    //             topic: batch.topic,
    //             partition: batch.partition,
    //             value: message.value?.toString(),
    //             headers: message.headers?.key1?.toString(), // 读取消息头
    //         });
    //     });
    // }
});
```

:::
