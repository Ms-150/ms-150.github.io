# Socket.IO

Socket.IO 是一个用于实时双向通信的库，基于 WebSocket 协议，并提供了许多额外的功能，如自动重连、事件广播等。

[https://socket.io/](https://socket.io/)

## 安装

在项目中安装 `socket.io` 和 `socket.io-client`：

```bash
npm install socket.io socket.io-client
```

## 示例

### 服务器端

在服务器端使用 `socket.io` 创建一个简单的 WebSocket 服务器：

```js
import { Server } from "socket.io";

const io = new Server(3000);

io.on("connection", (socket) => {
  console.log("客户端已连接");

  socket.on("message", (msg) => {
    console.log("收到消息:", msg);
    socket.emit("message", "你好，客户端！");
  });

  socket.on("disconnect", () => {
    console.log("客户端已断开连接");
  });
});
```

### 客户端

在客户端使用 `socket.io-client` 连接到服务器：

```html
<script type="module">
  import io from "socket.io-client";

  const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log("已连接到服务器");
    socket.send("你好，服务器！");
  });

  socket.on("message", (msg) => {
    console.log("收到服务器消息:", msg);
  });

  socket.on("disconnect", () => {
    console.log("与服务器断开连接");
  });
</script>
```
