# Flutter

Google 开发的一款开源 UI 软件开发工具包，用于从单个代码库构建跨平台（移动、Web、桌面）的、美观的原生编译应用程序。它使用 Dart 语言进行开发。

## Flutter 的优势

- **快速开发**：热重载（Hot Reload）功能让您在修改代码后立即看到效果，大大提高开发效率。
- **富有表现力且灵活的 UI**：内置丰富的可定制小部件（Widgets），可以轻松构建复杂且美观的用户界面。
- **原生性能**：Flutter 代码被编译成 ARM 机器码，确保在各种设备上都能提供流畅的原生体验。
- **跨平台**：一套代码库可以部署到 iOS、Android、Web、Windows、macOS 和 Linux。

## install

```bash
brew install dart
brew install --cask flutter

# 配置环境变量
echo 'export PATH="$PATH:/opt/homebrew/opt/flutter/bin"' >> ~/.zshrc

# 刷新配置文件
source ~/.zshrc
```

## cli

[https://docs.flutter.dev/reference/flutter-cli](https://docs.flutter.dev/reference/flutter-cli)

```bash
# 查看 Flutter 版本
flutter --version

# 创建新的 Flutter 项目
flutter create myapp

# 查看 Flutter 环境信息
flutter doctor

# 升级 Flutter
flutter upgrade

# 运行 Flutter 应用
flutter run
  r # reload
  R # restart

# 查看可用的设备
flutter devices

# 打包 Android 应用
flutter build apk

# 打包 iOS 应用
flutter build ios

# 运行 Flutter 测试
flutter test
```

## Assets 资源

比如图片、字体、JSON 文件等。这些资源是应用用户界面的重要组成部分。Flutter 提供了一套直观的机制来管理和使用这些资源。

```yaml [pubspec.yaml]
flutter:
  assets:
    - assets/my_image.png # 声明单个图片文件
    - assets/data/ # 声明整个目录 (例如，包含 JSON 或其他数据文件)
    - images/ # 声明另一个图片目录
```
