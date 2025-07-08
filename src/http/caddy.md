# Caddy

Caddy 是一个强大的开源 Web 服务器，具有自动 HTTPS、易于配置和高性能等特点。本文将介绍如何快速上手使用 Caddy。

[https://caddyserver.com/](https://caddyserver.com/)

## install

::: code-group

```bash [mac]
brew install caddy

caddy version
```

```bash [Linux]
sudo apt install -y caddy

caddy version
```

:::

## command

```bash
# 使用当前目录下的 Caddyfile 启动 Caddy 服务（默认）
caddy run

# 指定 Caddyfile 配置文件启动 Caddy 服务
caddy run --config /path/to/Caddyfile
# 指定 JSON 格式的配置文件启动 Caddy 服务，并告知 Caddy 使用 JSON 适配器解析配置
caddy run --config /path/to/caddy.json --adapter json

# 在不停止 Caddy 服务的情况下，重新加载配置文件，使新配置生效
caddy reload

# 停止正在运行的 Caddy 服务
caddy stop

# 检查配置文件的语法是否正确，避免因配置错误导致服务启动失败
caddy validate

# 指定配置文件进行验证
caddy validate --config /path/to/Caddyfile

# 格式化 Caddyfile 文件，使其具有一致的缩进和换行符，方便阅读和维护
caddy fmt --overwrite /etc/caddy/Caddyfile

# 将 Caddyfile 转换为 JSON 格式的配置文件，方便查看对应的 JSON 结构
caddy adapt

# 指定 Caddyfile 路径进行转换
caddy adapt --config /etc/caddy/Caddyfile
```

## 快速启动

::: code-group

```bash [1. 创建一个 Caddyfile]
touch caddyfile
```

```plaintext [2. 编写]
:2019

respond "Hello, Caddy!"
```

```bash [3. 运行]
caddy run
```

:::

访问 `http://localhost:2019`，你将看到 `Hello, Caddy!`。

## Caddyfile

Caddyfile 使用一种简洁且易于理解的格式，由一系列的指令 (directives) 组成。指令告诉 Caddy 如何处理传入的 HTTP 请求。

::: code-group

```js [指令]
<address> {
    <directive> [<args...>] {
        <nested directive> [<args...>]
    }
    <directive> [<args...>]
}

// <address>: 指定 Caddy 监听的网络地址，可以是域名（例如 example.com）、IP 地址（例如 127.0.0.1）、IP 地址加端口（例如 127.0.0.1:8080），或者通配符加端口（例如 :80 表示监听所有 IPv4 和 IPv6 接口的 80 端口）。
// { ... }: 包含应用于该地址的指令。
// <directive>: 告诉 Caddy 执行特定操作的关键词，例如 root, file_server, proxy, rewrite 等。
// [<args...>]: 指令的可选参数。
// <nested directive>: 一些指令可以包含嵌套的子指令块。
```

```js [example]
example.com {
    root * /var/www/example.com
    file_server
}

:8080 {
    respond "Hello from port 8080"
}
```

:::

### Core Directives (核心指令)

- `root \* <path>`: 设置服务文件的根目录。 `*` 即匹配所有请求
- `file_server [<path>]`: 启用静态文件服务。如果提供了 `<path>`，则只在该路径下启用文件服务。通常与 root 指令一起使用。
- `encode <formats...>`: 启用响应内容的编码（例如 gzip, zstd）以减小文件大小，提高传输效率。
- `reverse_proxy [<matcher>] <upstreams...>` (或 proxy，旧版本): 将请求反向代理到一个或多个后端服务器。`<matcher>` 可以指定哪些请求需要被代理。<upstreams...> 是后端服务器的地址和端口。
- `respond [<matcher>] <status> <body...>`: 允许你直接返回一个带有指定状态码和响应体的 HTTP 响应。
- `rewrite [<matcher>] <to>`: 修改请求的 URL。`<matcher>` 指定哪些请求需要被重写，`<to>` 是重写后的 URL。
- `redir [<matcher>] <to> [<status>]`: 发送 HTTP 重定向响应。`<status>` 是可选的重定向状态码（默认为 302）。
- `log [<output>] { ... }`: 配置访问日志。可以指定输出位置、格式等。
- `tls [<email>]`: 配置 TLS (HTTPS)。如果提供了 `<email>`，Caddy 会自动使用 Let's Encrypt 获取证书。
- `handle [<matcher>] { ... }`: 定义一个处理请求的块。可以包含多个指令。
- `handle_path [<matcher>] <prefix> { ... }`: 匹配具有特定路径前缀的请求，并在处理时去除该前缀（如前面的例子所示）。

::: code-group

```js [root]
example.com {
    root * /var/www/html
}
```

```js [file_server]
example.com {
    root * /var/www/html
    file_server
}
```

```js [encode]
example.com {
    root * /var/www/html
    file_server
    encode gzip
}
```

```js [reverse_proxy]
example.com {
    reverse_proxy /api/* localhost:8080
    root * /var/www/frontend
    file_server
}
```

```js [respond]
example.com {
    respond /hello 200 "Hello, world!"
}
```

```js [rewrite]
example.com {
    rewrite /old /new
}
```

```js [redir]
example.com {
    redir /old /new 301
}
```

```js [log]
example.com {
    log {
        output file /var/log/caddy/access.log
        format common
    }
    root * /var/www/html
    file_server
}
```

```js [tls]
example.com {
    tls your@email.com
    root * /var/www/html
    file_server
}
```

```js [handle]
example.com {
    handle /static/* {
        root * /var/www/static
        file_server
    }
    handle {
        root * /var/www/html
        file_server
    }
}
```

:::

#### Matchers (匹配器)

许多指令 例如 `rewrite, redir, reverse_proxy, handle` 可以接受 matchers 作为参数，用于更精确地指定哪些请求应该被指令处理。常见的匹配器包括：

- 路径匹配器 (`/path`, `/prefix/\*`): 匹配请求路径。
- 方法匹配器 (`method GET`, `method POST`): 匹配 HTTP 请求方法。
- 主机匹配器 (`host example.com`, `host \*.example.com`): 匹配请求 Host 头部。
- 头部匹配器 (`header User-Agent Firefox`): 匹配特定的 HTTP 请求头部。
- 查询匹配器 (`query id=123`): 匹配 URL 查询参数。

```js
example.com {
    handle /api {
        reverse_proxy localhost:8080
    }

    rewrite {
        r /old/(.*)
        to /new/{1}
    }

    redir /legacy /new 301 {
        if {method} == "GET"
    }
}
```

## example

```bash
# 配置 HTTPS
# 这里 Caddy 会自动为指定域名配置 HTTPS，前提是 DNS 解析正确
example.com {
    # 设置网站的根目录
    root * /var/www/html
    # 启用文件服务器功能，用于提供静态文件服务
    file_server
}

# 反向代理
# 把对 example.com 的请求反向代理到本地的 5000 端口
example.com {
    # 反向代理指令，将请求转发到指定的后端服务
    reverse_proxy localhost:5000
}

# 文件服务器
# 监听 8080 端口
:8080 {
    # 设置文件服务器的根目录
    root * /path/to/files
    # 启用文件服务器功能，并开启目录浏览
    file_server browse
}

# 重定向
# 将对 example.com 的请求重定向到 https://www.example.com
example.com {
    # 重定向指令，301 表示永久重定向，保留原请求的 URI
    redir 301 https://www.example.com{uri}
}
```

```bash
http://127.0.0.1 {
    root * /Users/ms/Documents/blog/.vitepress/dist
    file_server
    encode gzip
}

# vitepress base /blog/
http://127.0.0.1 {
    handle_path /blog/* {
        root * /Users/ms/Documents/blog/.vitepress/dist
        file_server
        encode gzip
    }
}
```
