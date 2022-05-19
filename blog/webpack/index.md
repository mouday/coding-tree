# Webpack5实战教程

尚硅谷新版Webpack5实战教程(从入门到精通)
https://www.bilibili.com/video/BV1e7411j7T5

尚硅谷前端Webpack5教程（高级进阶篇）
https://www.bilibili.com/video/BV1cv411C74F

笔记分享:
https://lab.puji.design/webpack-getting-started-manual/

## 目录

1. 课程简介
2. Webpack简介
3. Webpack初体验
4. Webpack开发环境基本配置
5. Webpack生产环境基本配置
6. Webpack优化配置
7. Webpack原理分析
8. Webpack5介绍

## 1、课程简介

### 1.1、知识点

- webpack5
- dll
- production
- development
- eslint
- babel
- pwa
- optimization
- resolve
- HMR
- loader
- plugin
- devtool
- 性能优化
- tree shaking
- code split
- caching
- lazy loading
- library
- shimming

### 1.2、环境配置

```
Node.js >= 10
webpack >= 4.26
```

### 1.3、预备知识

- Node.js
- NPM
- ES6

## 2、webpack简介

### 2.1、webpack是什么

Webpack:

- 一种前端资源构建工具;
- 一个静态模块打包器（module bundler）.

在webpack看来，前端的所有资源文件（js/json/css/img/less/...）都会作为模块处理
它根据模块的依赖关系进行静态分析，打包生成对应的静态资源（bundle）

![](img/webpack.png)


### 2.2、webpack五个核心概念

1. entry: 入口

2. output： 输出

3. loader：处理非js文件，翻译工作

4. plugins 插件，执行范围更广的任务，打包优化，压缩，定义环境中的变量等

5. mode 模式

- development
    - 本地调试
    - 会将process.env.NODE_ENV的值设置为development
    - 启用NamedChunksPlugin
    - 启用NamedModulesPlugin
- production
    - 上线运行
    - 会将process.env.NODE_ENV的值设置为production
    - 启用FlagDependencyUsagePlug
    - 启用FlagDependencyUsagePlugin
    - 启用FlagIncludedChunksPlugin
    - 启用ModuleConcatenationPlugin
    - 启用NoEmitOnErrorsPlugin
    - 启用TerserPlugin


## 3、webpack初体验

### 3.1、初始化项目

```bash
mkdir webpack-demo
cd webpack-demo

# 初始化项目目录
npm init -y

# 安装webpack
cnpm i webpack webpack-cli -D
```

项目目录
```bash
$ tree
.
├── package.json
└── src
    └── index.js
```

src/index.js
```js
function add(x, y){
    return x + y;
}

console.log(add(1, 2));
```

依赖 package.json
```json
{
    "devDependencies": {
    "webpack": "^5.72.1",
    "webpack-cli": "^4.9.2"
  }
}
```

打包

```bash
# 开发环境
$ npx webpack ./src/index.js -o ./dist --mode=development

asset main.js 1.25 KiB [emitted] (name: main)
./src/index.js 64 bytes [built] [code generated]
webpack 5.72.1 compiled successfully in 74 ms

# 生产环境
$ npx webpack ./src/index.js -o ./dist --mode=production

asset main.js 15 bytes [emitted] [minimized] (name: main)
./src/index.js 64 bytes [built] [code generated]
webpack 5.72.1 compiled successfully in 201 ms
```

### 3.2、导入json资源

```
src
├── data.json
└── index.js
```

data.json
```json
{
  "name": "Tom",
  "age": 23
}
```

index.js
```js
import data from './data.json';

function add(x, y){
    return x + y;
}

console.log(add(1, 2));
console.log(data);
```

运行打包后的代码
```bash
$ node dist/main.js
3
{ name: 'Tom', age: 23 }
```

### 3.3、结论

- webpack能处理js、json资源，不能处理css、img等其他资源
- 生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化
- 生产环境比开发环境多了一部压缩js代码


### 3.4、webpack配置文件

构建工具基于node.js环境运行，模块化采用commonjs

一个基本的配置 

webpack.config.js
```js
// 用来处理路径
const path = require('path');

// webpack配置
module.exports = {
  // 入口文件
  entry: './src/index.js',

  // 输出
  output: {
    // 输出文件名
    filename: 'bundle.js',
    // 输出路径 __dirname node.js变量，当前文件的目录绝对路径
    path: path.resolve(__dirname, 'dist'),
  },

  // loader配置
  module: {
    rules: [],
  },

  // 插件配置
  plugins: [],

  // 模式
  mode: 'development',
// mode: 'production',
};

```

### 3.5、打包样式资源-css文件

安装处理css的loader

```bash
$ cnpm i style-loader css-loader -D
```

项目结构
```
$ tree -I "node_modules"
.
├── dist
│   ├── bundle.js
│   └── index.html
├── package.json
├── src
│   ├── index.css
│   └── index.js
└── webpack.config.js
```

src/index.js

```js
// 引入样式资源
import './index.css';

```

src/index.css

```css
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  background-color: pink;
}

```

webpack.config.js

```js
// 用来处理路径
const path = require('path');

// webpack配置
module.exports = {
  // 入口文件
  entry: './src/index.js',

  // 输出
  output: {
    // 输出文件名
    filename: 'bundle.js',
    // 输出路径 __dirname node.js变量，当前文件的目录绝对路径
    path: path.resolve(__dirname, 'dist'),
  },

  // loader配置
  module: {
    rules: [
      {
        // 正则匹配文件名
        test: /\.css$/,
        // 处理文件的loader
        // 执行顺序：从右到左，从下到上
        use: [
          // 创建style标签，插入到head中
          'style-loader',
          // 加载css文件，变成commonjs模块，内容是样式字符串
          'css-loader',
        ],
      },
    ],
  },

  // 插件配置
  plugins: [],

  // 模式
  mode: 'development',
  // mode: 'production',
};

```

index.html

```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="./bundle.js"></script>
</body>
</html>
```

执行打包命令

```bash
$ npx webpack
```

打开index.html 文件，可以看到css样式已经生效（右键->检查元素）

js动态生成了style标签

```html
<html lang="en"><head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
<style>html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  background-color: pink;
}
</style></head>
<body>
    <script src="./bundle.js"></script>
</body></html>
```

### 3.6、打包样式资源-less文件

```bash
$ cnpm i less less-loader -D
```

src/index.js
```js
// 引入less样式资源
import './index.less';

```

src/index.less
```css
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  background-color: pink;
}

```


新增配置 webpack.config.js
```js
// webpack.config.js
// 用来处理路径
const path = require('path');

// webpack配置
module.exports = {
  // 入口文件
  entry: './src/index.js',

  // 输出
  output: {
    // 输出文件名
    filename: 'bundle.js',
    // 输出路径 __dirname node.js变量，当前文件的目录绝对路径
    path: path.resolve(__dirname, 'dist'),
  },

  // loader配置
  module: {
    rules: [
      // 处理less文件
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          // 将less编译成css
          'less-loader',
        ],
      },
    ],
  },

  // 插件配置
  plugins: [],

  // 模式
  mode: 'development',
  // mode: 'production',
};

```

执行打包命令

```bash
$ npx webpack
```

### 3.7、打包Html资源


- loader: 1. 下载； 2.使用（配置loader）
- plugins: 1. 下载； 2.引入；3.使用

```
cnpm i html-webpack-plugin -D
```

默认创建一个空的HTML文件，自动引入打包输出的所有资源（js/css）

默认输出的HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"><script defer src="bundle.js"></script></head>
  <body>
  </body>
</html>
```

自定义HTML

```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// webpack配置
module.exports = {
  // 入口文件
  entry: './src/index.js',

  // 输出
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  // loader配置
  module: {},

  // 插件配置
  plugins: [
    // 复制一份HTML文件，并自动引入打包资源（js/css）
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],

  // 模式
  mode: 'development',
  // mode: 'production',
};

```

src/index.html
```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webpack</title>
</head>
<body>
    
</body>
</html>
```

执行打包命令之后输出

```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webpack</title>
<script defer src="bundle.js"></script></head>
<body>
    
</body>
</html>
```

### 3.8、打包图片资源

安装依赖
```
cnpm i html-loader -D
```

项目结构

```bash
$ tree -I node_modules
.
├── package.json
├── src
│   ├── index.html
│   ├── index.js
│   ├── index.less
│   └── weibo.png
└── webpack.config.js
```

src/index.js
```js
// 引入less样式资源
import './index.less';

// js引入图片资源
import weibo from './weibo.png';
console.log(weibo);
// http://127.0.0.1:5500/dist/images/7f1a8e356f.png

```

src/index.less

```less
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  // background-color: pink;
}

.box {
  width: 100px;
  height: 100px;
  // css引入图片资源
  background-image: url('./weibo.png');
  // 替换为：background-image: url(/dist/images/7f1a8e356f.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
```

src/index.html
```html
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible"
          content="IE=edge">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <title>Webpack</title>
</head>

<body>
    <div class="box"></div>

    <!-- html引入图片资源 -->
    <img src="./weibo.png" alt="">
    <!-- 替换为：<img src="images/7f1a8e356f.png" alt=""> -->
</body>

</html>
```


配置文件 webpack.config.js

webpack5默认会处理图片资源，webpack4需要单独配置

|webpack5 | webpack4 | 说明
|-|-|-
asset/resource | file-loader | 发送一个单独的文件并导出 URL
asset/inline | url-loader | 导出一个资源的 data URI
asset/source | raw-loader | 导出资源的源代码
asset |  url-loader | 在导出一个 data URI 和发送一个单独的文件之间自动选择。


webpack4 配置
```js
{
    module: {
        rules: [
            // 默认无法处理HTML中的图片
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                // 使用一个loader，如果使用多个loader用use
                loader: 'url-loader',
                options: {
                    // 图片大小小于8kb，就会被base64编码
                    // 优点：减少请求数量，减轻服务器压力
                    // 缺点：js体积会更大, 文件请求速度更慢
                    limit: 8 * 1024,
                    // 问题：url-loader默认使用es6模块解析，而html-loader引入图片是commonjs
                    // 解析时会出现[object Module]
                    // 解决：关闭url-loader的es6模块化，使用commonjs解析
                    esModule: false,
                    // 自定义命名 取hash前10位
                    name: '[hash:10].[ext]'
                }
            },
            
            // 处理html中的图片, 引入img，让后续loader解析
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ]
    }
}
```

package.json

```json
{
  "devDependencies": {
    "css-loader": "^6.7.1",
    "html-loader": "^3.1.0",
    "html-webpack-plugin": "^5.5.0",
    "less": "^4.1.2",
    "less-loader": "^11.0.0",
    "style-loader": "^3.3.1",
    "webpack": "^5.72.1",
    "webpack-cli": "^4.9.2"
  }
}

```
webpack5配置
```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// webpack配置
module.exports = {
  // 入口文件
  entry: './src/index.js',

  // 输出
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // 自定义资源文件名
    assetModuleFilename: 'images/[hash:10][ext][query]',
  },

  // loader配置
  module: {
    rules: [
      // 处理less文件
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      // 处理资源文件
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        // 默认: 小于 8kb 的文件，将会视为 inline 模块类型，否则会被视为 resource 模块类型。
        type: 'asset',
      },
      // 处理html中的图片
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },

  // 插件配置
  plugins: [
    // 复制一份HTML文件，并自动引入打包资源（js/css）
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],

  // 模式
  mode: 'development',
  // mode: 'production',
};

```

### 3.9、打包字体资源

可以从iconfont（[https://www.iconfont.cn/](https://www.iconfont.cn/)）网站下载字体文件

打包后的项目结构
```
$ tree -I node_modules
.
├── dist
│   ├── bundle.js
│   ├── images
│   │   ├── 5b0edd384b.ttf
│   │   ├── 969b5fedf8.woff
│   │   └── d79bd05095.woff2
│   └── index.html
├── package.json
├── src
│   ├── iconfont
│   │   ├── iconfont.css
│   │   ├── iconfont.js
│   │   ├── iconfont.json
│   │   ├── iconfont.ttf
│   │   ├── iconfont.woff
│   │   └── iconfont.woff2
│   ├── index.html
│   ├── index.js
└── webpack.config.js
```

src/index.js

```js
// 引入css样式资源
import './iconfont/iconfont.css';

```

src/index.html
```html
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible"
          content="IE=edge">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <title>Webpack</title>
</head>

<body>
    <span class="iconfont icon-home"></span>   
</body>

</html>
```

webpack.config.js

webpack4

```js
{
    // 排除资源
    exclude: /\.(js|less|html)$/i,
    type: 'file-loader',
    options: {
        // 自定义命名 取hash前10位
        name: '[hash:10].[ext]'
    }
},
```

webpack5

```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// webpack配置
module.exports = {
  // 入口文件
  entry: './src/index.js',

  // 输出
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // 自定义资源文件名
    assetModuleFilename: 'images/[hash:10][ext][query]',
  },

  // loader配置
  module: {
    rules: [
      // 处理css文件
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // 处理less文件
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      // 处理资源文件
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
      },
      // 处理html文件，加载其中的图片
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      // 处理字体文件
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },

  // 插件配置
  plugins: [
    // 复制一份HTML文件，并自动引入打包资源（js/css）
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],

  // 模式
  mode: 'development',
  // mode: 'production',
};

```

https://www.bilibili.com/video/BV1e7411j7T5?p=9&spm_id_from=pageDriver