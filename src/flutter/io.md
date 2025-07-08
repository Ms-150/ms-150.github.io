# IO

`dart:io` 是 Dart 语言提供的一个核心库，专门用于处理文件系统、网络、进程以及标准输入/输出 (stdin/stdout/stderr) 等底层操作。

## 常用功能

- 文件操作：读写文件、创建删除目录、检查文件或目录是否存在等。
- 网络通信：进行 HTTP 请求（底层）、TCP/UDP 套接字通信等。
- 进程管理：启动外部进程、与进程通信等。
- 命令行交互：读取用户输入、打印输出到控制台。

## 主要类和功能

- `File` 文件
- `Directory` 目录（文件夹）
- `Process` 用于启动和控制外部进程。 运行系统命令、脚本，并捕获它们的输出。
- `stdin`、`stdout`、`stderr` 全局对象，用于与程序的标准输入/输出流进行交互。
- `HttpClient` 一个相对底层的 HTTP 客户端, 更倾向于使用 `http` 或 `dio`

### File

File(path)
构造函数 创建一个 `File` 对象，指向指定路径的文件, 仅是引用，不实际创建文件。路径推荐使用 /。

```dart
File file = File('/path/to/file.txt');
```

| 方法/属性           | 描述                | 同步/异步 |
| ------------------- | ------------------- | --------- |
| `file.exists()`     | 检查文件是否存在    | 异步      |
| `file.existsSync()` | 检查文件是否存在    | 同步      |
| `file.create()`     | 创建文件            | 异步      |
| `file.createSync()` | 创建文件            | 同步      |
| `file.delete()`     | 删除文件            | 异步      |
| `file.deleteSync()` | 删除文件            | 同步      |
| `file.rename()`     | 重命名文件/移动文件 | 异步      |
| `file.renameSync()` | 重命名文件/移动文件 | 同步      |

::: code-group

```dart [exists]
import 'dart:io';

void main() async {
  File file = File('example.txt');

  if (file.existsSync()) {
    file.deleteSync();
  }
  if (await file.exists()) {
    file.delete();
  }
}
```

```dart [create]
import 'dart:io';

void main() async {
  File file = File('example.txt');

  if (!await file.exists()) {
    await file.create();
  }
}
```

```dart [delete]
import 'dart:io';

void main() async {
  File file = File('example.txt');
  if (await file.exists()) {
    file.delete();
  }
}
```

```dart [rename]
import 'dart:io';

void main() async {
  File file = File('example.txt');
  if (await file.exists()) {
    await file.rename('new_name.txt');
  }
}
```

:::

| 文件内容读写 (字符串)      |                      |      |
| -------------------------- | -------------------- | ---- |
| `file.readAsStringSync()`  | 读取所有内容为字符串 | 同步 |
| `file.readAsString()`      | 读取所有内容为字符串 | 异步 |
| `file.writeAsStringSync()` | 写入字符串到文件     | 同步 |
| `file.writeAsString()`     | 写入字符串到文件     | 异步 |

| 文件内容读写 (行列表)     |                  |      |
| ------------------------- | ---------------- | ---- |
| `file.readAsLinesSync()`  | 读取所有内容为行 | 同步 |
| `file.readAsLines()`      | 读取所有内容为行 | 异步 |
| `file.writeAsLinesSync()` | 写入所有内容为行 | 同步 |
| `file.writeAsLines()`     | 写入所有内容为行 | 异步 |

| 文件内容读写 (字节列表)   |                    |      |
| ------------------------- | ------------------ | ---- |
| `file.readAsBytesSync()`  | 读取所有内容为字节 | 同步 |
| `file.readAsBytes()`      | 读取所有内容为字节 | 异步 |
| `file.writeAsBytesSync()` | 写入所有内容为字节 | 同步 |
| `file.writeAsBytes()`     | 写入所有内容为字节 | 异步 |

| 文件信息/元数据           | 描述                          | 同步/异步 |
| ------------------------- | ----------------------------- | --------- |
| `file.path`               | 获取文件路径                  | 同步      |
| `file.absolute.path`      | 获取文件绝对路径              | 同步      |
| `file.uri`                | 获取文件统一资源标识符（URI） | 同步      |
| `file.parent`             | 获取父目录                    | 同步      |
| `file.lengthSync()`       | 获取文件大小（字节）          | 同步      |
| `file.length()`           | 获取文件大小（字节）          | 异步      |
| `file.lastModifiedSync()` | 获取文件最后修改时间          | 同步      |
| `file.lastModified()`     | 获取文件最后修改时间          | 异步      |
| `file.statSync()`         | 获取文件状态                  | 同步      |
| `file.stat()`             | 获取文件状态                  | 异步      |

::: code-group

```dart [path、 absolute.path、 uri]
import 'dart:io';

void main() async {
  File file = File('example.txt');
  await file.writeAsString('Hello, metadata!');

  print('文件路径: ${file.path}');
  print('文件绝对路径: ${file.absolute.path}');
  print('文件URI: ${file.uri}');
}

```

```dart [parent]
import 'dart:io';

void main() async {
  File file = File('example.txt');
  print('父目录: ${file.parent.path}');
}
```

```dart [length]
import 'dart:io';

void main() async {
  File file = File('size_test.txt');
  await file.writeAsString('This is a test string.'); // 长度为 22 字节

  int size = await file.length();
  print('文件大小 (异步): $size 字节');

  int sizeSync = file.lengthSync();
  print('文件大小 (同步): $sizeSync 字节');
}
```

```dart [lastModified]
import 'dart:io';

void main() async {
  File file = File('size_test.txt');
  await file.writeAsString('This is a test string.'); // 长度为 22 字节

  DateTime lastModified = file.lastModifiedSync();
  print('最后修改时间 (同步): $lastModified');

  DateTime lastModifiedAsync = await file.lastModified();
  print('最后修改时间 (异步): $lastModifiedAsync');
}
```

```dart [stat]
import 'dart:io';

void main() async {
  File file = File('stats_test.txt');
  await file.writeAsString('Some data for stats.');

  FileStat stats = await file.stat();
  print('--- 文件统计信息 ---');
  print('类型: ${stats.type}'); // FileSystemEntityType.file, .directory, .link
  print('大小: ${stats.size} 字节');
  print('最后修改: ${stats.modified}');
  print('最后更改 (元数据): ${stats.changed}');
  print('最后访问: ${stats.accessed}');
  print('权限模式: ${stats.modeString()}'); // 例如: "-rw-r--r--"

  await file.delete();
}
```

:::

| 文件流操作 (处理大文件)  | 描述             | 同步/异步 |
| ------------------------ | ---------------- | --------- |
| `file.openRead()`        | 打开文件进行读取 | 同步      |
| `file.openWrite([mode])` | 打开文件进行写入 | 同步      |

#### 异步 vs 同步 操作

- 同步方法（如 readAsStringSync()）：

  会阻塞当前的执行线程，直到操作完成。
  在 Dart VM（命令行工具或服务器）中可以安全使用。
  在 Flutter 应用的 UI 线程中应避免使用，因为它们会导致 UI 冻结（卡顿），直到文件操作完成。

- 异步方法（如 readAsString()）：

  不会阻塞执行线程，而是返回一个 Future 对象。
  操作在后台进行，完成后通过 await 或 .then() 来获取结果。
  在 Flutter 应用中强烈推荐使用异步方法，以保持 UI 的流畅响应。

::: code-group

```dart
import 'dart:io';

void main() {
  // 创建一个 File 对象
  File file = File('example.txt');

  // 写入内容到文件
  file.writeAsString('Hello, Dart!');

  // 读取文件内容
  String content = file.readAsStringSync();
  print(content); // 输出: Hello, Dart!
}
```

:::
