
# 1、React 脚手架

## 1.1、创建一个脚手架项目

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

## 1.2、最小项目

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

## 1.3、样式模块化

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

## 1.4、VS Code 插件

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
