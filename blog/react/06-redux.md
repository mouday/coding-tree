# 6、Redux状态管理

文档: 
- 中文文档: https://www.redux.org.cn/
- npm: [https://www.npmjs.com/package/redux](https://www.npmjs.com/package/redux)

- 用于：状态管理
- 作用：集中式管理react应用中多个组件`共享`的状态

使用场景：

- 共享：某个组件的状态，需要让其他组件可以随时拿到
- 通信：一个组件需要改变另一个组件的状态

![](img/redux-flow.jpg)


安装
```
npm install --save redux
```

示例

定义 store 

store.js

```js
import { createStore } from "redux";

function counter(state = 0, action) {
  const { type, data } = action;
  console.log(type, data);

  switch (type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}

const store = createStore(counter);

export default store;

```

使用store

```js
import React, { Component } from "react";
import store from "./store.js";

export default class App extends Component {
  handleIncrement = () => {
    store.dispatch({ type: "INCREMENT" });
  };

  handleDecrement = () => {
    store.dispatch({ type: "DECREMENT" });
  };

  componentDidMount() {
    store.subscribe(() => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div className="app">
        <div>{store.getState()}</div>
        <button onClick={this.handleIncrement}>increment</button>
        <button onClick={this.handleDecrement}>decrement</button>
      </div>
    );
  }
}

```

### 求和案例

优化

- 新建 constant.js 常量文件，放置常量
- 新建 actions.js 文件，放置action

异步action

需要用到 中间件 `redux-thunk`

```
npm i redux-thunk
```

项目结构

```bash
$ tree src
src
├── App.jsx
├── index.js
└── store
    ├── actions.js
    ├── constants.js
    ├── index.js
    └── reducers.js
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
import React, { Component } from "react";
import store from "./store/index.js";
import { increment, decrement, incrementAsync } from "./store/actions.js";

export default class App extends Component {
  handleIncrement = () => {
    store.dispatch(increment());
  };

  handleDecrement = () => {
    store.dispatch(decrement());
  };

  handleIncrementAsync = () => {
    store.dispatch(incrementAsync(500));
  };

  componentDidMount() {
    store.subscribe(() => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div className="app">
        <div>{store.getState()}</div>
        <button onClick={this.handleIncrement}>increment</button>
        <button onClick={this.handleDecrement}>decrement</button>
        <button onClick={this.handleIncrementAsync}>异步increment</button>
      </div>
    );
  }
}

```
store/constants.js
```js
/**
 * constants
 */
export const INCREMENT = 'INCREMENT'

export const DECREMENT = 'DECREMENT'

export const INCREMENT_ASYNC = 'INCREMENT_async'
```

store/actions.js

```js
/**
 * actions
 */
import { INCREMENT, DECREMENT, INCREMENT_ASYNC } from "./constants.js";

// 同步action
export function increment(data) {
  return { type: INCREMENT, data };
}

export function decrement(data) {
  return { type: DECREMENT, data };
}

// 异步action
export function incrementAsync(data, time) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(increment(data));
    }, time);
  };
}

```
store/reducers.js
```js
/**
 * reducers
 */

import { INCREMENT, DECREMENT } from "./constants.js";

export function counter(state = 0, action) {
  const { type, data } = action;
  console.log(type, data);

  switch (type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
    default:
      return state;
  }
}

```

store/index.js

```js
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { counter } from "./reducers.js";

const store = createStore(counter, applyMiddleware(thunkMiddleware));

export default store;

```

### react-redux

- 容器组件
- UI组件

- [https://github.com/reduxjs/react-redux](https://github.com/reduxjs/react-redux)
- [https://react-redux.js.org](https://react-redux.js.org/introduction/getting-started)

```bash
pnpm i react-redux
```

示例

使用 Provider 提供 store

index.js 

```js
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import store from "./store/index.js";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// 如果store数据改变，重新渲染组件
// store.subscribe(() => {
//   root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// });

```

App.jsx

```js
import React, { Component } from "react";

import { connect } from "react-redux";
// import store from "./store/index.js";
import { increment, decrement, incrementAsync } from "./store/actions.js";

class App extends Component {
  handleIncrement = () => {
    // store.dispatch(increment());
    this.props.increment();
  };

  handleDecrement = () => {
    // store.dispatch(decrement());
    this.props.decrement();
  };

  handleIncrementAsync = () => {
    // store.dispatch(incrementAsync(500));
    this.props.incrementAsync(500);
  };

  // componentDidMount() {
  //   store.subscribe(() => {
  //     this.forceUpdate();
  //   });
  // }

  render() {
    console.log(this.props);
    const { value } = this.props;

    return (
      <div className="app">
        {/* <div>{store.getState()}</div> */}
        <div>{value}</div>
        <button onClick={this.handleIncrement}>increment</button>
        <button onClick={this.handleDecrement}>decrement</button>
        <button onClick={this.handleIncrementAsync}>异步increment</button>
      </div>
    );
  }
}

// 映射状态
function mapStateToProps(state) {
  return {
    value: state,
  };
}

// 映射方法
function mapDispatchToProps(dispatch) {
  return {
    // dispatching plain actions
    increment: (data) => dispatch(increment(data)),
    decrement: (data) => dispatch(decrement(data)),
    incrementAsync: (time) => dispatch(incrementAsync(null, time)),
  };
}
// 映射方法的简写形式 {functionName: action}
// const mapDispatchToProps = {
//   // dispatching plain actions
//   increment: increment,
//   decrement: decrement,
//   incrementAsync: incrementAsync,
// };

// 创建容器
export default connect(mapStateToProps, mapDispatchToProps)(App);

```

使用 `combineReducers` 拆分多个 reducer 函数 

纯函数约束

1. 不能修改参数值
2. 没有任何副作用，例如网络请求，输入和输出
3. 补鞥呢调用Date.now() 或者Math.random()等不纯函数

redux 的 reducer必须是一个纯函数


## Redux DevTools

开发者工具 Redux DevTools 配合 npm包redux-devtools-extension 使用

```
npm i redux-devtools-extension
```

配置

```js
import { composeWithDevTools } from 'redux-devtools-extension'

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

```
