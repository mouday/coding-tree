# React Router 6

- react-router 核心库
- react-router-dom 用于 DOM
- react-router-native 用于 ReactNative

## 对比 React Router 5

- 内置组件的变化移除<Switch/>，新增<Routes/>
- 语法变化 component={About} 变为 element={<About/>}
- 新增多个 hook：useParams、useNavigate、useMatch
- 官方明确推荐使用函数式组件

依赖

```
"react": "^18.2.0"
"react-router-dom": "^6.15.0"
```

## 简单示例

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

App.jsx

```js
import React from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";

export default function App() {
  return (
    <div className="app">
      {/* 路由链接 */}
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/about">About</NavLink>

      {/* 注册路由 */}
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/" element={<Navigate to="/home" />}></Route>
      </Routes>
    </div>
  );
}
```

## Navigate 路由跳转

```js
<Route path="/" element={<Navigate to="/home"/>}></
```

## NavLink 高亮

```js
function computedClassName({ isActive }) {
  return isActive ? "item active" : "item";
}

<NavLink className={computedClassName} to="/home">
  Home
</NavLink>;
```

## 路由表 useRoutes

```js
import React from "react";
import { NavLink, Navigate, useRoutes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";

export default function App() {
  const routes = useRoutes([
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/",
      element: <Navigate to="/home" />,
    },
  ]);

  return (
    <div className="app">
      {/* 路由链接 */}
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/about">About</NavLink>

      {/* 注册路由 */}
      {routes}
    </div>
  );
}
```

## 嵌套路由

```js
[
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "news",
        element: <News />,
      },
    ],
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
];
```

## Outlet

```js
// 指定路由呈现位置
<Outlet>
```