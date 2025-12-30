# FVM

Flutter Version Manager 的缩写，它是一个非常实用的命令行工具，主要作用是帮助你管理和切换不同版本的 Flutter SDK。

[https://fvm.app/](https://fvm.app/)

## install

```bash
brew tap leoafarias/fvm
brew install fvm

fvm -v
```

## usage

```bash
fvm list
fvm install stable
fvm global stable
fvm use stable
```

```bash
fvm list
>>>
Cache directory:  /Users/username/fvm/versions
Directory Size: 13.36 GB

┌─────────┬─────────┬─────────────────┬──────────────┬──────────────┬────────┬───────┐
│ Version │ Channel │ Flutter Version │ Dart Version │ Release Date │ Global │ Local │
├─────────┼─────────┼─────────────────┼──────────────┼──────────────┼────────┼───────┤
│ 3.32.8  │ stable  │ 3.32.8          │ 3.8.1        │ Jul 25, 2025 │ ●      │       │
├─────────┼─────────┼─────────────────┼──────────────┼──────────────┼────────┼───────┤
│ 3.19.6  │ stable  │ 3.19.6          │ 3.3.4        │ Apr 17, 2024 │        │       │
├─────────┼─────────┼─────────────────┼──────────────┼──────────────┼────────┼───────┤
│ 2.10.5  │ stable  │ 2.10.5          │ 2.16.2       │ Apr 18, 2022 │        │       │
├─────────┼─────────┼─────────────────┼──────────────┼──────────────┼────────┼───────┤
│ .fvm    │         │                 │              │              │        │       │
└─────────┴─────────┴─────────────────┴──────────────┴──────────────┴────────┴───────┘
```


```bash []
export PATH="$PATH:$HOME/fvm/default/bin"
```