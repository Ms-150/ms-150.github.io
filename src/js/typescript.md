# TypeScript / TS

`Typescript` 是 Javascript 类型的超集，它可以编译成纯 `Javascript`。
`Typescript` 可以在任何浏览器、任何计算机和任何操作系统上运行，并且是开源的。

[https://www.typescriptlang.org/](https://www.typescriptlang.org/)

## 安装

::: code-group

```bash [1. 安装]
npm install -g typescript
tsc -v      # 查看版本号
```

```bash [2. 初始化 ]
tsc --init # 生成 tsconfig.json
```

```bash [3. 安装声明文件]
npm i @types/node -D
```

```sh [4. 编译代码]
tsc xxx.ts

# 监听模式编译整个项目
tsc -w 
```

:::

## 数据类型
### 类型层级结构

1. 顶层类型 (Top Types)
   + `any`: 彻底放弃类型检查。
   + `unknown`: 安全版的 any。你可以把任何值赋给它，但在使用前必须进行类型检查或断言。
  
2. 基本类型与对象类型
  + `Object` / `{}`: 涵盖了几乎所有非原始类型。
  + 包装类与原始类型: 如 `Number`, `String`, `Boolean` 以及对应的原始类型 `number`, `string`, `boolean`。

  ::: warning [注意]
  原始类型是具体的，比如 `number` 是 `Object` 的子类型
  :::

3. 底层类型 (Bottom Types)
  `never`: 位于金字塔最底层。它是任何类型的子类型，但没有任何类型是它的子类型（除了它自己）。通常用于那些永远不会有返回值的函数（比如抛出异常或死循环）。

4. 关于 `null` 和 `undefined` 的特殊位置
  这两个类型的“顺序”取决于你的 `tsconfig.json` 配置中的 `strict` 开关：
   + 关闭 (非严格模式): null 和 undefined 是所有类型的子类型。这意味着你可以把 null 赋值给一个 number 类型的变量。
   + 开启  (严格模式 - 推荐): 它们变成了独立的类型，只能赋值给它们自己、void（仅 undefined）或者顶层类型。

### 1. 基本类型

- `number` 表示数字，包括整数和浮点数。双精度 64 位浮点值。

```ts
let binary: number = 0b1010; // 二进制
let octal: number = 0o744; // 八进制
let decimal: number = 6; // 十进制
let hexadecimal: number = 0xf00d; // 十六进制

let nan: number = NaN; 
let infinity: number = Infinity; // 无穷大
```

- `string` 字符型
  一个字符系列，使用单引号（`'`）或双引号（`"`）来表示字符串类型。反引号（`）来定义多行文本和内嵌表达式

```ts
let name: string = "Runoob";
```

- `boolean` 布尔型
  表示逻辑值：true 和 false。

```ts
let flag: boolean = true;
```

- `null` 表示对象值的缺失

- `undefined` 用于初始化变量为一个未定义的值

- `symbol` 表示唯一且不可变的数据类型。
  
  ::: code-group

  ```ts [Symbol]
  const a = Symbol();
  const b = Symbol();

  console.log(a === b); // false（永远不相等）

  ```

  ```ts [Symbol.for()]
  // 传入相同的 key，会返回同一个 symbol
  const a = Symbol.for('id');
  const b = Symbol.for('id');

  console.log(a === b); // true
  ```

  ```ts [getOwnPropertySymbols]
  const ID = Symbol('id');

  const obj = {
    name: 's',
    [ID]: 123
  };

  console.log(Object.getOwnPropertySymbols(obj));
  // [ Symbol(id) ]
  ```

  ```ts [Reflect.ownKeys]
  const ID = Symbol('id');

  const obj = {
    name: 's',
    [ID]: 123
  };

  console.log(Reflect.ownKeys(obj));
  // ["name", Symbol(id)]
  ```

  :::


- `bigint` 表示大整数，支持比 Number 更大的数字。

```ts
let bigNumber: bigint = BigInt(9007199254740991);
```

### 2. 对象类型

- `object` 非原始类型的对象（不包括 number、string、boolean、null、undefined）。

```ts
let obj: object;

obj = {}; // 合法，空对象
obj = { key: "value" }; // 合法，包含属性的对象
obj = (x: number) => x * 2; // 合法，函数
obj = new Date(); // 合法，Date 对象
obj = new RegExp("pattern"); // 合法，正则表达式对象
```

- `TYPE[]` `Array<TYPE>` 数组类型

```ts
// 元素类型后面加上 []
let numberArr: number[] = [1, 2, 3, 4];
let stringArr: string[] = ["a", "b", "c"];

// 泛型 Array<elementType>
let numbers: Array<number> = [1, 2, 3, 4];
let strings: Array<string> = ["a", "b", "c"];

// 二维数组 [][]
let numberArray: number[][] = [
  [1, 2],
  [3, 4],
];
let stringArray: Array<Array<string>> = [["a", "b"], ["c"]];
```

- `tuple` 元组 固定大小和类型的数组

::: code-group

```ts [元组]
llet user: [string, number];

user = ['s', 20];   // ✔ 正确
user = [20, 's'];   // ❌ 顺序不对
```

```ts [带可选元素的元组]
let t: [string, number?];

t = ['a'];       // ✔
t = ['a', 1];    // ✔
```

```ts [带 rest 的元组]
type Log = [string, ...number[]];

const l: Log = ['sum', 1, 2, 3];
```

```ts [只读的元组]
const config: readonly [string, number] = ['host', 8080];

// config[1] = 3000; ❌ 不能修改
```

:::

- `enum` 枚举 为一组命名的常数定义类型。

::: code-group

```ts
// 未赋值枚举 默认下标 0 开始
enum Color {
  red,
  green,
  blue,
}
let value: Color = Color.blue;
console.log(value); // 输出 2
```

```ts [增长枚举]
enum Status {
  OK = 200,
  NotFound,   // 201
  Forbidden,  // 202
}

// NotFound 自动变成 201，Forbidden 自动变成 202。
```

```ts [中间插值 + 自增]
enum Level {
  Low,        // 0
  Medium = 5, // 5
  High,       // 6
  Max = 99,
  Ultra       // 100
}

```

```ts [字符串枚举 ]
enum Role {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest'
}

const r: Role = Role.Admin;
```

:::

#### enum 和 const enum

::: code-group

```ts [enum]
enum Color {
  Red,
  Green,
  Blue
}

// 编译后会生成类似：
// var Color = {
//   0: "Red",
//   1: "Green",
//   2: "Blue",
//   Red: 0,
//   Green: 1,
//   Blue: 2
// };
```


```ts [const enum]
const enum Color {
  Red,
  Green,
  Blue
}

const c = Color.Red;

// 编译后
// var c = 0;
```
:::

 
| 特性               | `enum`           | `const enum `    |
| ------------------ | ---------------- | ---------------- |
| 是否生成运行时代码 | 会生成对象       | 不会生成对象     |
| 是否支持反向映射   | 支持（数字枚举） | 不支持           |
| 是否可遍历         | 可以             | 不可以           |
| 是否可动态访问     | 可以             | 不可以           |
| 编译后体积         | 较大             | 最小（完全内联） |

#### 反向映射

+ 通过 键 → 值
+ 也可以 值 → 键

::: code-group

```ts [数字枚举]
enum Status {
  OK = 200,
  NotFound = 404
}

console.log(Status.OK);     // 200
console.log(Status[200]);   // "OK"
```

```ts [字符串枚举]
enum Role {
  Admin = 'admin',
  User = 'user'
}

console.log(Role.Admin);   // "admin"
console.log(Role["admin"]); // ❌ undefined

```
:::

::: warning
+ `数字枚举` **有** _反向映射_
+ `字符串枚举` **没有** _反向映射_
:::

### 3. 特殊类型

- `any` 任意值

  ```ts
  let variable: any = "Hello, TypeScript!";
  variable = 42; // 不会报错，因为变量是 any 类型，可以赋值为任何类型
  ```

- `unknow` 未知的类型

  ```ts
  let variable: unknown = "Hello, TypeScript!";

  // 使用 unknown 类型的值之前进行类型检查，可以使用类型断言或控制流程：
  if (typeof variable === "string") {
    // 在这个分支中，variable 被 TypeScript 推断为 string 类型
    variable.toUpperCase(); // 安全调用方法
  }
  ```

- `void` 表示没有返回值的函数类型

```ts
function hello(): void {}
```

- `never` 表示永远不会有返回值的类型，通常用于抛出错误的函数或无限循环的函数。

::: code-group

```ts [抛错或死循环]
function fail(msg: string): never {
  throw new Error(msg);
}

function loop(): never {
  while (true) {}
}
```

```ts [穷尽检查]
type Status = 'ok' | 'fail';

function handle(s: Status) {
  switch (s) {
    case 'ok':
      break;
    case 'fail':
      break;
    default:
      const _never: never = s; // 新增状态时会报错
  }
}
```

:::

::: warning
`never` 在联合类型中会被排除
:::

### 4. 泛型

在“保持类型安全”的前提下写出“可复用、可扩展”的代码。核心思想是：类型也可以当作参数传入。

::: code-group

```ts  [interface 泛型]
interface Box<T> {
  value: T;
}

const a: Box<number> = { value: 123 };
```

```ts [type 泛型]
type Box<T> = {
  value: T;
};

const b: Box<string> = { value: 'hi' };
```

```ts [泛型函数]
function identity<T>(value: T): T {
  return value;
}

identity(10);      // T = number
identity('hello'); // T = string
```

```ts [泛型接口]
interface Box<T> {
  value: T;
}

const b1: Box<number> = { value: 123 };
const b2: Box<string> = { value: 'hi' };
```

```ts [泛型类]
class Store<T> {
  private data: T[] = [];
  add(item: T) {
    this.data.push(item);
  }
}

const s = new Store<string>();
s.add('hello');
```

```ts [泛型约束]
function getLength<T extends { length: number }>(v: T) {
  return v.length;
}

getLength('abc');   // ok
getLength([1, 2]);  // ok
getLength(123);     // ❌ number 没有 length
```

```ts [多个泛型参数]
function mapPair<A, B>(a: A, b: B) {
  return [a, b] as const;
}

const r = mapPair(1, 'x');
// r: readonly [1, "x"]
```

```ts [泛型默认值]
interface Response<T = string> {
  data: T;
}

const r: Response = { data: 'ok' }; // T 默认 string
```
 
:::

#### keyof 类型操作符 提取对象的属性名

`keyof` 会把某个对象类型的所有键名，收集成一个联合类型。它是 TypeScript 类型系统里最常用的操作符之一。

::: code-group

```ts [提取对象的属性名]
interface User {
  name: string;
  age: number;
}

type UserKeys = keyof User;
// "name" | "age"
```

```ts [约束函数参数]
function getProp<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const u = { name: 's', age: 20 };

getProp(u, 'name'); // ok
getProp(u, 'xxx');  // ❌ 报错：不存在的 key
```

```ts [keyof 与 extends]
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
}

const cat = { name: "咪咪", age: 3 };

setProperty(cat, "age", 5);      // ✅ 正确
// setProperty(cat, "age", "5"); // ❌ 报错：必须传入 number，因为 cat["age"] 是 number

// `T`: 代表整个对象。
// `keyof T`: 代表对象所有键的集合。
// `T[K]`: 代表对象中某个键对应的值的类型（索引访问类型）。
```
:::

#### 联合类型

通过 `|` 将变量设置多种类型，赋值时根据设置的类型来赋值。

```ts
var val: string | number;
val = 12;
val = "runoob";

// 联合类型数组
var arr: number[] | string[];
arr = [1, 2, 4];
arr = ["Runoob", "Google", "Taobao"];
```

#### 交叉类型

通过 `&` 结合多个类型，创建一个包含这些类型所有特性的新类型。

::: code-group

```ts
type Point = { x: number; y: number };
type Color = { color: string };

type ColoredPoint = Point & Color;
let coloredPoint: ColoredPoint = { x: 1, y: 2, color: "red" };
```

```ts [never]
type a = number & string 
// 因为没有任何值能既是 string 又是 number
// a = never
```

:::

### 断言类型

#### 用来手动指定一个值的类型，即允许变量从一种类型更改为另一种类型

- <类型>值
- 值 `as` 类型
- `!` 非空断言

::: code-group

```ts [<类型>值 / as]
let str: any = "runoob";
// <类型>值
let strLength: number = (<string>str).length;
// 值 as 类型
let strLength1: number = (str as string).length;
```

```ts [!]
let x: string | null | undefined;
user!.toUpperCase(); // ! 变量不为空
```

:::

## 类型断言 as

::: code-group

```ts [将宽泛的类型细化]
// 假设 document.getElementById 可能返回 HTMLElement 或 null
const myInput = document.getElementById('my-input') as HTMLInputElement;

// 现在你可以直接访问输入框特有的属性了，而不会报错
myInput.value = "Hello Gemini!";
```

```ts [处理 unknown 类型]
function process(val: unknown) {
    // console.log(val.length); // 报错：Object is of type 'unknown'
    
    const str = val as string;
    console.log(str.length); // ✅ 正常执行
}
```

:::

## 类型守卫

- ### `in` 判断是否包含某个属性

遍历属性名（映射类型）

::: code-group

```ts [in]
type AppPermissions = "create" | "read" | "update" | "delete";

// 遍历 AppPermissions 中的每一个成员 K
type PermissionConfig = {
  [K in AppPermissions]: boolean;
};

// 结果等同于：
// { create: boolean; read: boolean; update: boolean; delete: boolean; }

const myPrivileges: PermissionConfig = {
  create: true,
  read: true,
  update: false,
  delete: false,
};
```

```ts
interface isObject1 {
  a: number;
  x: string;
}

interface isObject2 {
  a: number;
  y: string;
}

function isInObject(arg: isObject1 | isObject2) {
  if ("x" in arg) console.log(arg.x);
  if ("y" in arg) console.log(arg.y);
}

isInObject({ a: 1, x: "xxx" });
isInObject({ a: 1, y: "yyy" });
```

:::

- ### `typeof` 类型推导 从“值”反推“类型”

::: code-group

```ts [获取变量的类型]
const theme = {
  primary: "#3498db",
  secondary: "#2ecc71",
  danger: "#e74c3c"
};

type ThemeType = typeof theme;
/* 
{ 
  primary: string; 
  secondary: string; 
  danger: string; 
} 
*/
```

```ts [判断参数的类型]
function isTypeof(value: string | number) {
  if (typeof value === "number") return "number";
  if (typeof value === "string") return "string";
}
```

```ts [instanceof] 
// 类型守卫
function createDate(date: Date | string) {
  if (date instanceof Date) {
    date.getDate();
  } else {
    return new Date(date);
  }
}
```

:::

## 函数

- 函数返回值

  返回值的类型要与函数定义的返回类型一致

- 可选参数

  参数设置为可选，可选参数使用问号标识 `?`

- 默认参数

  设置参数的默认值，在调用函数时，如果不传入该参数的值，则使用默认参数

- 剩余参数

  不知道要向函数传入多少个参数，就可以使用剩余参数来定义

::: code-group

```ts [函数返回值]
function add(x: number, y: number): number {
  return x + y;
}
```

```ts [可选参数]
function value(first: string, last?: string) {
  if (last) {
    return first + " " + last;
  } else {
    return first;
  }
}

let result1 = value("Bob");
let result3 = value("Bob", "Adams");
```

```ts [默认参数]
function count(price: number, rate: number = 0.5): number {
  return price * rate;
}
count(1000);
count(1000, 0.3);
```

```ts [剩余参数]
function newName(firstName: string, ...restOfName: string[])  {
  return firstName + " " + restOfName.join(" ");
}

newName("Jose", "Samu", "Luca", "MacK");
```

::: 

::: code-group

```ts [函数表达式]
let multiply: (a: number, b: number) => number = function (x, y) {
  return x * y;
};
```

```ts [函数重载]
// 函数重载
function greet(name: string): string;
function greet(age: number): string;
function greet(value: string | number): string {
  if (typeof value === "string") {
    return `Hello, ${value}!`;
  } else {
    return `Hello, you are ${value} years old!`;
  }
}

// 调用函数
let result1 = greet("John"); // 编译器选择第一个重载，输出: Hello, John!
let result2 = greet(25); // 编译器选择第二个重载，输出: Hello, you are 25 years old!
```

:::

### 类数组

一个对象如果满足以下两个条件，就可以被称为类数组：

+ 拥有 `length` 属性。
+ 拥有 `数字索引`（即可以通过 `obj[0]`, `obj[1]` 来访问元素）。
+ 但是，它没有数组的原生方法（如 `push, pop, map, forEach` 等）。

### 接口 interface

接口是一系列抽象方法的声明，是一些方法特征的集合

::: code-group

```ts [对象接口]
interface Person {
  readonly name: string; // readonly 只读
  age?: number; // ? 可选属性
  [propName: string]: any; // 其它任意属性
  sayHi: () => string;
}

let customer: Person = {
  name: "Tom",
  lastName: "Hanks",
  sayHi: (): string => {
    return "Hi there";
  },
};
```

```ts [函数接口]
interface Fn {
  (name: string): number[];
}

const fn: Fn = function (name: string) {
  return [1, 2, 3];
};
```

:::

#### 实现  implements

让一个类“保证”自己符合某个接口的结构。

+ 类 必须 实现接口中的所有属性和方法
+ 方法签名必须一致（参数、返回值）
+ 接口只定义结构，不包含实现

```ts
// 定义接口
interface Person {
  name: string;
  sayHi(): void;
}

// 类实现接口
class Student implements Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  sayHi() {
    console.log(`Hi, I'm ${this.name}`);
  }
}

```

#### 接口继承 extend

接口可以通过其他接口来扩展自己。允许接口继承多个接口

::: code-group

```ts [单继成]
interface Person {
  age: number;
}

interface Musician extends Person {
  instrument: string;
}

let drummer = <Musician>{};
drummer.age = 27;
drummer.instrument = "Drums";
```

```ts [多继承]
interface IParent1 {
  v1: number;
}

interface IParent2 {
  v2: number;
}

interface Child extends IParent1, IParent2 {}

let Iobj: Child = { v1: 1, v2: 2 };
```

:::

## 类 Class

三个核心：定义、构造、成员（属性/方法）。

```ts [基本结构]
class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  sayHi() {
    console.log(`Hi, I'm ${this.name}`);
  }
}

const p = new Person('s');
p.sayHi();

```

### 成员修饰符

::: code-group

```ts [public]
// 默认
class A {
  public x = 1;
}

```

```ts [private]
// 只能在类内部访问
class A {
  private secret = 'xxx';

  reveal() {
    console.log(this.secret);
  }
}

```

```ts [readonly]
// 只读属性
class Config {
  readonly port = 3000;
}

const c = new Config();
// c.port = 4000; ❌

```

```ts [static]
// 静态成员
class Util {
  static version = '1.0.0';

  static log(msg: string) {
    console.log(msg);
  }
}

Util.log(Util.version);

```

```ts [protected]
// 类内部 + 子类
class A {
  protected value = 10;
}

class B extends A {
  print() {
    console.log(this.value);
  }
} 

```

:::

### 抽象类 abstract

+ 使用 `abstract` 声明
+ 不能 `new`
+ 可以包含 抽象方法（必须由子类实现）
+ 也可以包含 普通方法（子类可直接继承）
+ 子类必须实现所有抽象方法，否则报错

::: code-group
 
```ts 
abstract class Animal {
  abstract makeSound(): void; // 抽象方法（没有实现）

  move() {
    console.log('moving...');
  }
}

class Dog extends Animal {
  makeSound() {
    console.log('woof!');
  }
}

const d = new Dog();
d.makeSound();
d.move();

```

:::

### 命名空间 namespace

`namespace` 会创建一个独立作用域，内部的内容默认是私有的，只有 `export` 才能被外部访问。

#### 关键点

+ `export` 才能让外部访问
+ 不写 `export` 的内容是 `namespace` 内部私有的
+ 声明合并

::: code-group

```ts [namespace]
namespace MathTools {
  export const PI = 3.14;

  export function area(r: number) {
    return PI * r * r;
  }
}

// 使用
MathTools.area(10);
```

```ts [嵌套 namespace]
namespace App {
  export namespace Models {
    export interface User {
      name: string;
    }
  }

  export namespace Services {
    export function login(user: Models.User) {
      return user.name;
    }
  }
}

// 使用
App.Services.login({ name: 's' });
```

:::

### 声明文件 declare

##### 以 `.d.ts` 为后缀的文件被称为声明文件。

为 JavaScript 或第三方库提供类型声明，让 TypeScript 能理解这些代码的结构。它本身不包含运行时代码，只包含类型信息。

::: code-group

```bash [生成 .d.ts 文件]
tsc -d / --declaration  # 生成 .d.ts 文件
```

```ts [编写.d.ts]
declare module Module_Name {
    export ...
}
```

:::

### 接口继承 extends

##### 接口可以通过其他接口来扩展自己。允许接口继承多个接口

::: code-group

```ts [单继成]
interface Person {
  age: number;
}

interface Musician extends Person {
  instrument: string;
}

let drummer = <Musician>{};
drummer.age = 27;
drummer.instrument = "Drums";
```

```ts [多继承]
interface IParent1 {
  v1: number;
}

interface IParent2 {
  v2: number;
}

interface Child extends IParent1, IParent2 {}

let Iobj: Child = { v1: 1, v2: 2 };
```

:::

#### infer 

1. 只能在 条件类型（extends ? :）的 `extends` 子句中使用。
2. 后面紧跟一个变量名（如 `infer U`）。

::: code-group

```ts  [infer]
interface User {
    name: string;
    age: number;
    address: string;
}

type PromiseType = Promise<User>;

type getPromiseType<T> = T extends Promise<infer R> ? R : T

type UserType = getPromiseType<PromiseType>;
```

```ts [嵌套]
interface User {
    name: string;
    age: number;
    address: string;
}

type PromiseType = Promise<Promise<Promise<User>>>;

type getPromiseType<T> = T extends Promise<infer R> ? getPromiseType<R> : T

type UserType = getPromiseType<PromiseType>;
```

```ts [提取元素]
type Arr = ['a', 'b', 'c'];

type FirstElementType<T extends any[]> = T extends [infer R, ...any[]] ? R : never;
type First = FirstElementType<Arr>; // 类型为 'a'

type LastElementType<T extends any[]> = T extends [...any[], infer Last] ? Last : never;
type Last = LastElementType<Arr>; // 类型为 'c'


type Push<T extends any[], U> = (arr: T, item: U) => [...T, U];
type NewArr = Push<Arr, 'd'>; // 类型为 ['a', 'b', 'c', 'd']

type Pop <T extends any[]> = T extends [...infer Rest, any] ? Rest : never;
type PopArr = Pop<Arr>; // 类型为 ['a', 'b']

type Shift  <T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;
type ShiftArr = Shift<Arr>; // 类型为 ['b', 'c']

type Unshift<T extends any[], U> = (arr: T, item: U) => [U, ...T];
type UnshiftArr = Unshift<Arr, 'z'>; // 类型为 ['z', 'a', 'b', 'c']
```

```ts [递归]
type Arr = ['a', 'b', 'c'];

// ...ReverseArr<Rest> 递归剩余
type ReverseArr<T extends any[]> = T extends [infer First, ...infer Rest] ? [...ReverseArr<Rest>, First] : [];
type ReversedArr = ReverseArr<Arr>; // 类型为 ['c', 'b', 'a']
```
:::

##### 协变 顺向而行

一般出现在对象身上
定义： 如果 `A` 是 `B` 的子类型，那么 `List<A>` 也是 `List<B>` 的子类型。

```ts
interface Animal { name: string; }
interface Dog extends Animal { bark(): void; }

let getAnimal = (): Animal => ({ name: "生物" });
let getDog = (): Dog => ({ name: "旺财", bark: () => console.log("汪!") });

// ✅ 协变：getDog 可以赋值给 getAnimal
// 逻辑：我雇了一个“能提供动物”的员工，你给了我一个“能提供狗”的员工。
// 我只需要它有 name，而狗肯定有 name，所以完全安全。
getAnimal = getDog;
```

##### 逆变 反向而行

定义： 如果 `A` 是 `B` 的子类型，那么 `Handler<B>` 却是 `Handler<A>` 的子类型。
场景： 函数的参数。

```ts
type Handler<T> = (arg: T) => void;

let drinkWater = (a: Animal) => console.log(`${a.name} 喝了水`);
let dogSurgery = (d: Dog) => d.bark(); // 只有狗能做手术，会叫

// ❌ 报错：不能把“专门看狗的医生”派去“给所有动物看病”
// 逻辑：万一送来一只猫，猫不会 bark()，程序就崩溃了。
// let admin: Handler<Animal> = dogSurgery; 

// ✅ 逆变：可以把“全科医生”派去“给狗看病”
// 逻辑：dogHandler 只需要处理 Dog。drinkWater 能处理所有 Animal。
// 给它一只 Dog，它把它当普通 Animal 处理（只用 name 属性），绝对安全！
let dogHandler: Handler<Dog> = drinkWater;
```

### 声明文件 declare

##### 以.d.ts 为后缀的文件被称为声明文件。

```bash
tsc -d / --declaration  # 生成 .d.ts 文件
```

::: code-group

```ts [全局变量]
declare var someGlobalVar: string;
```

```ts [模块]
declare module "some-module" {
  export function someFunction(param: number): string;
}
```

```ts [接口]
declare interface SomeInterface {
  propertyA: string;
  propertyB: number;
}
```

```ts [类型别名]
declare type SomeType = string | number;
```

:::

### Mixin 混入

#### 对象的混入

::: code-group

```ts
const a = { x: 1 };
const b = { y: 2 };

// 1. Object.assign 浅拷贝
const c = Object.assign({}, a, b);
// c: { x: number; y: number }

// 2. ...展开运算符 深拷贝
const c = { ...a, ...b };
```

:::

#### 类的混入

| 特性     | 类继承 (`extends`)      | `Mixin` 模式                       |
| -------- | ----------------------- | ---------------------------------- |
| 结构     | 垂直延伸（父子关系）    | 水平组合（插件关系）               |
| 灵活性   | 只能继承一个父类        | 可以混入无数个功能模块             |
| 耦合度   | 高（牵一发而动全身）    | 低（功能模块独立，按需组合）       |
| 适用场景 | “A 是一种 B” (人是动物) | “A 具有 B 的能力” (手机有拍照功能) |

::: code-group

```ts
// 1) 通用构造函数类型
type Constructor<T = {}> = new (...args: any[]) => T;

// 2) 能力类：日志能力
class Logger {
  log(message: string) {
    console.log(`Log: ${message}`);
  }
}

// 能力类：渲染能力
class Html {
  render() {
    console.log("render html");
  }
}

// 3) Mixin：把 Logger 和 Html 的能力混入到任意类
function WithLoggerAndHtml<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private logger = new Logger();
    private html = new Html();

    log(message: string) {
      this.logger.log(message);
    }

    render() {
      this.html.render();
    }
  };
}

// 4) 基类
class App {
  start() {
    console.log("App start");
  }
}

// 5) 使用：叠加能力
class MyApp extends WithLoggerAndHtml(App) {}

// 6) 实例
const app = new MyApp();

app.start();      // 来自 App
app.log("hello"); // 来自 Logger
app.render();     // 来自 Html

```

:::

### 装饰器 Decorator）

在不修改类本身代码的前提下，为类、方法、属性、参数添加额外行为。它是一种“元编程”能力，让你能在类定义阶段拦截、修改、增强代码。

#### 分类

+ 类装饰器（Class Decorator）
+ 方法装饰器（Method Decorator）
+ 属性装饰器（Property Decorator）
+ 参数装饰器（Parameter Decorator）

::: code-group

```json [tsconfig.json]
{
  // 开启 装饰器 反射
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

```ts [类装饰器]
function Logger(target: Function) {
  console.log("类被创建：", target.name);
}

@Logger
class Person {}

// 执行顺序：
// 代码加载时，Logger(Person) 会立即执行
// 输出：类被创建： Person
// 装饰器本质就是一个函数。
```

```ts [类装饰器]
/**
 * @param target 构造函数
 */
const Base: ClassDecorator = (target) => {
    console.log(target);
    target.prototype.name = 'xxx';
    target.prototype.getName = function () {
        console.log('my name');
    }
}

@Base
class Http {

}

const http = new Http() as any;

// polyfill
// Base(Http); 

http.getName();
console.log(http.name);

```

```ts [方法装饰器传参 ClassDecorator]
/**
 * @param target 构造函数
 */
const Base = (name: string) => {
    const fn: ClassDecorator = (target) => {
        console.log(target);
        target.prototype.name = name;
        target.prototype.getName = function () {
            console.log('my name:' + this.name);
        }
    }
    return fn;
}

@Base('xxx')
class Http {
  
}

const http = new Http() as any;

http.getName();
console.log(http.name);
```

```ts [方法装饰器 MethodDecorator]
import axios from 'axios'

/**
 * @param target 构造函数
 */
const Base = (name: string) => {
    const fn: ClassDecorator = (target) => {
        // console.log(target);
        target.prototype.name = name;
        target.prototype.getName = function () {
            // console.log('my name:' + this.name);
        }
    }
    return fn;
}

const Get = (url: string) => {
    /**
     * @param target - 对于静态成员是类的构造函数，对于实例成员是类的原型对象
     * @param propertyKey - 方法的名字
     * @param descriptor - 成员的属性描述符
     */
    const fn: MethodDecorator = (target, propertyKey, descriptor: PropertyDescriptor) => {

        // console.log(target, propertyKey, descriptor);
        axios.get(url).then((res) => {
            descriptor.value(res.data)

        })
    }
    return fn;
}

@Base('xxx')
class Http {
    @Get('https://jsonplaceholder.typicode.com/comments?_page=1&_limit=3 ')
    getList(data: any) {
        console.log(data);

    }
}

const http = new Http() as any;
```

```ts [参数装饰器]
import 'reflect-metadata'
import axios from 'axios'

/**
 * @param target 构造函数
 */
const Base = (name: string) => {
    const fn: ClassDecorator = (target) => {
        // console.log(target);
        target.prototype.name = name;
        target.prototype.getName = function () {
            // console.log('my name:' + this.name);
        }
    }
    return fn;
}

const Get = (url: string) => {
    /**
     * @param target - 对于静态成员是类的构造函数，对于实例成员是类的原型对象
     * @param propertyKey - 方法的名字
     * @param descriptor - 成员的属性描述符
     */
    const fn: MethodDecorator = (target, propertyKey, descriptor: PropertyDescriptor) => {

        const key = Reflect.getMetadata('key', target, propertyKey)
        // console.log(target, propertyKey, descriptor);
        axios.get(url).then((res) => {
            // descriptor.value(res.data)
            descriptor.value(key ? res.data[key] : res.data)
        })
    }
    return fn;
}

const Result = () => {
    /**
     * @param target - 原型对象
     * @param propertyKey - 方法名
     * @param parameterIndex - 参数索引（这里是 0）
     */
    const fn: ParameterDecorator = (target, propertyKey, parameterIndex) => {
        // console.log(target, propertyKey, parameterIndex);
        Reflect.defineMetadata('key', 'result', target)
    }
    return fn;
};

@Base('xxx')
class Http {
    @Get('https://jsonplaceholder.typicode.com/comments?_page=1&_limit=3 ')
    getList(@Result() data: any) {
        console.log(data);

    }
}

const http = new Http() as any;

// http.getName();
// console.log(http.name); 
```

:::

### 内置泛型工具  

- #### `Partial<T>` 部分的

  将类型 T 的所有属性设置为可选。

::: code-group

```ts [Partial]
interface User {
    name: string;
    age: number;
    address: string;
}

type RequiredUser = Required<User>;
```

```ts [原理]
interface User {
    name: string;
    age: number;
    address: string;
}

type CustomRequired<T> = {
    [P in keyof T]?: T[P]
}
type RequiredUser = CustomRequired<User>;
```

:::

- #### `Required<T>` 必须的

  将类型 T 的所有属性设置为必选。

::: code-group

```ts [Required]
interface User {
    name?: string;
    age?: number;
    address?: string;
}

type UserRequired = Required<User>
```

```ts [原理]
interface User {
    name?: string;
    age?: number;
    address?: string;
}

type CustomUser<T> = {
    [P in keyof T]-?: T[P]
}

type UserRequired = CustomUser<User>
```

:::

- #### `Readonly<T>` 只读

  将类型 T 的所有属性设置为只读。

  ```ts
  interface Person {
    name: string;
    age: number;
  }

  // 使用 Readonly 将 Person 类型的所有属性都设置为只读
  type ReadonlyPerson = Readonly<Person>;

  // 使用 ReadonlyPerson 类型
  let readonlyPerson: ReadonlyPerson = {
    name: "Alice",
    age: 25,
  };

  // 下面的操作会导致编译时错误
  // readonlyPerson.name = "Bob";
  // readonlyPerson.age = 26;
  ```

- #### `Pick<T, K>` 提取

  从类型 T 中选择指定属性 K，形成一个新的类型。

::: code-group

```ts [Pick]
interface User {
    name: string;
    age: number;
    address: string;
}

type PickUser = Pick<User, 'name' | 'age'>;

```

```ts [原理]
interface User {
    name: string;
    age: number;
    address: string;
}

type CustomPick<T, K extends keyof T> = {
    [P in K]: T[P]
}
type PickUser = CustomPick<User, 'name' | 'age'>;

```

:::

- #### `Exclude<T, U>` 排除

  从类型 T 中排除可以赋值给类型 U 的所有属性。

::: code-group

```ts [Exclude]
type Numbers = Exclude<number | string | boolean, string | boolean>; // 类型为 number
```

```ts [原理]
type CustomExclude<T, K > = T extends K ? never : T;

type Numbers = CustomExclude<number | string | boolean, string | boolean>;
```
::: 

- #### `Omit<T, K>` 剔除

  从类型 T 中排除指定属性 K，形成一个新的类型。

::: code-group

```ts
interface User {
    name: string;
    age: number;
    address: string;
}

type OmitUser = Omit<User, 'address' | 'age'>;
```

```ts [原理]
// type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
// or
type CustomOmit<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P]
}


type OmitUser = CustomOmit<User, 'address' | 'age'>;
```

:::

- #### `Record<K, T>` 约束

  创建一个包含指定键类型 K 和值类型 T 的 对象类型。

::: code-group

```ts [Record]
type key = 'a' | 'b' | 'c';

type value = '1' | '2' | '3';

let obj1: Record<key, value> = {
    a: '1',
    b: '2',
    c: '3'
}

let obj2: Record<key, Record<key, value>> = {
    a: {
        a: '1',
        b: '1',
        c: '1'
    },
    b: {
        a: '2',
        b: '2',
        c: '2'
    },
    c: {
        a: '3',
        b: '3',
        c: '3'
    }
}
```

```ts [原理]
type CustomRecord<K extends keyof string | number | symbol, T> = {
    [P in K]: T;
}

// or

type CustomRecord<K extends keyof any, T> = {
    [P in K]: T;
}
```

:::

- #### `ReturnType<T>`

  获取函数类型 T 的返回类型。

::: code-group
 
```ts [ReturnType]
let fn = () => [1, '2', true]

type ReturnFn = ReturnType<typeof fn> 
```

```ts [原理]
type CustomReturnType<T extends Function> = T extends (...args: any[]) => infer R ? R : any
```

:::
  
- #### `Extract<T, U>` 提取

  从类型 T 中提取可以赋值给类型 U 的所有属性。

  ```ts
  type Strings = Extract<number | string, string>; // 类型为 string
  ```

- #### `NonNullable<T>`
  从类型 T 中排除 null 和 undefined。
  ```ts
  type NotNullableStrings = NonNullable<string | null | undefined>; // 类型为 string
  ```

