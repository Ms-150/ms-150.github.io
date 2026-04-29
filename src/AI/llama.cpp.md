# llama.cpp

用 `C/C++` 实现的本地 `LLM` 推理引擎，支持 GGUF 模型格式，跨平台、极快、依赖极少。

它是目前本地部署 `LLM` 的事实标准，Ollama、LM Studio、很多桌面应用底层都在用它。

[https://github.com/ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp)

llama.cpp 只支持 `GGUF` 格式

`GGUF` 是一种为快速加载和推理优化的二进制模型格式。 [GGUF 量化后缀](./about.md#gguf-里的特殊后缀)

## install 

```bash
brew install llama.cpp

# llama-cli         # 命令行推理工具
# llama-server      # 本地 OpenAI API 服务器
# llama-quantize    # 量化工具
# llama-convert     # 模型转换工具
```

### llama-cli
命令行推理工具  

它让你可以在终端里直接运行 GGUF 模型，不需要 API、不需要 Web UI。

::: code-group

```bash [options]
llama-cli
# -m：模型路径
# -p / -i：Prompt 输入与交互模式
# -t：线程数（M4 芯片通常设置为物理核心数）
# -c：Context Window（上下文窗口大小），直接决定了模型能记住多少对话
```

```bash [直接从 HuggingFace 拉取模型]
# 下载模型 > 加载模型 > 开始聊天
llama-cli -hf unsloth/Qwen3.5-9B-GGUF:UD-Q4_K_XL
```

```bash [运行模型]
llama-cli -m qwen2.5-3b-instruct-q4_k_m.gguf

```

```bash [启用 GPU 加速（Apple Silicon）]
# -ngl 999 = 尽可能多地把层放到 GPU。
llama-cli -m qwen2.5-3b-instruct-q4_k_m.gguf -ngl 999
```

```bash [查看本地的模型]
llama-cli --cache-list

# 缓存目录 /Users/bn/.cache/huggingface/hub/
```

:::

### llama-server

一个轻量级的 HTTP 服务器，提供 OpenAI 兼容的聊天、embedding、rerank 等接口，并带 Web UI。

::: code-group

```bash
llama-server -hf unsloth/Qwen3.5-9B-GGUF:Q4_K_XL
```

```bash [启动 Embedding 模型]
# + RAG 检索
# + 语义搜索
# + 文档相似度
# + 向量数据库（Milvus / Chroma / Weaviate）

llama-server -hf bge-m3.gguf --embedding

llama-server -hf Qwen/Qwen3-Embedding-8B-GGUF -m Qwen3-Embedding-8B-Q4_K_M.gguf --port 8081 --embedding
```

```bash [启动 Reranker 模型]
# + 对检索结果重新排序
# + 提升 RAG 的准确率
# + 过滤无关内容
llama-server -m bge-reranker-base.gguf --reranking

llama-server -hf giladgd/Qwen3-Reranker-8B-GGUF -m Qwen3-Reranker-8B-Q3_K_M.gguf --port 8082 --rerank -ngl 99
```

:::


### llama-quantize
### llama-convert

### llama-embedding

```bash
llama-embedding -hf Qwen/Qwen3-Embedding-8B-GGUF -m Qwen3-Embedding-8B-Q4_K_M.gguf -p "你好世界"
```
