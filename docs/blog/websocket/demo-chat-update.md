# 示例3 聊天室升级版

## 客户端

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

    <script>
        // 消息类型枚举
        const message_type = {
            OPEN: 'open',
            CLOSE: 'close',
            MESSAGE: 'message',
        };

        var input = document.querySelector('input');
        input.addEventListener('keydown', function (e) {
            // 回车键
            if (e.keyCode == 13) {
                sendMessage();
            }
        })

        // 创建一个 WebSocket 对象
        var socket = new WebSocket('ws://127.0.0.1:8080');

        // 连接成功
        socket.onopen = function () {
            console.log('连接成功');
        }

        // 接收消息
        socket.onmessage = function (res) {
            console.log(res.data);

            let data = JSON.parse(res.data);

            let div = document.createElement('div');
            div.innerHTML = `${data.message} -- ${data.time}`;
            if (data.type === message_type.MESSAGE) {
                div.style.color = 'blue';
            } else if (data.type === message_type.CLOSE) {
                div.style.color = 'red';
            } else if (data.type === message_type.OPEN) {
                div.style.color = 'green';
            }

            document.getElementById('content').appendChild(div);

        }

        // 接收消息
        socket.onclose = function (res) {

            let div = document.createElement('div');
            div.innerHTML = '服务器断开连接';
            document.getElementById('content').appendChild(div);
        }


        // 发送消息
        function sendMessage() {
            socket.send(input.value);
            input.value = '';
        }

        document.querySelector('button').onclick = function () {
            sendMessage();
        }
    </script>
</body>

</html>
```

## 服务端

```js
// server.js
const ws = require('nodejs-websocket');
var dayjs = require("dayjs");

// 消息类型枚举
const message_type = {
  OPEN: 'open',
  CLOSE: 'close',
  MESSAGE: 'message',
};

// 端口号
const PORT = 8080;

// 所有用户数
var count = 0;

function getTime(){
    return dayjs().format('HH:mm');
}

// 监听事件
var server = ws.createServer(function (conn) {
  console.log('New connection');
  count++;
  conn.user_name = '用户' + count;

  broadcast({
    type: message_type.OPEN,
    message: conn.user_name + '加入了聊天室',
    time: getTime(),
  });

  // 接收客户端发送的数据
  conn.on('text', function (data) {
    console.log('Received ' + data);
    // conn.sendText(data)
    broadcast({
      type: message_type.MESSAGE,
      message: conn.user_name + '：' + data,
      time: getTime(),
    });
  });

  // 客户端断开
  conn.on('close', function (code, reason) {
    console.log('Connection closed');
    let message = conn.user_name + '离开了聊天室';
    broadcast({
        type: message_type.CLOSE,
        message: message,
        time: getTime(),
      });
  });

  // 客户端异常
  conn.on('error', function (err) {
    console.log('异常');
  });
});

// 广播给所有用户
function broadcast(data) {
  server.connections.forEach(function (conn) {
    conn.sendText(JSON.stringify(data));
  });
}

// 启动服务
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

```