
# WebSocket

[websocketd](http://websocketd.com/) is the WebSocket daemon, It's like CGI, twenty years later, for WebSockets

学习资料

[【bilibili】Web前端-3小时教你打造一个聊天室（websocket）](https://www.bilibili.com/video/BV14K411T7cd)


WebSocket 协议

基于TCP的一种新的网络协议，它实现了浏览器与服务器全双工（full-duplex）通信

允许服务器主动发送消息给客户端


文档：https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/WebSocket


创建websocket对象
```js
var ws = new WebSocket(url, [protocols]);
```

方法 

|方法 | 说明
|- | -
close() | 关闭链接
send(data) | 发送数据

事件

事件名 | 说明
|- | -
open | 连接打开
message | 接收到新消息
error | 出现错误
close | 连接关闭

实现技术：

- 客户端：WebSocket
- 服务端：[nodejs-websocket](https://www.npmjs.com/package/nodejs-websocket) / [ws](https://www.npmjs.com/package/)




## 示例

[示例1 Echo](./1-demo-echo.md)

[示例2 聊天室](./2-demo-chat.md)

[示例3 聊天室升级版](./3-demo-chat-update.md)

[示例4 socket.io](./4-demo-socket.io.md)

https://www.bilibili.com/video/BV14K411T7cd?p=8&spm_id_from=pageDriver


客户端代码

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible"
          content="IE=edge">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <title>WebSocket Demo</title>
</head>

<body>
    <input type="text">
    <button>发送</button>
    <div id="content"></div>
    
    <script src="https://cdn.bootcdn.net/ajax/libs/socket.io/4.4.1/socket.io.min.js"></script>

    <script>
        var socket = io('http://localhost:8080');
        var content = document.getElementById('content');
        var input = document.querySelector('input');
        var button = document.querySelector('button');
        
        // 发送消息
        button.addEventListener('click', function () {
            socket.emit('message', input.value);
        });
        
        // 接收服务器消息
        socket.on('message', function (data) {
            content.innerHTML += data + '<br>';
        });
    </script>
</body>

</html>
```

服务端代码

```js
// server.js
const { Server } = require('socket.io');
const { createServer } = require('http');

const httpServer = createServer();

// 处理跨域
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  // 接收数据
  socket.on('message', (data) => {
    // 发送数据
    socket.emit('message', data);
  });
});

httpServer.listen(8080);

```

