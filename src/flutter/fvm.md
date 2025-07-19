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
fvm install stable
fvm global stable
fvm use stable
```


```bash []
export PATH="$PATH:$HOME/fvm/default/bin"
```