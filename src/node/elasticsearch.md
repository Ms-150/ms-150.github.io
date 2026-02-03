# ElasticSearch

一个开源的分布式搜索和分析引擎，专为速度、扩展和 AI 应用而打造。
作为一个检索平台，它可以实时存储结构化、非结构化和向量数据，提供快速的混合和向量搜索，支持可观测性与安全分析，并以高性能、高准确性和高相关性实现 AI 驱动的应用。

[https://www.elastic.co/](https://www.elastic.co/)

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