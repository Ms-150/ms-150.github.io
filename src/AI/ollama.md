# Ollama

Ollama 是启动大型语言模型（如 gpt-oss、Gemma 3、DeepSeek-R1、Qwen3 等）最简单的方法。

[ollama](https://ollama.com/)

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
