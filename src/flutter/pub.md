# Pub

Dart 和 Flutter 应用的官方 package 仓库。

[https://pub.dev/](https://pub.dev/)

## Command

```bash
# 安装依赖
flutter pub get
# 添加依赖
flutter pub add <package_name>
# 移除依赖
flutter pub remove <package_name>
# 查看依赖
flutter pub deps
# 查看过时的依赖
flutter pub outdated

# 更新所有依赖
flutter pub upgrade
# 更新 所有依赖包到最新兼容版本
flutter pub upgrade <package_name>

# 运行包中提供的可执行脚本
flutter pub run <package_name> <script_name>
# example
flutter pub run build_runner build
```

## builder_runner

Dart 和 Flutter 生态系统中一个非常强大的工具，用于自动化代码生成。

`build_runner` 是一个构建系统，它协调并运行一个或多个 “构建器”（builders）。这些构建器是专门的 Dart 包，它们读取你的 Dart 源代码，然后根据预设的规则生成新的 Dart 文件。

```bash
flutter pub add builder_runner

# 执行一次性构建
flutter pub run build_runner build
# 监听文件变化并自动重新生成代码
flutter pub run build_runner watch
# 清除所有生成的代码文件和构建缓存
flutter pub run build_runner clean
# 强制删除冲突文件并重新生成
flutter pub run build_runner build --delete-conflicting-outputs
```

### 核心思想

输入 Dart 代码 + 构建器 = 生成的 Dart 代码

#### JSON 序列化

以最常用的 JSON 序列化为例，需要用到 `json_serializable` 和 `json_annotation`

- `json_annotation`: 这是一个运行时依赖，它提供了一些注解（如 @JsonSerializable()）来标记你的 Dart 类，告诉 json_serializable 构建器如何处理它们。
- `build_runner`: 这是核心的工具包，它本身不执行任何代码生成，而是提供了一个框架来运行其他构建器。
- `json_serializable`: 这是一个具体的构建器包，它会读取带有 json_annotation 注解的 Dart 文件，并生成 JSON 序列化/反序列化代码。

::: code-group

```bash [安装依赖]
# 安装依赖
flutter pub add builder_runner json_serializable json_annotation
# 生成代码
flutter pub run build_runner build
```

```dart [创建 模型 user.dart]
// lib/models/user.dart
import 'package:json_annotation/json_annotation.dart'; // 导入注解

// 这行是关键！它告诉 build_runner 去查找生成的代码文件。
// user.g.dart 是一个约定俗成的命名，表示 user.dart 对应的生成文件。
part 'user.g.dart';

// json_annotation 提供的注解，告诉 json_serializable 构建器你需要为 User 类生成 JSON 相关的代码
@JsonSerializable() // 标记这个类，让 json_serializable 处理它
class User {
  final String name;
  final int age;
  final List<String> hobbies;

  User({required this.name, required this.age, required this.hobbies});

  // 这些是手动添加的工厂构造函数和 toJson 方法的签名，
  // 它们的具体实现将在 user.g.dart 中生成。
  // _$UserFromJson(json) 和 _$UserToJson(this)：这些是约定俗成的函数名，它们将由 json_serializable 生成。
  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}
```

```bash [运行 build_runner]
flutter pub run build_runner build
```

```dart [生成的文件 user.g.dart]
// lib/models/user.g.dart

// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

User _$UserFromJson(Map<String, dynamic> json) => User(
      name: json['name'] as String,
      age: json['age'] as int,
      hobbies:
          (json['hobbies'] as List<dynamic>).map((e) => e as String).toList(),
    );

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
      'name': instance.name,
      'age': instance.age,
      'hobbies': instance.hobbies,
    };
```

:::
