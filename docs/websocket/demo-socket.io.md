## 示例4 socket.io

## 客户端

```html
<!-- index.html -->

<script src="https://cdn.bootcdn.net/ajax/libs/socket.io/4.4.1/socket.io.min.js"></script>

<script>
  var socket = io('http://localhost:8080');

  // 发送消息
  socket.emit('message', input.value);
  
  // 接收服务器消息
  socket.on('message', function (data) {
    console.log(data);
  });
</script>
```

## 服务端

安装依赖

```
cnpm i socket.io -S
```

代码示例

```js
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
  // 接收数据, 监听自定义事件
  socket.on('message', (data) => {
    // 发送数据
    socket.emit('message', data);
  });
});

httpServer.listen(8080);
```
