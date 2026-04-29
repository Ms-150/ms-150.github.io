# Huggingface

一个 机器学习社区平台，提供超过 200 万模型、50 万数据集、100 万+ 应用（Spaces），让开发者可以协作、分享和部署 AI 技术。
它的核心使命是 推动 AI 开源与民主化。

[https://huggingface.co/](https://huggingface.co/)

## huggingface-cli

[https://huggingface.co/docs/huggingface_hub/guides/cli](https://huggingface.co/docs/huggingface_hub/guides/cli)

```bash
brew install hf

hf version
```

### usage

::: code-group

```bash []
hf <类别> <操作>
```

```bash [身份验证]
hf auth -h

hf auth login   # 登录
hf auth whoami  # 查看身份
hf auth logout  # 退出
```

```bash [资源获取]
hf download -h

hf download [repo_id]                # 下载模型/数据集
hf download [repo_id] --local-dir .  # 下载到当前路径
```

```bash [缓存管理]
hf cache -h

hf cache ls             # 查看本地缓存
hf cache prune          # 清理无用缓存
hf cache rm model/gpt2  # 删除 
hf cache verify gpt2    # 校验文件完整性 
```

:::