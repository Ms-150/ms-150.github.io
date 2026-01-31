# YAML

[https://yaml.org/](https://yaml.org/)

#### `.yml` / `.yaml` 文件后缀

## YAML 是一种结构化配置文件格式，常用于：

+ GitHub Actions（.github/workflows/*.yml）
+ Docker Compose（docker-compose.yml）
+ Kubernetes（deployment.yaml）
+ 各类应用配置（如 application.yml）

它的目标是：让配置文件像自然语言一样易读。

## 语法规则

1. 缩进表示层级（只能用`空格`，不能用 `Tab`）
2. 键值对（`key: value`） 
   + 冒号后必须有空格
   + key 不能重复（后面的会覆盖前面的）
  
3. 字符串可以不加引号
   + 包含特殊字符
   + 以数字开头但你想保留为字符串
   + 包含冒号 `:` 或 `#`
        
    | 类型         | 示例          | 用途           |
    | ------------ | ------------- | -------------- |
    | 普通字符串   | `name: hello` | 默认           |
    | 单引号 `' '` | `'a: b'`      | 不解析转义字符 |
    | 双引号 `" "` | `"a\nb" `     | 支持转义字符   |

    + 多行字符串
      + 保留换行 `|`
      + 合并成一行 `>`
  
4. 列表（数组）用 `-` 表示
5. 字典 + 列表混合
6. 布尔值、数字、null
7. 注释使用 `#`
8. 锚点 & 引用
   + 定义锚点 `&`
   + 引用 `*`

::: code-group

```yml [空格缩进]
server:
  port: 8080
  host: localhost
```

```yml [键值对]
name: Copilot
version: 1.0
```

```yml [字符串可以不加引号]
title: Hello World
message: "Hello: world"
message: "#123"
code: "00123"
```

```yaml [列表/数组]
languages:
  - Go
  - Python
  - JavaScript

# 也可以写成行内形式
languages: [Go, Python, JavaScript]
```

```yaml [字典（对象）]
user:
  name: Alice
  age: 20
```

```yaml [字典 + 列表混合]
users:
  - name: Alice
    age: 20
  - name: Bob
    age: 25
```

```yaml [布尔值、数字、null]
debug: true
timeout: 30
description: null
```

```yaml [多行字符串]
# 保留换行
description: |
  This is line 1
  This is line 2

# 合并成一行
description: >
  This is line 1
  This is line 2
```

```yaml
# 锚点 `&xxx`
commonInfo: &commonInfo
  address: "北京市朝阳区幸福路 88 号"
  phone: "010-12345678"

# 引用 `*xxx`
# 合并键值对 `<<:`
dad:
  <<: *commonInfo
  name: "爸爸"
  age: 45

mom:
  <<: *commonInfo
  name: "妈妈"
  age: 43

# 合并后的
# dad:
#   address: "北京市朝阳区幸福路 88 号"
#   phone: "010-12345678"
#   name: "爸爸"
#   age: 45
```

:::

::: warning 
#### [YAML 常见问题]
+ 使用 Tab  YAML `只允许空格`
+ `冒号后没空格`    `key:value` 是错误写法
+ `列表缩进不一致`  会导致解析失败
+ `key 重复`	后面的会覆盖前面的
:::