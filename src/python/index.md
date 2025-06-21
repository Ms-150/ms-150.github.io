# Python 学习笔记

[Python 官网](https://www.python.org)

## 下载与安装

### 下载 Python

访问 [https://www.python.org/downloads/](https://www.python.org/downloads/) 下载适合你操作系统的 Python 版本。

### 安装 IDE：PyCharm

PyCharm 是一款强大的 Python 集成开发环境（IDE），提供代码提示、调试等功能，能显著提升开发效率。

### 命令行安装（macOS）

````bash
brew install python
python -V  # 查看 Python 版本
python --version # 查看 Python 版本

```bash
touch test.py
echo "print('hello python')" > test.py

python test.py  # 运行文件
```

### 虚拟环境
Python 虚拟环境是一种隔离的 Python 环境，可以在不同的项目中使用不同的 Python 版本和库。

```bash
# 创建虚拟环境
python3 -m venv .venv
# 激活 .venv 虚拟环境
➜  PyCharmMiscProject source .venv/bin/activate
(.venv) ➜  PyCharmMiscProject
```

## pip

```bash
pip install <package_name>   # 安装指定的包
pip uninstall <package_name> # 卸载指定的包
pip list                     # 列出已安装的包
pip show <package_name>    # 查看指定包的信息
pip freeze > requirements.txt # 导出已安装的包及其版本到 requirements.txt 文件
pip install -r requirements.txt # 从 requirements.txt 文件安装包
```

### 注释

- 单行注释
- 多行注

```py
# 1. 单行注释

'''
2.1
多行注释1
'''

"""
2.2
多行注释1
多行注释2
"""
```

:::

### python 保留字

这些是 Python 语言中具有特殊含义的关键字，不能用作变量名。

```py
import keyword

print(keyword.kwlist)
>>>
['False', 'None', 'True', '__peg_parser__', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']
```

### 多行语句

使用反斜杠 \ 将一行过长的语句分割成多行，提高代码可读性。

```py
total = 1 + \
        2 + \
        3

print(total)
>>> 6
```

### 输出

print() 函数用于将信息输出到控制台。使用逗号 , 分隔多个输出时，它们之间会以空格分隔。

```py
print('hello', 'word')  # ,输出空格
>>>
hello word
```

### 输入

input() 函数用于接收用户的输入，返回一个字符串。

```py
name = input('输入名字 ：')  # Python大小写 敏感

print('hello', name)

>>>
输入名字 ：ms
hello ms
```

## 变量 与 数据类型

Python 是 动态类型语言，无需声明变量类型。
Python 会根据赋给变量的值自动推断类型。

### 合法变量名：

- 只能包含 字母、数字、下划线`_`
- 不能以 数字开头
- 区分大小写（name 和 Name 是两个不同的变量）
- 命名约定 (PEP 8 推荐): 推荐使用小写字母和下划线组合作为变量名，例如 user_name。

### 标准数据类型

- String（字符串）: 不可变的字符序列，用单引号 `'` 或双引号 `"` 包裹。支持切片、转义等操作。
- Number（数字）:

  - int（整数）
  - float（浮点数）
  - bool（布尔值）：True 或 False
  - complex（复数）

- List（列表）: 有序、可变的元素集合，用方括号 `[]` 包裹。
- Tuple（元组）: 有序、不可变的元素集合，用小括号 `()` 包裹。
- Dictionary（字典）: 无序的键值对（key-value）集合，用花括号 `{}` 包裹，键必须是不可变类型且唯一。
- Set（集合）: 无序、不重复元素的集合，用花括号 `{}` 或 `set()` 函数创建。

```py
name = "Alice"  # 字符串
age = 25        # 整数
height = 1.75   # 浮点数
is_happy = True # 布尔值
numbers = [1, 2, 3]  # 列表 list
person = {"name": "Alice", "age": 25}  # 字典 dict

print(name, age, height, is_happy)  # Alice 25 1.75 True
```

### 检查数据类型

type() 函数可以用来查看变量的数据类型。

```py
print(type(name))   # <class 'str'>
print(type(age))    # <class 'int'>
print(type(height)) # <class 'float'>
print(type(is_happy)) # <class 'bool'>
```

#### 可变与不可变数据类型

- 不可变数据类型: Number（数字）、String（字符串）、Tuple（元组）。一旦创建，它们的值就不能被修改。
- 可变数据类型: List（列表）、Dictionary（字典）、Set（集合）。它们的值可以在创建后被修改。

#### Number 数字型

- `int` (整型): 用于表示整数，例如：`1`
- `float` (浮点型): 用于表示带有小数部分的数字，例如：`1.23`, `3e-1` (表示 0.3)。**`float` 是 `Number` 类型的一种。**
- `bool` (布尔型): 用于表示真或假，值为 `True` 或 `False`。在数值上下文中，`True` 相当于 `1`，`False` 相当于 `0`。
- `complex` (复数型): 用于表示复数，例如：`1 + 2j`

#### String 字符串

- 单引号 ' 和双引号 " 用法相同。
- 三引号 ''' 或 """ 可以定义多行字符串。
- 反斜杠 \ 是转义字符。
- r 前缀使反斜杠不进行转义，表示原始字符串。
- - 运算符用于重复字符串。
- 字符串支持两种索引方式：从左到右以 0 开始，从右到左以 -1 开始。
- Python 没有单独的字符类型，一个字符就是长度为 1 的字符串。
- 字符串切片: 变量[头下标:尾下标:步长]
- 常用字符串方法： lower(), upper(), strip(), split(), join(), find(), replace(), format() (包括 f-strings) 等。

```py
str_example = 'Runoob'
print(str_example[0:-1])   # 输出第一个到倒数第二个字符
print(str_example[0])      # 输出第一个字符
print(str_example[2:5])    # 输出从第三个到第五个字符（不包含第五个）
print(str_example[2:])     # 输出从第三个字符开始到末尾的所有字符
print(str_example * 2)     # 输出字符串两次
print(str_example + "TEST")    # 连接字符串

print('Ru\noob') # \n 是换行符
print(r'Ru\noob') # r'' 表示原始字符串，\n 不会被转义

>>>
Runoo
R
noo
noob
RunoobRunoob
RunoobTEST
Ru
oob
Ru\noob
```

### List 列表

- Python 中最常用的数据类型之一。
- 索引从 0 开始，-1 表示最后一个元素。
- 可以使用 `+` 进行列表连接，使用 `*` 进行列表重复。
- 列表中的元素可以修改。
- 支持索引和切片操作。
- 列表推导式: 一种简洁创建列表的方式，例如 [x*2 for x in range(5)]。
- 常用列表方法: append(), insert(), remove(), pop(), sort(), reverse(), len() 等。

```py
list = ['abc', 1, 'def', 2, 'ghi']
tinylist = [3, 'jkl']

print(list)         # 输出完整列表
print(list[0])      # 输出列表第一个元素
print(list[1:3])    # 从第二个开始输出到第三个素
print(list[2:])     # 输出从第三个元素开始的所元素
print(tinylist * 2)    # 输出两次列表
print(list + tinylist) # 连接列表
>>>
['abc', 1, 'def', 2, 'ghi']
abc
[1, 'def']
['def', 2, 'ghi']
[3, 'jkl', 3, 'jkl']
['abc', 1, 'def', 2, 'ghi', 3, 'jkl']
```

### Tuple 元组

- 与列表类似，但元组的元素不能修改。
- 元组用小括号 () 包裹，元素之间用逗号 , 隔开。
- 元组中的元素类型可以不同。
- 当元组只有一个元素时，需要在元素后添加逗号，例如 tup2 = (20,)。
- 元组通常用于存储不应被修改的数据，或者作为字典的键。

```py
tuple = ('abcd', 786 , 2.23, 'runoob', 70.2)
tinytuple = (123, 'runoob')
tup2 = (20,)    # 一个元素，需要在元素后添加逗号

print (tuple)             # 输出完整元组
print (tuple[0])          # 输出元组的第一个元素
print (tuple[1:3])        # 输出从第二个元素开始到第三个元素
print (tuple[2:])         # 输出从第三个元素开始的所有元素
print (tinytuple * 2)     # 输出两次元组
print (tuple + tinytuple) # 连接元组
>>>
('abcd', 786, 2.23, 'runoob', 70.2)
abcd
(786, 2.23)
(2.23, 'runoob', 70.2)
(123, 'runoob', 123, 'runoob')
('abcd', 786, 2.23, 'runoob', 70.2, 123, 'runoob')
```

### Set 集合

- 由一个或多个形态各异的大小整体组成的无序不重复元素的序列。
- 使用花括号 {} 或 set() 函数创建集合。
- 创建空集合必须使用 set()。
- 集合支持数学上的集合运算，如并集、交集、差集等。

```py
sets = {'Google', 'Taobao', 'Runoob', 'Facebook', 'Zhihu', 'Baidu'}

if 'Taobao' in sets:
    print('true')
else:
    print('false')

# set可以进行集合运算
a = set('abracadabra')
b = set('alacazam')

print(a)
print(a - b)     # a 和 b 的差集
print(a | b)     # a 和 b 的并集
print(a & b)     # a 和 b 的交集
print(a ^ b)     # a 和 b 中不同时存在的元素
>>>
{'Google', 'Zhihu', 'Runoob', 'Baidu', 'Taobao', 'Facebook'}
true
{'b', 'c', 'd', 'r', 'a'}
{'d', 'b', 'r'}
{'b', 'c', 'm', 'd', 'l', 'r', 'z', 'a'}
{'c', 'a'}
{'d', 'b', 'm', 'l', 'r', 'z'}
```

### 字典 Dictionary

- 一种映射类型，存储键值对（key-value）。
- 字典用花括号 {} 标识，键是唯一的且必须是不可变类型（通常是字符串或数字），值可以是任意类型。
- 字典是无序的（在 Python 3.7+ 版本中，字典会记住插入顺序）。
- 创建空字典使用 {} 或 dict()。
- 常用字典方法: keys(), values(), items(), get(), update(), pop(), popitem() 等。

```py
dict = {}
dict['one'] = "1 - 菜鸟教程"
dict[2] = "2 - 菜鸟工具"

tinydict = {'name': 'runoob', 'code': 1, 'site': 'www.runoob.com'}

print(dict['one'])       # 输出键为 'one' 的值
print(dict[2])           # 输出键为 2 的值
print(tinydict)          # 输出完整的字典
print(tinydict.keys())   # 输出所有键
print(tinydict.values()) # 输出所有值
>>>
1 - 菜鸟教程
2 - 菜鸟工具
{'name': 'runoob', 'code': 1, 'site': 'www.runoob.com'}
dict_keys(['name', 'code', 'site'])
dict_values(['runoob', 1, 'www.runoob.com'])
```

### 数据类型转换

```py
int(x[, base])      # 将x转换为一个整数
float(x)            # 将x转换为一个浮点数
complex(real[, base])   # 创建一个复数
str(x)          # 将对象x转换为字符串
repr(x)         # 将对象x转换为表达式字符串
eval(x)         # 计算在字符串中的有效python表达式 返回一个对象
tuple(x)        # 将序列x转换为一个元组
list(x)         # 将序列x转换为一个列表
set(x)          # 转换为可变集合
dict(x)         # 创建一个字典x必须是一个 (key, value)元组序列
frozenset(x)    # 转换为不可变集合
chr(x)          # 将整数转换为字符
ord(x)          # 将字符转换为的他的整数值
hex(x)          # 将整数转换为十六进制字符串
oct(x)          # 将整数转换为八进制字符串
```

### 判断数据类型
    type()
    isinstance()

### 数据运算

##### `+ - * /`

    +   # 加法
    -   # 减法
    *   # 乘法
    /   # 除法，得到一个浮点数
    //  # 除法，得到一个整数
    %   # 取余
    **  # 乘方

### 成员运算符

`in` 如果在序列中找到值返回 True，否则返回 False "a" in "banana" True
`not in` 如果在序列中没有找到值返回 True，否则返回 False "x" not in

### 运算符优先级

() (括号)
** (幂)
*, /, //, % (乘法, 除法, 整除, 取余)
+, - (加法, 减法)
<<, >> (位移)
& (按位与)
^ (按位异或)
| (按位或)
==, !=, >, <, >=, <=, is, is not, in, not in (比较运算符, 身份运算符, 成员运算符)
not (逻辑非)
and (逻辑与)
or (逻辑或)
= (赋值运算符)
````
