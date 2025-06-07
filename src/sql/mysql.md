# MySQL

一个流行的开源关系型数据库管理系统。

[https://www.mysql.com](https://www.mysql.com)

## 安装

::: code-group

```sh [社区版下载]
https://dev.mysql.com/downloads/mysql/
```

```sh [brew]
brew install mysql
brew services start mysql
```

```sh [docker]
docker pull mysql
docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql
```

:::

## 命令

```sh
mysql -u root -p	# 连接mysql

help; | ? | \h      # ; 必须写

exit; | \q          # 退出 sql
```

使用反引号 `` ` `` 的作用是将标识符（如数据库名、表名、列名等）括起来，防止与 MySQL 的保留关键字冲突，同时也支持在标识符中使用一些特殊字符如 `-`。

## 入门

```bash
数据库（Database）
     └── Schema（模式）
         ├── 表（Tables）
         ├── 视图（Views）
         ├── 存储过程（Stored Procedures）
         └── 索引（Indexes）
```

```sql
-- 显示所有库
SHOW DATABASES;
-- 创建数据库 database_name
CREATE DATABASE database_name;
-- 进入数据库 database_name
USE database_name;
-- 创建数据表 table_name
CREATE TABLE table_name(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
);
>>>
Query OK, 0 rows affected, 1 warning (0.01 sec)

-- 显示数据表头结构
desc table_name;
>>>
+-------+------+------+-----+---------+----------------+
| Field | Type | Null | Key | Default | Extra          |
+-------+------+------+-----+---------+----------------+
| id    | int  | NO   | PRI | NULL    | auto_increment |
+-------+------+------+-----+---------+----------------+
1 row in set (0.01 sec)

-- 插入数据
INSERT INTO table_name
(id, name)
VALUES
(2, "lisi");
```

## 数据类型

- ### 数值类型

  包含：整数型 浮点型

  整数型：tinyint smallint mediumint int bigint

  浮点型：float double decimal

  ::: tip
  1Bytes (字节) = 8bit (比特)
  :::

| 类型          |                 大小 (Bytes)                  |                        范围                        | 用途            |
| ------------- | :-------------------------------------------: | :------------------------------------------------: | --------------- |
| tinyint       |                       1                       |                      (0, 255)                      | 大整数值        |
| smallint      |                       2                       |                     (0, 65535)                     | 大整数值        |
| mediumint     |                       3                       |                   (0, 16777215)                    | 大整数值        |
| int / integer |                       4                       |                  (0, 4294967295)                   | 大整数值        |
| bigint        |                       8                       |             (0, 18446744073709551615)              | 极大整数值      |
| float         |                      40                       |         (1.175494351E-38, 3.402823466E+38)         | 单精度 浮点数值 |
| double        |                      80                       | (2.2250738585072014E-308, 1.7976931348623157E+308) | 双精度 浮点数值 |
| decimal       | 对 DECIMAL(M,D) ，如果 M>D，为 M+2 否则为 D+2 |                 依赖于 M 和 D 的值                 | 小数值          |

- ### 日期和时间类型

  表示时间值的日期和时间：date time year datetime timestamp

  | 类型      | 大小 (Bytes) | 格式                | 用途                   |
  | --------- | :----------: | ------------------- | ---------------------- |
  | date      |      3       | YYYY-MM-DD          | 日期值                 |
  | time      |      3       | HH:MM:SS            | 时间值                 |
  | year      |      1       | YYYY                | 年份值                 |
  | datetime  |      8       | YYYY-MM-DD hh:mm:ss | 混合日期和时间         |
  | timestamp |      4       | YYYY-MM-DD hh:mm:ss | 混合日期时间值，时间戳 |

- ### 字符串类型

  char varchar tinytext text mediumtext longtext tinyblob blob mediumblob longblob

  | 类型       | 大小 无符号(unsigned) | 用途                    |
  | ---------- | --------------------- | ----------------------- |
  | char       | 0-255                 | 定长字符串              |
  | varchar    | 0-65535               | 变长字符串              |
  | tinytext   | 0-255                 | 短文本字符串            |
  | text       | 0-65335               | 长文本数据              |
  | mediumtext | 0-16777215            | 中等长度文本数据        |
  | longtext   | 0-4294967295          | 极大长度文本数据        |
  | tinyblob   | 0-255                 | 二进制不超过 255 个字符 |
  | blob       | 0-65335               | 二进制长文本数据        |
  | mediumblob | 0-16777215            | 二进制中等长度文本数据  |
  | longblob   | 0-4294967295          | 二进制极大长度文本数据  |

## 数据库操作

### 显示全部数据库 SHOW DATABASES

```sql
SHOW DATABASES;
>>>
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.00 sec)
```

### 创建数据库 CREATE DATABASE

```sql
CREATE DATABASE [IF NOT EXISTS] database_name;
-- [IF NOT EXISTS] 防止创建已存在的新表而产生错误。
DEFAULT CHARACTER SET = 'utf8mb4';
-- 设置默认字符集
>>>
mysql> CREATE DATABASE database_name;
Query OK, 1 row affected (0.01 sec)
```

### 查看当前数据库 SELECT DATABASE()

```sql
SELECT DATABASE();
>>>
+--------------+
| database()   |
+--------------+
| database_name|
+--------------+
1 row in set (0.00 sec)
```

### 删除数据库 DROP DATABASE

```sql
DROP DATABASE [IF NOT EXISTS] database_name;
>>>
Query OK, 0 rows affected (0.03 sec)
```

### 选择数据库 USE

```sql
USE database_name;
>>>
Database changed
```

## 数据表操作

### 查看所有表

```sql
SHOW TABLES;
```

### 创建数据表 CREATE TABLE

```sql
CREATE TABLE IF NOT EXISTS table_name (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    name VARCHAR(255) COMMENT '姓名',
    age INT COMMENT '年龄'
) COMMENT '表注释';

-- 注释
-- ID 字段名
-- INT 整型
-- UNSIGNED 无符号数 该列只能存储非负值。
-- NOT NULL 非空
-- AUTO_INCREMENT 自增
-- DEFAULT 1 默认值 1
-- PRIMARY key 主键
-- COMMENT "年龄" 备注"年龄"
-- FOREIGN KEY (user_id) REFERENCES users(id) 外键 user_id 关联

-- 创建主表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100)
);
-- 创建从表
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_date DATE,
    amount DECIMAL(10, 2),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
```

| 外键约束选项       |                                                                   |
| ------------------ | ----------------------------------------------------------------- |
| ON DELETE CASCADE  | 当主表中对应的记录被删除时，自动删除外键表中所有关联的记录。      |
| ON DELETE SET NULL | 当主表中对应的记录被删除时，将外键表中相关的外键字段设置为 NULL。 |
| ON UPDATE CASCADE  | 当主表中的主键被更新时，自动更新外键表中的外键字段。              |
| ON UPDATE RESTRICT | 当主表中的主键被更新时，禁止更新，除非外键表中的外键字段被处理。  |

### 查看表结构 DESC / DESCRIBE

```sql
DESC table_name;
-- or
DESCRIBE table_name;
>>>
+-------+------+------+-----+---------+----------------+
| Field | Type | Null | Key | Default | Extra          |
+-------+------+------+-----+---------+----------------+
| id    | int  | NO   | PRI | NULL    | auto_increment |
+-------+------+------+-----+---------+----------------+
1 row in set (0.02 sec)
```

### 删除数据表 DROP TABLE

```sql
DROP TABLE table_name;
>>>
Query OK, 0 rows affected (0.01 sec)
```

### 修改数据表 ALTER 命令

#### 修改表名 RENAME TO

```sql
ALTER TABLE old_table_name RENAME TO new_table_name;
-- or
RENAME TABLE old_table_name TO new_table_name;
```

#### 添加列 ADD

```sql
ALTER TABLE table_name
ADD
column_name column_type;
```

#### 删除列 DROP

```sql
ALTER TABLE table_name
DROP
column_name;
```

#### 修改列 MODIFY

```sql
ALTER TABLE table_name
MODIFY
column_name new_column_type;
```

#### 重命名列 CHANGE

```sql
ALTER TABLE table_name
CHANGE
old_column_name new_column_name column_type;
```

#### 添加主键

```sql
ALTER TABLE table_name
ADD PRIMARY KEY (id);
```

## 数据操作

### 插入数据 INSERT INTO

```sql
INSERT INTO table_name
(column_name1, column_name2)
VALUES
(value1, value2),
(value1, value2);

-- example
INSERT INTO table_name
(id, name, age)
VALUES
(2, "lisi", 20);
(3, "pics", 10);
>>>
Query OK, 2 row affected (0.01 sec)
```

### 删除数据 DELETE FROM

```sql
DELETE FROM table_name
[WHERE condition];        -- condition 条件可选 不带条件 删除全部

-- example
-- 删除单个
DELETE FROM table_name
WHERE age>18;
-- 删除多个
DELETE FROM table_name
WHERE age IN(15,16,17);
```

### 更新数据 UPDATE SET

```sql
UPDATE table_name SET   -- UPDATE 表名 SET
column_name1=value,column_name2=value         -- 字段1=值,字段2=值,
[WHERE condition];      -- condition 条件可选 不带条件 更新全部

-- example
UPDATE table_name SET
id=3,age=16
WHERE id = 2;
```

### 查询数据 SELECT

```sql
-- 查询所有字段数据
SELECT * FROM table_name;
-- 查询特定字段数据
SELECT [DISTINCT] column_name FROM table_name; -- DISTINCT 去重

-- example
SELECT DISTINCT id FROM table_name;
>>>
+----+------+
| id | name |
+----+------+
|  1 | ms   |
|  2 | 123  |
+----+------+
2 rows in set (0.00 sec)
```

#### 别名 AS

```sql
SELECT column_name AS alias_name
FROM table_name;

-- example
-- 把 user 表中的 id 列返回为 user_i
SELECT id AS user_id
FROM user;
```

#### 排序 ORDER BY

- ASC 升序 默认
- DESC 降序

```sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC], ...;

-- example
SELECT id, name
FROM user
ORDER BY id DESC;
```

#### 限制查询结果 LIMIT

1. 限制返回的行数

```sql
SELECT * FROM column1
LIMIT number_of_rows;
```

2. 指定偏移量和返回的行数

```sql
SELECT column1, column2, ...
FROM table_name
LIMIT offset, number_of_rows;
```

3. 结合排序

```sql
SELECT * FROM table_name
ORDER BY column_name DESC
LIMIT 10;
```

4. 实现分页

```sql
SELECT * FROM table_name
ORDER BY column_name
LIMIT 20 OFFSET 10;
```

#### 条件查询 WHERE

| 操作符        | 备注                            |
| ------------- | ------------------------------- |
| `=`           | 等于                            |
| `!=` / `<>`   | 不等于                          |
| `>`           | 大于                            |
| `<`           | 小于                            |
| `>=`          | 大于或等于                      |
| `<=`          | 小于或等于                      |
| `AND`         | 逻辑与（AND 操作符）            |
| `OR`          | 逻辑或（OR 操作符）             |
| `NOT`         | 逻辑非（NOT 操作符）            |
| `IS NULL`     | 检查值是否为 NULL               |
| `IS NOT NULL` | 检查值是否不为 NULL             |
| `BETWEEN`     | 在一个范围内（包含边界）        |
| `LIKE`        | 模糊查询，使用通配符 `_` 和 `%` |
| `IN`          | 匹配一组值中的任意一个          |
| `NOT IN`      | 不匹配一组值中的任意一个        |

```sql
SELECT * FROM table_name
WHERE age=18;

SELECT * FROM table_name
WHERE age is null;

SELECT * FROM table_name
WHERE age is not null;

SELECT * FROM table_name
WHERE age >=13 && age <20;

SELECT * FROM table_name
WHERE age between 15 and 20;

SELECT * FROM table_name
WHERE age>15 && name='zhangsan';

SELECT * FROM table_name
WHERE age=15 or age=18 or age=20;

SELECT * FROM table_name
WHERE age in(15,18,20);
```

#### 模糊查询 LIKE

- `%`：表示任意数量的字符，可以是零个、一个或多个字符。
- `_`：表示单个字符。

```sql
SELECT * FROM table_name
WHERE name LIKE '____' -- 查询4个字符长度

SELECT * FROM table_name
WHERE name LIKE 'x%';  -- 查询首位为x

SELECT * FROM table_name
WHERE name LIKE '%x';  -- 查询末位为x

SELECT * FROM table_name
WHERE name LIKE '%x%';  -- 查询包含x

-- % _ 结合使用
SELECT * FROM table_name
WHERE name LIKE '_a%'; -- 查询第二个字母是a
```

## 表达式

1. 算术表达式

| 函数/表达式 | 作用                |
| ----------- | ------------------- |
| `+`         | 加法                |
| `-`         | 减法                |
| `*`         | 乘法                |
| `/`         | 除法                |
| `%`         | 取模 返回除法的余数 |

```sql
SELECT 10 + 5 AS result;
SELECT 10 - 5 AS result;
SELECT 10 * 5 AS result;
SELECT 10 / 5 AS result;
SELECT 10 % 3 AS result;
```

2. 字符串表达式

| 函数/表达式           | 作用                       |
| --------------------- | -------------------------- |
| `CONCAT()`            | 拼接字符串                 |
| `CONCAT_WS()`         | 带分隔符拼接字符串         |
| `LEFT()`              | 从左边截取字符串           |
| `RIGHT()`             | 从右边截取字符串           |
| `SUBSTRING()`         | 截取指定位置的子字符串     |
| `LENGTH()`            | 获取字符串长度             |
| `TRIM()`              | 去除首尾空格或指定字符     |
| `LCASE()` / `LOWER()` | 转换为小写                 |
| `UCASE()` / `UPPER()` | 转换为大写                 |
| `REPLACE()`           | 替换字符串中的子字符串     |
| `INSTR()`             | 查找子字符串首次出现的位置 |
| `LOCATE()`            | 查找子字符串首次出现的位置 |
| `REPEAT()`            | 重复字符串                 |
| `REVERSE()`           | 反转字符串                 |
| `FORMAT()`            | 将数字格式化为字符串       |
| `ASCII()`             | 获取字符的 ASCII 值        |
| `CHAR()`              | 将 ASCII 值转换为字符      |

```sql
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM user;

-- 截取左侧3个字符
SELECT LEFT(name, 3) AS short_name
FROM user;
```

3. 逻辑表达式

| 函数/表达式 | 作用   |
| ----------- | ------ |
| `AND`       | 逻辑与 |
| `OR`        | 逻辑或 |
| `NOT`       | 逻辑非 |
| `=`         | 等于   |
| `!=` / `<>` | 不等于 |
| `>`         | 大于   |
| `<`         | 小于   |

```sql
SELECT *
FROM user
WHERE age > 18 AND age < 30;

SELECT *
FROM user
WHERE city = 'New York' OR city = 'Los Angeles';

SELECT *
FROM user
WHERE NOT age < 18;
```

4. 比较表达式

| 函数/表达式 | 作用                          |
| ----------- | ----------------------------- |
| `=`         | 等于                          |
| `!=` / `<>` | 不等于                        |
| `>`         | 大于                          |
| `<`         | 小于                          |
| `>=`        | 大于或等于                    |
| `<=`        | 小于或等于                    |
| `BETWEEN`   | 检查一个值是否在范围内        |
| `LIKE`      | 模糊匹配，支持通配符 `%`、`_` |

```sql
SELECT *
FROM user
WHERE salary BETWEEN 30000 AND 50000;
```

5. NULL 表达式

| 函数/表达式   | 作用                  |
| ------------- | --------------------- |
| `IS NULL`     | 检查值是否为 `NULL`   |
| `IS NOT NULL` | 检查值是否不为 `NULL` |

```sql
SELECT *
FROM user
WHERE address IS NULL;
```

6. 日期和时间表达式

| 函数/表达式  | 作用                     |
| ------------ | ------------------------ |
| `NOW()`      | 获取当前日期和时间       |
| `CURDATE()`  | 获取当前日期（不含时间） |
| `CURTIME()`  | 获取当前时间（不含日期） |
| `DATE()`     | 从日期时间值提取日期部分 |
| `TIME()`     | 从日期时间值提取时间部分 |
| `YEAR()`     | 提取年份                 |
| `MONTH()`    | 提取月份                 |
| `DAY()`      | 提取日                   |
| `HOUR()`     | 提取小时                 |
| `MINUTE()`   | 提取分钟                 |
| `SECOND()`   | 提取秒                   |
| `DATEDIFF()` | 返回两个日期之间的天数差 |
| `ADDDATE()`  | 为日期加上指定的天数     |
| `SUBDATE()`  | 从日期中减去指定的天数   |

```sql
SELECT DATEDIFF(NOW(), '2023-01-01') AS days_difference;

SELECT ADDDATE('2024-10-01', INTERVAL 10 DAY) AS new_date;

SELECT SUBDATE('2024-10-11', INTERVAL 5 DAY) AS new_date;
```

7. 聚合表达式

| 函数/表达式 | 作用           |
| ----------- | -------------- |
| `SUM()`     | 计算总和       |
| `COUNT()`   | 统计记录的数量 |
| `AVG()`     | 计算平均值     |
| `MIN()`     | 返回最小值     |
| `MAX()`     | 返回最大值     |

```sql
-- 查询用户表的长度
SELECT COUNT(*) FROM user;
```

8. 其他

| 函数/表达式                              | 作用                               |
| ---------------------------------------- | ---------------------------------- |
| `RAND()`                                 | 生成随机数 0 和 1 之间的随机浮点数 |
| `IF(condition, true_value, false_value)` | 条件判断                           |

```sql
SELECT RAND() AS random_number;

SELECT name, IF(sex = 1, '男', '女') AS sex
FROM user;
```

### 聚合函数

将一列数据作为一个整体进行纵向计算

所有 null 不参与聚合函数

| 函数    | 作用   |
| ------- | ------ |
| `count` | 统计   |
| `max`   | 最大   |
| `min`   | 最小   |
| `avg`   | 平均数 |
| `sum`   | 求和   |

```sql
-- 统计 id 的总条数
SELECT count(*) FROM table_name;
SELECT count(id) FROM table_name;

SELECT avg(age) FROM table_name;

SELECT max(age) FROM table_name;

SELECT min(age) FROM table_name;

SELECT sum(age) FROM table_name
WHERE name LIKE '%f';
```

### 分组查询 group by

where 和 having 的区别

- 执行时机不同
  - where 分组前过滤
  - having 分组后过滤
- 判断条件不同
  - where 不能 用聚合函数
  - having 能用聚合函数

```sql
-- 性别分组查询
SELECT sex,count(sex) from table_name group by sex;
-- 性别分组 求年龄的平均值 别名as age_avg
SELECT sex, avg(age) as age_avg from table_name group by sex;

-- 年龄>15 地址分组 地址数量>1 的地址 最终结果都是 分组的
SELECT address, count(address) from table_name where age>=15 group by address having count(address)>1;
```

## 子查询 Subquery

一种嵌套在另一个查询语句中的查询。子查询通常用于从另一个查询的结果集中筛选数据。
子查询 用小括号 () 包裹

```sql
SELECT * FROM tables
WHERE user_id = (SELECT id FROM user WHERE id = 1)å
```

## 联表查询 JOIN Query

- 内连接 // 内连接返回两个表中匹配的记录。即，只有在两个表中都有相应的记录时，才会返回结果。

- 外连接
  - 左连接
  ```sql
  SELECT * FROM table1
  LEFT JOIN table2 ON table1.column = table2.column;
  ```
  - 右连接
  ```sql
  SELECT * FROM table1
  RIGHT JOIN table2 ON table1.column = table2.column;
  ```

```sql
-- 内连接
SELECT * FROM `user`,`tables` WHERE `user`.`id` = `tables`.`user_id`;

-- 左连接
SELECT * from `user` LEFT JOIN `tables` ON user.id = tables.user_id;
-- 右连接
SELECT * from `user` RIGHT JOIN `tables` ON user.id = tables.user_id;
```

## 数据备份 mysqldump

mysqldump 是 MySQL 提供的命令行工具，用于导出数据库的结构和数据。

```bash

```

## mysql2

```bash
npm i express mysql2 js-yaml
```

```js
import fs from "node:fs";
import mysql2 from "mysql2/promise";
import jsyaml from "js-yaml";
import express from "express";

const yaml = fs.readFileSync("./db.config.yaml", "utf-8");

// 加载 yaml文件
const DB_CONFIG = jsyaml.load(yaml);

const app = express();

app.use(express.json());

// 连接数据库
const sql = await mysql2.createConnection({
  ...DB_CONFIG.db,
});

// 查询全部
app.get("/users", async (req, res) => {
  const [data] = await sql.query("select * from user");
  res.send(data);
});

// 查询单个
app.get("/user/:id", async (req, res) => {
  const [data] = await sql.query(
    `select * from user where id = ${req.params.id}`
  );
  // or
  // const [data] = await sql.query("select * from user where id = ?", [
  //   req.params.id,
  // ]);
  res.send(data);
});

// 创建
app.post("/create", async (req, res) => {
  const { name } = req.body;
  await sql.query("insert into user (name) values (?)", [name]);
  res.send("ok");
});

// 更新
app.post("/update", async (req, res) => {
  const { id, name } = req.body;
  await sql.query("update user set name = ? where id = ?", [name, id]);
  res.send("ok");
});

// 删除
app.post("/delete", async (req, res) => {
  const { id } = req.body;
  await sql.query("delete from user where id = ?", [id]);
  res.send("ok");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```
