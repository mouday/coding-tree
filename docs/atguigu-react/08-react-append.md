[返回目录](/blog/react/atguigu-react)

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

## State Hook

```js
const [value, setValue] = React.useState(initValue)

// 写法一
setValue(newValue)

// 写法二
setValue((preValue)=>{return newValue})
```

## Effect Hook

可以在函数式组件中执行副作用操作，类似类式组件中的生命周期钩子

第二个参数表示监测的对象

```js
// 相当于钩子 componentDidMount
React.useEffect(()=>{

}, [])

// 相当于钩子 componentDidUpdate
React.useEffect(()=>{

}, [stateValue])


// 相当于钩子 componentWillMount
React.useEffect(()=>{
    return ()=>{
        // componentWillMount
    }
}, [])
```

## Ref Hook

```js
// 类似 React.createRef()
const ref = React.useRef()
```

## Fragment

替代顶层的容器

```js
import {Fragment} from "react"


// 仅允许接收属性：key
<Fragment></Fragment>

// 简写，不允许写任何属性
<></>
```

## Context

组件之间通信，常用于`祖组件` 和`后代组件` 间通讯

父组件
```js
// 创建context容器对象
const DataContext = React.createContext()

// 给后代组件传递数据
<DataContext.Provider value={?}>
</DataContext.Provider>

```

孙子组件(类式)
```js
// 声明接收context
static contextType = DataContext

// 获取value数据
this.context
```

孙子组件(类式和函数式)

```js
<DataContext.Consumer>
{value=>()}
</DataContext.Consumer>
```

注意：一般情况下context用于封装react插件

## 组件优化

Component存在的问题：

- 只要执行setState()，即使不修改数据，也会重新render
- 只要当前组件render，即使子组件没有用到任何父组件的数据，子组件也会render

高效的做法：
- 只有当组件的state或者props数据发生改变的时候才render

原因：

- shouldComponentUpdate 总是返回true

解决：

方法1：重写shouldComponentUpdate方法

```js
// 比较数据，改变了返回true，否则返回false
shouldComponentUpdate(nextProps, nextState){
    // 目前的数据 this.props, this.state
    // 接下来的数据 nextProps, nextState

    return true / false
}
```

方法2：使用 PureComponent 替换 Component 

不要直接修改state数据，而要产生新数据

```js
// 正确写法
this.setState({value: newValue})

// 错误写法
const obj = this.state
obj.value = newValue
this.setState(obj)
```

## render props

两个组件A和B行成父子关系

方式一：

```xml
<A></A>

A：<><B/></>
```

方式二： children props

可以传入结构

```xml
<A><B/></A>

A: <>{this.props.children}</>
```

方式三：render props

可以将A中的数据传给B

```xml
<A render={(value)=><B value={value}/>}></A>

A: <>{this.props.render(value)}</>
```

相当于Vue中的slot插槽，属性render是约定的字段

## 错误边界

Error boundary 用来捕获后代组件错误

```js
state = {
    error: null
}

// 获取子组件生命周期产生的错误，不能捕获足自己组件产生的错误
static getDerivedStateFromError(error){
    return {error}
}

// 组件错误
componentDidCatch(error, info){
    
}
```

## 组件通信方式总结

组件间关系

- 父子
- 兄弟
- 祖孙

通信方式

- props
    - children props
    - render props
- 消息订阅-发布
    - pub-sub、event
- 集中式管理
    - redux、dva
- context
    - 生产者-消费者模式

搭配方式

- 父子：props
- 兄弟：消息订阅-发布、集中式管理
- 祖孙：消息订阅-发布、集中式管理、context
