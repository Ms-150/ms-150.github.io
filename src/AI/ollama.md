# Ollama

Ollama 是启动大型语言模型（如 gpt-oss、Gemma 3、DeepSeek-R1、Qwen3 等）最简单的方法。

[ollama](https://ollama.com/)

## AI 模型

1. 通用语言模型（LLM, Large Language Models）
  + 处理：文本 → 文本
  + 能力：理解、生成、推理、代码、对话
  + 代表：GPT、Claude、Qwen、Llama、DeepSeek

2. 向量模型（Embedding Models）
  + 处理：文本 → 向量
  + 能力：语义检索、RAG、相似度
  + 代表：bge-m3、nomic-embed-text、gte-small
  
3. 多模态模型（Vision/Audio/Video LLM）
  + 处理：图像/音频/视频 → 文本
  + 能力：看图、OCR、图像问答、视频理解
  + 代表：Qwen-VL、LLaVA、Moondream、GPT‑4o

4. 生成式视觉模型（扩散模型 / 文生图模型）
  + 处理：文本 → 图片
  + 能力：文生图、图生图、修复、风格迁移
  + 代表：Stable Diffusion、SDXL、Flux、Midjourney、DALL·E

## install

::: code-group

```bash [Linux]
curl -fsSL https://ollama.com/install.sh | sh

# mac 
brew install ollama
```

```bash [Windows]
irm https://ollama.com/install.ps1 | iex
```

:::

## start

::: code-group

```bash [版本]
ollama -v

# ollama version is 0.17.7
```

```bash [启动]
ollama
```
:::

## 用 API 调用

Ollama 默认提供本地 API： `http://localhost:11434`

::: code-group

```bash [cURL]
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3:8b",
  "messages": [{"role": "user", "content": "你好"}]
}'
```

```python
import requests

resp = requests.post(
    "http://localhost:11434/api/chat",
    json={
        "model": "qwen3:8b",
        "messages": [{"role": "user", "content": "你好"}]
    }
)
print(resp.json())
```

```js
const response = await fetch("http://localhost:11434/api/chat", {
  method: "POST",
  body: JSON.stringify({
    model: "qwen3:8b",
    messages: [{ role: "user", content: "你好" }]
  })
});
console.log(await response.json());
```

:::

## docker

[https://docs.dify.ai/zh/self-host/quick-start/docker-compose](https://docs.dify.ai/zh/self-host/quick-start/docker-compose)
