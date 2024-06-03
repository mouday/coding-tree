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
