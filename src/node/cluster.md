# cluster 集群

Node.js  默认是 `单线程 + 事件循环`，只能使用 1 个 CPU 核心。
在多核机器上，这会浪费大量性能。

`cluster` 模块允许你在同一端口上启动多个 `worker` 进程，让 Node.js  充分利用多核 CPU。

## 目的

| 目标              | 说明                                 |
| ----------------- | ------------------------------------ |
| 利用多核          | CPU	每个 worker 占用一个 CPU 核心    |
| 提升吞吐量（QPS） | 多 worker 并行处理请求               |
| 提高可用性        | worker 崩溃后 master 自动拉起        |
| 避免单点故障      | master 不处理业务，只负责管理 worker |

## 工作原理

+ `Master`（主进程）: 负责创建、管理 worker，不处理业务
+ `Worker`（子进程）: 真正处理 HTTP 请求
+ 所有 worker 共享同一个端口（由 master 负责调度）

## 进程

::: code-group

```js [多进程]
import os from 'os';
import cluster from 'cluster';
import http from 'http';

const cpuCount = os.cpus().length;
// console.log(cpuCount, "cpu 核心数");
// console.log(cluster, "cluster 集群模块");

if (cluster.isPrimary) {
    // 启动 worker
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    // worker 崩溃自动重启 
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    // Worker 进程
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('cluster 服务启动成功！\n');
    }).listen(3000, () => {
        console.log('服务器运行在 http://localhost:3000/');
    });
}

```

```bash [查看进程]
ps aux | grep node
>>>
xx               67342   0.0  0.2 436128720  50688 s043  S+    1:45PM   0:00.05 /Users/xx/.n/bin/node /Users/xx/Documents/ms/cluster/server.js
xx               67341   0.0  0.2 436128656  49376 s043  S+    1:45PM   0:00.05 /Users/xx/.n/bin/node /Users/xx/Documents/ms/cluster/server.js
xx               67340   0.0  0.2 436128736  49360 s043  S+    1:45PM   0:00.05 /Users/xx/.n/bin/node /Users/xx/Documents/ms/cluster/server.js
xx               67339   0.0  0.2 436128816  50176 s043  S+    1:45PM   0:00.05 /Users/xx/.n/bin/node /Users/xx/Documents/ms/cluster/server.js
xx               67338   0.0  0.2 436128656  49168 s043  S+    1:45PM   0:00.05 /Users/xx/.n/bin/node /Users/xx/Documents/ms/cluster/server.js
xx               67337   0.0  0.2 436128480  48992 s043  S+    1:45PM   0:00.05 /Users/xx/.n/bin/node /Users/xx/Documents/ms/cluster/server.js
xx               67336   0.0  0.2 436128208  50224 s043  S+    1:45PM   0:00.05 /Users/xx/.n/bin/node /Users/xx/Documents/ms/cluster/server.js
xx               67335   0.0  0.2 436128032  49648 s043  S+    1:45PM   0:00.05 /Users/xx/.n/bin/node /Users/xx/Documents/ms/cluster/server.js
xx               67334   0.0  0.2 436128576  49472 s043  S+    1:45PM   0:00.05 /Users/xx/.n/bin/node /Users/xx/Documents/ms/cluster/server.js
xx               67333   0.0  0.2 436128496  49840 s043  S+    1:45PM   0:00.06 /Users/xx/.n/bin/node /Users/xx/Documents/ms/cluster/server.js
xx               67332   0.0  0.2 436128352  45600 s043  S+    1:45PM   0:00.05 node ./server.js
```

```js [单进程]
import http from 'http';

http.createServer((req, res) => {
    res.writeHead(200);
    res.end('服务启动成功！\n');
}).listen(3000, () => {
    console.log('服务器运行在 http://localhost:3001/');
});

```

:::

## 压测

使用 [loadtest](../js/loadtest.md)

::: code-group

```bash [集群测试]
npx loadtest -n 100000 -c 1000 http://localhost:3000/

# >>>
Target URL:          http://localhost:3000/
Max requests:        100000
Concurrent clients:  5000
Running on cores:    5
Agent:               none

Completed requests:  100000
Total errors:        0
Total time:          7.519 s
Mean latency:        362.9 ms
Effective rps:       13300

Percentage of requests served within a certain time
  50%      333 ms
  90%      503 ms
  95%      598 ms
  99%      787 ms
 100%      4493 ms (longest request)
```

:::