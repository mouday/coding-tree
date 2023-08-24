
# 8、React补充内容

## 1、setState更新状态的两种形式

1、对象式

定义

```js
setState(state, [callback])
```

示例

```js
const {count} = this.state

this.setState({count: count + 1}, ()=>{
    console.log(this.state.count)
})
```

2、函数式

定义

```js
setState(updater, [callback])
```

示例

```js
setState((state, props) => ({count: state.count + 1}))
```

## 2、lazyLoad懒加载

路由懒加载示例

```js
import { lazy, Suspense } from "react"
import { Route } from "react-router-dom"

// 加载中显示组件
import Loading from "./Loading.jsx"

// import Demo from "./Demo.jsx"
const Demo = Lazy(()=>import("./Demo.jsx"))

<Suspense fallback={<Loading/>}>
    <Route path="/demo" component={Demo}/>
</Suspense>
```