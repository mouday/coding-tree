# 示例2 聊天室

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
        // 创建一个 WebSocket 对象
        var socket = new WebSocket('ws://127.0.0.1:8080');
        
        // 连接成功
        socket.onopen = function() {
            console.log('连接成功');
        }

        // 接收消息
        socket.onmessage = function(res) {
            console.log(res.data);
        
            let div = document.createElement('div');
            div.innerHTML = res.data;
            document.getElementById('content').appendChild(div);
            
        }

        // 发送消息
        document.querySelector('button').onclick = function() {
            var input = document.querySelector('input');
            socket.send(input.value);
            input.value = '';
        }
    </script>
</body>

</html>
```

## 服务端
    
```js
// server.js
const ws = require("nodejs-websocket")
 
// 端口号
const PORT = 8080;

// 所有用户数
var count = 0;

// 监听事件
var server = ws.createServer(function (conn) {
    console.log("New connection")
    count++;
    conn.user_name = "用户" + count;

    broadcast(conn.user_name + "加入了聊天室");

    // 接收客户端发送的数据
    conn.on("text", function (data) {
        console.log("Received "+data)
        // conn.sendText(data)
        broadcast(conn.user_name + "：" + data)
    })

    // 客户端断开
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
        broadcast(conn.user_name + "离开了聊天室")
    })

    // 客户端异常
    conn.on("error", function (err) {
        console.log('异常')
    })
})

// 广播给所有用户
function broadcast(msg){
    server.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}

// 启动服务
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
```

