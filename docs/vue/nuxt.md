# VUE 服务器端渲染-NUXT

1. 服务器端渲染 利于 SEO
2. 客户端渲染

## vue-server-renderer

[https://ssr.vuejs.org/zh/guide/](https://ssr.vuejs.org/zh/guide/)

安装环境

```
npm install vue vue-server-renderer --save
```

1、渲染示例

```js
const Vue = require("vue");
const VueServerRenderer = require("vue-server-renderer");

// 第 1 步：创建一个 Vue 实例
const app = new Vue({
  template: `<div>Hello {{name}}</div>`,
  data() {
    return {
      name: "Tom",
    };
  },
});

// 第 2 步：创建一个 renderer
const renderer = VueServerRenderer.createRenderer();

// 第 3 步：将 Vue 实例渲染为 HTML
renderer.renderToString(app).then((html) => {
  console.log(html);
});
// <div data-server-rendered="true">Hello Tom</div>
```

2、与服务端结合

```
npm install express --save
```

```js
const Vue = require("vue");
const VueServerRenderer = require("vue-server-renderer");
const express = require("express");

// vue实例
const app = new Vue({
  template: `<div>Hello {{name}}</div>`,
  data() {
    return {
      name: "Tom",
    };
  },
});

// 渲染器
const renderer = VueServerRenderer.createRenderer();

// 服务
const server = express();

server.get("*", async (request, response) => {
  const html = await renderer.renderToString(app);
  response.end(html);
});

server.listen(8080);
```

官方 Demo
https://github.com/vuejs/vue-hackernews-2.0/

## Nuxt

### 1、使用 npx 创建项目

```bash
npx create-nuxt-app my-app

# 等价于
npm install -g create-nuxt-app
create-nuxt-app my-app

```

如果速度慢，可以配置国内源

```bash
vim ~/.bash_profile

alias cnpx='NPM_CONFIG_REGISTRY=https://registry.npm.taobao.org/ npx'
```

### 2、目录结构

```
静态资源          assets 会被编译 scss等
组件             components
布局组件          layouts
中间件            middleware
页面路由          pages
插件目录          plugins 根vue.js应用 实例化之前运行
静态文件          static 不会被编译处理
应用的Vuex 状态树  store
个性化配置         nuxt.config.js
脚本接口           package.json
```

别名

```
~ 或 @ srcDir
~~ 或 @@ rootDir

assets 或者 static 使用~
```

### 3、配置

css

```
npm install node-sass sass-loader --save-dev
```

### 4、路由

```html
<nuxt-link to="/"></nuxt-link>
```

pages 目录下会自动生成

(1)基础路由

```
pages/detail
=>
/detail
```

(2)动态路由

```
pages/detail/_id.vue

=>

/detail/007

$route.params.id == 007
```

(3)嵌套路由

```
pages/users.vue

pages/users/index.vue
```

(4)过渡动效

assets/css/main.scss

```scss
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}
```

nuxt.config.js：

```js
module.exports = {
  css: ["assets/css/main.scss"],
};
```

### 5、中间件 middleware

### 6、模板

app.html 不建议直接修改

布局 layouts

### 7、异步数据

asyncData 页面加载之前

static/data/user.json

```json
{
  "name": "Tom",
  "age": 23
}
```

pages/index.vue

```html
<template>
  <div class="container">
    {{ initData.name }}
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    async asyncData(context) {
      const res = await axios.get("http://localhost:3000/data/user.json");
      console.log(res);

      return {
        initData: res.data,
      };
    },
  };
</script>
```

### 8、资源文件

assets 会被打包

static 不会被打包

```html
<!-- 引用 static 目录下的图片 -->
<img src="/my-image.png" />

<!-- 引用 assets 目录下经过 webpack 构建处理后的图片 -->
<img src="~/assets/my-image-2.png" />
```

### 9、插件

plugins/vue-notifications.js：

```js
import Vue from "vue";
import VueNotifications from "vue-notifications";

Vue.use(VueNotifications);
```

配置 plugins 如下：

```js
module.exports = {
  plugins: ["@/plugins/vue-notifications"],
};
```

### 10、注入

(1)注入 Vue 实例

plugins/vue-inject.js:

```js
import Vue from "vue";

Vue.prototype.$debug = (msg) => console.log(msg);
```

nuxt.config.js:

```js
export default {
  plugins: ["~/plugins/vue-inject.js"],
};
```

(2)注入 context

plugins/ctx-inject.js:

```js
export default ({ app }, inject) => {
  // Set the function directly on the context.app object
  app.debug = (msg) => console.log(msg);
};
```

nuxt.config.js:

```js
export default {
  plugins: ["~/plugins/ctx-inject.js"],
};
```

(3)同时注入

会自动添加前缀`$`

```js
export default ({ app }, inject) => {
  inject("debug", (msg) => console.log(msg));
  );
};
```

nuxt.config.js:

```js
export default {
  plugins: ["~/plugins/combined-inject.js"],
};
```

### 11、状态树

fetch 方法会在渲染页面前被调用，作用是填充状态树 (store) 数据

与 asyncData 方法类似，不同的是它不会设置组件的数据。

nuxtServerInit：服务端数据传给客户端的状态树

store/index.js

```js
export const state = () => ({
  counter: 0,
});

export const mutations = {
  increment(state) {
    state.counter++;
  },
};
```

pages/index.vue

```html
<p>{{$store.state.counter}}</p>

<button @click="$store.commit('increment')">点击</button>
```

### 12、部署

```
开发 npm dev
上线 npm start
```

> 学习视频:
> [VUE 服务器端渲染-NUXT 实战视频](https://www.bilibili.com/video/BV1rb411x7TG)
