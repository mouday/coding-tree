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

### 1.3、样式模块化

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

### 1.4、VS Code 插件

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

## 2、TodoList 案例

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

## 3、React Ajax

常用的 ajax

- 基于 xhr

  - jQuery
  - axios（推荐）

- 基于 fetch
  - fetch

浏览器插件 FeHelper，可以自动格式化 json 数据

### 3.1、代理 Proxy

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

### 3.2、配置单个代理

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

### 3.3、配置多个代理

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

### 3.4、案例 github 用户搜索

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

### 3.5、PubSubJS 消息订阅发布

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

### 3.6、Fetch

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

## 4、React Route 路由

### 4.1、SPA

SPA：Single Page Web Application 单页面 Web 应用

- 整个应用只有一个完整的页面
- 局部刷新
- 单页面，多组件

路由：映射关系（key-value）

| 路由分类 | value     |
| -------- | --------- |
| 后端路由 | function  |
| 前端路由 | component |

### 4.2、history

- [https://www.npmjs.com/package/history](https://www.npmjs.com/package/history)
- [https://github.com/remix-run/history](https://github.com/remix-run/history)

两种模式

- createBrowserHistory H5 history 模式
- createHashHistory hash 模式（锚点）

示例

```html
<button id="push" onclick="handlePush('/about')">push about</button>
<button id="push" onclick="handlePush('/home')">push home</button>

<script src="https://cdn.bootcdn.net/ajax/libs/history/5.3.0/history.production.min.js"></script>
<script>
  const history = HistoryLibrary.createBrowserHistory();
  // const history = HistoryLibrary.createHashHistory();

  function handlePush(value) {
    history.push(value);
  }

  // 监听路由变化
  history.listen(({ location, action }) => {
    console.log(action, location);
  });
</script>
```

## react-router

```
pnpm i react-router-dom@5
```

文档：[https://v5.reactrouter.com/web/guides/quick-start](https://v5.reactrouter.com/web/guides/quick-start)

index.js

```js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

```js
import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import About from "./components/About/About.jsx";
import Home from "./components/Home/Home.jsx";

export default class App extends Component {
  render() {
    return (
      <div className="app">
        {/* 跳转路由 */}
        <Link to="/about">About</Link>
        <Link to="/home">Home</Link>

        {/* 注册路由 */}
        <Route path="/about" component={About} />
        <Route path="/home" component={Home} />
      </div>
    );
  }
}
```

components/Home/Home.jsx

```js
import React, { Component } from "react";

export default class Home extends Component {
  render() {
    return <div>Home</div>;
  }
}
```

components/About/About.jsx

```js
import React, { Component } from "react";

export default class About extends Component {
  render() {
    return <div>About</div>;
  }
}
```

Link 标签会被解析为 a 标签

```xml
<Link to="/about">About</Link>

<a href="/about">About</a>
```

路由组件会收到 props 参数

```js
history:
    action: "REPLACE"
    block: block(prompt)
    createHref: createHref(location)
    go: go(n)
    goBack: goBack()
    goForward: goForward()
    length: 5
    listen: listen(listener)
    location: {
      pathname: '/home',
      search: '',
      hash: '',
      state: undefined,
      key: 'ocj0pd'
    }
    push: push(path, state)
    replace: replace(path, state)

location:
    hash: ""
    key: "ocj0pd"
    pathname: "/home"
    search: ""
    state: undefined

match:
    isExact: true
    params: {}
    path: "/home"
    url: "/home"

staticContext: undefined
```

使用 NavLink 会给当前匹配的路由添加 active 类名

```js
import {NavLink } from "react-router-dom";

<NavLink to="/about">About</NavLink>
<NavLink to="/home">Home</NavLink>
```

```xml
<a href="/home" aria-current="page" class="active">Home</a>
```

也可以使用属性 activeClassName 自定义类名

```xml
<NavLink to="/home" activeClassName="custom-active" >Home</NavLink>
```

### 封装 NavLink

```js
import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";

export default class MyNavLink extends Component {
  render() {
    return <NavLink activeClassName="custom-active" {...this.props} />;
  }
}
```

使用自定义 MyNavLink

```xml
<MyNavLink to="/about">About</MyNavLink>
```

> 备注：在 props 的属性 children 可以获取标签体内容

## Switch

默认会将所有的路由遍历匹配，如果使用 Switch 可以匹配一个路由后不在继续匹配

```js
import { Route, NavLink, Switch } from "react-router-dom";

<Switch>
  <Route path="/about" component={About} />
  <Route path="/home" component={Home} />
</Switch>;
```

## 多级路径资源文件

如果路由路径是多级，资源文件会请求失败

例如：`/demo/about`

```html
<!-- 失败 -->
<!-- 实际请求路径: /demo/style.css -->
<link rel="stylesheet" href="./style.css" />

<!-- 成功 -->
<link rel="stylesheet" href="/style.css" />
<link rel="stylesheet" href="%PUBLIC_URL%/style.css" />
```

或者使用 hash 路由模式

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
```

Route 属性

- exact 开启严格匹配，默认 false
- activeClassName 激活类名

```xml
<Route exact path="/home" component={Home} />
```

### Redirect

Redirect 开启默认匹配，类似 default

```js
import { Route, Switch, Redirect } from "react-router-dom";

<Switch>
  <Route path="/about" component={About} />
  <Route path="/home" component={Home} />
  <Redirect to="/about" />
</Switch>;
```

### 嵌套路由

```js
import { Route, Switch, Redirect } from "react-router-dom";

<Switch>
  <Route path="/home/news" component={News} />
  <Route path="/home/message" component={Message} />
  <Redirect to="/home/news" />
</Switch>;
```

### 路由参数 params

```js
// 传递路由参数
<Link to="/home/news/001">About</Link>

// 声明路由参数
<Route path="/home/news/:id" component={News} />

// 接收路由参数
const { id } = this.props.match.params
```

### 路由参数 search

```js
// 传递路由参数
<Link to="/home/news?id=001">About</Link>

// 声明路由参数, search参数不需要申明
<Route path="/home/news" component={News} />

// 接收search参数 npm i query-string
import queryString from 'query-string';

const { search } = this.props.location
const { id } = queryString.parse(search);
```

### 路由参数 state

```js
// 传递路由参数
<Link to={{pathname: '/home/news', state: {id: '001'}}}>About</Link>

// 声明路由参数, state参数不需要申明
<Route path="/home/news" component={News} />

// 接收state参数
const { id } = this.props.location.state
``` 

state 是浏览器器history的一个属性，刷新页面不会丢失，清空历史记录后会被清空

### 路由参数总结

3种路由参数传递的方式

1. params
2. search
3. state


### Link replace模式

more是push模式，开启replace模式后，直接替换数据

```js
<Link to="/home/news" replace>About</Link>
```

### 编程式跳转

借助`history` 的api进行路由前进后退的控制

```js
// push
this.props.history.push('/home/news')

// params参数
this.props.history.push(`/home/news/${id}`)

// search参数
this.props.history.push(`/home/news?id=${id}`)

// state参数
this.props.history.push('/home/news', {id: '001'})

// replace
this.props.history.replace('/home/news')

// 回退
this.props.history.goBack()
// 前进
this.props.history.goForward()

// n > 0 前进
// n < 0 回退
this.props.history.go(n)
```

### withRouter

一般组件中，默认props没有history的api, 需要借助`withRouter` 引入路由api

```js
import React, { Component } from "react";
import { withRouter } from 'react-router-dom'

class Home extends Component {
  render() {
    return <div>Home</div>;
  }
}

export default withRouter(Home)
```

### BrowserRouter 和 HashRouter的区别

1. 底层原理不一样:
    - BrowserRouter使用的是H5的history API，不兼容IE9及以下版本
    - HashRouter使用的是URL的哈希值。
2. path表现形式不一样
    - BrowserRouter的路径中没有#,例如: localhost:3000/demo/test
    - HashRouter的路径包含#,例如: localhost:3000/#/demo/test
3. 刷新后对路出state参数的影响
    - (1). BrowserRouter没有任何影响，因为state保存在history对象中。
    - (2).HashRouter刷新后会导致路由state参数的丢失。
4. 备注: HashRouter可以用于解决一些路径错误相关的问题。

## React UI组件库

- material-ui: https://mui.com/material-ui/
- Ant Design: https://ant.design/index-cn/

其他组件库

- Element-UI（适用于Vue.js）: https://element.eleme.io/#/zh-CN
- Vant-UI(适用于Vue.js移动端): https://vant-contrib.gitee.io/vant/#/zh-CN



安装

```
$ pnpm install antd --save
```

使用示例

```js
import React, { Component } from "react";

import { Button } from "antd";

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <Button type="primary">Primary Button</Button>
      </div>
    );
  }
}

```

进阶使用

- 按需引入
- 自定义主题

## Redux

中文文档: https://www.redux.org.cn/

- 用于：状态管理
- 作用：集中式管理react应用中多个组件`共享`的状态

使用场景：

- 共享：某个组件的状态，需要让其他组件可以随时拿到
- 通信：一个组件需要改变另一个组件的状态

![](img/redux-flow.jpg)

### 求和案例

https://www.bilibili.com/video/BV1wy4y1D7JT/?p=99&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da