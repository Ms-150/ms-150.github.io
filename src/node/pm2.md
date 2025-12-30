# PM2

M2 是一个用于 Node.js 应用程序的生产环境进程管理器（Process Manager）。
它是一个功能强大且功能丰富的工具，旨在帮助开发者和运维人员管理、监控和保持 Node.js 应用的持续运行。

## 核心功能与优势

PM2 的目标是确保您的 Node.js 应用程序在服务器上以高性能和高可用性运行。

1. 进程管理 (Process Management)

守护进程 (Daemon)：PM2 可以在后台运行，即使你关闭了 SSH 终端，你的 Node.js 应用也会持续运行。

2. 高可用性与可靠性 (High Availability)

自动重启：如果你的应用因为任何原因崩溃或遇到未捕获的异常而退出，PM2 会自动且立即重启它，最大限度地减少停机时间。
内存阈值重启：你可以设置一个内存限制，当应用使用的内存超过这个阈值时，PM2 会优雅地重启它（避免内存泄漏导致的崩溃）。

3. 性能优化与负载均衡 (Clustering)

集群模式 (Cluster Mode)：这是 PM2 最强大的功能之一。它可以利用服务器的所有 CPU 核心来运行你的 Node.js 应用的多个实例。

```bash
pm2 start app.js -i 0 
# -i 0 表示 PM2 会根据服务器的 CPU 核心数自动创建尽可能多的实例。
```

在这种模式下，PM2 充当负载均衡器，将进入的请求分散到所有子进程中，大大提高了应用的吞吐量和稳定性。

4. 监控和日志 (Monitoring & Logging)
+ 实时监控：PM2 提供了一个实时的控制面板，可以查看 CPU 使用率、内存占用、请求速率等关键指标。
+ 日志管理：PM2 会自动捕获应用的 console.log 输出和错误日志，并将它们存储在指定文件中。它还支持日志轮换，防止日志文件无限增长。

5. 部署与环境管理
+ 声明式配置：你可以使用 JSON 或 YAML 配置文件来定义应用的启动参数、环境变量、集群数量等，方便版本控制和部署。
+ 多环境支持：可以为开发、测试和生产等不同环境设置不同的配置。

## command

```bash

npm install pm2 -g      # 安装

pm2 start index.js --name <my-web-app> # 启动应用并命名

pm2 logs              # 查看日志（实时输出）
pm2 monit             # 打开监控面板（CPU、内存、请求速率等）

pm2 list              # 查看所有进程
pm2 describe my-app   # 查看某个应用的详细信息
pm2 stop my-app       # 停止应用
pm2 restart my-app    # 重启应用
pm2 reload my-app     # 重载应用（零停机重启，推荐在集群模式下使用）
pm2 delete my-app     # 删除应用

pm2 startup           # 设置开机自启（根据系统生成命令）
pm2 save              # 保存当前进程列表，重启后自动恢复


# 配置与部署

# 配置文件 CommonJS 格式
pm2 start ecosystem.config.js

# 多环境支持
pm2 start ecosystem.config.js --env production
pm2 start ecosystem.config.js --env development
```