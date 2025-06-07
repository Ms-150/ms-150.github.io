# HTTP 超文本传输协议

一个 HTTP 请求是客户端（如浏览器）向服务器发送的消息，请求服务器返回某些资源（如网页、图片、数据等）。HTTP 请求包括以下几个主要部分：

## 请求

- 请求行：包括请求方法、请求目标（URL）和 HTTP 版本。
- 请求头：包含有关请求的各种信息（如内容类型、接受的编码方式、用户代理等）。
- 请求体（可选）：在某些请求方法（如 POST）中包含数据。

### 请求行

```
GET /index.html HTTP/1.1
请求方法 请求目标 HTTP 版本
```

#### 请求方法

| 请求方法  | 解释                                                                        |
| --------- | --------------------------------------------------------------------------- |
| `GET`     | 请求获取指定资源。数据通常附在 URL 后面（作为查询参数），而且请求体通常为空 |
| `POST`    | 提交数据到服务器（如表单数据）。数据包含在请求体中                          |
| `HEAD`    | 获取指定资源的头部信息，与 GET 方法类似，但不返回资源体                     |
| `PUT`     | 更新指定资源的全部内容。数据包含在请求体中                                  |
| `DELETE`  | 删除指定资源                                                                |
| `OPTIONS` | 请求资源的可用方法和其他选项                                                |
| `PATCH`   | 部分更新资源                                                                |
| `CONNECT` | 将请求的连接转为透明的 TCP/IP 隧道                                          |
| `TRACE`   | 回显服务器收到的请求，用于诊断                                              |

### 请求头

请求头包含了许多信息，这些信息可以帮助服务器理解请求的上下文。常见的请求头包括：

| 请求头            | 解释                                                           |                              |
| ----------------- | -------------------------------------------------------------- | ---------------------------- |
| `Host`            | 指定请求的主机和端口                                           |                              |
| `User-Agent`      | 标识发出请求的客户端应用程序                                   |                              |
| `Accept`          | 指定客户端能够接受的内容类型（如 text/html、application/json） |                              |
| `Accept-Encoding` | 指定客户端能够接受的内容编码类型，例如 gzip, deflate。         |
| `Content-Type`    | 请求体中数据的类型 ｜                                          | [详见](#请求体-content-type) |
| `Authorization`   | 包含认证信息（如令牌或凭证）                                   |                              |
| `Cookie`          | 向服务器发送存储在客户端的 cookies。                           |
| `Referer`         | 指示请求的来源页面的 URL。                                     |

### 请求体 Content-Type

请求体用于传输数据，通常在 POST 和 PUT 请求中使用。请求体的格式可以是多种多样的，例如 JSON、XML 或表单数据。

| 请求体                              | 解释                                                |
| ----------------------------------- | --------------------------------------------------- |
| `application/json`                  | 请求体包含 JSON 格式的数据                          |
| `application/x-www-form-urlencoded` | 表单数据以 URL 编码格式发送，通常用于 HTML 表单提交 |
| `multipart/form-data`               | 用于上传文件和表单数据，允许发送文件和其他数据      |
| `text/plain`                        | 请求体包含纯文本数据                                |

::: code-group

```http [application/json]
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

```http [x-www-form-urlencoded]
Content-Type: application/x-www-form-urlencoded

username=johndoe&password=secret
```

```http [multipart/form-data]
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="user"; filename="user.png"
Content-Type: image/png

(binary data of the image)
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

```http [text/plain]
Content-Type: text/plain

This is a plain text message.
```

:::

### example

::: code-group

```http [GET]
GET /users/123 HTTP/1.1
Host: example.com
```

```http [POST]
POST /users HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

```http [HEAD]
HEAD /users/123 HTTP/1.1
Host: example.com
```

```http [PUT]
PUT /users/123 HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

```http [DELETE]
DELETE /users/123 HTTP/1.1
Host: example.com
```

```http [OPTIONS]
OPTIONS /users HTTP/1.1
Host: example.com
```

```http [PATCH]
PATCH /users/123 HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "email": "new-email@example.com"
}
```

```http [CONNECT]
CONNECT www.example.com:443 HTTP/1.1
Host: www.example.com
```

```http [TRACE]
TRACE / HTTP/1.1
Host: example.com
```

:::

## 响应

- 状态行
  - HTTP 版本（如 HTTP/1.1）
  - 状态码（如 200）
  - 状态消息（如 OK）
- 响应头
- 响应体

### 状态行

```
HTTP/1.1 200 OK
HTTP 版本 状态码 状态消息
```

#### 状态码

| 状态码 | 状态信息              | 解释                                               |
| ------ | --------------------- | -------------------------------------------------- |
| `200`  | OK                    | 请求成功，服务器返回了请求的资源                   |
| `201`  | Created               | 请求成功，服务器创建了新的资源                     |
| `204`  | No Content            | 请求成功，但服务器没有返回任何内容                 |
| `301`  | Moved Permanently     | 资源已永久移动到新位置                             |
| `304`  | Not Modified          | 自从上次请求后，请求的资源没有修改（用于协商缓存） |
| `400`  | Bad Request           | 请求无效，服务器无法理解                           |
| `401`  | Unauthorized          | 需要身份验证                                       |
| `403`  | Forbidden             | 服务器拒绝执行请求                                 |
| `404`  | Not Found             | 请求的资源未找到                                   |
| `500`  | Internal Server Error | 服务器内部错误                                     |
| `503`  | Service Unavailable   | 服务不可用，服务器暂时无法处理请求                 |

### 响应头

| 响应头             | 描述                                             | 示例值                                                  |
| ------------------ | ------------------------------------------------ | ------------------------------------------------------- |
| `Content-Type`     | 指示响应主体的媒体类型                           | Content-Type: text/html; application/json;charset=UTF-8 |
| `Content-Length`   | 表示响应主体的长度（以字节为单位）               | Content-Length: 1234                                    |
| `Server`           | 提供有关服务器的软件信息                         | Server: Apache/2.4.41 (Ubuntu)                          |
| `Date`             | 指定响应消息的发送日期和时间                     | Date: Fri, 13 Sep 2024 12:00:00 GMT                     |
| `Cache-Control`    | 指示缓存机制如何处理响应                         | Cache-Control: no-cache, no-store, must-revalidate      |
| `Expires`          | 指定响应到期时间，过期后响应可能会被认为是陈旧的 | Expires: Fri, 13 Sep 2024 12:00:00 GMT                  |
| `ETag`             | 提供资源的唯一标识符，通常用于缓存验证           | ETag: "686897696a7c876b7e"                              |
| `Location`         | 用于重定向响应，指示客户端访问的新的 URL         | Location: https://example.com/new-page                  |
| `Set-Cookie`       | 用于设置客户端的                                 | cookie Set-Cookie: sessionId=abc123; Path=/; HttpOnly   |
| `WWW-Authenticate` | 在需要身份验证时，告知客户端如何进行身份验证     | WWW-Authenticate: Basic realm="Example"                 |

### 响应体

`Content-Type` ：指示响应体的媒体类型（如 text/html、application/json）。
`Content-Length` ：指示响应体的大小（以字节为单位）。
`Content-Encoding` ：指示响应体的编码方式（如 gzip，表示响应体经过压缩）。

### example

::: code-group

```http [200]
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 138

<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
```

```http [301]
HTTP/1.1 301 Moved Permanently
Location: https://www.example.com/new-page
```

```http [404]
HTTP/1.1 404 Not Found
Content-Type: text/html
Content-Length: 123

<!DOCTYPE html>
<html>
<head>
    <title>404 Not Found</title>
</head>
<body>
    <h1>404 Not Found</h1>
    <p>The requested resource could not be found.</p>
</body>
</html>
```

:::

## 简单请求

- 请求方法：请求方法必须是以下之一：

  - GET
  - POST
  - HEAD

- 请求头：请求头字段必须只包含以下 "安全" 请求头字段：

  - Accept：客户端能够接受的内容类型。
  - Accept-Language：客户端能够接受的语言类型。
  - Content-Language：请求中内容的语言。
  - Content-Type：请求体中的数据类型。具体可为：
    - application/x-www-form-urlencoded：表单数据以 URL 编码格式发送。
    - multipart/form-data：用于上传文件和表单数据。
    - text/plain：请求体包含纯文本数据。
  - DPR：设备像素比。
  - Downlink：网络下行带宽估计值。
  - Save-Data：客户端节省数据的请求头。
  - Viewport-Width：视口宽度。
  - Width：视口宽度的 CSS 像素值。

### example

::: code-group

```http [GET]
GET /api/data HTTP/1.1
Host: example.com
Accept: application/json
```

```http [POST]
POST /api/submit HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

name=JohnDoe&age=30
```

```http [HEAD]
HEAD /api/data HTTP/1.1
Host: example.com
Accept-Language: en-US
```

:::

### 预检请求

指在进行跨源请求（CORS, Cross-Origin Resource Sharing）时，浏览器会先发出一个“预检”请求，以确定服务器是否允许实际的跨源请求。

这通常发生在以下几种情况：

1. 请求方法：使用了 PUT、DELETE 或其他非简单方法（如 POST 但不是 application/x-www-form-urlencoded、multipart/form-data 或 text/plain 类型），浏览器会发送一个预检请求。

2. 自定义头部：请求中包含了自定义的头部（如 X-Custom-Header），浏览器会发送一个预检请求。

3. 内容类型：请求中包含了非简单的内容类型（如 application/json），也会导致预检请求的产生。
