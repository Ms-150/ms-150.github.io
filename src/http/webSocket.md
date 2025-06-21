# WebSocket

一种在 Web 应用程序中实现实时通信的技术，它允许浏览器和服务器之间创建持久性的连接，以便可以进行双向数据传输。

## 应用场景

- 即时聊天
- 实时游戏

## install

```bash
npm install ws

npm install @types/ws -D
```

### 协议 ws:// wss;// 类似 http:// https://

### API

| API       | 描述                               |
| --------- | ---------------------------------- |
| `open`    | 连接建立成功时触发的事件           |
| `message` | 接收到来自服务器的消息时触发的事件 |
| `send`    | 向服务器发送消息                   |
| `close`   | 连接关闭时触发的事件               |
| `error`   | 发生错误时触发的事件               |

```js
// 创建 WebSocket 实例
let ws = new WebSocket("ws://localhost:8080");

// 监听 WebSocket 连接建立事件
ws.addEventListener("open", () => {
  console.log("WebSocket连接已建立");
});

// 监听 WebSocket 接收消息事件
ws.addEventListener("message", (event) => {
  console.log("收到服务器消息: " + event.data);
});

// 监听 WebSocket 连接关闭事件
ws.addEventListener("close", (event) => {
  if (event.wasClean) {
    console.log("WebSocket连接已关闭");
  } else {
    console.error("WebSocket连接断开"); // 通常发生错误时触发
  }
});

// 监听 WebSocket 发生错误事件
ws.addEventListener("error", (error) => {
  console.error("WebSocket发生错误: " + error.message);
});

// 发送消息给服务器
ws.send("Hello Server!");
```

### 心跳检测 保活

后端 socket.readystate == ws.OPEN

```js
// 心跳检测
let heartInterval = setInterval(() => {
  //  OPEN 状态
  if (socket.readystate == ws.OPEN) {
    socket.send(
      JSON.stringify({
        type: state.heart,
        message: "心跳检测",
      })
    );
  } else {
    clearInterval(heartInterval);
  }
}, 3000);
```

### example

::: code-group

```js [FrontEnd]
// 创建 WebSocket
// 协议 ws:// wss;// 类似 http:// https://
const ws = new WebSocket("ws://localhost:8080");

ws.addEventListener("open", () => {
  console.log("连接成功");
});
ws.onopen = function (event) {
  console.log("WebSocket连接已建立");
};

let input = document.querySelector("input");
const handler = () => {
  if (input.value.length > 0) {
    // 发送消息
    ws.send(input.value);
    input.value = null;
  }
};

// 接受 服务端返回的消息
ws.onmessage = (event) => {
  console.log("接收到服务器返回消息：", event.data);
  let li = document.createElement("li");
  const data = JSON.parse(event.data);
  if (data.type == 2) {
    li.innerHTML = data.message;
    document.querySelector("ul").appendChild(li);
  }
};
```

```js [BackEnd]
const WebSocket = require("ws");

const ws = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket服务启动成功，端口8080");
});

const state = {
  heart: 1,
  message: 2,
};

ws.on("connection", (socket) => {
  console.log("连接成功");

  socket.on("message", (message) => {
    console.log("服务端收到客户端的消息:", message.toString());

    // 广播消息给所有客户端
    ws.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: state.message,
            message: message.toString(),
          })
        );
      }
    });
  });

  // 心跳检测
  let heartInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: state.heart,
          message: "心跳检测",
        })
      );
    } else {
      clearInterval(heartInterval);
    }
  }, 3000);

  // 连接关闭时清除心跳检测定时器
  socket.on("close", () => {
    clearInterval(heartInterval);
  });
});
```

:::
