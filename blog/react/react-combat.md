[返回目录](/blog/react/index.md)

# React项目实战(React后台管理系统、TypeScript+React18)

## 创建项目

[https://cn.vitejs.dev/guide/](https://cn.vitejs.dev/guide/)

```
pnpm create vite react-ts-app --template react-ts
```


## 项目依赖 

```
pnpm i react-router-dom redux react-redux reset-css
```

package.json

```
vite
react 18
react-dom
react-router-dom
react-redux
redux
reset-css // 样式初始化
```

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

## css模块化

```js
// css
.className{

}

// js
import styles from './name.module.css'

// jsx
<div className={styles.className}></div>
```


常用的css属性

```css
/* 禁用文字选中 */
user-select: none;
```

## 路径别名配置

vite.config.js

```js
// import path from 'path'
import * as path from 'path'

export default defineConfig({
    plugins: [react()],
    
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './src')
        }
    }
})
```

提示path

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


## 引入Ant Design

组件和图标

```bash
pnpm install antd @ant-design/icons --save
```

使用antd组件

```js
import { Button } from "antd";

export default function Foo() {
  return <Button>按钮</Button>;
}
```

使用icon

```js
import { PlayCircleOutlined } from "@ant-design/icons";


export default function Foo() {
  return <PlayCircleOutlined />;
}
```


按需引入（新版本的vite默认支持，无需单独引入插件）

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

`Outlet` 相当于vue里边的 `router-view`



https://www.bilibili.com/video/BV1FV4y157Zx/?p=14&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da