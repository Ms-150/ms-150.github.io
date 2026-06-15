# ElasticSearch

一个开源的分布式搜索和分析引擎，专为速度、扩展和 AI 应用而打造。
作为一个检索平台，它可以实时存储结构化、非结构化和向量数据，提供快速的混合和向量搜索，支持可观测性与安全分析，并以高性能、高准确性和高相关性实现 AI 驱动的应用。

[https://www.elastic.co/](https://www.elastic.co/)

## 本质

一个“超强搜索数据库”

## 擅长

+ 全文搜索
+ 海量数据检索
+ 模糊搜索
+ 日志分析
+ 聚合统计
+ 实时查询

## 底层核心：

+ 倒排索引（Inverted Index）
+ 全文检索

全文检索：从一大段文本里找“相关内容”
倒排索引：全文检索的核心数据结构

::: code-group

```text [正向索引]
文档1 -> 苹果 手机
文档2 -> 华为 手机
文档3 -> 小米 手机

文档 → 内容
```

```text [倒排索引]
苹果 -> 文档1
华为 -> 文档2
小米 -> 文档3
手机 -> 文档1、2、3

词 → 文档
```

:::

| MySQL           | Elasticsearch |
| --------------- | ------------- |
| Database 数据库 | Index 索引    |
| Row 行数据      | Document 文档 |
| Column 字段     | Field 字段    |
| Schema 表结构   | Mapping 映射  |
| SQL             | DSL JSON 查询 |

::: code-group

```bash [mysql]
# 数据库 -> 表 -> 行

Database(mall)
    └── Table(product)
            ├── Row1
            ├── Row2
            └── Row3
```

```bash [elasticsearch]
# 索引 -> JSON文档

Index(product)
    ├── Document1(JSON)
    ├── Document2(JSON)
    └── Document3(JSON)
```

:::

### mapping 字段规则配置

```bash
PUT /product
{
  "mappings": {
        "properties": {
            "title": {
                "type": "text",
                "analyzer": "ik_max_word"
            },
            "status": {
                "type": "keyword"
            },
            "price": {
                "type": "float"
            },
            "created_at": {
                "type": "date"
            }
        }
    }
}

# mappings 
#     properties 字段
#         title 字段名
#             type  索引类型
#             analyzer 分词器
```

| type      | 是否分词 | 适合场景   | 示例             |
| --------- | -------- | ---------- | ---------------- |
| `text`    | 是       | 全文搜索   | 标题、文章内容   |
| `keyword` | 否       | 精确匹配   | ID、状态、手机号 |
| `integer` | 否       | 整数       | 年龄、数量       |
| `long`    | 否       | 长整数     | 大数字ID         |
| `float`   | 否       | 小数       | 商品价格         |
| `double`  | 否       | 高精度小数 | 金额统计         |
| `boolean` | 否       | true/false | 是否启用         |
| `date`    | 否       | 日期时间   | 创建时间         |
| `ip`      | 否       | IP地址     | 服务器IP         |
| `nested`  | 否       | 嵌套对象   | 商品规格         |
| `object`  | 否       | JSON对象   | 用户信息         |

| analyzer      | 说明             | 适合语言 | 特点           |
| ------------- | ---------------- | -------- | -------------- |
| `standard`    | 默认分词器       | 英文     | ES 自带        |
| `simple`      | 简单分词         | 英文     | 按非字母拆分   |
| `whitespace`  | 空格分词         | 英文     | 遇空格切       |
| `stop`        | 去停用词         | 英文     | 去掉 the/a/is  |
| `keyword`     | 不分词           | 全部     | 整句作为一个词 |
| `ik_max_word` | 最细粒度中文分词 | 中文     | 搜索效果强     |
| `ik_smart`    | 智能中文分词     | 中文     | 分词较粗       |

### settings 索引性能配置

```bash
PUT /product
{
    "settings": {
        "number_of_shards": 3, # 分片数
        "number_of_replicas": 1 # 副本数
    },
    "mappings": {
        "properties": {
            "title": {
                "type": "text",
                "analyzer": "ik_max_word"
            },
            "price": {
                "type": "float"
            },
            "status": {
                "type": "keyword"
            }
        }
    }
}

# number_of_shards 分片数
# number_of_replicas 副本数
```

| setting              | 作用       | 是否常用 | 是否可修改 |
| -------------------- | ---------- | -------- | ---------- |
| `number_of_shards`   | 主分片数   | ⭐⭐⭐⭐⭐    | ❌          |
| `number_of_replicas` | 副本数     | ⭐⭐⭐⭐⭐    | ✅          |
| `refresh_interval`   | 刷新间隔   | ⭐⭐⭐⭐     | ✅          |
| `max_result_window`  | 最大分页   | ⭐⭐⭐      | ✅          |
| `analysis`           | 分词器配置 | ⭐⭐⭐⭐⭐    | ⚠️          |
| `routing`            | 路由规则   | ⭐⭐       | ⚠️          |


## install
 
::: code-group

```bash
docker run -d --name es \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  elasticsearch:8.12.0

# 关闭 https   -e "xpack.security.enabled=false" \ 
```

## usage

:::

::: code-group

```bash [创建索引]
PUT /product
{
  "mappings": {
        "properties": {
            "title": {
                "type": "text"
            },
            "price": {
                "type": "float"
            }
        }
    }
}
```

```bash [插入数据]
POST /product/_doc/1
{
    "title": "iPhone 15 Pro",
    "price": 7999
}
```

```bash [查询数据]
GET /product/_search
{
  "query": {
        "match": {
            "title": "iphone"
        }
    }
}
```

:::

### 索引

```bash
Index
 ├── settings
 ├── mappings
 ├── aliases
 └── documents
```

::: code-group

```bash [创建索引]
PUT /product
```

```bash [删除索引]
# 整个索引 + 所有数据
DELETE /product
```

```bash [修改索引]
# mapping / setting 都是部分可以修改

# 修改 mapping 
PUT /product/_mapping

# 修改 setting
PUT /product/_settings
```

```bash [查询索引]
GET /product
```

:::

#### aliases 索引别名
给索引起一个“虚拟名字”

##### 为什么需要 Alias？

ES 的索引很多配置：不能直接修改。 别名用来 `重建索引`

例如：
+ mapping
+ analyzer
+ shards

优势
1. 索引平滑升级
2. 无感知切换
3. 零停机迁移

product 【Alias】
   ↓
product_v1 【Index】

::: code-group

```bash [创建索引别名]
PUT /product_v1
{
  "aliases": {
    "product": {}
  }
}
```

```bash [查询索引别名]
GET /_alias
```

```bash [切换别名]
POST /_aliases
{
  "actions": [
    {
      "remove": {
        "index": "product_v1",
        "alias": "product"
      }
    },
    {
      "add": {
        "index": "product_v2",
        "alias": "product"
      }
    }
  ]
}
```

:::

### 文档

::: code-group

```bash [创建文档]
POST /product/_doc/1
{
  "title": "iPhone 15 Pro",
  "price": 7999
}
```

```bash [删除文档]
DELETE /product/_doc/1
```

```bash [修改文档]
POST /product/_update/1
{
  "doc": {
    "price": 8999
  }
}
```

```bash [查询文档]
GET /product/_doc/1
```

:::


# Kibana

一个开源界面，用于查询、分析、可视化和管理存储在 Elasticsearch 中的数据。

[https://www.elastic.co/kibana](https://www.elastic.co/kibana)

```bash
# 1. 创建一个网络（如果还没有的话）
docker network create elastic

# 2. 启动 Kibana
docker run -d \
  --name kibana \
  --net elastic \
  -p 5601:5601 \
  -e "ELASTICSEARCH_HOSTS=http://elasticsearch:9200" \
  -e "I18N_LOCALE=zh-CN" \
  docker.elastic.co/kibana/kibana:8.12.0
```

```yml
services:
  # Elasticsearch 容器
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:9.2.1
    container_name: elasticsearch
    environment:
      - discovery.type=single-node       # 单节点模式，省去集群配置
      - xpack.security.enabled=false    # 初学建议先关闭安全验证，避免被密码卡住
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m" # 限制内存，防止吃光宿主机内存
    ulimits:
      memlock:
        soft: -1
        hard: -1
    ports:
      - 9200:9200

  # Kibana 容器
  kibana:
    image: docker.elastic.co/kibana/kibana:9.2.1
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200 # 核心：直接用服务名访问
      - I18N_LOCALE=zh-CN                            # 界面汉化
    ports:
      - 5601:5601
    depends_on:
      - elasticsearch # 确保 ES 先启动
```

## usage

::: code-group

```bash
npm i @elastic/elasticsearch
```

```js [app.js]
import elasticsearch from '@elastic/elasticsearch';

// 1 创建客户端实例
const client = new elasticsearch.Client({
    node: 'http://localhost:9200'
});

// 2 索引文档
const result = await client.index({
    index: 'test-index',
    document: {
        name: 'zhangsan',
        age: 20
    },
    refresh: true
});

// 3 查询文档
const findResult = await client.get({
    index: 'test-index',
    id: result._id
});

console.log('get:', findResult);

// 4 搜索文档
const searchResult = await client.search({
    index: 'test-index',
    query: {
        match: { name: 'zhangsan' }
    }
});

console.log('search:', searchResult.hits.hits);

// 5 删除索引
await client.indices.delete({
    index: 'test-index'
});
```

:::

## 匹配

::: code-group

```bash
npm i @faker-js/faker
```

```js
import { Faker, zh_CN } from "@faker-js/faker";
import fs from "fs";

const faker = new Faker({
    locale: [zh_CN],
});

function generateFakeData(maxItems = 1000) {
    let arr = [];

    for (let i = 0; i < maxItems; i++) {
        arr.push({
            name: faker.person.firstName(),
            age: faker.number.int({ min: 18, max: 80 }),
            phoneNumber: faker.phone.number(),
            email: faker.internet.email(),
            id: faker.string.uuid(),
        });
    }
    return arr;
}

fs.writeFileSync("./fakerData.json", JSON.stringify(generateFakeData(), null, 2));

generateFakeData();
```

```js [app.js]
import { Client } from "@elastic/elasticsearch";
import fs from "fs";

const client = new Client({ node: "http://localhost:9200" });

const data = JSON.parse(fs.readFileSync("./fakerData.json", "utf-8"));

// 检查索引是否存在
const exists = await client.indices.exists({
    index: "users",
})

// await client.indices.delete({
//     index: "users",
// })

// 如果索引不存在，则创建索引
if (!exists) {
    // 定义索引和映射
    await client.indices.create({
        index: "users",
        mappings: {
            properties: {
                // fields 
                name: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                age: { type: 'integer', },
                phoneNumber: { type: 'text', },
                email: { type: 'text', },
                id: { type: 'keyword' },
            }
        }
    });

    const operations = []
    data.forEach(item => {
        operations.push({
            index: {
                _index: 'users',
                _id: item.id
            }
        });
        operations.push(item);
    });

    // Bulk 插入数据
    await client.bulk({ operations: operations });
    console.log('索引创建并数据插入完成');
}

// 查询全部
// const result = await client.search({
//     index: 'users',
//     query: {
//         // 查询全部 
//         match_all: {},
//     },
//     size: 20, //默认返回10条 
// });

// 模糊查询
// const result = await client.search({
//     index: 'users',
//     query: {
//         // 查询 name 中包含 "张" 的数据
//         match: {
//             name: "张三", // 自动分词 匹配每个字/词 
//         },
//     },
//     size: 20, //默认返回10条 
// });

// 精确查询
// const result = await client.search({
//     index: 'users',
//     query: {
//         term: {
//             "name.keyword": "静怡", // 不分词，整体匹配 
//         }
//     },
// });

// 组合查询
// const result = await client.search({
//     index: 'users',
//     query: {
//         bool: {
//             // // 必须匹配
//             must: {
//                 match: {
//                     name: "静怡",
//                 }
//             },
//             // // 过滤
//             // filter: {
//             //     range: {
//             //         age: {
//             //             gte: 20,
//             //             lte: 35,
//             //         }
//             //     }
//             // },
//             // 不匹配
//             // must_not: {
//             //     match: {
//             //         name: "静怡",
//             //     }
//             // },
//             // // 或者匹配
//             // should: {
//             //     match: {
//             //         phoneNumber: "172",
//             //     }
//             // }
//         }
//     },
// });

// // 总数
// console.log('匹配到的总数:', result.hits.total.value);

// // 本次真正拿到的数据量，应该是 20
// console.log('本次返回的数据条数:', result.hits.hits.length);
// // 具体数据
// console.log(result.hits.hits);

// 聚合查询
const result = await client.search({
    index: 'users',
    // size: 0, // 不返回具体数据，只返回聚合结果
    aggs: {
        age: {
            // max: {
            //     field: 'age'
            // },
            terms: {
                field: 'age',
                size: 5, // 限制返回数量 返回前5个年龄段
            }
        },
    }
});

// console.log('聚合结果:', result.aggregations);
console.log('聚合结果:', result.aggregations.age.buckets);

```
:::