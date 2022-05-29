# Webpack loader

loader 将不同类型的文件转换为 webpack 可识别的模块

## loader 使用方式

1. 配置方式： pre、normal、post (推荐使用)
2. 内联方式： inline

### 配置方式

```js
module: {
  rules: [
    {
      test: /\.js$/,
      loader: "babel-loader",
    },
  ]
}
```

### 内联方式

使用 `!` 将资源中的 loader 分开

```js
import style from "style-loader!css-loader?modules!./style.css";
```

内联方式跳过配置方式的 loader

```js
// !  跳过 normal loader。
import style from "!style-loader!css-loader?modules!./style.css";

// -! 跳过 pre 和 normal loader。
import style from "-!style-loader!css-loader?modules!./style.css";

// !! 跳过 pre、 normal 和 post loader。
import style from "!!style-loader!css-loader?modules!./style.css";
```

## loader 执行优先级

### 默认优先级

```bash
pre：    前置 loader
normal： 普通 loader
inline： 内联 loader
post：   后置 loader
```

### 相同优先级

从右到左，从下到上

```js
// 此时loader执行顺序：loader3 - loader2 - loader1
module: {
  rules: [
    {
      test: /\.js$/,
      loader: "loader1",
    },
    {
      test: /\.js$/,
      loader: "loader2",
    },
    {
      test: /\.js$/,
      loader: "loader3",
    },
  ],
},
```

### 指定优先级

```js
// 此时loader执行顺序：loader1 - loader2 - loader3
module: {
  rules: [
    {
      enforce: "pre",
      test: /\.js$/,
      loader: "loader1",
    },
    {
      // 没有enforce就是normal
      test: /\.js$/,
      loader: "loader2",
    },
    {
      enforce: "post",
      test: /\.js$/,
      loader: "loader3",
    },
  ],
}

```

## 开发一个 loader

项目结构

```bash
$ tree
.
├── loaders
│   └── test-laoder.js
├── package.json
├── pnpm-lock.yaml
├── src
│   └── index.js
└── webpack.config.js
```

项目文件

```js
// loaders/test-laoder.js
/**
 *
 * @param {*} content 源文件的内容
 * @param {*} map SourceMap 数据
 * @param {*} meta 数据，可以是任何内容
 * @returns
 */
module.exports = function loader(content, map, meta) {
  console.log("hello loader");
  return content;
};
```

package.json

```json
{
  "dependencies": {
    "webpack": "^5.72.1",
    "webpack-cli": "^4.9.2"
  }
}
```

```js
// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "./loaders/test-laoder.js",
      },
    ],
  },

  plugins: [],

  mode: "development",
};
```

```js
// src/index.js
console.log("Hello World");
```

编译打包

```bash
# 安装依赖
$ pnpm add webpack webpack-cli

# 运行打包
$ npx webpack --config webpack.config.js
hello loader
```


## loader 分类

### 同步 loader

```js
module.exports = function (content, map, meta) {
  return content;
};
```

callback方式

```js
module.exports = function (content, map, meta) {
  // 第一个参数：err 错误
  this.callback(null, content, map, meta);
};
```

### 异步 loader

```js
module.exports = function (content, map, meta) {
  const callback = this.async();
  
  // 进行异步操作
  setTimeout(() => {
    callback(null, content, map, meta);
  }, 1000);
};
```

### Raw Loader

通常用于处理图片资源

```js
module.exports = function (content) {
  // content是一个Buffer数据
  return content;
};

// 开启 Raw Loader
module.exports.raw = true; 
```

### Pitching Loader

```js
module.exports = function (content) {
  return content;
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  console.log("do somethings");
};
```

webpack完整的loader执行顺序

![](./img/loader1.png)

loader提前返回

![](./img/loader2.png)

## loader API

|方法名	| 含义	| 用法
|- | - | - 
this.async|	异步回调 loader。返回 this.callback |	const callback = this.async()
this.callback	|可以同步或者异步调用的并返回多个结果的函数	|this.callback(err, content, sourceMap?, meta?)
this.getOptions(schema)	|获取 loader 的 options	|this.getOptions(schema)
this.emitFile	|产生一个文件	|this.emitFile(name, content, sourceMap)
this.utils.contextify	|返回一个相对路径	|this.utils.contextify(context, request)
this.utils.absolutify	|返回一个绝对路径	|this.utils.absolutify(context, request)

文档：[https://webpack.docschina.org/api/loaders/](https://webpack.docschina.org/api/loaders/)

## 手写示例

### clean-log-loader

```js
// console-log-laoder.js
module.exports = function (content, map, meta) {
  return content.replace(/console\.log\(.*\);?/g, '');
};
```
https://www.bilibili.com/video/BV14T4y1z7sw?p=67&spm_id_from=pageDriver
