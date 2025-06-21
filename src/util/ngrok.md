# ngrok

ngrok 是一个反向代理工具，它能够将本地运行的服务暴露到互联网上，即使你的本地服务在防火墙或 NAT 后面。这对于开发人员来说非常有用，例如在本地测试 Webhook、演示本地项目给客户，或者与移动设备进行联调等。

[https://ngrok.com/](https://ngrok.com/)

## 主要特点：

- **即时暴露本地服务**：无需配置复杂的端口转发或防火墙规则。
- **支持多种协议**：HTTP、HTTPS、TCP。
- **自定义域名**：付费版本支持自定义域名。
- **流量回放**：可以回放请求，方便调试。
- **Web 界面**：提供一个本地 Web 界面，可以查看所有请求和响应。

### 适用场景：

- **本地 Webhook 调试**：接收来自第三方服务的 Webhook 请求。
- **演示本地项目**：将本地开发中的网站或 API 演示给外部用户。
- **移动应用/客户端联调**：让外部设备访问本地服务进行联调。
- **临时共享文件**：快速共享本地文件或目录。

## 安装与使用：

```bash
brew install ngrok
ngrok -v
ngrok -h
```

```bash
# 注册账号并获取 Authtoken
ngrok authtoken YOUR_AUTHTOKEN
```

## command

```bash
# -region 指定服务器区域 提升连接速度
    # - us：美国（默认）
    # - eu：欧洲
    # - ap：亚太
    # - au：澳大利亚
    # - sa：南美
    # - jp：日本
in：印度
ngrok http -region=ap 3000
# --basic-auth 启用 账号密码 认证保护
ngrok http --basic-auth="user:SecurePass123" 9257

```
#### 3. 启动 ngrok

以下是一些常用的 ngrok 启动命令示例：

::: code-group

```bash [http / https]
# - **暴露本地 Web 服务 (HTTP)** 例如 Apache, Nginx, Node.js 应用等
# 即使你的本地服务是 HTTP，ngrok 也会提供 HTTPS 的公共 UR
ngrok http 80
#  如果你的服务运行在其他端口，例如 3000 端口
ngrok http 3000
```

```bash [tcp]
# - **暴露 TCP 服务 (非 HTTP/HTTPS)**
# 对于 SSH、RDP、数据库等非 Web 服务，你可以使用 TCP 隧道
ngrok tcp 22 # 暴露本地 SSH 服务
```

```bash [自定义子/域名]
# - **暴露指定自定义子/域名 (付费功能)**
ngrok http -subdomain=my-app 80
```

```bash [指定域名]
# **暴露指定域名 (付费功能)**
ngrok http -hostname=app.example.com 80
```

:::

### 4. 查看 ngrok 状态

grok 启动后，会在终端显示一个状态界面，包括公共 URL、会话状态等信息。你也可以通过访问 `<mcurl name="http://localhost:4040" url="http://localhost:4040"></mcurl>` 来查看 ngrok 的 Web 界面，这里会显示所有通过 ngrok 隧道的请求日志，方便调试。

### 高级配置 (ngrok.yml)

ngrok 允许你通过配置文件 `ngrok.yml` 来管理更复杂的隧道配置。这个文件通常位于 `~/.ngrok2/ngrok.yml`。

以下是一个 `ngrok.yml` 文件的示例：

```yaml
authtoken: <YOUR_AUTHTOKEN>
tunnels:
  web:
    proto: http
    addr: 80
  ssh:
    proto: tcp
    addr: 22
  my_app:
    proto: http
    addr: 3000
    subdomain: my-app
```

配置完成后，你可以通过以下命令启动指定的隧道：

```bash
./ngrok start web
./ngrok start ssh
./ngrok start my_app
```

或者启动所有隧道：

```bash
./ngrok start --all
```

### 注意事项：

- **安全性**：ngrok 会将你的本地服务暴露到公共互联网，请确保你暴露的服务是安全的，并且不要暴露敏感信息。
- **免费版限制**：免费版 ngrok 会随机生成公共 URL，并且每次启动都会改变。同时，免费版有连接数和带宽限制。
- **付费版功能**：付费版提供固定域名、自定义域名、TCP 端口范围、更多并发隧道等高级功能。
