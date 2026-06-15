# geminicli

`Gemini CLI` 将 `Gemini` 车型的强大功能直接带入您的终端。用它来理解代码，自动化任务，并结合本地项目背景构建工作流程。

[https://geminicli.com/](https://geminicli.com/)

::: code-group

```bash [node]
npm install -g @google/gemini-cli
```

```bash [brew]
brew install gemini-cli
```

:::

## usage

::: code-group

```bash [version]
gemini -v
```

```bash [start]
gemini
```

```bash [init]
/init 
# 生成 .gemini/ 配置
```

```bash [plan]
/plan
# 计划模式
```

```bash [claar]
/clear
# 清空当前对话缓存，开始新任务。
```
:::

### context

直接引用: 使用 `@` 符号强制 CLI 读取特定文件或目录。

::: code-group

```bash [file]
# 单文件
@path/to/file.ts 解释逻辑
```

```bash [files]
# 多文件
@file1.ts @file2.ts 重构接口依赖
```

```bash [dir]
# 目录级扫描
@src/utils/ 检查过时的 API
```

``` [ignore]
.geminiignore
# 敏感文件忽视

.env
local-db-dump.sql
private-notes.md
```
:::


### Skills

 