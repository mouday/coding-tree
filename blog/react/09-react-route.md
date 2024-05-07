[返回目录](/blog/react/atguigu-react)

# 9、React Router 6

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

类似vue的`router-view`

```js
// 指定路由呈现位置
<Outlet>
```

路由参数

params参数

```
1、定义参数占位
path: '/detail/:id'

2、传递参数
/detail/001

3、接收参数
import {useParams} from "react-router-dom"

const {id} = useParams()
```

search参数

```
1、无需定义占位
path: '/detail'

2、传递参数
/detail?id=001

3、接收参数
import {useSearchParams} from "react-router-dom"

const {search, setSearch} = useSearchParams()
const id = search.get('id')

```

state参数

```
1、无需定义占位
path: '/detail'

2、传递参数
<Link 
    to="/detail" 
    state={{id: '001'}}></Link>

3、接收参数
import {useLocation} from "react-router-dom"

const {state} = useLocation()
const {id} = state
```

编程式路由导航

```js
import {useNavigate} from "react-router-dom"

const navigate = useNavigate()

// 跳转， params和search参数，直接写在路径
navigate('/detail', {
    replace: false,
    state: {id: '001'}
})

// 前进
navigate(1)

// 后退
navigate(-1)
```

## useInRouterContext

是否被路由器BroserRouter包裹

```js
import {useInRouterContext} from "react-router-dom"

// 返回布尔值
useInRouterContext()
```

## useNavigationType

路由打开方式

- POP 刷新页面，浏览器直接打开
- PUSH
- REPLACE

## useOutlet

用来呈现当前组件中渲染的嵌套组件

- 如果没有挂载，返回null
- 已经挂载，返回路由对象

```js
import {useOutlet} from "react-router-dom"

const outlet = useOutlet()
```

## useResolvedPath

给定一个URL值，解析其中的参数
- path
- search
- hash

```js
import {useResolvedPath} from "react-router-dom"

useResolvedPath('/detail?id=001')
```
