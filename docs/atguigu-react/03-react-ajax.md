[返回目录](/blog/react/atguigu-react)

# 3、React Ajax和代理

常用的 ajax

- 基于 xhr

  - jQuery
  - axios（推荐）

- 基于 fetch
  - fetch

浏览器插件 FeHelper，可以自动格式化 json 数据

## 3.1、代理 Proxy

项目结构

```
$ tree -I node_modules/
.
├── package.json
├── pnpm-lock.yaml
├── public
│   ├── favicon.ico
│   └── index.html
├── server
│   ├── server-student.js
│   └── server-car.js
└── src
    ├── App.jsx
    └── index.js
```

index.js

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 3.2、配置单个代理

学生服务 server/server-student.js

```js
const express = require("express");

const app = express();

app.get("/students", (request, response) => {
  const data = [
    { id: "001", name: "Tom", age: 18 },
    { id: "002", name: "Jerry", age: 20 },
    { id: "003", name: "Jack", age: 22 },
  ];
  response.json(data);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server runing on http://127.0.0.1:${port}`);
});
```

启动学生服务，端口：5000

```bash
node server/server-student.js
```

访问地址：http://127.0.0.1:5000/students

```json
[
  {
    "id": "001",
    "name": "Tom",
    "age": 18
  },
  {
    "id": "002",
    "name": "Jerry",
    "age": 20
  },
  {
    "id": "003",
    "name": "Jack",
    "age": 22
  }
]
```

启动 react 开发环境，默认端口：3000

```bash
npm run start
```

App.jsx

```js
import axios from "axios";

function App() {
  axios.get("http://127.0.0.1:5000/students").then((res) => {
    console.log(res);
  });

  return <div className="App">app</div>;
}

export default App;
```

出现跨域问题

```
Access to XMLHttpRequest at 'http://127.0.0.1:5000/students'
from origin 'http://localhost:3000' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

配置跨域代理 package.json

```json
{
  "proxy": "http://127.0.0.1:8888"
}
```

修改请求地址

```js
import axios from "axios";

function App() {
  axios.get("/students").then((res) => {
    console.log(res);
  });

  return <div className="App">app</div>;
}

export default App;
```

可以看到，能正常获取到接口数据了

## 3.3、配置多个代理

增加汽车服务 server/server-car.js

```js
const express = require("express");

const app = express();

app.get("/cars", (request, response) => {
  const data = [
    { id: "001", name: "大众", price: 20 },
    { id: "002", name: "奥迪", age: 40 },
    { id: "003", name: "奔驰", age: 80 },
  ];
  response.json(data);
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server runing on http://127.0.0.1:${port}`);
});
```

启动汽车服务，端口：5001

```bash
node server/server-car.js
```

请求地址：[http://127.0.0.1:5001/cars](http://127.0.0.1:5001/cars)

返回数据

```json
[
  {
    "id": "001",
    "name": "大众",
    "price": 20
  },
  {
    "id": "002",
    "name": "奥迪",
    "age": 40
  },
  {
    "id": "003",
    "name": "奔驰",
    "age": 80
  }
]
```

项目根目录下新增配置文件 `setupProxy.js`

setupProxy.js 旧版本配置

```js
// 默认已经安装：http-proxy-middleware
const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy("/api-student", {
      // 触发代理的请求前缀
      target: "http://127.0.0.1:5000", // 转发目标地址
      changeOrigin: true, // 修改请求头中的Host字段
      pathRewrite: {
        "^/api-student": "", // 重写请求路径
      },
    }),
    proxy("/api-car", {
      target: "http://127.0.0.1:5001",
      changeOrigin: true,
      pathRewrite: {
        "^/api-car": "",
      },
    })
  );
};
```

setupProxy.js 新版本配置

```js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api-student",
    createProxyMiddleware({
      // 触发代理的请求前缀
      target: "http://127.0.0.1:5000", // 转发目标地址
      changeOrigin: true, // 修改请求头中的Host字段
      pathRewrite: {
        "^/api-student": "", // 重写请求路径
      },
    })
  );

  app.use(
    "/api-car",
    createProxyMiddleware({
      target: "http://127.0.0.1:5001",
      changeOrigin: true,
      pathRewrite: {
        "^/api-car": "",
      },
    })
  );
};
```

App.jsx 修改请求路径

```js
import axios from "axios";

function App() {
  axios.get("/api-student/students").then((res) => {
    console.log(res.data);
  });

  axios.get("/api-car/cars").then((res) => {
    console.log(res.data);
  });

  return <div className="App">app</div>;
}

export default App;
```

请求代理转发

```
http://localhost:3000/api-student/students
=> http://127.0.0.1:5000/students

http://localhost:3000/api-car/cars
=> http://127.0.0.1:5001/cars
```

复习：js 连续解构赋值

```js
const obj = { a: { b: { c: "1" } } };

const {
  a: {
    b: { c },
  },
} = obj;

console.log(c); // 1
```

复习：js 连续解构赋值重命名

```js
const obj = { a: { b: { c: "1" } } };

const {
  a: {
    b: { c: data },
  },
} = obj;

console.log(data); // 1
```

## 3.4、案例 github 用户搜索

github 用户搜索接口

```
https://api.github.com/search/users?q=mouday
```

返回数据

```json
{
  "total_count": 3,
  "incomplete_results": false,
  "items": [
    {
      "login": "mouday",
      "id": 24365682,
      "node_id": "MDQ6VXNlcjI0MzY1Njgy",
      "avatar_url": "https://avatars.githubusercontent.com/u/24365682?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/mouday",
      "html_url": "https://github.com/mouday",
      "followers_url": "https://api.github.com/users/mouday/followers",
      "following_url": "https://api.github.com/users/mouday/following{/other_user}",
      "gists_url": "https://api.github.com/users/mouday/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/mouday/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/mouday/subscriptions",
      "organizations_url": "https://api.github.com/users/mouday/orgs",
      "repos_url": "https://api.github.com/users/mouday/repos",
      "events_url": "https://api.github.com/users/mouday/events{/privacy}",
      "received_events_url": "https://api.github.com/users/mouday/received_events",
      "type": "User",
      "site_admin": false,
      "score": 1
    }
  ]
}
```

案例代码：[https://github.com/mouday/learn-react](https://github.com/mouday/learn-react)

## 3.5、PubSubJS 消息订阅发布

```js
import PubSub from "pubsub-js";
import React, { Component } from "react";

export default class App extends Component {
  componentDidMount() {
    // 订阅消息
    this.token = PubSub.subscribe("msg", (msg, data) => {
      console.log(msg, data);
    });
  }

  componentWillUnmount() {
    // 取消订阅消息
    PubSub.unsubscribe(this.token);
  }

  handleClick = () => {
    // 发布消息
    PubSub.publish("msg", "hello");
  };

  render() {
    return <div className="app">APP</div>;
  }
}
```

## 3.6、Fetch

https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch

- 原生函数
- 兼容性存在问题

```js
(async function () {
  const res = await fetch("http://httpbin.org/get");
  const data = await res.json();
  console.log(data);
})();
```
