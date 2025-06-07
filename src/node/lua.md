# Lua

Lua 是一种轻量级、高效的脚本语言，常用于嵌入式开发、游戏开发和配置管理。

[https://www.lua.org/](https://www.lua.org/)

## install

```bash
brew install lua

lua -v
>>>
Lua 5.4.7  Copyright (C) 1994-2024 Lua.org, PUC-Rio
```

## start

::: code-group

```lua [hello.lua]
print("Hello, Lua!")
```

```bash
lua hello.lua
```

:::

## Basic Syntax 基本语法

### variable and data types 变量和数据类型

```lua
x = 10              -- 整型变量
y = 3.14            -- 浮点型变量
name = "Lua"        -- 字符串变量
isActive = true     -- 布尔型变量
null = nil          -- 空

-- 全局变量
x = 10  -- 这是一个全局变量
-- 局部变量
local y = 20  -- 这是一个局部变量，只在当前块有效
```

### 表

- 数组 `默认从 1 开始索引`
- 对象

```lua
array = {10, 20, 30, 40}    -- 数组

-- 遍历数组
for i, value in ipairs(array) do
    print(i, value)
end

-- 向数组添加元素
table.insert(array, 50)  -- 在末尾添加元素
table.insert(array, 1, 5)  -- 在索引 1 处添加元素

-- 删除数组元素
table.remove(array)  -- 删除数组的最后一个元素
table.remove(array, 2)  -- 删除索引为 2 的元素

-- 对象
local person = {
    name = "John",
    age = 30,
    greet = function(self)
        print("Hello, my name is " .. self.name)
    end
}

-- 访问对象的属性
print(person.name)  -- 输出：John
print(person.age)   -- 输出：30

-- 调用对象的方法
person:greet()  -- 输出：Hello, my name is John

-- 修改对象的属性
person.age = 31
print(person.age)  -- 输出：31
```

### 变量检测 type()

```lua
type(10)       -- number
type("hello")  -- string
type(true)     -- boolean
type(nil)      -- nil 空
```

```lua
obj = {           -- 对象
    nama = "ms",
    age = 18
}

-- 局部变量
local pi = 3.14
```
### 数据类型转换

```lua
-- 字符串转数字
tonumber("123")  -- 123
tonumber("3.14") -- 3.14
-- 数字转字符串
tostring(123)  -- "123"
tostring(3.14) -- "3.14"
-- 布尔型转数字
tonumber(true)  -- 1
tonumber(false) -- 0
-- 数字转布尔型
toboolean(1)  -- true
toboolean(0)  -- false
```

### 控制语句

```lua

local m = 0
if m < 5 then
    print("A")
else
    print("B")
end

-- 循环
for i = 1, 10, 1 do
    print(i)
end

local i = 1
while i <= 5 do
    print(i)
    i = i + 1
end

-- 代码块
do
    -- 局部变量
    local name = "do-end"
    print(name)
end
```
