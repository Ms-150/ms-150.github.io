# SDKMAN

软件开发工具包管理器
在 Unix 系统上轻松管理多个软件开发工具包的可靠伴侣。想象一下，拥有不同版本的 SDK，并且需要一种轻松的方式在它们之间切换。
[https://sdkman.io/](https://sdkman.io/)

## 安装

::: code-group

```bash [curl]
curl -s "https://get.sdkman.io" | bash
```

```bash [source]
source "/Users/ms/.sdkman/bin/sdkman-init.sh"
```

:::

## command

```bash
sdk version
sdk help
# 列出所有可用的 SDK
sdk list

# 安装特定 SDK 的版本
sdk install <candidate> <version_identifier>

# 卸载特定 SDK 的版本
sdk uninstall <candidate> <version_identifier>

# 列出所有已安装的 Java 版本
sdk list java

sdk install java [TAB]

# 当前会话 切换
sdk use java [TAB]

# 设置 SDK 的默认版本
sdk default <candidate> <version_identifier>

# 查看当前版本
sdk current

```
