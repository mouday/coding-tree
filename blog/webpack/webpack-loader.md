# Webpack loader

loader 将不同类型的文件转换为 webpack 可识别的模块


使用loader的方式

1. 配置方式： pre、normal、post (推荐使用)
2. 内联方式： inline

loader 执行优先级：

```
pre：    前置 loader
normal： 普通 loader
inline： 内联 loader
post：   后置 loader
```

相同优先级：从右到左，从下到上

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

指定优先级

```
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
},
```

内联方式

```js
import style from 'style-loader!css-loader?modules!./style.css'
```

内联方式跳过配置方式的 loader

```js
// !  跳过 normal loader。
import style from '!style-loader!css-loader?modules!./style.css'

// -! 跳过 pre 和 normal loader。
import style from '-!style-loader!css-loader?modules!./style.css'

// !! 跳过 pre、 normal 和 post loader。
import style from '!!style-loader!css-loader?modules!./style.css'
```

开发一个 loader

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

```
# 安装依赖
$ pnpm add webpack webpack-cli

# 运行打包
$ npx webpack --config webpack.config.js
hello loader
```


https://www.bilibili.com/video/BV14T4y1z7sw?p=67&spm_id_from=pageDriver
