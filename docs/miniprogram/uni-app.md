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

## loading 提示框

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