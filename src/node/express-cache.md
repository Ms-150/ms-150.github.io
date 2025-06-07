# Express 缓存 redis 示例

缓存是提高 Web 应用性能的重要手段，Express 作为 Node.js 的流行 Web 框架，提供了多种实现缓存的方式。本文将介绍在 Express 中实现各种缓存机制的示例代码。

## HTTP 缓存

HTTP 缓存是最常用的缓存机制，分为强缓存和协商缓存两种类型。

### 强缓存示例

强缓存通过设置响应头中的 `Cache-Control` 和 `Expires` 字段来控制，客户端直接从本地缓存读取资源，不会向服务器发送请求，状态码为 200。

```js
const express = require('express');
const path = require('path');
const app = express();

// 强缓存示例 - 设置 Cache-Control
app.get('/static-with-cache', (req, res) => {
  // 设置缓存控制头
  res.setHeader('Cache-Control', 'public, max-age=3600'); // 缓存一小时
  res.send('这个内容将被缓存一小时');
});

// 强缓存示例 - 设置 Expires
app.get('/static-with-expires', (req, res) => {
  // 设置过期时间（一小时后）
  const expiresDate = new Date();
  expiresDate.setHours(expiresDate.getHours() + 1);
  res.setHeader('Expires', expiresDate.toUTCString());
  res.send('这个内容将在一小时后过期');
});

// 静态文件的强缓存
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: 86400000, // 一天的缓存时间（毫秒）
  immutable: true, // 表示文件不会改变
  etag: true, // 启用 ETag
  lastModified: true // 启用 Last-Modified
}));

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

### 协商缓存示例

协商缓存需要客户端和服务器进行交互，验证资源是否有更新。如果资源未更新，服务器返回 304 状态码，客户端使用本地缓存；如果资源已更新，服务器返回 200 状态码和新的资源。

```js
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const app = express();

// 协商缓存示例 - 使用 Last-Modified
app.get('/last-modified-example', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const stats = fs.statSync(filePath);
  const lastModified = stats.mtime.toUTCString();
  
  // 检查客户端发送的 If-Modified-Since 头
  if (req.headers['if-modified-since'] === lastModified) {
    // 资源未修改，返回 304
    res.status(304).end();
  } else {
    // 资源已修改或首次请求，返回资源内容
    const content = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Last-Modified', lastModified);
    res.setHeader('Cache-Control', 'no-cache'); // 使用协商缓存
    res.send(content);
  }
});

// 协商缓存示例 - 使用 ETag
app.get('/etag-example', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 生成 ETag（基于内容的哈希值）
  const etag = crypto.createHash('md5').update(content).digest('hex');
  
  // 检查客户端发送的 If-None-Match 头
  if (req.headers['if-none-match'] === etag) {
    // 资源未修改，返回 304
    res.status(304).end();
  } else {
    // 资源已修改或首次请求，返回资源内容
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'no-cache'); // 使用协商缓存
    res.send(content);
  }
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

## 内存缓存

对于频繁访问但不经常变化的数据，可以使用内存缓存来提高性能。

```js
const express = require('express');
const app = express();

// 简单的内存缓存实现
const cache = {
  data: {},
  set: function(key, value, ttl) {
    this.data[key] = {
      value: value,
      expiry: Date.now() + ttl
    };
  },
  get: function(key) {
    const item = this.data[key];
    if (item && item.expiry > Date.now()) {
      return item.value;
    }
    return null;
  },
  del: function(key) {
    delete this.data[key];
  }
};

// 使用内存缓存的路由
app.get('/api/data', (req, res) => {
  const cacheKey = 'api_data';
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    console.log('从缓存返回数据');
    return res.json(cachedData);
  }
  
  // 模拟从数据库获取数据
  setTimeout(() => {
    const data = { message: '这是一些数据', timestamp: Date.now() };
    
    // 将数据存入缓存，设置 TTL 为 30 秒
    cache.set(cacheKey, data, 30 * 1000);
    
    console.log('从数据库返回数据');
    res.json(data);
  }, 100);
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

## 使用 Redis 缓存

对于需要在多个服务器实例之间共享的缓存数据，可以使用 Redis 作为缓存存储。

```js
const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const app = express();

// 创建 Redis 客户端
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

// 将 Redis 命令转换为 Promise
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const setexAsync = promisify(client.setex).bind(client);

// 处理 Redis 连接错误
client.on('error', (err) => {
  console.error('Redis 错误:', err);
});

// 使用 Redis 缓存的路由
app.get('/api/redis-data', async (req, res) => {
  const cacheKey = 'api_redis_data';
  
  try {
    // 尝试从 Redis 获取缓存数据
    const cachedData = await getAsync(cacheKey);
    
    if (cachedData) {
      console.log('从 Redis 缓存返回数据');
      return res.json(JSON.parse(cachedData));
    }
    
    // 模拟从数据库获取数据
    const data = { message: '这是一些 Redis 缓存的数据', timestamp: Date.now() };
    
    // 将数据存入 Redis 缓存，设置过期时间为 60 秒
    await setexAsync(cacheKey, 60, JSON.stringify(data));
    
    console.log('从数据库返回数据并缓存到 Redis');
    res.json(data);
  } catch (error) {
    console.error('Redis 操作错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

## 缓存中间件

可以创建自定义中间件来为多个路由提供缓存功能。

```js
const express = require('express');
const app = express();

// 内存缓存对象
const memoryCache = {
  data: {},
  set: function(key, value, ttl) {
    this.data[key] = {
      value: value,
      expiry: Date.now() + ttl
    };
  },
  get: function(key) {
    const item = this.data[key];
    if (item && item.expiry > Date.now()) {
      return item.value;
    }
    return null;
  }
};

// 缓存中间件
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // 跳过非 GET 请求
    if (req.method !== 'GET') {
      return next();
    }
    
    // 使用请求路径作为缓存键
    const key = req.originalUrl || req.url;
    const cachedResponse = memoryCache.get(key);
    
    if (cachedResponse) {
      // 返回缓存的响应
      res.send(cachedResponse);
      return;
    }
    
    // 保存原始的 res.send 方法
    const originalSend = res.send;
    
    // 重写 res.send 方法来缓存响应
    res.send = function(body) {
      // 缓存响应
      memoryCache.set(key, body, duration);
      
      // 调用原始的 send 方法
      originalSend.call(this, body);
    };
    
    next();
  };
};

// 应用缓存中间件到特定路由
app.get('/api/cached-data', cacheMiddleware(60 * 1000), (req, res) => {
  // 模拟耗时操作
  setTimeout(() => {
    const data = { message: '这是缓存的数据', timestamp: Date.now() };
    res.json(data);
  }, 500);
});

// 不使用缓存的路由
app.get('/api/fresh-data', (req, res) => {
  const data = { message: '这是新鲜的数据', timestamp: Date.now() };
  res.json(data);
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

## 条件缓存

有时候我们需要根据特定条件决定是否使用缓存。

```js
const express = require('express');
const app = express();

// 内存缓存
const cache = {};

// 条件缓存中间件
const conditionalCache = (shouldCache, duration) => {
  return (req, res, next) => {
    // 检查是否应该缓存
    if (!shouldCache(req)) {
      return next();
    }
    
    const key = req.originalUrl || req.url;
    const cachedItem = cache[key];
    
    // 检查缓存是否有效
    if (cachedItem && cachedItem.expiry > Date.now()) {
      return res.json(cachedItem.data);
    }
    
    // 保存原始的 json 方法
    const originalJson = res.json;
    
    // 重写 json 方法来缓存响应
    res.json = function(data) {
      // 缓存响应
      cache[key] = {
        data: data,
        expiry: Date.now() + duration
      };
      
      // 调用原始的 json 方法
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// 只为已认证用户缓存数据
app.get('/api/user-data', 
  conditionalCache(
    req => req.query.authenticated === 'true', // 条件函数
    30 * 1000 // 缓存 30 秒
  ), 
  (req, res) => {
    // 模拟获取用户数据
    setTimeout(() => {
      const userData = {
        id: 123,
        name: '测试用户',
        lastAccess: new Date().toISOString()
      };
      res.json(userData);
    }, 300);
  }
);

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

## 缓存清除

当数据更新时，需要清除相关的缓存。

```js
const express = require('express');
const app = express();

// 内存缓存
const cache = {};

// 缓存中间件
const cacheMiddleware = (key, duration) => {
  return (req, res, next) => {
    const cachedItem = cache[key];
    
    if (cachedItem && cachedItem.expiry > Date.now()) {
      return res.json(cachedItem.data);
    }
    
    const originalJson = res.json;
    
    res.json = function(data) {
      cache[key] = {
        data: data,
        expiry: Date.now() + duration
      };
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// 清除缓存的函数
const clearCache = (key) => {
  delete cache[key];
};

// 获取产品列表（使用缓存）
app.get('/api/products', cacheMiddleware('products', 60 * 1000), (req, res) => {
  // 模拟从数据库获取产品列表
  setTimeout(() => {
    const products = [
      { id: 1, name: '产品 1', price: 100 },
      { id: 2, name: '产品 2', price: 200 },
      { id: 3, name: '产品 3', price: 300 }
    ];
    res.json(products);
  }, 200);
});

// 添加新产品（并清除产品列表缓存）
app.post('/api/products', express.json(), (req, res) => {
  // 模拟添加产品到数据库
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price
  };
  
  // 清除产品列表缓存
  clearCache('products');
  
  res.status(201).json(newProduct);
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

## 总结

在 Express 应用中，可以根据不同的需求选择合适的缓存策略：

1. **HTTP 缓存**：适用于静态资源和不经常变化的内容，通过设置响应头控制客户端缓存行为。
2. **内存缓存**：适用于频繁访问的数据，但不适合大量数据或需要在多个服务器实例间共享的数据。
3. **Redis 缓存**：适用于需要在多个服务器实例间共享的缓存数据，或者需要持久化的缓存。
4. **缓存中间件**：可以为多个路由提供统一的缓存功能，简化代码。
5. **条件缓存**：根据特定条件决定是否使用缓存，提供更灵活的缓存控制。
6. **缓存清除**：当数据更新时，及时清除相关缓存，保证数据一致性。

选择合适的缓存策略可以显著提高 Express 应用的性能和响应速度，同时减轻服务器负担。
