# 《尚硅谷React教程》笔记

视频地址：https://www.bilibili.com/video/BV1wy4y1D7JT

## 1、React入门

### 1.1、学习资料

- React基础 https://www.yuque.com/fechaichai/qeamqf/xbai87
- Mobx https://www.yuque.com/fechaichai/qeamqf/apomum
- React-极客园PC项目 https://www.yuque.com/fechaichai/tzzlh1

- 英文官网 [https://react.dev/](https://react.dev/)
- 中文官网 [https://react.docschina.org/](https://react.docschina.org/)


### 1.2、js回顾

直接使用js操作DOM的示例

```html
<ul id="list"></ul>

<script type="text/javascript">
  let list = [
    { id: "001", name: "刘备", age: 40 },
    { id: "002", name: "关羽", age: 30 },
    { id: "003", name: "张飞", age: 20 },
  ];

  let html = list
    .map((item) => {
      return `<li>${item.name}-${item.age}</li>`;
    })
    .join("");

  document.getElementById("list").innerHTML = html;
</script>
```

渲染结果如下

```html
<ul id="list">
    <li>刘备-40</li>
    <li>关羽-30</li>
    <li>张飞-20</li>
</ul>
```


## 2、React的基本使用

### 2.1、Hello World

以下代码是来自 [官网](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) 的一个示例

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World</title>

    <!-- react 核心库 -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <!-- react-dom: 用于支持react操作dom -->
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

    <!-- babel：将jsx转为js -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>

  <body>
    <!-- React 容器 -->
    <div id="root"></div>

    <script type="text/babel">
      function MyApp() {
        return <h1>Hello, world!</h1>;
      }

      // 渲染到页面  
      const container = document.getElementById("root");
      const root = ReactDOM.createRoot(container);
      root.render(<MyApp />);
    </script>
  </body>
</html>

```

渲染结果

```html
<div id="root">
    <h1>Hello, world!</h1>
</div>
```

为了开发环境加载依赖更快，将js文件下载到本地，统一采用本地加载的方式

```html
<!-- react 核心库 -->
<!-- <script src="https://unpkg.com/react@18/umd/react.development.js"></script> -->
<script src="../js/react.development.js"></script>

<!-- react-dom: 用于支持react操作dom -->
<!-- <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script> -->
<script src="../js/react-dom.development.js"></script>

<!-- babel：将jsx转为js -->
<!-- <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script> -->
<script src="../js/babel.min.js"></script>
```

### 2.2、创建虚拟DOM

方式一：babel + jsx

```html
<!-- React 容器 -->
<div id="root"></div>

<script type="text/babel">
  const vdom = <h1 id="title">Hello World!</h1>;
  
  // 渲染到页面
  const container = document.getElementById("root");
  const root = ReactDOM.createRoot(container);
  root.render(vdom);
</script>
```

渲染结果

```html
<div id="root"><h1 id="title">Hello World!</h1></div>
```

方式二：js

```html
<!-- React 容器 -->
<div id="root"></div>

<script type="text/javascript">
  // const vdom = <h1 id="title">Hello World!</h1>;
  
  // 参数：标签名，标签属性，标签内容
  const vdom = React.createElement("h1", { id: "title" }, "Hello World!");
  
  // 渲染到页面
  const container = document.getElementById("root");
  const root = ReactDOM.createRoot(container);
  root.render(vdom);
</script>
```

渲染结果

```html
<div id="root"><h1 id="title">Hello World!</h1></div>
```

### 2.3、虚拟DOM与真实DOM

1. 虚拟DOM本质是Object类型对象
2. 虚拟DOM较为轻量，真实DOM比较重，因为真实DOM上存在很多属性
3. 虚拟DOM最终会被React转换为真实DOM，呈现在页面上

可以借助以下方式查看js对象

```js
// 方式一
console.dir()

// 方式二
debugger
```

## 3、React JSX

### 3.1、JSX

JSX全称：JavaScript XML

JSX语法规则：

1. 不需要引号，可以用小括号`()`包裹
2. js表达式用`{}`
3. 类名不要用`class`，要用`className`
4. 内联样式要用对象表达式 `style={{key: value}}`
5. 内联样式的key需要使用小驼峰命名规则：需要使用`fontSize`表示`font-size`
6. 只有一个根标签
7. 标签必须闭合
8. 标签首字母小写是html元素; 标签首字母大写是React组件

示例
```html
<style>
  .title {
    color: red;
  }
</style>

<!-- React 容器 -->
<div id="root"></div>

<script type="text/babel">
  function Button() {
    return <button>Click Me</button>;
  }

  function MyApp() {
    return (
      <div>
        <h1 className="title">Hello, world!</h1>
        <div style={{ fontSize: "16px" }}>Hello, world!</div>
        <input type="text"></input>
        <Button></Button>
      </div>
    );
  }

  // 渲染到页面
  const container = document.getElementById("root");
  const root = ReactDOM.createRoot(container);
  root.render(<MyApp />);
</script>
```

渲染结果

```html
<div id="root">
    <div>
        <h1 class="title">Hello, world!</h1>
        <div style="font-size: 16px;">Hello, world!</div>
        <input type="text">
        <button>Click Me</button>
    </div>
</div>
```


### 3.2、React渲染list

```html
<!-- React 容器 -->
<div id="root"></div>

<script type="text/babel">
  const data = ["React", "Vue", "Angular"];

  function MyApp() {
    return (
      <ul>
        {data.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
    );
  }

  // 渲染到页面
  const container = document.getElementById("root");
  const root = ReactDOM.createRoot(container);
  root.render(<MyApp />);
</script>
```



```html
<div id="root">
  <ul>
    <li>React</li>
    <li>Vue</li>
    <li>Angular</li>
  </ul>
</div>
```

## 4、其他事项

### 4.1、模块和组件

- 模块：一个js文件
- 组件：一个实现业务功能的集合

### 4.2、开发者工具

安装浏览器插件`React Developer Tools`

https://www.bilibili.com/video/BV1wy4y1D7JT?p=9&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da

