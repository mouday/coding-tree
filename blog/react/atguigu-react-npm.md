# React 进阶篇-基于 npm

## 1、React 脚手架

### 1.1、创建一个脚手架项目

脚手架特点：模块化、组件化、工程化

SPA: single page application

创建一个脚手架项目

```bash
# 使用pnpm
pnpx create-react-app hello-react
```

启动项目

```bash
cd hello-react

npm start
```

访问地址：[http://localhost:3000/](http://localhost:3000/)

生成的项目结构

```bash
$ tree -I node_modules
.
├── README.md
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html           # 主界面文件
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js               # app组件
    ├── App.test.js
    ├── index.css
    ├── index.js             # 入口文件
    ├── logo.svg
    ├── reportWebVitals.js
    └── setupTests.js

```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!-- 网站图标 -->
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />

    <!-- 开启理想视口，用于移动端网页适配 -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- 浏览器标签页+地址栏颜色（仅支持安卓手机浏览器） -->
    <meta name="theme-color" content="#000000" />

    <!-- 网站描述 -->
    <meta
      name="description"
      content="Web site created using create-react-app"
    />

    <!-- 网页添加到手机主屏上的图标 -->
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />

    <!-- 应用加壳时的配置文件 -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />

    <title>React App</title>
  </head>
  <body>
    <!-- 如果浏览器不支持javascript将会显示 -->
    <noscript>You need to enable JavaScript to run this app.</noscript>

    <!-- 容器 -->
    <div id="root"></div>
  </body>
</html>
```

### 1.2、最小项目

精简文件后

```bash
$ tree -I node_modules
.
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
└── src
    ├── App.jsx
    └── index.js
```

创建组件文件

```bash
$ tree -I node_modules
.
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
└── src
    ├── App.jsx
    ├── components
    │   ├── Hello
    │   │   ├── Hello.css
    │   │   └── Hello.jsx
    │   └── Welcome
    │       ├── Welcome.css
    │       └── Welcome.jsx
    └── index.js
```

package.json

```json
{
  "name": "hello-react",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app", "react-app/jest"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!-- 网站图标 -->
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <title>React App</title>
  </head>
  <body>
    <!-- 容器 -->
    <div id="root"></div>
  </body>
</html>
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

App.jsx

```js
import Welcome from "./components/Welcome/Welcome.jsx";
import Hello from "./components/Hello/Hello.jsx";

function App() {
  return (
    <div className="App">
      <Hello />
      <Welcome />
    </div>
  );
}

export default App;
```

components/Hello/Hello.jsx

```js
import { Component } from "react";
import "./Hello.css";

export default class Hello extends Component {
  render() {
    return <h1 className="title">Hello</h1>;
  }
}
```

components/Hello/Hello.css

```css
.title {
  background-color: orange;
}
```

components/Welcome/Welcome.jsx

```js
import { Component } from "react";
import "./Welcome.css";

export default class Welcome extends Component {
  render() {
    return <h1 className="welcome">Welcome to React</h1>;
  }
}
```

components/Welcome/Welcome.css

```css
.welcome {
  background-color: skyblue;
}
```

渲染结果

```html
<div id="root">
  <div class="App">
    <h1 class="title">Hello</h1>
    <h1 class="welcome">Welcome to React</h1>
  </div>
</div>
```

### 样式模块化

如果两个组件同时写了`.title` 这个类名，那么谁后引入谁就生效

Hello.css

```css
.title {
  background-color: skyblue;
}
```

Welcome.css

```css
.title {
  background-color: orange;
}
```

解决办法

Hello.css 改名为 Hello.module.css

修改`Hello.jsx` 中的样式文件引入方式

```js
import { Component } from "react";
// import "./Hello.css";
import hello from "./Hello.module.css";

export default class Hello extends Component {
  render() {
    // return <h1 className="title">Hello</h1>;
    return <h1 className={hello.title}>Hello</h1>;
  }
}
```

修改`Welcome.jsx` 中的样式文件引入方式

```js
import { Component } from "react";
// import "./Welcome.css";
import welcome from "./Welcome.module.css";

export default class Welcome extends Component {
  render() {
    // return <h1 className="title">Welcome to React</h1>;
    return <h1 className={welcome.title}>Welcome to React</h1>;
  }
}
```

渲染结果

```html
<div id="root">
  <div class="App">
    <h1 class="Hello_title__a5yGq">Hello</h1>
    <h1 class="Welcome_title__EAh1s">Welcome to React</h1>
  </div>
</div>
```

方案二：使用 less

Hello.less

```css
.hello {
  .title {
    background-color: orange;
  }
}
```

Hello.jsx

```js
import { Component } from "react";
// import "./Hello.css";
import "./Hello.less";

export default class Hello extends Component {
  render() {
    return (
      <div className="hello">
        <h1 className="title">Hello</h1>
      </div>
    );
  }
}
```

## VS Code 插件

[ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

[ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

快捷键

输入`rcc`

```js
import React, { Component } from "react";

export default class Demo extends Component {
  render() {
    return <div>Demo</div>;
  }
}
```

输入`rfc`

```js
import React from "react";

export default function Demo() {
  return <div>Demo</div>;
}
```

## TodoList 案例

代码：[https://github.com/mouday/todo-list/tree/master/todo-list-client/todo-list-client-react](https://github.com/mouday/todo-list/tree/master/todo-list-client/todo-list-client-react)

使用到的库

- nanoid [https://github.com/ai/nanoid](https://github.com/ai/nanoid)

- prop-types

todoList 案例相关知识点

1. 拆分组件、实现静态组件，注意: className、style 的写法
2. 动态初始化列表，如何确定将数据放在哪个组件的 state 中?

- 某个组件使用: 放在其自身的 state 中
- 某些组件使用: 放在他们共同的父组件 state 中(官方称此操作为: 状态提升)

3. 关于父了之间通信:

- [父组件] 给[子组件] 传递数据:通过 props 传递
- [子组件]给[父组件] 传递数据: 通过 props 传递，要求父提前给子传递一个函数

4. 注意 defaultChecked 和 checked 的区别，类似的还有: defaultValue 和 value
5. 状态在哪里，操作状态的方法就在哪里

## React Ajax

常用的 ajax

- jQuery
- axios（推荐）

浏览器插件 FeHelper，可以自动格式化 json 数据

## 代理 Proxy

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

### 配置单个代理

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

### 配置多个代理

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

github用户搜索接口
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
https://www.bilibili.com/video/BV1wy4y1D7JT/?p=67&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da
