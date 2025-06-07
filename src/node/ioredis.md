# ioredis

一个流行的 Redis 客户端库，特别适用于 Node.js 环境，支持 Redis 集群、分布式 Redis 和事务等特性。
它提供了丰富的 API 和较高的性能，可以方便地与 Redis 服务器进行交互。

[https://www.npmjs.com/package/ioredis](https://www.npmjs.com/package/ioredis)

## install

```bash
npm install ioredis
```

## usage

```js
import Redis from "ioredis";

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

// string
redis.set("name", "123");
redis.get("name").then((res) => {
  console.log(res);
});
redis.setex("xxx", 5, "xxx");

// set
redis.sadd("myset", 1, 2, 3, 4, 5);
redis.smembers("myset").then((res) => {
  console.log(res);
});
redis.srem("myset", 5);

redis.sismember("myset", 8).then((res) => {
  console.log(res);
});

// hash
redis.hset("myhash", "name", "ms");
redis.hset("myhash", "age", 18);
redis.hset("myhash", "sex", 0);
redis.hdel("myhash", "sex");

redis.hgetall("myhash").then((res) => {
  console.log(res);
});

// list
redis.lpush("mylist", 1, 2, 3);
redis.rpush("mylist", 8, 9, 0);

redis.llen("mylist").then((res) => {
  console.log(res);
});

redis.lrange("mylist", 0, -1).then((res) => {
  console.log(res);
});
```

### 发布订阅

```js
import Redis from "ioredis";

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

const redis2 = new Redis({
  host: "localhost",
  port: 6379,
});

// 订阅频道
redis.subscribe("news").then((err, count) => {
  if (err) {
    console.error("Failed to subscribe:", err);
  } else {
    console.log(`Subscribed to ${count} channel(s).`);
  }
});
// 监听消息
redis.on("message", (channel, message) => {
  console.log(channel, message, "--- I am redis");
});

// 发布消息
redis2.publish("news", "I am redis2");
redis2.publish("news", "I am redis2");
```
