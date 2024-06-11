# React 项目实战

(React 后台管理系统、TypeScript+React18)


视频地址：https://www.bilibili.com/video/BV1FV4y157Zx

项目代码：https://github.com/mouday/vite-react-ts-template

## 创建项目

[https://cn.vitejs.dev/guide/](https://cn.vitejs.dev/guide/)

```
pnpm create vite react-ts-app --template react-ts
```

## 项目依赖

- vite
- react 18 https://react.docschina.org/learn
- react-dom
- react-router https://reactrouter.com/
- react-router-dom
- redux
- react-redux
- reset-css // 样式初始化
- antd https://ant.design/index-cn

```
pnpm i react-router-dom redux react-redux reset-css
```

package.json

## 样式初始化

src/main.tsx

```js
import "reset-css";
```

## 样式引入顺序

样式引入顺序 main.js

```
初始化样式
UI框架样式
全局样式
组件样式
```

## css 模块化

```js
// css
.className{

}

// js
import styles from './name.module.css'

// jsx
<div className={styles.className}></div>
```

常用的 css 属性

```css
/* 禁用文字选中 */
user-select: none;
```

## 路径别名配置

vite.config.js

```js
// import path from 'path'
import * as path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

提示 path

```bash
pnpm i @types/node
```

## 路径别名提示

tsconfig.json

```js
{
  "compilerOptions": {
	"baseUrl": "./",
	"paths": {
	    "@/*": [
	        "src/*"
	    ]
	}
}
```

## 引入 Ant Design

组件和图标

```bash
pnpm install antd @ant-design/icons --save
```

使用 antd 组件

```js
import { Button } from "antd";

export default function Foo() {
  return <Button>按钮</Button>;
}
```

使用 icon

```js
import { PlayCircleOutlined } from "@ant-design/icons";

export default function Foo() {
  return <PlayCircleOutlined />;
}
```

按需引入（新版本的 vite 默认支持，无需单独引入插件）

```
pnpm install vite-plugin-style-import less consola  -D
```

## 路由

router
views

嵌套路由配置

src/router/index.tsx

```js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "../App";
import Home from "../views/Home/Home";
import About from "../views/About/About";

// BrowserRouter history模式
// HashRouter hash模式

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

src/main.tsx

```js
import React from "react";
import ReactDOM from "react-dom/client";
import "reset-css";

// 引入路由对象
import Router from "./router/index";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

```

src/App.tsx

```js
import { useState } from "react";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <div>app</div>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
```

`Outlet` 相当于 vue 里边的 `router-view`

## 路由跳转

```js
import { Link } from "react-router-dom";

<Link to="/home">Home</Link>
```

渲染结果

```html
<a href="/home">Home</a>
```

## 路由重定向

```js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "../App";
import Home from "../views/Home/Home";
import About from "../views/About/About";

// BrowserRouter history模式
// HashRouter hash模式

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* 配置重定向 */}
          <Route path="/" element={<Navigate to="/home"/>}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

```

## 路由表的写法

router/index.tsx

```js
// 路由写法二
import React from "react";
import { Navigate } from "react-router-dom";

import Home from "../views/Home/Home";
import About from "../views/About/About";

export const routes = [
  {
    path: "/",
    // 重定向
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
];
```

App.tsx
```js
import { Link, useRoutes } from "react-router-dom";
import { routes } from "./router/index";

function App() {
  const route = useRoutes(routes);

  return (
    <div className="app">
      <div>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
      </div>

      {route}
    </div>
  );
}

export default App;
```
main.tsx

```js
import React from "react";
import ReactDOM from "react-dom/client";
import "reset-css";
import { BrowserRouter } from "react-router-dom";
// 引入路由对象
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

## 路由懒加载

```js
// 路由写法二
import React from "react";
import { Navigate } from "react-router-dom";

// import Home from "../views/Home/Home";
// import About from "../views/About/About";

const Home = React.lazy(() => import("../views/Home/Home"));
const About = React.lazy(() => import("../views/About/About"));

const withLoadingComponent = (component) => (
  <React.Suspense fallback={<div>Loading...</div>}>{component}</React.Suspense>
);

export const routes = [
  {
    path: "/",
    // 重定向
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    element: withLoadingComponent(<Home />),
  },
  {
    path: "/about",
    element: withLoadingComponent(<About />),
  },
];

```

## 路由懒加载

```js
const Home = React.lazy(() => import("../views/Home/Home"));
```

## redux状态管理

## axios网络请求