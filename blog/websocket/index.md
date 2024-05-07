
[websocketd](http://websocketd.com/) is the WebSocket daemon, It's like CGI, twenty years later, for WebSockets


Web前端-3小时教你打造一个聊天室（websocket）

https://www.bilibili.com/video/BV14K411T7cd


WebSocket 协议

基于TCP的一种新的网络协议，它实现了浏览器与服务器全双工（full-duplex）通信

允许服务器主动发送消息给客户端


文档：https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/WebSocket


创建websocket对象
```js
var ws = new WebSocket(url, [protocols]);
```

方法 

方法 | 说明
- | -
close() | 关闭链接
send(data) | 发送数据

事件

事件名 | 说明
- | -
open | 连接打开
message | 接收到新消息
error | 出现错误
close | 连接关闭

实现技术：

- 客户端：WebSocket
- 服务端：[nodejs-websocket](https://www.npmjs.com/package/nodejs-websocket) / [ws](https://www.npmjs.com/package/)




## 示例

[示例1 Echo](blog/websocket/demo-echo.md)

[示例2 聊天室](blog/websocket/demo-chat.md)

[示例3 聊天室升级版](blog/websocket/demo-chat-update.md)

[示例4 socket.io](blog/websocket/demo-socket.io.md)

https://www.bilibili.com/video/BV14K411T7cd?p=8&spm_id_from=pageDriver