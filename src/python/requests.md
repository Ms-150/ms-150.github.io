# requests

一个简单却优雅的 HTTP 库。

[https://pypi.org/project/requests/](https://pypi.org/project/requests/)


## install

```bash
pip install requests
```

## usage

### 请求操作

```py
import requests

# 1. GET 请求 (带参数)
payload = {'type': 'book', 'query': 'python'}
r = requests.get('https://httpbin.org/get', params=payload)

# 2. POST 请求 (提交表单)
r = requests.post('https://httpbin.org/post', data={'key': 'value'})

# 3. POST 请求 (提交 JSON 数据 - 最常用)
r = requests.post('https://httpbin.org/post', json={'user': 'admin'})

# 4. 自定义 Headers (伪装成浏览器)
headers = {'User-Agent': 'my-app/0.0.1'}
r = requests.get('https://httpbin.org/get', headers=headers)
```

### 解析响应

| 属性/方法       | 作用                               |
| --------------- | ---------------------------------- |
| `r.status_code` | HTTP 状态码 (如 200, 404)          |
| `r.json()`      | 自动将返回的 JSON 转为 Python 字典 |
| `r.text`        | 以字符串形式获取响应内容           |
| `r.content`     | 获取二进制数据 (下载图片/文件时用) |
| `r.url`         | 查看最终请求的完整 URL             |

::: warning
如果发现中文乱码，可以手动指定编码
`r.encoding = 'utf-8'`
:::

### 异常处理 `try-except`
 
```py
try:
    r = requests.get('https://github.com', timeout=5) # 设置 5 秒超时
    r.raise_for_status() # 如果状态码不是 200-299，直接抛出异常
except requests.exceptions.HTTPError as errh:
    print("HTTP 错误:", errh)
except requests.exceptions.ConnectionError as errc:
    print("连接错误:", errc)
except requests.exceptions.Timeout as errt:
    print("请求超时:", errt)
```