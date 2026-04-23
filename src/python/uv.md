# UV

一个极其快速的 Python 包和项目管理器，用 Rust 编写。

[https://docs.astral.sh/uv/](https://docs.astral.sh/uv/)

## feature

用 Rust 写的 Python 工具链，可以替代：

+ `pip`（装包）
+ `venv`（虚拟环境）
+ `Poetry`（依赖管理）
+ `pyenv`（Python 版本）

👉 一句话：

uv = Python 版 npm / pnpm（而且更快）


## install

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
# or
brew install uv

uv -V
# uv 0.11.7 (Homebrew 2026-04-15 aarch64-apple-darwin)
```

## core

::: code-group

```bash [初始化项目]
uv init

# 生成：pyproject.toml
# name = "demo"
# version = "0.1.0"
# dependencies = []
```

```bash [安装依赖]
uv add requests

# 创建虚拟环境
# 安装依赖
# 写入 pyproject.toml
# 生成 uv.lock
```

```bash [运行代码]
uv run python main.py
```

```text
demo/
├── pyproject.toml
├── uv.lock
└── main.py
```

:::

## 
