# Widget

## 什么是 Widget？

在 Flutter 中，一切皆 Widget。Widget 是 Flutter 应用程序 UI 的基本构建块。它们描述了在给定配置和状态下，视图应该看起来是什么样子。Widget 可以是可见的 UI 元素（如文本、按钮、图片），也可以是不可见的布局元素（如行、列、填充）。

Widget 是不可变的，这意味着一旦创建，它们的属性就不能改变。当 Widget 的状态发生变化时，Flutter 会创建一个新的 Widget 树来表示新的 UI 状态，然后高效地更新屏幕。

## Widget 的分类

Widget 主要分为两大类：

- StatefulWidget (有状态 Widget)
- StatelessWidget (无状态 Widget)
- InheritedWidget (继承 Widget)

### 1. StatelessWidget (无状态 Widget)

`StatelessWidget` 是没有内部状态的 Widget。它们一旦被创建，其属性就不能改变。它们通常用于显示静态内容，或者其状态由父 Widget 管理。

**特点：**

- 不依赖于任何可变状态。
- 生命周期简单，通常只构建一次。
- 适用于静态内容，如图标、文本、图片等。

**示例：** `Text`, `Icon`, `Image`, `AppBar`, `Padding`, `Row`, `Column`

```dart
import 'package:flutter/material.dart';

class MyStatelessWidget extends StatelessWidget {
  final String title;

  const MyStatelessWidget({Key? key, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: const Center(
        child: Text('这是一个无状态 Widget'),
      ),
    );
  }
}

void main() {
  runApp(const MaterialApp(home: MyStatelessWidget(title: '无状态示例')));
}
```

### 2. StatefulWidget (有状态 Widget)

`StatefulWidget` 是有状态的 Widget，它们的状态可以随着时间的推移而改变。当状态发生变化时，Flutter 会创建一个新的 Widget 树来表示新的 UI 状态，然后高效地更新屏幕。

**特点：**

- 可以拥有可变状态，状态可以在 Widget 的生命周期内改变。
- 生命周期相对复杂，包括创建、更新、销毁等阶段。
- 适用于需要用户交互或数据动态变化的场景，如计数器、表单输入等。

示例： `Checkbox` , `Slider` , `TextField` , `ListView` , `InkWell`

```dart
import 'package:flutter/material.dart';

class MyStatefulWidget extends StatefulWidget {
  const MyStatefulWidget({Key? key}) : super(key: key);

  @override
  State<MyStatefulWidget> createState() => _MyStatefulWidgetState();
}

class _MyStatefulWidgetState extends State<MyStatefulWidget> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('有状态示例'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              '您已经点击按钮这么多次:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}

void main() {
  runApp(const MaterialApp(home: MyStatefulWidget()));
}
```

### Widget

- `Text` : 显示一段文本。
- `Icon` : 显示一个图标。
- `Image` : 显示一张图片。
- `Button` (如 `ElevatedButton` , `TextButton` , `OutlinedButton` ) : 用户可点击的按钮。
- `Container` : 一个方便的 Widget，可以组合绘制、定位和大小调整 Widget。
- `Row` : 将子 Widget 水平排列。
- `Column` : 将子 Widget 垂直排列。
- `Stack` : 允许子 Widget 堆叠在一起，可以用于创建重叠的 UI 元素。
- `Padding` : 给子 Widget 添加内边距。
- `Scaffold` : 实现基本的 Material Design 视觉布局结构，包含 AppBar , body , FloatingActionButton 等。
- `ListView` : 可滚动的列表，适用于显示大量内容。
- `GestureDetector` : 检测用户手势，如点击、双击、长按等。

#### 文本和图像

::: code-group

```dart [Text]
Text(
  'Hello, Flutter!',
  style: TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.blue,
  ),
)
```

```dart [Icon]
Icon(
  Icons.favorite,
  color: Colors.red,
  size: 48,
)
```

```dart [Image]
// 从网络加载图片
Image.network('https://example.com/image.jpg')

// 从本地资源加载图片
Image.asset('assets/images/logo.png')
```

```dart [Button]
// ElevatedButton
ElevatedButton(
  onPressed: () {
    print('Button pressed!');
  },
  child: Text('Elevated Button'),
)

// TextButton
TextButton(
  onPressed: () {},
  child: Text('Text Button'),
)

// OutlinedButton
OutlinedButton(
  onPressed: () {},
  child: Text('Outlined Button'),
)

FloatingActionButton(
    onPressed: () {},
    child: Icon(Icons.add),
    tooltip: 'Add',
)
```

:::

#### 页面结构

::: code-group

```dart [Scaffold]
Scaffold(
  appBar: AppBar(
    title: Text('Scaffold Example'),
  ),
  body: Center(
    child: Text('Main Content'),
  ),
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: Icon(Icons.add),
  ),
)
```

```dart [AppBar]
// 通常用于 Scaffold 的顶部，显示标题、操作按钮等
AppBar(
  title: Text('AppBar Example'),
  actions: [
    IconButton(
      icon: Icon(Icons.settings),
      onPressed: () {},
    ),
  ],
)
```

```dart [BottomNavigationBar]
// 用于在底部创建一个导航栏，通常用于切换不同的页面或功能
BottomNavigationBar(
  items: [
    BottomNavigationBarItem(
      icon: Icon(Icons.home),
      label: 'Home',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.search),
      label: 'Search',
    ),
  ],
)
```

:::

### 布局

::: code-group

```dart [Container]
Container(
  width: 200,
  height: 200,
  color: Colors.amber,
  padding: EdgeInsets.all(16),
  margin: EdgeInsets.all(8),
  child: Text('Container Content'),
)
```

```dart [Padding]
Padding(
  padding: EdgeInsets.all(16),
  child: Text('Padded Text'),
)
```

```dart [Center]
Center(
  child: Container(
    width: 200,
    height: 200,
    color: Colors.blue,
    child: Center(
      child: Text('双重居中'),
    ),
  ),
)
```

```dart [SizedBox]
SizedBox(
  width: 100,
  height: 100,
  child: Container(
    color: Colors.red,
  ),
)

SizedBox.expand(
  child: Container(
    color: Colors.green,
  ),
)

SizedBox.shrink()
```

```dart [Row]
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  children: [
    Icon(Icons.star, color: Colors.yellow),
    Icon(Icons.star, color: Colors.yellow),
    Icon(Icons.star, color: Colors.yellow),
  ],
)
```

```dart [Column]
Column(
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Text('First Item'),
    Text('Second Item'),
    Text('Third Item'),
  ],
)
```

```dart [Stack]
Stack(
  children: [
    Container(
      width: 200,
      height: 200,
      color: Colors.blue,
    ),
    Positioned(
      bottom: 10,
      right: 10,
      child: Icon(Icons.add_circle, color: Colors.white, size: 48),
    ),
  ],
)
```

```dart [Expanded]
Expanded(
 flex: 1, // 占据剩余空间的 1 份
 child: Container(
   color: Colors.red,
   child: const Center(child: Text('Expanded (flex: 1)', style: TextStyle(color: Colors.white))),
 ),
```

```dart [Flexible]
Flexible( // 红色方块会根据内容大小灵活伸缩，但不强制填满
  flex: 1,
  fit: FlexFit.loose, // 允许它更灵活地根据内容决定大小
  child: Container(color: Colors.red, child: Text('短文本')),
),
Flexible( // 绿色方块也会根据内容大小灵活伸缩
  flex: 1,
  fit: FlexFit.loose,
  child: Container(color: Colors.green, child: Text('一段比较长的文本，可能会自动换行')),
),
```

```dart [Spacer]
Row(
  children: <Widget>[
    Text('左边'),
    Spacer(), // 填充左右文本之间的所有剩余空间
    Text('右边'),
  ],
)

// 或者均匀分布
Row(
  children: <Widget>[
    Text('A'),
    Spacer(), // 弹性空间1
    Text('B'),
    Spacer(flex: 2), // 弹性空间2，比空间1大一倍
    Text('C'),
  ],
)
```

:::

#### 输入交互

::: code-group

```dart [TextField]
// 用于创建单行文本输入框，用户可以在其中输入文本。
TextField(
  decoration: InputDecoration(
    hintText: 'Enter your text',
    labelText: 'Text Input',
  ),
)
```

```dart [TextFormField]
// 用于创建可验证的文本输入框，通常与 Form 一起使用，用于收集用户输入并进行验证。
TextFormField(
  decoration: InputDecoration(
    hintText: 'Enter your email',
    labelText: 'Email Input',
  ),
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your email';
    }
    return null;
  },
)
```

```dart [Checkbox]
// 复选框，用于用户选择多个选项中的一个或多个。
Checkbox(
  value: isChecked,
  onChanged: (newValue) {
    setState(() {
      isChecked = newValue!;
    });
  },
)
```

```dart [Radio]
// 单选框，用于用户选择多个选项中的一个。
enum SingingCharacter { lafayette, jefferson }
SingingCharacter? _character = SingingCharacter.lafayette; // 状态变量
// ... 在 build 方法中 ...
Radio<SingingCharacter>(
  value: SingingCharacter.lafayette,
  groupValue: _character,
  onChanged: (SingingCharacter? value) {
    setState(() {
      _character = value;
    });
  },
)
```

:::

### 列表和滚动

::: code-group

```dart [ListView.builder]
// 常用的可滚动列表，适用于显示大量动态内容。可以一次性构建所有子项 (ListView)，也可以按需构建 (ListView.builder) 以提高性能。

ListView.builder(
  itemCount: 50,
  itemBuilder: (context, index) {
    return ListTile(
      title: Text('Item \$index'),
    );
  },
)
```

```dart [SingleChildScrollView]
// 用于在单个子项的情况下创建可滚动视图，适用于只有一个子项的情况。

SingleChildScrollView(
  child: Column(
    children: [
      Text('SingleChildScrollView Example'),
      // 这里添加更多内容
    ],
  ),
)
```

```dart [ListView.builder]
ListView.builder(
  itemCount: 100, // 列表项的总数量，如果是无限列表，可以省略或给一个很大的值
  itemBuilder: (BuildContext context, int index) {
    // 这个 builder 函数会为每个索引构建一个列表项
    return ListTile(
      title: Text('列表项 ${index + 1}'),
      subtitle: Text('这是第 $index 个数据'),
      leading: Icon(Icons.star),
    );
  },
);
```

```dart [GridView.builder]
GridView.builder(
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2, // 每行/列显示2个
    crossAxisSpacing: 10.0, // 交叉轴间距
    mainAxisSpacing: 10.0, // 主轴间距
  ),
  itemCount: 50, // 网格项的总数量
  itemBuilder: (BuildContext context, int index) {
    // 这个 builder 函数会为每个索引构建一个网格项
    return Card(
      color: Colors.primaries[index % Colors.primaries.length], // 随机颜色
      child: Center(
        child: Text('格子 $index', style: const TextStyle(color: Colors.white, fontSize: 20)),
      ),
    );
  },
);
```

:::

#### 手势检测

::: code-group

```dart [GestureDetector]
GestureDetector(
  onTap: () {
    print('Tapped!');
  },
  onDoubleTap: () {
    print('Double tapped!');
  },
  onLongPress: () {
    print('Long pressed!');
  },
  child: Container(
    width: 200,
    height: 200,
    color: Colors.green,
    child: Center(child: Text('Tap Me')),
  ),
)
```

:::

#### 进度指示器

::: code-group

```dart [CircularProgressIndicator]
// 用于显示圆形进度指示器，通常用于表示加载操作或等待时间。
CircularProgressIndicator(
  value: 0.5, // 进度值，范围为 0.0 到 1.0
  backgroundColor: Colors.grey, // 背景颜色
  valueColor: AlwaysStoppedAnimation<Color>(Colors.blue), // 进度颜色
)
```

```dart [LinearProgressIndicator]
// 用于显示线性进度指示器，通常用于表示加载操作或等待时间。
LinearProgressIndicator(
  value: 0.75, // 进度值，范围为 0.0 到 1.0
  backgroundColor: Colors.grey, // 背景颜色
  valueColor: AlwaysStoppedAnimation<Color>(Colors.green), // 进度颜色
)
```

:::

#### 消息通知

::: code-group

```dart [SnackBar]
// 用于显示短暂的消息通知，通常用于向用户展示操作成功或失败的消息。
SnackBar(
  content: Text('This is a SnackBar message'),
  duration: Duration(seconds: 2),
)
```

```dart [AlertDialog]
AlertDialog(
  title: Text('AlertDialog Example'),
  content: Text('This is an AlertDialog content'),
  actions: [
    TextButton(
      onPressed: () {
        Navigator.pop(context);
      },
      child: Text('Cancel'),
    ),
    TextButton(
      onPressed: () {
        Navigator.pop(context);
      },
      child: Text('OK'),
    ),
  ],
)
```

:::
