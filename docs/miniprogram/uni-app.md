# uni-app常用api

## 条件编译

1、API 的条件编译

```js
// #ifdef H5
平台特有的组件
// #endif

// #ifdef MP-WEIXIN
平台特有的组件
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

https://uniapp.dcloud.net.cn/api/router.html#event-channel

示例

```js
// 保留当前页面，跳转到应用内的某个页面，
uni.navigateTo({
    url: '/pages/index/index?id=1&name=uniapp'
});

// 返回到原页面
uni.navigateBack()

// 关闭当前页面，跳转到应用内的某个页面。
uni.redirectTo({
    url: '/pages/index/index?id=1&name=uniapp'
});

// 关闭所有页面，打开到应用内的某个页面。
uni.reLaunch({
    url: '/pages/index/index?id=1&name=uniapp'
});

// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
uni.switchTab({
    url: '/pages/index/index' // 路径后不能带参数
});
```

## loading 提示框

```js
// 显示 loading 提示框
uni.showLoading({
	title: '加载中'
    mask: true
});

// 隐藏 loading 提示框
uni.hideLoading();
```