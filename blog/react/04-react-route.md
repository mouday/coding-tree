
# 4、React Route 路由

## 4.1、SPA

SPA：Single Page Web Application 单页面 Web 应用

- 整个应用只有一个完整的页面
- 局部刷新
- 单页面，多组件

路由：映射关系（key-value）

| 路由分类 | value     |
| -------- | --------- |
| 后端路由 | function  |
| 前端路由 | component |

## 4.2、history

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

## 封装 NavLink

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

## Redirect

Redirect 开启默认匹配，类似 default

```js
import { Route, Switch, Redirect } from "react-router-dom";

<Switch>
  <Route path="/about" component={About} />
  <Route path="/home" component={Home} />
  <Redirect to="/about" />
</Switch>;
```

## 嵌套路由

```js
import { Route, Switch, Redirect } from "react-router-dom";

<Switch>
  <Route path="/home/news" component={News} />
  <Route path="/home/message" component={Message} />
  <Redirect to="/home/news" />
</Switch>;
```

## 路由参数 params

```js
// 传递路由参数
<Link to="/home/news/001">About</Link>

// 声明路由参数
<Route path="/home/news/:id" component={News} />

// 接收路由参数
const { id } = this.props.match.params
```

## 路由参数 search

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

## 路由参数 state

```js
// 传递路由参数
<Link to={{pathname: '/home/news', state: {id: '001'}}}>About</Link>

// 声明路由参数, state参数不需要申明
<Route path="/home/news" component={News} />

// 接收state参数
const { id } = this.props.location.state
``` 

state 是浏览器器history的一个属性，刷新页面不会丢失，清空历史记录后会被清空

## 路由参数总结

3种路由参数传递的方式

1. params
2. search
3. state


## Link replace模式

more是push模式，开启replace模式后，直接替换数据

```js
<Link to="/home/news" replace>About</Link>
```

## 编程式跳转

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

## withRouter

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

## BrowserRouter 和 HashRouter的区别

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
