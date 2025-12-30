# SQLite3 入门教程

[https://www.npmjs.com/package/sqlite3](https://www.npmjs.com/package/sqlite3)

## 安装

```bash
npm i sqlite3
```

## 基础概念

SQLite 是一个轻量级的文件型数据库：
- 数据存储在 `.sqlite` 或 `.db` 文件中
- 无需启动数据库服务器
- 支持标准 SQL 语法
- 适合小到中型应用

## 基本使用

### 1. 连接数据库

```javascript
import sqlite3 from 'sqlite3';

// 创建或连接数据库文件
const db = new sqlite3.Database('./my-database.sqlite');

// 也可以使用内存数据库（重启后数据丢失）
const memoryDb = new sqlite3.Database(':memory:');
```

### 2. 创建表

```javascript
// 创建用户表
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
```

### 3. 插入数据

```javascript
// 插入单条数据
db.run(
  "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
  ["张三", "zhangsan@example.com", 25],
  function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`插入成功，ID: ${this.lastID}`);
    }
  }
);

// 插入多条数据
const stmt = db.prepare("INSERT INTO users (name, email, age) VALUES (?, ?, ?)");
const users = [
  ["李四", "lisi@example.com", 30],
  ["王五", "wangwu@example.com", 28],
  ["赵六", "zhaoliu@example.com", 35]
];

users.forEach(user => {
  stmt.run(user);
});
stmt.finalize();
```

### 4. 查询数据

```javascript
// 查询单条数据
db.get("SELECT * FROM users WHERE id = ?", [1], (err, row) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(row);
    // 输出: { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25, created_at: '2024-01-01 12:00:00' }
  }
});

// 查询多条数据
db.all("SELECT * FROM users WHERE age > ?", [25], (err, rows) => {
  if (err) {
    console.error(err.message);
  } else {
    rows.forEach(row => {
      console.log(`${row.name} - ${row.email} - ${row.age}岁`);
    });
  }
});

// 查询所有数据
db.all("SELECT * FROM users", (err, rows) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("所有用户:", rows);
  }
});
```

### 5. 更新数据

```javascript
db.run(
  "UPDATE users SET age = ? WHERE name = ?",
  [26, "张三"],
  function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`更新了 ${this.changes} 条记录`);
    }
  }
);
```

### 6. 删除数据

```javascript
db.run(
  "DELETE FROM users WHERE age < ?",
  [20],
  function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`删除了 ${this.changes} 条记录`);
    }
  }
);
```

## Promise 封装（推荐）

原生 sqlite3 使用回调函数，我们可以封装成 Promise：

```javascript
class Database {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
  }

  // 执行 SQL（INSERT, UPDATE, DELETE）
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  // 查询单条记录
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // 查询多条记录
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // 关闭数据库
  close() {
    return new Promise((resolve, reject) => {
      this.db.close(err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
```

### 使用 Promise 版本

```javascript
const db = new Database('./my-database.sqlite');

async function example() {
  try {
    // 创建表
    await db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT
      )
    `);

    // 插入数据
    const result = await db.run(
      "INSERT INTO products (name, price, category) VALUES (?, ?, ?)",
      ["iPhone 15", 999.99, "手机"]
    );
    console.log("插入成功，ID:", result.lastID);

    // 查询数据
    const products = await db.all("SELECT * FROM products");
    console.log("所有产品:", products);

    // 查询单个产品
    const product = await db.get("SELECT * FROM products WHERE id = ?", [1]);
    console.log("产品详情:", product);

  } catch (error) {
    console.error("数据库操作失败:", error);
  }
}

example();
```

## 常用 SQL 语句

### 数据类型
```sql
-- SQLite 主要数据类型
INTEGER    -- 整数
REAL       -- 浮点数
TEXT       -- 文本
BLOB       -- 二进制数据
NULL       -- 空值
```

### 表操作
```sql
-- 创建表
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 删除表
DROP TABLE users;

-- 修改表结构（添加列）
ALTER TABLE users ADD COLUMN phone TEXT;
```

### 索引
```sql
-- 创建索引（提高查询速度）
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name_age ON users(name, age);

-- 删除索引
DROP INDEX idx_users_email;
```

### 事务
```sql
-- 开始事务
BEGIN TRANSACTION;

-- 执行多个操作
INSERT INTO users (name, email) VALUES ('用户1', 'user1@example.com');
INSERT INTO users (name, email) VALUES ('用户2', 'user2@example.com');

-- 提交事务
COMMIT;

-- 或者回滚事务
-- ROLLBACK;
```

## 实际项目中的使用

在你的登录系统中，SQLite 的使用模式：

```javascript
// 1. 初始化数据库和表
class AuthDatabase {
  constructor() {
    this.db = new sqlite3.Database('./auth.sqlite');
    this.init();
  }

  async init() {
    // 创建用户表
    await this.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建会话表
    await this.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
  }

  // 创建用户
  async createUser(userData) {
    return await this.run(
      "INSERT INTO users (id, email, name, avatar) VALUES (?, ?, ?, ?)",
      [userData.id, userData.email, userData.name, userData.avatar]
    );
  }

  // 查找用户
  async findUserByEmail(email) {
    return await this.get("SELECT * FROM users WHERE email = ?", [email]);
  }
}
```

## 调试技巧

### 1. 查看数据库文件
```bash
# 使用 sqlite3 命令行工具
sqlite3 database.sqlite

# 查看所有表
.tables

# 查看表结构
.schema users

# 执行查询
SELECT * FROM users;

# 退出
.quit
```

### 2. 启用调试日志
```javascript
// 启用详细日志
sqlite3.verbose();

const db = new sqlite3.Database('./debug.sqlite', (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('数据库连接成功');
  }
});
```

## 最佳实践

1. **总是使用参数化查询**防止 SQL 注入
2. **适当创建索引**提高查询性能
3. **使用事务**保证数据一致性
4. **及时关闭数据库连接**
5. **定期备份数据库文件**
6. **使用 Promise 封装**提高代码可读性

这就是 SQLite 的基础使用方法！你可以从简单的增删改查开始练习。

