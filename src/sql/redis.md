# Redis

一个开源的`内存数据结构存储`，可以用作数据库、缓存和消息代理。

它支持多种数据结构，包括字符串、哈希、列表、集合、有序集合等，并提供了丰富的功能，如持久化、复制、高可用性、事务等。Redis 通常被用于构建高性能、可扩展的应用程序，它被广泛应用于各种场景，包括实时分析、队列、会话缓存等。

## install 安装

::: code-group

```bash [1. install]
brew install redis

brew services start redis
# or
redis-server
```

```bash [2. test connection]
redis-cli ping
>>>
PONG
```

```bash [3. launchd]
resdis-cli      # 连接到 Redis
>>>
127.0.0.1:6379>

# or 不同的主机或端口上连接
redis-cli -h <hostname> -p <port>

exit | Ctrl + C     # 退出
```

:::

## basic commands 基本命令

```sql
SET key value       -- 设置键值对
GET key             -- 获取值
DEL key             -- 删除键
KEYS pattern        -- 查找键
FLUSHDB             -- 清空数据库
EXPIRE key seconds  -- 设置过期时间 单位 s
TTL key             -- 查看键的剩余生存时间
EXISTS key          -- 检查键是否存在
DBSIZE              -- 查看所有数据库中的键值
TYPE key            -- 检查键的类型
```

## 数据类型

- `String` 字符串
- `Hash` 哈希
- `List` 列表
- `Set` 集合
- `Sorted Set` 有序集合
- `Bitmaps` 位图

### 字符串（String）

`字符串`是 Redis 最简单的数据类型，可以存储`任意类型`的数据，如文本、数字、JSON 等。
字符串类型是二进制安全的，意味着 Redis 的字符串可以包含任意的数据，包括图片、序列化对象等。

```sql
SET key value [NX|XX] [GET] [EX seconds|PX milliseconds|EXAT unix-time-seconds|PXAT unix-time-milliseconds|KEEPTTL]     -- 设置键 key 的值为 value
  -- NX 当键不存在时才设置键值对 / XX 当键存在时才设置键值对  -1
  -- EX seconds 设置键的过期时间为指定的秒数 / PX milliseconds 设置键的过期时间为指定的毫秒数
GET key               -- 获取键 key 的值
DEL key [key ...]     -- 删除一个/多个键 key
EXISTS key [key ...]  -- 检查键是否存在
```

#### example

```sql
SET name zhangsan EX 5      -- 设置键 anme 的值为 zhangsan 过期时间 5s
GET name                    -- 获取键 name 的值
DEL name                    -- 删除键 name

INCR key1                   -- 将键 key1 的值递增 1
DECR key1                   -- 将键 key1 的值递减 1
APPEND key1 value1          -- 将字符串 value1 追加到键 key1 的值后面
STRLEN key1                 -- 获取键 key1 的值的长度
SETNX key1 value1           -- 如果键 key1 不存在，则设置其值为 value1
SETEX key1 seconds value1          -- 设置键 key1 的值为 value1，并指定过期时间（秒）
MSET key1 value1 key2 value2 ...   -- 同时设置多个键值对
MGET key1 key2 ...          -- 同时获取多个键的值
```

### 哈希（Hash）

`哈希`用于存储对象，类似于关联数组。每个哈希可以存储多个字段和对应的值，适合存储结构化数据。

```bash
# hash_key1 是哈希的键（Key）
# field1、field2、field3等是哈希的字段（Field）
# 而value1、value2、value3等则是对应字段的值。
# 哈希结构允许在一个键中存储多个字段和值，并且可以通过字段来访问和修改对应的值。

hash_key1:
    field1: value1
    field2: value2
    field3: value3
```

```sql
HSET key field value [field value ...] -- 在哈希 key 中设置字段 field 的值为 value
HGET key field                         -- 获取哈希 key 中字段 field 的值
HDEL key field [field ...]             -- 删除哈希 key 中的字段 field

HGETALL key     -- 获取哈希 key 中所有字段和值
```

#### example

```sql
HSET obj name ms age 18  -- 在哈希 obj 中设置字段 name 的值为 ms age 为18
HGET obj name         -- 获取哈希 obj 中字段 name 的值
HDEL obj name         -- 删除哈希 obj 中的字段 name

HEXISTS obj name      -- 检查哈希 obj 中是否存在字段 name
HGETALL obj           -- 获取哈希 obj 中所有字段和值

HKEYS key1               -- 获取哈希 key1 中所有字段
HVALS key1               -- 获取哈希 key1 中所有值
HLEN key1                -- 获取哈希 key1 中字段的数量
HINCRBY key1 field1 increment  -- 将哈希 key1 中字段 field1 的值增加 increment
HMSET key1 field1 value1 field2 value2   -- 同时设置哈希 key1 中多个字段和值
HMGET key1 field1 field2 ...             -- 同时获取哈希 key1 中多个字段的值
```

### 列表（List）

`列表`是一个有序的字符串集合，可以包含重复元素。
列表的两端可以执行插入和删除操作，支持在头部和尾部进行快速的插入和删除。

```sql
LPUSH key element [element ...]   -- 在列表的左侧插入一个/多个元素
RPUSH key element [element ...]   -- 在列表的右侧插入一个/多个元素

LRANGE key start stop   -- 获取列表中指定范围的元素 [start, stop]

LSET key index element  -- 设置列表中指定索引位置的元素值

LPOP key [count]    -- 从列表的左侧弹出一个/ count 个元素 并移除
RPOP key [count]    -- 从列表的右侧弹出一个/ count 个元素 并移除

LREM key count element -- 移除列表中指定数量的指定值元素
```

#### example

```sql
LPUSH mylist 1 2 3     -- 在列表的左侧插入一个/多个元素
RPUSH mylist 1 2 3     -- 在列表的右侧插入一个/多个元素

LPOP mylist         -- 从列表的左侧弹出一个元素 并移除
RPOP mylist         -- 从列表的右侧弹出一个元素 并移除

LINDEX mylist 0     -- 获取列表中指定索引位置的元素
LRANGE mylist 0 -1  -- 获取列表中指定范围的元素 [start, stop]

LLEN mylist         -- 获取列表的长度

LSET mylist 0 "new_element1"    -- 设置列表中指定索引位置的元素值

LREM mylist 1 "element2"        -- 移除列表中指定数量的指定值元素

LTRIM mylist 1 1    -- 修剪列表，保留指定范围内的元素

-- 从源列表的右侧弹出一个元素，并将其添加到目标列表的左侧
RPOPLPUSH source_list destination_list

BLPOP mylist 10     -- 阻塞式左侧弹出，等待并弹出列表的左侧元素
BRPOP mylist 10     -- 阻塞式右侧弹出，等待并弹出列表的右侧元素

# 阻塞式右侧弹出，并将弹出的元素添加到目标列表的左侧
BRPOPLPUSH source_list destination_list 10
```

### 集合（Set）

`集合`是一个无序的字符串集合，不允许重复元素。
集合适用于存储唯一值，并提供了集合运算的功能，如并集、交集、差集等。

```sql
SADD key member [member ...]  -- 将一个或多个成员添加到集合中
SMEMBERS key                  -- 返回集合中的所有成员
SISMEMBER key member          -- 检查成员是否存在于集合中

SREM key member [member ...]  -- 从集合中移除一个或多个成员
```

#### example

```sql
SADD myset 1 1 1 2 2 2   -- 将一个或多个成员添加到集合中
SMEMBERS myset           -- 返回集合中的所有成员
SISMEMBER myset 1        -- 检查成员是否存在于集合中
SREM myset 1      -- 从集合中移除一个或多个成员

SCARD myset        -- 获取集合的基数（元素的数量）
SPOP myset         -- 随机移除并返回集合中的一个或多个成员
SPOP myset 2

SRANDMEMBER myset  -- 返回集合中一个或多个随机成员，不移除
SRANDMEMBER myset 2

SUNION myset1 myset2   -- 返回给定集合的并集
SINTER myset1 myset2   -- 返回给定集合的交集
SDIFF myset1 myset2    -- 返回给定集合的差集

SUNIONSTORE union_set myset1 myset2    -- 将给定集合的并集存储到目标集合中
SINTERSTORE intersection_set myset1 myset2 -- 将给定集合的交集存储到目标集合中
SDIFFSTORE diff_set myset1 myset2      -- 将给定集合的差集存储到目标集合中

SSCAN myset 0  -- 迭代集合中的元素
```

### 有序集合（Sorted Set）

`有序集合`类似于集合，但是每个成员都关联一个分数（score），根据分数对成员进行排序。
有序集合可以用于排行榜、范围查询等场景。

```bash
# 向有序集合中添加一个或多个成员，每个成员都有一个相关的分数
ZADD myzset 1 "member1"
ZADD myzset 2 "member2" 3 "member3"

# 从有序集合中移除一个或多个成员
ZREM myzset "member1"

# 获取有序集合中指定范围的成员，可以选择是否同时获取成员的分数
ZRANGE myzset 0 -1
ZRANGE myzset 0 -1 WITHSCORES

# 以逆序方式获取有序集合中指定范围的成员，可以选择是否同时获取成员的分数
ZREVRANGE myzset 0 -1
ZREVRANGE myzset 0 -1 WITHSCORES

# 获取有序集合的基数（成员的数量）
ZCARD myzset

# 获取有序集合中指定成员的分数
ZSCORE myzset "member2"

# 计算有序集合中分数在指定范围内的成员数量
ZCOUNT myzset 1 3

# 将指定成员的分数增加指定的增量值
ZINCRBY myzset 5 "member3"

# 获取有序集合中指定成员的排名（从小到大）
ZRANK myzset "member2"

# 获取有序集合中指定成员的排名（从大到小）
ZREVRANK myzset "member2"

# 移除有序集合中指定排名范围内的所有成员
ZREMRANGEBYRANK myzset 0 1

# 移除有序集合中分数在指定范围内的所有成员
ZREMRANGEBYSCORE myzset 2 5

# 根据分数范围获取有序集合中的成员，可以选择是否同时获取成员的分数，还可以指定返回结果的偏移量和数量
ZRANGEBYSCORE myzset 1 3
ZRANGEBYSCORE myzset 1 3 WITHSCORES
ZRANGEBYSCORE myzset 1 3 LIMIT 0 2

# 以逆序方式根据分数范围获取有序集合中的成员，同样可以指定是否同时获取成员的分数和返回结果的偏移量和数量
ZREVRANGEBYSCORE myzset 3 1
ZREVRANGEBYSCORE myzset 3 1 WITHSCORES
ZREVRANGEBYSCORE myzset 3 1 LIMIT 0 2

# 计算有序集合中成员在字典排序范围内的数量
ZLEXCOUNT myzset "[member1" "[member3"

# 根据成员在字典排序范围内获取有序集合中的成员，同样可以指定返回结果的偏移量和数量
ZRANGEBYLEX myzset "[member1" "[member3"
ZRANGEBYLEX myzset "[member1" "[member3" LIMIT 0 2

# 以逆序方式根据成员在字典排序范围内获取有序集合中的成员，同样可以指定返回结果的偏移量和数量
ZREVRANGEBYLEX myzset "[member3" "[member1"
ZREVRANGEBYLEX myzset "[member3" "[member1" LIMIT 0 2

# 迭代有序集合中的元素
ZSCAN myzset 0
```

### 位图（Bitmap）

位图是一种特殊的字符串，每个位表示一个二进制的 0 或 1。位图可以执行位操作，并且支持位图计数、位图偏移等操作。

```bash
# 设置位图中指定偏移量的位值
SETBIT mybitmap 0 1

# 获取位图中指定偏移量的位值
GETBIT mybitmap 0

# 对位图中指定偏移量的位值进行取反操作，并返回修改后的位值
BITOP NOT destkey mybitmap

# 对一个或多个位图进行逻辑 AND 操作，并将结果保存到目标位图中
BITOP AND destkey mybitmap1 mybitmap2

# 对一个或多个位图进行逻辑 OR 操作，并将结果保存到目标位图中
BITOP OR destkey mybitmap1 mybitmap2

# 对一个或多个位图进行逻辑 XOR 操作，并将结果保存到目标位图中
BITOP XOR destkey mybitmap1 mybitmap2

# 统计位图中值为 1 的位的数量
BITCOUNT mybitmap

# 统计位图中指定范围内值为 1 的位的数量
BITCOUNT mybitmap 0 1

# 从左到右查找位图中第一个设置为指定值的位，并返回其偏移量
BITPOS mybitmap 1

# 从左到右查找位图中第一个设置为指定值的位，并返回其偏移量，同时可以指定起始偏移量和结束偏移量
BITPOS mybitmap 1 0 2

# 从左到右查找位图中第一个未设置为指定值的位，并返回其偏移量
BITPOS mybitmap 0

# 从左到右查找位图中第一个未设置为指定值的位，并返回其偏移量，同时可以指定起始偏移量和结束偏移量
BITPOS mybitmap 0 0 2
```

## 数据结构存储

### 存储和检索数据

Redis 代表远程词典服务器。您可以在 Redis 的服务器端使用与本地编程环境中相同的数据类型。

```bash
# 设置和获取字符串值
SET bike:1 "Process 134"
>>>
Ok

GET bike:1
>>>
"Process 134"

# 哈希相当于字典（字典或哈希映射）
HSET bike:1 model Deimos brand Ergonom type 'Enduro bikes' price 4972
>>>
(integer) 4

HGET bike:1 model
>>>
"Deimos"

HGET bike:1 price
>>>
"4972"

HGETALl bike:1
>>>
1) "model"
2) "Deimos"
3) "brand"
4) "Ergonom"
5) "type"
6) "Enduro bikes"
7) "price"
8) "4972"
```

### 扫描密匙空间

Redis 中的每个项目都有一个唯一的键。所有项目都位于 Redis 键空间内。

```bash
SCAN 0
# 扫描所有键

SCAN 0 MATCH "bike:*" COUNT 100
# SCAN 扫描
# MATCH 匹配
# COUNT 限制返回数量
>>>
1) "0"
2) 1) "bike:1"
```

### 作为文档数据库

1. 创建索引

```bash
FT.CREATE idx:bicycle ON JSON PREFIX 1 bicycle: SCORE 1.0 SCHEMA $.brand AS brand TEXT WEIGHT 1.0 $.model AS model TEXT WEIGHT 1.0 $.description AS description TEXT WEIGHT 1.0 $.price AS price NUMERIC $.condition AS condition TAG SEPARATOR ,
>>>
OK
```

2. 添加 JSON 文档

```bash
JSON.SET "bicycle:0" "." "{\"brand\": \"Velorim\", \"model\": \"Jigger\", \"price\": 270, \"description\": \"Small and powerful, the Jigger is the best ride for the smallest of tikes! This is the tiniest kids\\u2019 pedal bike on the market available without a coaster brake, the Jigger is the vehicle of choice for the rare tenacious little rider raring to go.\", \"condition\": \"new\"}"
>>>
OK
```

## 发布订阅

```bash
SUBSCRIBE channel [channel ...] # 订阅一个或多个频道
PUBLISH channel message         # 向指定频道发送消息
UNSUBSCRIBE [channel [channel ...]]   # 取消订阅一个或多个频道

# 模式匹配
PSUBSCRIBE news.*     # 通过模式匹配来订阅频道
PUNSUBSCRIBE news.*   # 取消模式匹配订阅
```

### example

```bash
SUBSCRIBE news  # 订阅 news

PUBLISH news "Breaking News: Redis 7.0 released!"  # 发布 news
```

## 事务

可以将一组命令按顺序执行，保证在事务执行过程中不会有其他客户端的干扰。
Redis 事务没有回滚机制，所以如果其中某条命令执行失败，不会影响其他命令的执行。

```bash
MULTI     # 开启事务
EXEC      # 执行事务中的所有命令
DISCARD   # 取消事务，放弃所有已加入事务队列的命令
```

### example

A=100, B=100 A 向 B 转账 100

::: code-group

```bash [1. 开启事务]
MULTI
>>>
OK
```

```bash [2. 加入一些命令]
SET A 0
>>>
QUEUED

SET B 200
>>>
QUEUED
```

```bash [3. 执行]
EXEC
>>>
1) OK
2) OK
```

:::

## 持久化

两种主要的持久化机制来保存数据：

- RDB（快照持久化）
- AOF（追加文件持久化）

### RDB（Redis Database Backup）快照持久化

将 Redis 的数据在指定时间间隔内保存为二进制快照文件，文件通常命名为 `dump.rdb`。
这种方式在重启时能够快速加载数据，适合用于`数据恢复或备份`。

::: code-group

```diff [配置文件 自动save]
# /usr/local/etc/redis.conf

# Save the DB to disk.
#
# save <seconds> <changes> [<seconds> <changes> ...]
#
# Redis will save the DB if the given number of seconds elapsed and it
# surpassed the given number of write operations against the DB.
#
# Snapshotting can be completely disabled with a single empty string argument
# as in following example:
#
# save ""
#
# Unless specified otherwise, by default Redis will save the DB:
#   * After 3600 seconds (an hour) if at least 1 change was performed
#   * After 300 seconds (5 minutes) if at least 100 changes were performed
#   * After 60 seconds if at least 10000 changes were performed
#
# You can set these explicitly by uncommenting the following line.
#
- # save 3600 1 300 100 60 10000
+ save 3600 1 300 100 60 10000
```

```bash [手动触发 RDB 快照]
SAVE      # 立即生成快照，但会阻塞 Redis 直到完成
BGSAVE    # 在后台异步生成快照，不影响当前客户端的操作
```

:::

::: warning

```bash
save 900 1    # 如果 900 秒（15 分钟）内有至少 1 次写操作，则生成快照
save 300 10   # 如果 300 秒（5 分钟）内有至少 10 次写操作，则生成快照
save 60 10000 # 如果 60 秒内有至少 10000 次写操作，则生成快照
```

:::

```bash
SAVE
```

### AOF（Append-Only File）追加日志持久化

将所有写操作记录到一个日志文件（通常为 `appendonly.aof`），并在 Redis 重启时按顺序重放这些操作来恢复数据。
AOF 提供更高的数据安全性，因为可以更频繁地将数据写入磁盘。

```bash
# 修改 /usr/local/etc/redis.conf

# appendonly no
appendonly yes  # 启用 AOF
appendfilename "appendonly.aof"  # 默认 AOF 文件名
```

## 主从复制 （Master-Slave）

### 基本概念

- 主节点 `Master` // 负责处理所有写操作（如 SET、DEL 等），将数据同步到从节点。
- 从节点 `Slave` // 主要用于处理读操作，并从主节点获取数据的更新。
- 读写分离 // 可以在从节点上处理读操作，将写操作集中在主节点，减轻主节点的压力。
- 自动故障转移 // 在 Redis Sentinel 或 Redis Cluster 的帮助下，从节点可以在主节点宕机时自动升级为主节点，实现高可用。

### 配置主从复制

::: code-group

```bash [Master 主]
# 主节点无需指定特殊配置，直接启动即可
redis-server
```

```bash [Slave 从]
redis-server --port 6380 replicaof 127.0.0.1 6379
# or
# 新建 配置文件 redis-6380.conf
bind 127.0.0.1
port 6380
replicaof 127.0.0.1 6379
# 启动
redis-server /path/to/redis-6380.conf

# or
# 安装好后配置
# replicaof <masterip> <masterport>
# 配置 主服务器的 IP Port
replicaof 127.0.0.1 6379
```

```bash [Master 查看复制状态]
redis-cli
info replication
>>>
info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:7
master_sync_in_progress:0
```

:::

#### 验证主从复制

::: code-group

```bash [Master]
redis-cli
>>>
set mykey "Hello, Redis!"
OK
```

```bash [Slave]
redis-cli -p 6380
>>>
127.0.0.1:6380> get mykey
"Hello, Redis!"
```

:::

### Redis sentinel 高可用性

- `Redis Sentinel` 自动故障转移

```bash [redis-sentinel.conf]
# sentinel monitor <master-name> <ip> <redis-port> <quorum>
# master-name：主服务器的名称，通常用于标识主服务器。
# master-ip：主服务器的 IP 地址。
# master-port：主服务器的端口（通常是 6379）。
# quorum：指定了在故障转移前，至少需要多少个 Sentinel 实例确认主服务器已经宕机。一般情况下设置为 2 或更多。

sentinel monitor mymaster 127.0.0.1 6379 2
```

- 手动

```bash
# 登录到从服务器
redis-cli -p 6380
# 从服务器提升为主服务器
replicaof no one
# 检查主从状态
INFO replication
```

#### 启动 Redis Sentinel （默认未启动）

```bash
redis-server /path/to/redis-sentinel.conf --sentinel
```

### 调用 `lua`

原子操作 ：Lua 脚本在 Redis 中是以原子方式执行的，这意味着在脚本执行期间不会有其他命令插入，这对于需要多个命令组合成一个事务的场景非常有用。

::: code-group
```bash
npm install express ioredis
```

```lua [rate_limit.lua]
-- KEYS[1]: 限流的 key (例如：user:123:rate_limit)
-- ARGV[1]: 时间窗口 (秒)
-- ARGV[2]: 允许的最大请求次数

local key = KEYS[1]
local time_window = tonumber(ARGV[1])
local max_requests = tonumber(ARGV[2])
local current = tonumber(redis.call('get', key) or "0")

if current > max_requests then
    return 0 -- 超过限制
else
    redis.call('INCRBY', key, 1)
    redis.call('EXPIRE', key, time_window)
    return 1 -- 允许通过
end
```

```js [app.js]
const express = require('express');
const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

const app = express();
const redis = new Redis();

// 读取 Lua 脚本内容
const luaScriptPath = path.join(__dirname, 'scripts', 'rate_limit.lua');
const luaScript = fs.readFileSync(luaScriptPath, 'utf8');

// 抽奖接口
app.post('/lottery', (req, res) => {
  const key = `user:${req.ip}:lottery_limit`;
  redis.eval(luaScript, 1, key, 60, 5) // 60秒内最多5次请求
    .then(result => {
      if (result === 1) {
        // 执行抽奖逻辑
        res.send('抽奖成功！');
      } else {
        res.status(429).send('抽奖次数过多，请稍后再试。');
      }
    })
    .catch(err => {
      console.error('执行脚本时出错:', err);
      res.status(500).send('服务器错误');
    });
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```
:::
