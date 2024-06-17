# vant

1、安装
```bash
# 安装 Vue Cli
npm install -g @vue/cli

# 创建一个项目
vue create hello-world

# 安装vant 
npm i vant -S
# 完整写法：npm install vant --save

# 安装插件 
npm i babel-plugin-import -D
# 完整写法： npm install babel-plugin-import --save-dev

# 更换安装源：
# npm install vant --save --registry=https://registry.npm.taobao.org
```

2、babel.config.js 中配置
```js
module.exports = {
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
};
```

3、新建视图 views/Web.vue
```html
<template>
  <div>
    
    <van-button type="primary">主要按钮</van-button>

  </div>
</template>

<script>

// 引入组件
import { Button } from "vant";

export default {
  name: "web",

  // 注册组件
  components: {
    [Button.name]: Button
  }
};
</script>

```

4、配置路由router.js
```js
{
  path: '/web',
  name: 'web',
  component: () => import('./views/Web.vue')
}
```

5、访问测试
http://localhost:8080/web
