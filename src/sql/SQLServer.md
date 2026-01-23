# SQL Server

+ 微软的关系型数据库（RDBMS）
+ 使用 T‑SQL（Transact-SQL） 作为查询语言
+ ERP 系统（如金蝶、用友、SAP B1）大量使用 SQL Server

## 数据类型
+ 数值类型 (Numeric)
+ 字符串类型 (Character Strings)
+ 日期和时间类型 (Date and Time)
+ 其他特殊类型

### 数值类型
用于存储数字，分为精确数值和近似数值。

| 类型           | 说明                                 | 常用场景               |
| -------------- | ------------------------------------ | ---------------------- |
| `INT`          | 4 字节整数（约正负 21 亿）           | 数量、ID、计数         |
| `BIGINT`       | 8 字节大整数                         | 海量数据的 ID          |
| `DECIMAL(p,s)` | 精确小数。`p` 是总位数，`s` 是小数位 | 价格、金额（必须精确） |
| `FLOAT`        | 近似浮点数（科学计数法）             | 科学计算、传感器数据   |
| `BIT`          | `0`, `1` 或 `NULL`                   | 布尔值（真/假）、开关  |

### 字符串类型
关键在于 固定长度 vs 可变长度 以及 是否支持 Unicode。

| 类型          | 是否 Unicode | 长度   | 存储特点                                              |
| ------------- | ------------ | ------ | ----------------------------------------------------- |
| `CHAR(n)`     | 否           | 固定 n | 不足长度补空格。适合长度固定的代码（如 ISO 国家码）。 |
| `VARCHAR(n)`  | 否           | 可变 n | 最常用。存多少占多少。适合普通英文、数字。            |
| `NCHAR(n)`    | 是           | 固定 n | 每个字符占 2 字节。适合固定长度的中文。               |
| `NVARCHAR(n)` | 是           | 可变 n | 处理中文首选。支持多国语言，避免乱码。                |

::: warning
`VARCHAR` 和 `NVARCHAR` 的区别
+ `VARCHAR(10)`：占 4 个字节（如果是 GBK 编码，每个汉字 2 字节）。
+ `NVARCHAR(10)`：占 4 个字节（每个 Unicode 字符固定 2 字节）。

建议：在存储中文姓名、地址等内容时，统一使用 NVARCHAR，并在查询字符串前加 N 前缀（例如：WHERE Name = N'李四'），这样可以确保解析正确。
:::

### 日期和时间类型

| 类型        | 格式                        | 精度             | 常用场景                   |
| ----------- | --------------------------- | ---------------- | -------------------------- |
| `DATE`      | YYYY-MM-DD                  | 仅日期           | 生日、入职日期             |
| `DATETIME`  | YYYY-MM-DD HH:MM:SS.mmm     | 3.33 毫秒        | 旧系统常见类型             |
| `DATETIME2` | YYYY-MM-DD HH:MM:SS.fffffff | 100 纳秒         | 现代标准，精度更高且省空间 |
| `GETDATE()` | 函数                        | 获取当前系统时间 | 默认值约束                 |

### 其他特殊类型

+ `UNIQUEIDENTIFIER`：存储 GUID（全球唯一标识符）。
    示例：6F9619FF-8B86-D011-B42D-00C04FC964FF。
+ `VARBINARY(MAX)`：存储二进制数据（如图片、PDF 文件）。

::: warning
隐式转换陷阱
`WHERE` 子句中将 `VARCHAR` 列与 `INT` 值比较，SQL Server 会尝试自动转换。这可能导致索引失效，性能剧降。

-- 假设 OrderID 是 VARCHAR 类型，但你传了数字
`SELECT * FROM Orders WHERE OrderID = 12345; `
-- 建议写法（匹配类型）：
`SELECT * FROM Orders WHERE OrderID = '12345';`
:::

## 常用约束（Constraint）

| 约束          | 作用                  |
| ------------- | --------------------- |
| `PRIMARY KEY` | 主键（唯一 + 不为空） |
| `NOT NULL`    | 不允许为空            |
| `UNIQUE`      | 唯一                  |
| `DEFAULT`     | 默认值                |
| `FOREIGN KEY` | 外键（关联其他表）    |


## 打印

::: code-group
```sql [PRINT]
-- 打印文本
PRINT 'Hello World';
PRINT 123;
PRINT 3 + 5;
```

```sql [SELECT]
-- 查询输出 
SELECT 'Hello World';
SELECT 3 + 5;
```
:::

## 变量

| 类型     | 前缀 | 说明                    |
| -------- | ---- | ----------------------- |
| 局部变量 | `@`  | 只在当前批次/过程内有效 |
| 全局变量 | `@@` | 系统内置变量（只读）    |

::: code-group

```sql
DECLARE @变量名 类型;
```

```sql [@]
-- 声明
DECLARE @name NVARCHAR(50);
DECLARE @age INT;
```

```sql
SET @变量名 = 值;
-- or
SELECT @变量名 = 值;
```

```sql [赋值]
SET @name = '张三';
SELECT @age = 18;
```

```sql [打印]
PRINT @name;
SELECT @age;
```

```sql [@@]
-- 查看 SQL Server 版本
SELECT @@VERSION;
```
:::

| 变量         | 含义                 |
| ------------ | -------------------- |
| `@@VERSION`  | SQL Server 版本      |
| `@@ROWCOUNT` | 上一条语句影响的行数 |
| `@@ERROR`    | 上一条语句的错误码   |
| `@@IDENTITY` | 最近插入的自增 ID    |

### SELECT vs SET
| 功能           | SELECT     | SET  |
| -------------- | ---------- | ---- |
| 给变量赋值     | ✅          | ✅    |
| 一次赋多个变量 | ✅          | ❌    |
| 从表中取值     | ✅          | ✅    |
| 多行结果       | 取最后一行 | 报错 |
| 标准 SQL       | cuo        | ✅    |

## 运算符
1. 算术运算符

| 运算符 | 含义 |
| ------ | ---- |
| `+`    | 加法 |
| `-`    | 减法 |
| `*`    | 乘法 |
| `/`    | 除法 |
| `%`    | 取余 |

```sql
SELECT 3 + 5 AS AddResult;
SELECT 10 - 4 AS SubResult;
SELECT 6 * 7 AS MulResult;
SELECT 20 / 4 AS DivResult;
SELECT 10 % 3 AS ModResult;
```

2. 比较运算符

| 运算符 | 含义     |
| ------ | -------- |
| `=`    | 等于     |
| `<>`   | 不等于   |
| `>`    | 大于     |
| `<`    | 小于     |
| `>=`   | 大于等于 |
| `<=`   | 小于等于 |

```sql
SELECT * FROM Employees WHERE Salary > 20000;
SELECT * FROM Employees WHERE DeptID <> 10;
```

3. 逻辑运算符

| 运算符 | 含义             |
| ------ | ---------------- |
| `AND`  | 并且（同时满足） |
| `OR`   | 或者（满足其一） |
| `NOT`  | 取反             |

```sql
SELECT * FROM Employees
WHERE Salary > 15000 AND DeptID = 20;

SELECT * FROM Employees
WHERE DeptID = 10 OR DeptID = 20;

SELECT * FROM Employees
WHERE NOT Salary < 20000;
```

4. 子查询比较运算符

| 运算符 | 含义                                        |
| ------ | ------------------------------------------- |
| `ALL`  | 与子查询结果的所有值比较                    |
| `ANY`  | 与子查询结果的任意一个值比较                |
| `SOME` | 与子查询结果的任意一个值比较（与 ANY 等价） |

5. 模糊匹配

| 模式 | 含义         |
| ---- | ------------ |
| `%`  | 任意长度字符 |
| `_`  | 单个字符     |

```sql
SELECT * FROM Employees WHERE EmpName LIKE '张%';   -- 张开头
SELECT * FROM Employees WHERE EmpName LIKE '%三';   -- 三结尾
SELECT * FROM Employees WHERE EmpName LIKE '_三';   -- 第二个字是三
```

6. 集合运算符 （IN / NOT IN / BETWEEN）

::: code-group
```sql [IN]
-- 在集合中
SELECT * FROM Employees WHERE DeptID IN (10, 20);
```

```sql [NOT IN]
-- 不在集合中
SELECT * FROM Employees WHERE DeptID NOT IN (30, 40);
```

```sql [BETWEEN]
-- 范围
SELECT * FROM Employees WHERE Salary BETWEEN 15000 AND 25000;
```
:::

7. 空值判断（IS NULL / IS NOT NULL）

```sql
SELECT * FROM Employees WHERE DeptID IS NULL;
SELECT * FROM Employees WHERE Salary IS NOT NULL;
```

8. 字符串运算符 
    `+` 字符串拼接

```sql
SELECT 'Hello ' + 'World';
```

## 语法

### 创建数据库

::: code-group

```sql [CREATE DATABASE ]
CREATE DATABASE MyDatabase;
-- 等创建完成 
GO 
-- 创建后切换到该数据库
USE MyDatabase;
```

```sql [DROP DATABASE]
-- 删除数据库
DROP DATABASE MyDatabase;
```

```sql
-- 查看所有数据库
SELECT name, database_id, create_date 
FROM sys.databases;
```
:::

::: code-group
```sql
CREATE DATABASE MyDatabase
-- ON PRIMARY 定义主文件组，用于存放实际的业务数据（表、索引等）
ON PRIMARY (
    NAME = MyDatabase_Data,               -- 逻辑名称：在 SQL Server 内部引用的名字
    FILENAME = 'C:\Data\MyDatabase.mdf',  -- 物理路径：磁盘上的真实存放位置（后缀通常为 .mdf）
    SIZE = 10MB,                          -- 初始大小：数据库刚创建时的容量
    MAXSIZE = 1GB,                        -- 最大容量：防止数据库无限增长耗尽磁盘空间
    FILEGROWTH = 10MB                     -- 自动增长：当 10MB 用完后，每次自动增加 10MB
)
-- LOG ON 定义事务日志，用于记录所有数据修改操作，以便进行回滚或恢复
LOG ON (
    NAME = MyDatabase_Log,                -- 日志逻辑名称
    FILENAME = 'C:\Data\MyDatabase.ldf',  -- 日志物理路径（后缀通常为 .ldf）
    SIZE = 5MB,                           -- 日志初始大小
    FILEGROWTH = 5MB                      -- 日志自动增长：建议设置为固定值（如 5MB），而非百分比
);
```
+ MDF 文件：主数据文件，存放表、索引、存储过程等核心数据。
+ LDF 文件：事务日志文件，记录所有的修改操作（用于事务回滚和数据恢复）。

:::

### 创建表

::: code-group
```sql
CREATE TABLE 表名 (
    字段名 数据类型 约束,
    字段名 数据类型 约束,
    ...
);
```

```sql [CREATE TABLE]
CREATE TABLE Employees (
    EmpID INT PRIMARY KEY IDENTITY(1,1),
    EmpName VARCHAR(50) NOT NULL,
    DeptID INT NOT NULL,
    Salary INT NOT NULL,
    HireDate DATE DEFAULT GETDATE()
);
-- EmpID：主键，自增
-- EmpName：员工姓名
-- DeptID：部门 ID
-- Salary：工资
-- HireDate：默认今天
```
:::
 
### 基础查询

+ `SELECT`
    - `TOP n`               只取前 n 条
    - `TOP n PERCENT`       取 n% 条
    - `ORDER BY` xxx `ASC`      从小到大
    - `ORDER BY` xxx `DESC`     从大到小

::: code-group

```sql
SELECT 字段列表
FROM 表名
WHERE 条件
ORDER BY 排序字段;
```

```sql [SELECT]
SELECT *
FROM Users;

SELECT name, email
FROM Users;
```

```sql [TOP]
-- 只取前 10 行记录
SELECT TOP 10 *
FROM Employees;
```

```sql [TOP ... PERCENT]
-- 取 10% 条记录
SELECT TOP 10 PERCENT
FROM Employees;
```
:::

+ `WHERE`
    - `IN`      多个值之一
    - `=`
    - `<>`      不等于
    - `>`
    - `<`      
    - `>=`
    - `<=`
    - `BETWEEN AND` 范围
    - `LIKE`    模糊查询
    - `AND`
    - `OR`      
    - `IS NULL`     为空值
    - `IS NOT NULL` 不为空

::: code-group
```sql
SELECT 列 
FROM 表 
WHERE 条件;
```

```sql [>]
-- 查工资大于 8000
SELECT * 
FROM Employees 
WHERE Salary > 8000;
```

```sql [IN]
-- 查部门是 技术部 或 销售部 的员工
SELECT * 
FROM Employees 
WHERE Department IN ('技术部', '销售部');
```

```sql [BETWEEN AND]
-- 查工资在 5000 到 8000 之间
SELECT * 
FROM Employees 
WHERE Salary BETWEEN 5000 AND 8000;
```

```sql [AND]
-- 查技术部 + 工资大于 8000
SELECT *
FROM Employees
WHERE Department = '技术部' AND Salary > 8000;
```

```sql [OR]
-- 查技术部 或 销售部
SELECT *
FROM Employees
WHERE Department = '技术部' OR Department = '销售部';
```

```sql [IS NULL]
-- 查没有填写部门的员工
SELECT *
FROM Employees
WHERE Department IS NULL;
```
:::

### 模糊搜索 LIKE

| 通配符 | 含义                       | 示例             | 匹配结果                        |
| ------ | -------------------------- | ---------------- | ------------------------------- |
| `%`    | 匹配 0 个或多个 字符       | `LIKE '张%'`     | 张三、张小凡、张（单个字也行）  |
| `_`    | 匹配 1 个 字符（占位符）   | `LIKE '张_'`     | 张三、张飞（必须是两个字）      |
| `[]`   | 匹配 括号内 的任意一个字符 | `LIKE '[张李]%'` | 姓张或姓李的人                  |
| `[^]`  | 不匹配 括号内的任意字符    | `LIKE '[^张]%'`  | 不姓张的人                      |
| `[-]`  | 匹配 指定范围 内的字符     | `LIKE '[a-e]%'`  | "以 a, b, c, d, e 开头的字符串" |

::: code-group

```sql
SELECT 字段
FROM 表名 
WHERE 字段 LIKE 条件;
```

```sql [%]
-- 查找名字里带有“小”字的员工：
SELECT * 
FROM Employees 
WHERE EmpName LIKE N'%小%';

-- 查姓名以“王”开头
SELECT *
FROM Employees
WHERE EmployeeName LIKE '王%';
```

```sql [_]
-- 查找姓“王”，且名字一共只有两个字的员工：
-- _有且仅有1个字符
SELECT *
FROM Employees
WHERE EmployeeName LIKE '王_';
```

```sql [[]]
-- 查找编号以 A、B 或 C 开头的订单
-- []匹配 括号内 的任意一个字符
SELECT * 
FROM Orders 
WHERE OrderCode LIKE '[A-C]%';
```

```sql [[^]]
-- 不姓张的人
-- [^]不匹配 括号内的任意字符
SELECT *
FROM Employees
WHERE EmployeeName LIKE '[^张]%';
```

:::

### 分组与聚合

+ `ORDER BY`     排序
  - `ASC`   升序（默认）
  - `DESC`  降序
+ `DISTINCT`    去重
+ `LEN`     字符串长度
+ `ISNULL`  字符串替换
+ `CONCAT`  字符串拼接

+ `GROUP BY`
+ `HAVING`      对分组结果过滤

::: code-group

```sql
SELECT 列 
FROM 表 
ORDER BY 列;
```

```sql [ORDER BY]
SELECT *
FROM Employees
ORDER BY Salary;
```

```sql [DESC]
-- 按工资从高到低排序
SELECT *
FROM Employees
ORDER BY Salary DESC;
```

```sql [DISTINCT]
-- 查所有部门（不重复）
SELECT DISTINCT Department
FROM Employees;
```

```sql [LEN]
-- 查姓名长度大于 2 的员工
SELECT Department
FROM Employees
WHERE LEN(EmployeeName) > 2;
```

```sql [ISNULL]
-- 把 NULL 替换成默认值
SELECT EmployeeName,
       ISNULL(Department, '未分配') AS Dept
FROM Employees;
```

```sql [CONCAT]
-- 拼接字符串
SELECT CONCAT(EmployeeName, '（', Department, '）') AS Info
FROM Employees;
```
:::

### 多表查询

+ `JOIN`
  - `INNER JOIN`	只取匹配数据（最常用）
  - `LEFT JOIN`	    取左表全部 + 右表匹配
  - `RIGHT JOIN`	取右表全部
  - `FULL JOIN`	    两边都取
  - `CROSS JOIN`    笛卡尔积 左表 × 右表，每行都互相组合

Employees（员工表）

| EmployeeID | EmployeeName | Department |
| ---------- | ------------ | ---------- |
| 1          | 张三         | 技术部     |
| 2          | 李四         | 销售部     |
| 3          | 王五         | 技术部     |

Salaries（工资表）

| EmployeeID | Salary |
| ---------- | ------ |
| 1          | 8000   |
| 2          | 12000  |

::: code-group

```sql 
SELECT *
FROM 表A 别名A
JOIN 表B 别名B
    ON 别名A.字段 = 别名B.字段;
```

```sql [INNER JOIN]
-- 查员工姓名 + 工资
SELECT e.EmployeeName, s.Salary
FROM Employees e
INNER JOIN Salaries s
    ON e.EmployeeID = s.EmployeeID;

-- Employees e 给 Employees 起别名 e
-- Salaries s 给 Salaries 起别名 s
-- ON e.EmployeeID = s.EmployeeID 是关联条件
```

```sql [LEFT JOIN]
-- 查所有员工 + 工资（没有工资的显示 NULL）
SELECT e.EmployeeName, s.Salary
FROM Employees e
LEFT JOIN Salaries s
    ON e.EmployeeID = s.EmployeeID;
```

```sql [RIGHT JOIN]
-- 保留右表全部行，左表匹配不到的用 NULL
SELECT e.EmpName, d.DeptName
FROM Employees e
RIGHT JOIN Departments d
    ON e.DeptID = d.DeptID;
```

```sql [FULL JOIN]
-- 左右两表全部保留，匹配不到的用 NULL
SELECT e.EmpName, d.DeptName
FROM Employees e
FULL JOIN Departments d
    ON e.DeptID = d.DeptID;
```

```sql [CROSS JOIN]
-- 左表 × 右表，每行都互相组合
SELECT e.EmpName, d.DeptName
FROM Employees e
CROSS JOIN Departments d;
```
:::


#### 自连接

物理上只有一张表，但在逻辑上我们把它“分身”成了两张表来用。


通过在同一张表内建立“父子关系”来表达层级结构

| DeptId (主键) | DeptName   | ParentId (上级编号) |
| ------------- | ---------- | ------------------- |
| 1             | 软件部     | NULL                |
| 2             | 硬件部     | NULL                |
| 3             | 软件研发部 | 1                   |
| 4             | 软件测试部 | 1                   |
| 5             | 硬件研发部 | 2                   |

::: code-group

```sql
SELECT 
    Sub.DeptName AS [当前部门],
    Super.DeptName AS [上级部门]
FROM Dept AS Sub
-- 使用左连接，确保没有上级的部门（如软件部）也能显示出来
LEFT JOIN Dept AS Super 
    ON Sub.ParentId = Super.DeptId;
```

| 当前部门   | 上级部门 |
| ---------- | -------- |
| 软件部     | NULL     |
| 硬件部     | NULL     |
| 软件研发部 | 软件部   |
| 软件测试部 | 软件部   |
| 硬件研发部 | 硬件部   |

:::

### 分组

+ `GROUP BY` 
+ `HAVING`      过滤

+ `COUNT()`
+ `SUM()`
+ `AVG()`
+ `MIN()`
+ `MAX()`
  
+ `DATEDIFF(year|month|day, 1991-1-1, 1993-3-3)`

::: code-group

```sql 
SELECT 分组字段, 聚合函数
FROM 表
WHERE 普通条件
GROUP BY 分组字段;
HAVING 聚合条件
```

```sql [GROUP BY]
-- 按部门 + 职位统计人数
SELECT Department, Position, COUNT(*) AS Cnt
FROM Employees
GROUP BY Department, Position;
```

```sql [HAVING]
-- 查出人数大于 5 的部门
SELECT Department, COUNT(*) AS Cnt
FROM Employees
GROUP BY Department
HAVING COUNT(*) > 5;
```

```sql [COUNT]
-- 按部门统计员工数量
SELECT Department, COUNT(*) AS EmployeeCount
FROM Employees
GROUP BY Department;
```

```sql [AVG]
-- 按部门统计平均工资
SELECT Department, AVG(Salary) AS AvgSalary
FROM Employees
GROUP BY Department;
```

```sql [GROUP BY ORDER BY]
-- 按部门统计人数，并按人数从多到少排序
SELECT Department, COUNT(*) AS Cnt
FROM Employees
GROUP BY Department
ORDER BY Cnt DESC;
```
:::

### 子查询 Subquery

在一条 SQL 里再嵌套一条 SQL。

1. `WHERE` 中的子查询（最常用）
2. `FROM` 中的子查询（把子查询当成一张表）
    + 先统计
    + 再排序
    + 再过滤

#### 单行子查询（=、>、<）
#### 多行子查询（IN、ANY、ALL）

::: code-group

```sql [WHERE 子查询]
-- 查工资高于全公司平均工资的员工
SELECT EmployeeName, Salary
FROM Employees
WHERE Salary > (
    SELECT AVG(Salary)
    FROM Employees
);

-- 内层子查询算出平均工资
-- 外层查询找出工资 > 平均工资的员工
```

```sql [FROM 子查询]
-- 查每个部门的平均工资，并按平均工资从高到低排序
SELECT *
FROM (
    SELECT Department, AVG(Salary) AS AvgSalary
    FROM Employees
    GROUP BY Department
) AS t
ORDER BY t.AvgSalary DESC;

-- 查每个员工的工资 + 全公司平均工资
SELECT 
    EmployeeName,
    Salary,
    (SELECT AVG(Salary) FROM Employees) AS AvgSalary
FROM Employees;
```

```sql [多行子查询]
-- 查出工资高于公司平均工资的员工姓名和工资
SELECT EmployeeName, Salary
FROM Employees
WHERE Salary > (
    SELECT AVG(Salary)
    FROM Employees
);

-- 查出工资属于“技术部所有工资”的员工
SELECT EmployeeName, Salary
FROM Employees
WHERE Salary IN (
    SELECT Salary
    FROM Employees
    WHERE Department = '技术部'
);
```

:::

### 窗口函数

窗口函数 = 在不合并行的前提下，对一组行做排序、排名、累计、对比的函数。

+ `PARTITION BY`  
+ `ORDER BY`

+ `ROW_NUMBER OVER`    严格排名 绝对序号（不管并列）
+ `RANK OVER`          并列排名（跳号）
+ `DENSE_RANK OVER`    并列排名（不跳号）

+ `SUM OVER`	    累计求和
+ `AVG OVER`	    平均值（不合并行）
+ `MAX OVER`	    每行显示组内最大值
+ `MIN OVER`        每行显示组内最小值
+ `COUNT OVER`      每行显示组内数量

+ `LAG OVER`     获取“上一行”的值
+ `LEAD OVER`    获取“下一行”的值

+ `NTILE(n) OVER`   分桶函数 把数据平均分成 n 份

+ `FIRST_VALUE OVER`    取窗口内的第一行
+ `LAST_VALUE OVER`     取窗口内的最后一行

::: code-group

```sql
函数名() OVER (PARTITION BY ... ORDER BY ...)
```

```sql [ROW_NUMBER]
-- 绝对序号（不管并列）
-- 每个部门按工资降序排名
SELECT EmployeeName, Department, Salary,
    ROW_NUMBER() OVER (
        PARTITION BY Department
        ORDER BY Salary DESC
    ) AS SalaryRank
FROM Employees;
```

```sql [RANK]
-- 有并列，会跳号（1、2、2、4…）
-- 每个部门工资排名（并列工资并列名次）

SELECT EmployeeName, Department, Salary,
    RANK() OVER (
        PARTITION BY Department
        ORDER BY Salary DESC
    ) AS SalaryRank
FROM Employees;
```

```sql [DENSE_RANK]
-- 有并列，不跳号（1、2、2、3…）
-- 每个部门工资排名（并列但不跳号）
SELECT EmployeeName, Department, Salary,
    DENSE_RANK() OVER (
        PARTITION BY Department
        ORDER BY Salary DESC
    ) AS SalaryRank
FROM Employees;
```

```sql [LAG]
-- 比较员工工资与上一名的差距
SELECT EmployeeName, Salary,
    LAG(Salary) OVER (
        ORDER BY Salary DESC
    ) AS PrevSalary
FROM Employees;
```

```sql [LEAD]
SELECT EmployeeName, Salary,
    LEAD(Salary) OVER (
        ORDER BY Salary DESC
    ) AS NextSalary
FROM Employees;
```

```sql [NTILE]
-- 按工资分成 4 档（四分位）
SELECT EmployeeName, Salary,
    NTILE(4) OVER (
        ORDER BY Salary DESC
    ) AS SalaryQuartile
FROM Employees;
```

```sql [FIRST_VALUE]
-- 每个部门工资最高的人是谁
SELECT EmployeeName, Department, Salary,
    FIRST_VALUE(EmployeeName) OVER (
        PARTITION BY Department
        ORDER BY Salary DESC
    ) AS TopEmployee
FROM Employees;
```

```sql [LAST_VALUE]
-- 每个部门工资最低的人是谁
SELECT 
    EmployeeName,
    Department,
    Salary,
    LAST_VALUE(EmployeeName) OVER (
        PARTITION BY Department
        ORDER BY Salary DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS LowestEmployee
FROM Employees;
```
:::

### 数据修复基础

+ `INSERT INTO`
+ `UPDATE`
+ `DELETE`

#### 插入

::: code-group

```sql
INSERT INTO 表名 (字段1, 字段2, ...)
VALUES (值1, 值2, ...);
```

```sql [一次插入]
INSERT INTO People (EmpName, Salary)
VALUES (N'张三', 8000);
```

```sql [批量插入]
INSERT INTO People (EmpName, Salary)
VALUES 
    (N'李四', 7500),
    (N'王五', 9000),
    (N'赵六', 6000);
```
:::

#### 更新

::: code-group

```sql [UPDATE ... SET]
UPDATE 表名
SET 字段 = 新值
WHERE 条件;

-- 把“李四”的工资改为 20000
UPDATE Employees
SET Salary = 20000
WHERE EmployeeName = '李四';
```

```sql [批量插入]
INSERT INTO EmployeesBackup (EmployeeName, Department, Salary)
SELECT EmployeeName, Department, Salary
FROM Employees
WHERE Department = '技术部';
```

```sql [批量更新]
UPDATE e
SET e.Department = d.NewDeptName
FROM Employees e
JOIN DepartmentMapping d
    ON e.Department = d.OldDeptName;
```
:::

#### 删除

```sql [DELETE]
DELETE FROM 表名 WHERE 条件;

-- 删除工资为 15000 的员工
DELETE FROM Employees
WHERE Salary = 15000;
```
:::

### 事务

事务 = 一组要么全部成功，要么全部失败的操作。

+ `BEGIN TRAN`
+ `ROLLBACK`
+ `COMMIT`

```sql
-- 开始事务
BEGIN TRAN;

-- 你的 SQL（INSERT / UPDATE / DELETE）

ROLLBACK;  -- 撤销
-- 或
COMMIT;    -- 提交
```
#### 事务的黄金流程

::: code-group
```sql
-- 第一步：开始事务
BEGIN TRAN

-- 第二步：执行你的 UPDATE / DELETE
DELETE FROM Employees
WHERE Department = '财务部';

-- 第三步：检查结果（非常关键）
SELECT * FROM Employees;

-- 第四步：决定提交还是撤销
ROLLBACK; -- 发现删错 回滚
-- 或
COMMIT; -- 确认没问题 提交
```

```sql [成功提交]
BEGIN TRAN;

UPDATE Employees SET Salary = Salary + 1000 WHERE EmpID = 1;
UPDATE Employees SET Salary = Salary + 2000 WHERE EmpID = 2;

COMMIT;
```

```sql [失败回滚]
BEGIN TRAN;

UPDATE Employees SET Salary = Salary + 1000 WHERE EmpID = 1;

-- 这里假设报错，比如字段不存在
UPDATE Employees SET WrongColumn = 123 WHERE EmpID = 2;

ROLLBACK;
```

```sql [@@ERROR]
-- @@ERROR 判断事务是否成功
BEGIN TRAN;

UPDATE Employees SET Salary = Salary + 1000 WHERE EmpID = 1;

IF @@ERROR <> 0
BEGIN
    ROLLBACK;
    RETURN;
END

COMMIT;
```

```sql [TRY…CATCH]
BEGIN TRY
    BEGIN TRAN;

    UPDATE Employees SET Salary = Salary + 1000 WHERE EmpID = 1;
    UPDATE Employees SET Salary = Salary + 2000 WHERE EmpID = 2;

    COMMIT;
END TRY
BEGIN CATCH
    ROLLBACK;

    SELECT ERROR_MESSAGE() AS ErrorMsg;
END CATCH;
```
:::

### 视图（VIEW）

视图是保存 SQL 查询的“虚拟表”，让复杂查询变简单。

#### 用途
1. 简化复杂 SQL
    把 `JOIN`、子查询、窗口函数封装起来。
2. 隐藏敏感字段
    比如隐藏工资、身份证号。
3. 统一报表逻辑
    ERP 报表常用视图来统一数据口径。
4. 减少重复代码
    不用每次都写 `JOIN`。

::: code-group
```sql
-- 创建视图
CREATE VIEW 视图名 AS
SELECT ...
FROM ...
WHERE ...;
```

```sql [CREATE VIEW]
-- 创建一个“员工 + 部门名称”的视图
CREATE VIEW vw_EmployeeInfo AS
SELECT 
    e.EmpID,
    e.EmpName,
    d.DeptName,
    e.Salary
FROM Employees e
LEFT JOIN Departments d
    ON e.DeptID = d.DeptID;

-- 就可以这样查
SELECT * FROM vw_EmployeeInfo;
```

```sql [ALTER VIEW]
-- 更新视图
ALTER VIEW vw_EmployeeInfo AS
SELECT ...
```

```sql [DROP VIEW]
-- 删除视图
DROP VIEW vw_EmployeeInfo;
```

:::

::: warning
不可更新视图（Non-updatable View）
如果视图包含：
+ `GROUP BY`
+ `DISTINCT`
+ 聚合函数（`SUM`、`AVG`）
+ `UNION`
+ 子查询
+ 窗口函数

那么视图只能 SELECT，不能修改。
:::

### 函数

函数 = 输入参数 → 返回一个值（或表）

分两大类
+ 内置函数（系统自带）
+ 用户自定义函数（UDF）

### 内置函数
1. 字符串函数
2. 数学函数
3. 日期时间函数
4. 聚合函数
5. 转换函数
6. 系统函数

#### 字符串函数
::: code-group
```sql [LEN]
-- LEN：长度
SELECT LEN('Hello');   -- 5
```

```sql [UPPER / LOWER]
-- UPPER / LOWER：大小写
SELECT UPPER('abc');   -- ABC
SELECT LOWER('ABC');   -- abc
```

```sql [SUBSTRING]
-- SUBSTRING：截取字符串
SELECT SUBSTRING('abcdef', 2, 3);  -- bcd
```

```sql [REPLACE]
-- REPLACE：替换
SELECT REPLACE('a-b-c', '-', '_');  -- a_b_c
```

```sql [CONCAT]
-- CONCAT：拼接
SELECT CONCAT('Hello ', 'World');
```
:::

#### 数学函数

::: code-group

```sql [ABS]
-- ABS：绝对值
SELECT ABS(-10);  -- 10
```

```sql [ROUND]
-- ROUND：四舍五入
SELECT ROUND(123.456, 2);  -- 123.46
```

```sql [CEILING / FLOOR]
-- CEILING / FLOOR：向上 / 向下取整
SELECT CEILING(4.2);  -- 5
SELECT FLOOR(4.8);    -- 4
```
:::

#### 日期时间函数

::: code-group

```sql [GETDATE]
-- GETDATE：当前时间
SELECT GETDATE();

```

```sql [DATEADD]
-- DATEADD：加减时间
SELECT DATEADD(DAY, 7, GETDATE());  -- 当前时间 + 7 天
```

```sql [DATEDIFF]
-- DATEDIFF：时间差
SELECT DATEDIFF(DAY, '2024-01-01', '2024-01-10');  -- 9
```

```sql [YEAR / MONTH / DAY]
-- YEAR / MONTH / DAY：取年月日
SELECT YEAR(GETDATE());
SELECT MONTH(GETDATE());
SELECT DAY(GETDATE());
```
:::


#### 聚合函数

聚合函数必须配合 GROUP BY 或整表使用

::: code-group

```sql [COUNT]
-- COUNT：数量
SELECT COUNT(*) FROM Employees;
```

```sql [SUM]
--  SUM：求和
SELECT SUM(Salary) FROM Employees;
```

```sql [AVG]
--  AVG：平均值
SELECT AVG(Salary) FROM Employees;
```

```sql [MAX]
--  MAX / MIN：最大最小
SELECT MAX(Salary), MIN(Salary) FROM Employees;
```
:::

#### 转换函数

::: code-group

```sql [CAST]
-- CAST：类型转换
SELECT CAST(123 AS VARCHAR(10));
```

```sql [CONVERT]
-- CONVERT：格式化日期
SELECT CONVERT(VARCHAR(10), GETDATE(), 120);  -- yyyy-mm-dd
```

:::

#### 系统函数

```sql [@@IDENTITY]
-- @@IDENTITY：最近插入的自增 ID
INSERT INTO Employees(Name) VALUES ('Tom');
SELECT @@IDENTITY;
```

```sql [SCOPE_IDENTITY]
-- SCOPE_IDENTITY（更推荐）
SELECT SCOPE_IDENTITY();
```

```sql [@@ROWCOUNT]
-- @@ROWCOUNT：上一条语句影响行数
UPDATE Employees SET Salary = Salary + 1000;
SELECT @@ROWCOUNT;
```

#### 用户自定义函数

1. 标量函数（Scalar Function） → 返回单个值
2. 表值函数（Inline Table-Valued Function） → 返回表
3. 多语句表值函数（Multi-Statement TVF） → 返回表（多语句）

::: code-group

```sql

CREATE FUNCTION 函数名(参数1 参数1类型, 参数2 参数2类型)
RETURNS 返回值类型
AS
BEGIN
    RETURN ...
END

-- 调用
SELECT dbo.函数名(参数1, 参数2);
```

```sql [标量函数（返回一个值）]
CREATE FUNCTION fn_Add(@a INT, @b INT)
RETURNS INT
AS
BEGIN
    RETURN @a + @b;
END

-- 调用
SELECT dbo.fn_Add(3, 5); -- 8
```

```sql [内联表值函数（返回表）]
CREATE FUNCTION fn_GetHighSalary()
RETURNS TABLE
AS
RETURN (
    SELECT * FROM Employees WHERE Salary > 20000
);

-- 调用
SELECT * FROM dbo.fn_GetHighSalary();
```
:::

### 存储过程

存储过程 = 可以重复执行的 SQL 程序（带参数、带逻辑、可复用）

SQL 版本的函数/脚本/自动化工具

可以包含

+ `SELECT`
+ `INSERT`
+ `UPDATE`
+ `DELETE`
+ `IF` / `ELSE`
+ 变量
+ 循环
+ 事务（`BEGIN TRAN` / `COMMIT` / `ROLLBACK`）

::: code-group

```sql
CREATE PROCEDURE 存储过程名
AS
BEGIN
    SQL语句...
END;
```

```sql [CREATE PROCEDURE]
-- 1. 创建一个简单存储过程（查询所有员工）
CREATE PROCEDURE sp_GetAllEmployees
AS
BEGIN
    SELECT * FROM Employees;
END;

-- 2. 执行
EXEC sp_GetAllEmployees;
```

```sql [ALTER PROCEDURE]
-- 修改存储过程
ALTER PROCEDURE sp_GetAllEmployees
AS
BEGIN
    SELECT EmpName, Salary FROM Employees;
END;
```

```sql [DROP PROCEDURE]
-- 删除存储过程
DROP PROCEDURE sp_GetAllEmployees;
```
:::

#### 参数分三类：

1. 输入参数（Input Parameter）
2. 输出参数（Output Parameter）
3. 输入输出参数（Input/Output Parameter）

::: code-group

```sql [简单存储过程]
CREATE PROCEDURE sp_GetAllEmployees
AS
BEGIN
    SELECT * FROM Employees;
END;

-- 执行
EXEC sp_GetAllEmployees;
```

```sql [输入参数]
-- 根据部门查询员工
CREATE PROCEDURE sp_GetEmployeesByDept
    @DeptID INT
AS
BEGIN
    SELECT *
    FROM Employees
    WHERE DeptID = @DeptID;
END;

-- 执行 并传参
EXEC sp_GetEmployeesByDept 20;
```

```sql [输出参数]
-- OUTPUT 输出参数标识
CREATE PROCEDURE sp_GetSalary
    @EmpName NVARCHAR(50),
    @Salary INT OUTPUT
AS
BEGIN
    SELECT @Salary = Salary
    FROM Employees
    WHERE EmpName = @EmpName;
END;

-- 调用 
DECLARE @S INT;

EXEC sp_GetSalary '张三', @S OUTPUT;

PRINT @S;

```

```sql [输入 + 输出参数]
-- 参数既能传入，也能传出
-- OUTPUT 既是输入又是输出

CREATE PROCEDURE sp_RaiseSalary
    @EmpName NVARCHAR(50),
    @Salary INT OUTPUT
AS
BEGIN
    -- 先查出当前工资
    SELECT @Salary = Salary
    FROM Employees
    WHERE EmpName = @EmpName;

    -- 涨 10%
    SET @Salary = @Salary * 1.1;

    -- 更新
    UPDATE Employees
    SET Salary = @Salary
    WHERE EmpName = @EmpName;
END;

-- 调用
DECLARE @NewSalary INT = 0;

EXEC sp_RaiseSalary '李四', @NewSalary OUTPUT;

PRINT @NewSalary;
```

```sql [存储过程返回值（RETURN）]

CREATE PROCEDURE sp_CheckDept
    @DeptID INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Departments WHERE DeptID = @DeptID)
        RETURN 0;   -- 存在
    ELSE
        RETURN 1;   -- 不存在
END;

-- 调用
DECLARE @Result INT;

EXEC @Result = sp_CheckDept 10;

PRINT @Result;
```

```sql [存储过程 + 事务]
-- 安全更新工资（失败自动回滚）
CREATE PROCEDURE sp_SafeUpdateSalary
    @EmpName NVARCHAR(50),
    @NewSalary INT
AS
BEGIN
    BEGIN TRAN;

    UPDATE Employees
    SET Salary = @NewSalary
    WHERE EmpName = @EmpName;

    IF @@ERROR <> 0
    BEGIN
        ROLLBACK;
        RETURN;
    END

    COMMIT;
END;

-- 执行
EXEC sp_SafeUpdateSalary '王五', 22000;
```

:::

### 触发器

当表发生 `INSERT` / `UPDATE` / `DELETE` 时自动执行的 SQL 程序。
你不需要手动执行，它会自动触发。

常用于：
+ 审计日志（记录谁改了什么）
+ 数据同步（A 表改了自动更新 B 表）
+ 数据校验（阻止非法数据）
+ 自动维护历史记录

1. `AFTER` 触发器（操作完成后触发）
2. `INSTEAD OF` 触发器（替代原操作）
3. `DDL` 触发器（结构变化触发）
    + `CREATE TABLE`
    + `ALTER TABLE`
    + `DROP TABLE`
    + `CREATE INDEX`
    + `ALTER DATABASE`


#### 触发器的三种类型

+ `AFTER INSERT`	插入后触发
+ `AFTER UPDATE`	更新后触发
+ `AFTER DELETE`	删除后触发

+ `INSTEAD OF INSERT`   替代插入操作
+ `INSTEAD OF UPDATE`   替代更新操作
+ `INSTEAD OF DELETE`   替代删除操作

::: code-group

```sql
CREATE TRIGGER 触发器名称
ON 数据表
AFTER UPDATE
AS
BEGIN
    ...
END;
```

```sql [ALTER TRIGGER]
-- 修改触发器
ALTER TRIGGER trg_LogInsert
ON Employees
AFTER INSERT
AS
BEGIN
    -- 新逻辑
END;
```

```sql [DROP TRIGGER]
-- 删除触发器
DROP TRIGGER trg_LogInsert;
```

```sql [DISABLE TRIGGER]
-- 暂时禁用触发器（不删除，只是让它失效）
DISABLE TRIGGER trg_AfterSalaryUpdate ON Employees;
```

```sql [ENABLE TRIGGER]
-- 重新启用
ENABLE TRIGGER trg_AfterSalaryUpdate ON Employees;
```
:::

:::code-group
```sql [AFTER UPDATE]
-- 记录工资变动
CREATE TRIGGER trg_LogSalaryChange
ON Employees
AFTER UPDATE
AS
BEGIN
    INSERT INTO EmployeeLog (EmpID, Action, OldSalary, NewSalary, LogTime)
    SELECT 
        i.EmpID,
        'UPDATE',
        d.Salary AS OldSalary,
        i.Salary AS NewSalary,
        GETDATE()
    FROM inserted i
    JOIN deleted d ON i.EmpID = d.EmpID;
END;
```

```sql [AFTER INSERT]
-- 记录新增员工
CREATE TRIGGER trg_LogInsert
ON Employees
AFTER INSERT
AS
BEGIN
    INSERT INTO EmployeeLog (EmpID, Action, NewSalary, LogTime)
    SELECT 
        EmpID,
        'INSERT',
        Salary,
        GETDATE()
    FROM inserted;
END;
```

```sql [AFTER DELETE]
-- 记录删除员工
CREATE TRIGGER trg_LogDelete
ON Employees
AFTER DELETE
AS
BEGIN
    INSERT INTO EmployeeLog (EmpID, Action, OldSalary, LogTime)
    SELECT 
        EmpID,
        'DELETE',
        Salary,
        GETDATE()
    FROM deleted;
END;
```

:::

::: code-group

```sql [1]
CREATE TABLE Departments (
    DeptID INT PRIMARY KEY,
    DeptName VARCHAR(50)
);

CREATE TABLE Employees (
    EmpID INT PRIMARY KEY,
    EmpName VARCHAR(50),
    DeptID INT FOREIGN KEY REFERENCES Departments(DeptID)
);

```

```sql [2]
INSERT INTO Departments VALUES (1, '技术部'), (2, '人事部');

INSERT INTO Employees VALUES 
(101, '张三', 1),
(102, '李四', 1);
```

```sql [3]
CREATE TRIGGER trg_NoDeleteDeptWithEmployees
ON Departments
INSTEAD OF DELETE
AS
BEGIN
    -- 检查要删除的部门是否有员工
    IF EXISTS (
        SELECT 1
        FROM Employees e
        JOIN deleted d ON e.DeptID = d.DeptID
    )
    BEGIN
        RAISERROR('该部门下有员工，不能删除！', 16, 1);
        RETURN;
    END

    -- 如果没有员工，允许删除
    DELETE FROM Departments
    WHERE DeptID IN (SELECT DeptID FROM deleted);
END;
```

```sql [4]
DELETE FROM Departments WHERE DeptID = 1;
```
:::

## 索引（Index）

索引 = 数据库的目录 / 书的目录 / 字典的拼音索引。

+ 没有索引：
    数据库要从头到尾扫描整张表（全表扫描）
+ 有了索引：
    数据库可以“跳着查”，直接定位到目标行

索引的本质是 B-Tree（平衡树），让查找速度从：

O(n) → O(log n)

这就是为什么索引能让查询快几十倍甚至几百倍。

### 创建索引

::: code-group

```sql
-- 创建
CREATE INDEX 索引名
ON 表名(字段);

-- 删除
DROP INDEX 索引名 ON 表名;
```

```sql [CREATE INDEX]
-- 给 EmpName 创建索引 提高 WHERE 查询速度
CREATE INDEX idx_Employees_EmpName
ON Employees(EmpName);

-- 查询
SELECT * FROM Employees WHERE EmpName = '李四';
```

```sql [DROP]
DROP INDEX idx_Salary ON Employees;
```

:::

#### 联合索引 Composite Index

```sql [联合索引]
CREATE INDEX idx_Employees_DeptID_Salary
ON Employees(DeptID, Salary);

-- 查询
SELECT * FROM Employees
WHERE DeptID = 20 AND Salary > 15000;
```

#### 唯一索引 Unique Index

```sql [唯一索引]
-- 保证字段不重复（类似主键）
CREATE UNIQUE INDEX idx_Employees_EmpName
ON Employees(EmpName);
```

#### 主键索引 Primary Key

```sql 
-- 主键自动创建唯一索引
ALTER TABLE Employees
ADD CONSTRAINT PK_Employees PRIMARY KEY(EmpID);
```

### 索引什么时候最有效

::: code-group
```sql [WHERE 条件]
WHERE EmpName = '张三'
```

```sql [JOIN 条件]
JOIN Departments d ON e.DeptID = d.DeptID
```

```sql [ORDER BY]
ORDER BY Salary
```

```sql [GROUP BY]
GROUP BY DeptID
```
:::

### 索引的代价

索引不是越多越好。

索引会：
+ 加快查询
+ 减慢 INSERT / UPDATE / DELETE
+ 占用磁盘空间

所以索引要“精准”，不是“越多越好”。

### GO

`GO` 不是 SQL 语句。  
它是 SQL Server 客户端工具（SSMS、sqlcmd）用的“批处理分隔符”。

+ `GO` 用来把 SQL 脚本分成多个批次（Batch）。
+ `GO` 本身不会被 SQL Server 执行。