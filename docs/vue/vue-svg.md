# vue项目中使用svg

vue项目中使用svg并设置大小颜色等样式

1、安装依赖
```
npm install --save-dev svg-sprite-loader

# 或者
yarn add svg-sprite-loader --dev
```

2、新建svg资源目录
将svg资源放入此目录，接下来会在配置文件中该路径
```
mkdir -p src/assets/icons
```

3、vue-cli 3.x 配置 
vue.config.js
```js
module.exports = {
  chainWebpack: config => {
    // svg rule loader
    const svgRule = config.module.rule('svg') // 找到svg-loader
    svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
    svgRule // 添加svg新的loader处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/assets/icons'))
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  }
}

```

4、创建SvgIcon.vue
src/compoments/SvgIcon.vue
```html
<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'svg-icon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.iconClass}`
    },
    svgClass () {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

```

5、组件注册
src/assets/icons/index.js
```js
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'

// 全局注册组件
Vue.component('svg-icon', SvgIcon)
// 定义一个加载目录的函数
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/assets/icons', false, /\.svg$/)
// 加载目录下的所有 svg 文件
requireAll(req)

```

6、引入组件
main.js
```js
import './assets/icons'
```

7、使用svg组件
iconClass: svg文件的文件名
className: svg图标的样式类名
```html
<template>
  <svg-icon iconClass='svg-name' className='icon'></svg-icon>
</template>
...
<style scoped>
.icon {
  width: 100px;
  height: 100px;
  color: red;
}
</style>

```
备注：
如果颜色没有改变，打开svg文件，找到fill，都删除

>参考
[在vue项目中使用svg，并能根据需要修改svg大小颜色等样式](https://blog.csdn.net/weixin_42204698/article/details/93751906)


