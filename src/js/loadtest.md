# loadtest

对选定的 HTTP 或 WebSockets URL 进行负载测试。
API 允许你轻松集成到自己的测试中。

## install

```bash
npm install -g loadtest
```

## usage

| 参数                 | 说明                             |
| -------------------- | -------------------------------- |
| `-c`                 | 并发数（concurrency）            |
| `-n`                 | 总请求数                         |
| `--rps`              | 限制每秒请求数                   |
| `-t`                 | 持续时间（秒）                   |
| `-m`                 | HTTP 方法（GET/POST/PUT/DELETE） |
| `-H "Header: value"` | 自定义请求头                     |
| `-P`                 | POST body 数据                   |
| `--timeout`          | 请求超时                         |

::: code-group
 
```bash [固定并发 + 固定请求数]
loadtest -n 100 -c 10 http://www.example.com/
```
 
```bash [限制 RPS，持续压测 30 秒]
loadtest -t 30 --rps 50 -c 10 http://localhost:3000/health
```
 
```bash [使用文件作为 POST Body]
loadtest -m POST -p data.json -T "application/json" -c 20 -n 500 http://localhost:3000/api/create
```
 
```bash [添加自定义 Header（模拟登录）]
loadtest -H "Authorization: Bearer my-secret-token" -n 200 -c 5 http://localhost:3000/user/profile
```
```bash [WebSocket 压测示例]
loadtest ws://localhost:8080 -c 20 -n 200
```

:::