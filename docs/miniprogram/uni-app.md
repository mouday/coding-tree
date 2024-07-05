# uni-app 常用 api

参考文档：https://uniapp.dcloud.net.cn/

## 条件编译

1、API 的条件编译

```js
// #ifdef H5
平台特有的组件;
// #endif

// #ifdef MP-WEIXIN
平台特有的组件;
// #endif
```

2、组件的条件编译

```html
<!--  #ifdef H5 -->
平台特有的组件
<!--  #endif -->

<!--  #ifdef MP-WEIXIN -->
平台特有的组件
<!--  #endif -->
```

3、样式的条件编译

```css
/*  #ifdef  H5  */
平台特有样式
/*  #endif  */

/*  #ifdef  MP-WEIXIN  */
平台特有样式
/*  #endif  */
```

## 页面和路由

示例

```js
// 保留当前页面，跳转到应用内的某个页面，
uni.navigateTo({
  url: "/pages/index/index?id=1&name=uniapp",
});

// 返回到原页面
uni.navigateBack();

// 关闭当前页面，跳转到应用内的某个页面。
uni.redirectTo({
  url: "/pages/index/index?id=1&name=uniapp",
});

// 关闭所有页面，打开到应用内的某个页面。
uni.reLaunch({
  url: "/pages/index/index?id=1&name=uniapp",
});

// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
uni.switchTab({
  url: "/pages/index/index", // 路径后不能带参数
});
```

## 提示框loading

```js
// 显示 loading 提示框
uni.showLoading({
  title: "加载中",
  mask: true,
});

// 隐藏 loading 提示框
uni.hideLoading();
```

## 下拉刷新

开启下拉刷新

```json
// pages.json
{
  "path": "pages/index/index",
  "style": {
    "enablePullDownRefresh": true
  }
}
```

使用下拉刷新

```js
export default {
  onLoad: function (options) {},

  // 监听该页面用户下拉刷新事件
  onPullDownRefresh() {
    // 触发下拉刷新动画
    uni.startPullDownRefresh();

    // 停止当前页面下拉刷新
    uni.stopPullDownRefresh();
  },

  // 页面滚动到底部的事件
  onReachBottom() {
    // 下一页数据
  },
};
```

## 表单组件picker

使用示例

```html
<template>
    <picker
      @change="handleChange"
      :value="value"
      :range="options"
      range-key="label"
      >{{selectedLabel}}</picker>
</template>

<script>

export default {
  data() {
    return {
      // picker index
      value: null,

      options: [
        {
          'label': '男性',
          'value': 'man',
        },
        {
          'label': '女性',
          'value': 'woman',
        }
      ],
    }
  },

  computed: {
    selectedLabel(){
       return this.options[this.value]?.label
    }
  },

  methods: {
    handleChange(e) {
      this.value = e.detail.value
    },
  }
}
</script>

```

## 自定义转发内容

```js
export default {
  onShareAppMessage(res) {
    return {
      // 转发标题 默认值: 当前小程序名称  
      title: '自定义分享标题',
      // 转发路径 默认值: 当前页面 path ，必须是以 / 开头的完整路径
      path: '/pages/test/test?id=123',
      // 自定义图片路径 默认值: 使用默认截图
      imageUrl: ''
    }
  }
}
```

## 微信手机号登录

通过用户授权，获取手机号code，后台解码后，返回登录token

```html
<template>
  <view class="mo-button">
    点击微信授权
    <button
      class="mo-open-button"
      open-type="getPhoneNumber"
      @getphonenumber="handleGetPhonenumberAndLogin"
    ></button>
  </view>
</template>

<script>

export default {
  methods: {

    async handleGetPhonenumberAndLogin(e) {
      console.log(e)

      if (!e.detail.code) {
        this.$msg.warning('请先授权登录')
        return
      }

      const res = await this.$api.post('/auth/loginByCode', {
        code: e.detail.code,
      })

      console.log(res)

      if (res.ok) {
        // success
        this.$emit('on-success')
      }
    },
  },
}
</script>

<style lang="less" scoped>
/* 按钮 */
.mo-button {
  width: 100%;
  background-color: $uni-color-primary;
  color: #fff;
  text-align: center;
  font-size: 34rpx;
  line-height: 100rpx;
  height: 100rpx;
  border-radius: 4rpx;
}


.mo-open-type {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>

```

## lodash防抖

```html
<template>
  <button  @click="debounceSubmit">提交</button>
</template>

<script>
import lodash from 'lodash'

export default {
  methods: {
    handleSubmit() {
      // submit data
    },
  },

  created() {
    // 防抖函数
    this.debounceSubmit = lodash.debounce(this.handleSubmit, 500)
  },
}
</script>
```

## token管理

```js
/**
 * weixin-token 管理
 */
const WEIXIN_TOKEN_KEY = 'weixin-token'

export function getWeixinToken() {
  return uni.getStorageSync(WEIXIN_TOKEN_KEY)
}

export function setWeixinToken(value) {
  return uni.setStorageSync(WEIXIN_TOKEN_KEY, value)
}

export function removeWeixinToken() {
  return uni.removeStorageSync(WEIXIN_TOKEN_KEY)
}

```

## Tabbar页面传参

适用于tabbar页面传参

```js
// query-util.js
/**
 * 一次性数据
 */
const DATA = new Map()
const KEY = 'query'

export default {
  get() {
    const value = DATA.get(KEY)
    DATA.clear()
    return value || {}
  },

  set(value) {
    DATA.set(KEY, value)
  },
}

```

使用方式

```js
// pageA.js
import Query from '@/utils/query-util.js'

// 在页面跳转之前，将数据存入Query
Query.set({'id': '123'})

uni.switchTab({
  url: '/pages/pageB/pageB',
})
```


```js
// pageB.js
import Query from '@/utils/query-util.js'

// 在新的页面获取参数
const query = Query.get()
console.log(query)
```

## 页面间通信


```js
// pageA.js
// 改变this 指向
let that = this

// 由pageA 打开 pageB
uni.navigateTo({
  url: '/pages/pageB/pageB',
  success: function(res) {
    // 监听一次 pageB 的消息
    res.eventChannel.once('on-success', that.handleSuccess)

    // 向 pageB 发送消息
    res.eventChannel.emit("on-init", {data: 'data'});
  }
});
```

```js
// pageB.js

// 向pageA传递消息
this.getOpenerEventChannel().emit('on-success')


// 监听页面pageA的消息
onLoad(options) {
  const eventChannel = this.getOpenerEventChannel();

  eventChannel.once("on-init", function (data) {
    console.log(data);
  });
},
```