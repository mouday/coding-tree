# 示例1 Echo

## 客户端代码

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
            document.querySelector('div').innerHTML = res.data;
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

## 服务端代码

使用到的库

nodejs-websocket

 - npm: https://www.npmjs.com/package/nodejs-websocket
 - github: https://github.com/sitegui/nodejs-websocket

```bash
cnpm i nodejs-websocket -S
```

```js
// server.js
var ws = require("nodejs-websocket")
 
const PORT = 8080;

// 监听事件
var server = ws.createServer(function (connection) {
    console.log("New connection")
    
    // 接收客户端发送的数据
    connection.on("text", function (data) {
        console.log("Received "+data)
        connection.sendText(data)
    })

    // 客户端断开
    connection.on("close", function (code, reason) {
        console.log("Connection closed")
    })

    // 客户端异常
    connection.on("error", function (err) {
        console.log('异常')
    })
})

// 启动服务
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
```
