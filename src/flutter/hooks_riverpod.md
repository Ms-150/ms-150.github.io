# Hooks_riverpod

`Provider` 是 `Flutter` 中最流行也是最推荐的状态管理方案之一，它简单易懂，功能强大，能帮助你快速入门并构建出清晰可维护的 Flutter 应用。
一个非常流行且功能强大的状态管理库, 旨在解决 Provider 在某些场景下的一些痛点，并提供更安全、更灵活的依赖管理。

[https://pub.dev/packages/hooks_riverpod](https://pub.dev/packages/hooks_riverpod)

[https://riverpod.dev/](https://riverpod.dev/)

## install

```bash
flutter pub add hooks_riverpod
```

## 核心概念

- `ProviderScope` Riverpod 的 "家"
- `Provider` 状态的 "声明" 和 "分发"
- `ref` 访问和管理 Provider 的 "引用"
- `ConsumerWidget` `Consumer` UI 消费 "状态" 的 Widget

### `ProviderScope`

`ProviderScope` 是 Riverpod 应用的根 Widget。你必须将整个 Flutter 应用包裹在 ProviderScope 中，以便 Riverpod 能够管理和提供状态。

```dart
void main() {
  runApp(
    // 整个应用需要包裹在 ProviderScope 中
    const ProviderScope(
      child: MyApp(),
    ),
  );
}
```

### `Provider`

1. `Provider`
   提供一个不可变的值。当这个值不会改变时，可以使用它。

```dart
final welcomeMessageProvider = Provider<String>((ref) {
  return '欢迎来到 Riverpod！';
});
```

2. `StateProvider`

提供一个可以改变的简单状态（例如一个计数器）。它内部维护了一个 State 对象，你可以通过修改 State 的 state 属性来更新值。

```dart
final counterProvider = StateProvider<int>((ref) => 0); // 初始值为 0

// 获取 StateController 实例，然后修改其 state 属性
ref.read(counterProvider.notifier).state++;
```

3. `StateNotifierProvider` 和 `StateNotifier`

`Riverpod` 中最常用、也最推荐的复杂状态管理方案，类似于 `Provider` 中的 `ChangeNotifier`。

- `StateNotifier`
  一个类，用于封装更复杂的业务逻辑和状态。它不直接继承自 `ChangeNotifier`，而是提供一个 state 属性来持有其当前状态。当 state 发生变化时，它会自动通知监听者。

- `StateNotifierProvider`
  用于提供 StateNotifier 的实例。

::: code-group

```dart [StateNotifier]
// 定义一个不可变的状态类 (推荐使用 freezed 或 equatable)
class Todo {
  final String id;
  final String description;
  final bool completed;

  Todo({required this.id, required this.description, this.completed = false});

  Todo copyWith({String? id, String? description, bool? completed}) {
    return Todo(
      id: id ?? this.id,
      description: description ?? this.description,
      completed: completed ?? this.completed,
    );
  }
}

// 状态管理类，继承 StateNotifier
class TodosNotifier extends StateNotifier<List<Todo>> {
  TodosNotifier() : super([]); // 初始状态为空列表

  void addTodo(Todo todo) {
    state = [...state, todo]; // 更新状态，创建新列表
  }

  void toggle(String id) {
    state = [
      for (final todo in state)
        if (todo.id == id) todo.copyWith(completed: !todo.completed)
        else todo,
    ];
  }
}
```

```dart [StateNotifierProvider]
final todosProvider = StateNotifierProvider<TodosNotifier, List<Todo>>((ref) {
  return TodosNotifier();
});
```

:::

4. `FutureProvider`

异步地提供一个值（例如从网络获取数据）。它会返回一个 AsyncValue 对象，表示加载中、错误或数据已就绪。

```dart
final userProvider = FutureProvider<User>((ref) async {
  // 模拟网络请求
  await Future.delayed(const Duration(seconds: 2));
  return User(name: 'Alice', age: 30);
});

```

5. `StreamProvider`

提供一个异步流（例如实时聊天数据）。

```dart
final timerProvider = StreamProvider<int>((ref) {
  return Stream.periodic(const Duration(seconds: 1), (count) => count);
});
```

### `ref`

访问和管理 Provider 的"引用"

这是一个非常重要的对象，你可以通过它来读取其他 Provider、监听它们的变化、或者执行一些副作用（例如关闭资源）。

- `ref.watch(someProvider)`：监听一个 Provider 的值。当该 Provider 的值发生变化时，调用 watch 的 Widget 会自动重建。这通常用于在 build 方法中显示状态。
- `ref.read(someProvider)`：读取一个 Provider 的当前值，但不监听其变化。当该 Provider 的值发生变化时，调用 read 的 Widget 不会重建。这通常用于事件处理函数（如按钮的 onPressed），执行一次性操作，例如调用 StateNotifier 中的方法来修改状态。
- `ref.listen(someProvider`, (previous, next) { ... })：监听 Provider 的变化，并在变化发生时执行副作用（例如显示 SnackBar、导航到新页面）。它不会导致 Widget 重建。
- `ref.invalidate(someProvider)`：使 Provider 的当前状态失效，强制它重新计算其值（例如，重新发起网络请求）。

### `ConsumerWidget` `HookConsumerWidget` `Consumer`

`ConsumerWidget` 是一个专门为 `Riverpod` 设计的 `StatelessWidget` 替代品。它是你在 Riverpod 应用中构建 UI 组件的最常用方式。

Riverpod 提供了一个 `ConsumerWidget` 或 `HookConsumerWidget` (如果你使用 flutter_hooks)，以及 `Consumer` Widget 来访问 Provider。

- `ConsumerWidget`
  替代 `StatelessWidget` 或 `StatefulWidget`。它的 build 方法会接收一个 WidgetRef 对象，通过它可以读取 Provider。
- `Consumer`
  类似于 Provider 中的 `Consumer`，用于在 Widget 树的局部监听 Provider。当只有部分 Widget 需要重建时，它会很有用。

::: code-group

```dart [ConsumerWidget]
class MyCounterPage extends ConsumerWidget { // 注意这里是 ConsumerWidget
  const MyCounterPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) { // build 方法多了一个 ref 参数
    // 监听 counterProvider 的值，当值改变时，这个 Widget 会重建
    final count = ref.watch(counterProvider);

    // 监听 userProvider 的异步状态
    final asyncUser = ref.watch(userProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Riverpod 计数器')),
      body: Center(
        child: Column(
          children: [
            Text('计数: $count'),
            // 处理异步数据
            asyncUser.when(
              data: (user) => Text('用户: ${user.name}'),
              loading: () => const CircularProgressIndicator(),
              error: (err, stack) => Text('错误: $err'),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // 读取 counterProvider 的 notifier，然后修改 state
          ref.read(counterProvider.notifier).state++;
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

```dart [Consumer]
Consumer(
  builder: (context, ref, child) {
    final count = ref.watch(counterProvider);
    return Text('计数: $count');
  },
)
```

:::

## 流程

1. 声明 Provider

   - `Provider`：用于提供不可变的值。
   - `StateProvider`：用于提供简单的可变状态。
   - `StateNotifierProvider`：用于管理复杂状态和业务逻辑（需要配合 StateNotifier 类）。
   - `FutureProvider`：用于处理异步数据（一次性获取）。
   - `StreamProvider`：用于处理异步数据流（持续监听）。

2. `ProviderScope` 包裹根组件
   这是 Riverpod 运行的必要环境，为所有 Provider 提供作用域。

3. 用 `ConsumerWidget` 或 `Consumer` 来使用 `ref` 传入

   - `ConsumerWidget`：替换 StatelessWidget，通过 build(context, ref) 方法直接获取 ref。
   - `Consumer`：一个 Widget，通过 builder(context, ref, child) 方法获取 ref，用于局部优化或在非 ConsumerWidget 中使用。

   - `ref.watch()`：监听 Provider 的值，当值变化时，调用 watch 的 Widget 会自动重建。
   - `ref.read()`：读取 Provider 的当前值，但不监听其变化。通常用于触发事件或调用 Provider 中的方法。
   - `ref.listen()`：监听 Provider 的变化，并在变化发生时执行副作用（如显示 SnackBar、导航等），不会导致 Widget 重建。
   - `ref.invalidate()`：使 Provider 的当前状态失效，强制它重新计算其值。

## example

```dart
import 'package:flutter/material.dart'; // 导入 Flutter Material Design UI 组件库
import 'package:flutter_hooks/flutter_hooks.dart'; // 导入 Flutter Hooks 库，用于在函数式组件中使用状态管理等 Hook
import 'package:hooks_riverpod/hooks_riverpod.dart'; // 导入 Riverpod 状态管理库（已集成 Hooks）

// 我们创建一个 "provider"（提供者），它将存储一个值（这里是 "Hello world"）。
// 通过使用 provider，我们可以模拟/覆盖所暴露的值。
final helloWorldProvider = Provider((_) => 'Hello world'); // 定义一个简单的 Provider，提供字符串 "Hello world"

void main() {
  runApp(
    // 为了使 widget 能够读取 provider，我们需要将整个应用程序包裹在一个 "ProviderScope" widget 中。
    // 这里将存储我们 provider 的状态。
    ProviderScope( // ProviderScope 是 Riverpod 应用程序的根，所有 provider 的状态都存储在这里
      child: MyApp(), // 应用程序的根组件
    ),
  );
}

// 扩展 HookConsumerWidget 而不是 HookWidget，这是 Riverpod 提供的
// HookConsumerWidget 允许我们同时使用 Flutter Hooks 和 Riverpod provider
class MyApp extends HookConsumerWidget {
  @override
  // build 方法是组件 UI 的描述。context 是构建上下文，ref 是 Riverpod 提供的用于与 provider 交互的引用
  Widget build(BuildContext context, WidgetRef ref) {
    // 我们可以在 HookConsumerWidget 内部使用 hooks
    // useState 是 Flutter Hooks 提供的 Hook，用于管理组件内部的局部状态。
    // 这里创建一个名为 counter 的状态变量，初始值为 0。
    final counter = useState(0);

    // 使用 ref.watch() 监听 helloWorldProvider 的值。
    // 当 helloWorldProvider 的值发生变化时（尽管本例中它是固定值），此 Widget 会自动重建。
    final String value = ref.watch(helloWorldProvider);

    return MaterialApp( // Material Design 风格的应用程序根组件
      home: Scaffold( // 脚手架，提供基本的视觉结构，如 AppBar 和 body
        appBar: AppBar(title: const Text('示例')), // 应用栏，显示标题 "Example"
        body: Center( // 页面主体内容，将子组件居中显示
          child: Text('$value ${counter.value}'), // 显示文本，拼接了 provider 的值和计数器的当前值
        ),
      ),
    );
  }
}
```
