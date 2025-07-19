# Dart

Dart 是一种面向对象的编程语言，由 Google 开发，是 Flutter 框架的开发语言。

## 变量声明

- `var` 自动类型推断
- `const` 编译时常量
- `final` 运行时常量

```dart
var name = 'Alice';   // 自动推断类型
String city = 'Tokyo'; // 显式类型
const pi = 3.1415;     // 编译时常量
final time = DateTime.now(); // 运行时常量
```

## 基本数据类型

- `Number` 数值类型
- `String` 字符串
- `Boolean` 布尔值
- `List` 列表
- `Set` 集合
- `Map` 映射

### 数值类型（int、double、num）

```dart
int age = 30;
double pi = -3.1415;
num anyNumber = 10; // num 可存 int 或 double

age.toString(); // '30'
pi.toInt(); // -3 向下取整
pi.ceil(); // -3 向上取整

pi.round(); // -3 四舍五入
pi.abs(); // 3.1415 取绝对值
3.1415.toStringAsFixed(2); // '3.14' 保留两位小数

10.remainder(3); // 1 取余

// 比较大小
10.compareTo(5); // 1 大于
10.compareTo(15); // -1 小于
10.compareTo(10); // 0 等于
```

### 字符串类型

`' '` `" "` `''' '''`

```dart
String str1 = 'hello';
String str2 = "world";
// 多行字符串
var str3 = '''hello,
world
'''

print(str1 + str2); // helloworld
print("$str1, $str2"); // hello, world

print(str1.split('')); // [h, e, l, l, o]

' abc '.trim(); // 'abc' 去除首尾空格
' abc '.trimLeft(); // 'abc ' 去除左边空格
' abc '.trimRight(); // ' abc' 去除右边空格

// 判断是否为空
'str1'.isEmpty; // false
'str1'.isNotEmpty; // true

// 替换
'str1'.replaceAll('1', '2'); // str2
'a1b1c1'.replaceAll(RegExp(r'\d'), '_'); // a_b_c

// 截取
'str1'.substring(0, 2); // st

// 查找
'str1'.contains('1'); // true
// 定位
'str1'.indexOf('1'); // 1
'str1'.lastIndexOf('1'); // 1

// 转换为大写
'str1'.toUpperCase(); // STR1
// 转换为小写
'str1'.toLowerCase(); // str1
```

### 正则表达式

```dart
RegExp(r'\d+'); // 匹配一个或多个数字
RegExp exp = RegExp(r'[a-z]'); // 匹配小写字母

// 匹配
exp.hasMatch('abc'); // true
RegExp(r'^1\d{10}$').hasMatch('123'); // false
```

### 布尔类型

```dart
bool isTrue = true;
bool isFalse = false;

// 显示的进行判断
var flag;
if (flag == true) {
  print('true');
} else {
  print('false');
}

// 检查是否为 NaN（Not a Number）
0 / 0.isNaN; // true
isFinite(0); // true 有限
isInfinite(0); // false 无限
isNegative(0); // false 非负数
```

### 列表类型 `List`

```dart
List list1 = []; // 不限制类型空列表
List<int> lst2 = [1, 2, 3, 4, 5]; // 整数列表

List list3 = new List.empty(growable: true); // 不限制类型列表
List list4 = new List.filled(3, 6); // 固定长度3 固定内容6的列表 [6 6 6]

// ... ...?
[0, ...?list4]; // [0, 6, 6, 6]
// 添加
[1].add(2); // [1, 2]
[1, 2].addAll([3, 4]); // [1, 2, 3, 4]
[1, 2, 3, 4].insert(1, 5); // [1, 5, 2, 3, 4]

// 删除
[1, 2, 3, 4].remove(2); // [1, 3, 4]
// 删除索引
[1, 2, 3, 4].removeAt(1); // [1, 3, 4]
// 清空
[1, 2, 3, 4].clear(); // []

// 连接
[1, 2, 3].join('-'); // '1-2-3'

// 长度
list4.length; // 3
// 反转
[1,2,3,4].reversed.toList(); // [4, 3, 2, 1]

// 查找索引
[1, 2, 3, 4].indexOf(3); // 2
// 查找最后一个索引
[1, 2, 3, 4].lastIndexOf(3); // 2

// 遍历
for (var i = 0; i < [1, 2, 3, 4].length; i++) {
  print(element);
};

for (var element in [1, 2, 3, 4]) {
  print(element);
};

[1, 2, 3, 4].forEach((element) {
  print(element);
});
// 映射
[1, 2, 3, 4].map((e) => e * 2).toList(); // [2, 4, 6, 8]
// 过滤
[1, 2, 3, 4].where((element) => element > 2).toList(); // [3, 4]
// 任意一个满足
[1, 2, 3, 4].any((element) => element > 2); // true
// 所有满足
[1, 2, 3, 4].every((element) => element > 2); // false

// 展开
[[1, 2], 3].expand((element) => [element, element]).toList(); // [1, 2, 3]
// 折叠 1+ 1+2+3
[1, 2, 3].fold(1, (prev, element) => prev + element); // 1+1+2+3=7
```

### 集合类型 `Set`

没有下标、 不重复

```dart
var set1 = <int>[1, 2, 3]; // {1, 2, 3}
var set2 = new Set();
set2.add(1); // {1}
set2.addAll([3, 4]); // {1, 2, 3, 4}
set2.toList(); // [1, 2, 3, 4]

// 交集
set1.intersection(set2); // {1, 2, 3}
// 并集
set1.union(set2); // {1, 2, 3, 4}
// 差集
set1.difference(set2); // {2, 3}

{1, 2, 3}.first; // 1
{1, 2, 3}.last; // 3
```

### 映射类型 键值对

```dart
var map1 = {'a': 1, 'b': 2};
var map2 = new Map();
var map3 = Map();
map3['name'] = 'zhangsan';
map3['age'] = 18;

// 访问属性
map3['name']; // 'zhangsan'
// 检查是否包含键key
map3.containsKey('name'); // true

// 不存在key 则添加
map3.putIfAbsent('sex', () => 'nan');

// 获取所有的key
map3.keys; // ['name', 'age']
// 获取所有的value
map3.values; // ['zhangsan', 18]

map3.remove('name'); // 'zhangsan'
// 移除满足条件的键值对
map3.removeWhere((key, value) => key == 'age');
```

## 数据类型转换

- `toInt()` 转换为整数 只能转换为整数

- `toString()` 转换为字符串
- `int.parse()` 字符串转换为整数
- `double.parse()` 字符串转换为浮点数

```dart
int age = 30;
String ageString = age.toString(); // '30'

String piString = '3.1415';
double pi = double.parse(piString); // 3.1415
```

## 其他

`Runes` 32 位字符对象 [https://copychar.cc/](https://copychar.cc/)
`Symbol` #开头的标识符
`dynamic` 动态类型

::: code-group

```dart [Runes]
var str = '✅';
str.length; // 2  UTF-16
str.units.length; // 1  UTF-32

Runes runes = new Runes('\u{1f680}');
new String.fromRunes(runes); // '🚀'
```

```dart [Symbol]
var sym1 = #abc;
var sym2 = new Symbol('abc');

sym1 == sym2; // true
```

```dart [dynamic]
dynamic a = 1;
a = '2';
a = true;
```

:::

## 运算符

`~/` 整除 向下取整
`is` `is!` 类型判断
`??` `??=` 避空
`?.` 安全调用
`..` 级联调用 返回调用对象

```dart
// 整除
10 ~/ 3; // 3

// 类型判断
List list = [];

list is List; // true
list is! Number; // true

// 避空
11 ?? 12; // 11
null ?? 13; // 13

var a;
a ??= 3; // a=3


Set s1 = new Set();
s.add(1);
s.add(2);
s.add(3);
s.remove(2); // {1, 3}

Set s2 = new Set();
s2..add(1)
..add(2)
..add(3);  // {1, 2, 3}
```
