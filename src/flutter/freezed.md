# Freezed

一个用于数据类、标记联合、嵌套类和克隆的代码生成器。 简化不可变状态类创建。

帮助你轻松创建不可变 (immutable) 数据类、联合类型 (union types) 或密封类 (sealed classes)，并自动生成大量的样板代码，如 `copyWith`、`hashCode`、`==` 操作符以及 toString 方法。这大大减少了手动编写这些代码的工作量，同时也减少了出错的可能性。

[https://pub.dev/packages/freezed](https://pub.dev/packages/freezed)

## 为什么使用 Freezed？

在 Dart 中，创建数据类通常需要手动实现很多方法，比如：

- 构造函数：初始化类的实例。
- `copyWith` 方法：用于创建当前实例的修改版本，同时保留原始实例的不可变性。
- `hashCode` 和 `==` 操作符：用于正确地比较两个对象是否相等。
- `toString` 方法：用于方便地打印对象信息进行调试。

当数据类变得复杂时，手动编写和维护这些方法会非常繁琐且容易出错。Freezed 就是为了解决这些痛点而生的。

## 核心

- 不可变性：默认生成不可变的数据类，这在并发编程和状态管理中非常有用，可以避免意外修改数据。
- 联合类型/密封类：允许你定义一个类型，它可以是预定义的一组特定类型中的一个。这对于表示有限状态或不同结果（例如网络请求的成功、失败、加载中）非常强大，能更好地利用 Dart 的模式匹配特性。
- 代码生成：自动生成大量样板代码，让你专注于业务逻辑。
- Null 安全：完全支持 Dart 的 Null 安全特性。
- 支持 JSON 序列化/反序列化：可以直接从 JSON 字符串创建对象，也可以将对象转换为 JSON 字符串。

## process

1. 声明类模型 (`@freezed` class A `with` `_$`A. const `factory`)：

2. 执行生成器 (flutter pub run build_runner build 或 watch)：

在定义好 Freezed 类之后，你不能直接使用它，因为它只是一个“蓝图”。

你需要运行 build_runner 命令来自动生成这个蓝图对应的所有具体实现代码（包括 copyWith、==、hashCode、toString 以及联合类型的模式匹配方法等）。

生成的文件通常是 .freezed.dart 和 .g.dart（如果集成了 json_serializable）。

3. 像创建对象一样生成 Freezed 实例并使用：

一旦代码生成完成，并且你已经通过 part 指令正确地导入了生成的文件，你就可以像创建任何 Dart 对象一样，使用你定义的 factory 构造函数来创建 Freezed 类的实例了。

例如，如果你的类是 User，你可以直接 User(id: '1', name: 'Alice')。

然后，你就可以开始使用 Freezed 提供的所有强大功能，比如 copyWith 方法来创建不可变副本，或者对联合类型使用 when、map 等方法进行模式匹配。

## install

```bash
flutter pub add freezed_annotation
flutter pub add freezed
```

```yaml
dependencies:
  flutter:
    sdk: flutter
  freezed_annotation: ^2.4.1 # freezed 注解
  flutter_riverpod: ^2.5.1 # Riverpod 核心库
  hooks_riverpod: ^2.5.1 # 使用 hooks_riverpod

dev_dependencies:
  build_runner: ^2.4.9 # 代码生成器
  freezed: ^2.5.2 # freezed 核心库
  json_serializable: ^6.6.0 # json_serializable 核心库
```

## process 流程

1. 定义数据类
2. 运行代码生成器
3. 使用生成的代码

## example

1. 创建一个类 新文件 `data_state.dart`
2. 保存 `data_state.dart` 后，在你的项目根目录下运行以下命令来生成 `data_state.freezed.dart` 文件

::: code-group

```dart [定义数据状态类]
import 'package:freezed_annotation/freezed_annotation.dart';

part 'data_state.freezed.dart'; // 这一行是代码生成器会创建的文件
part 'data_state.g.dart'; // 这一行是代码生成器会创建的文件

@freezed // 使用 @freezed 注解标记这个类，表示它将由 freezed 处理
class DataState with _$DataState { // 混入 _$DataState，这是 freezed 生成代码的一部分

  // 定义联合类型（Union Types）的不同状态
  // const factory 是 freezed 的语法，用于定义不同的命名构造函数，每个代表一种状态。

  // 初始状态：数据未加载或已重置
  const factory DataState.initial() = _DataStateInitial;

  // 加载中状态：数据正在获取
  const factory DataState.loading() = _DataStateLoading;

  // 数据成功状态：数据已成功获取，并携带一个 String 类型的值
  const factory DataState.data(String value) = _DataStateData;

  // 加载失败状态：数据获取失败，并携带一个 String 类型的错误信息
  const factory DataState.error(String message) = _DataStateError;
}
```

```bash [运行代码生成器]
flutter pub run build_runner build
# 文件更改时自动运行生成器（推荐）
flutter pub run build_runner watch
```

:::
