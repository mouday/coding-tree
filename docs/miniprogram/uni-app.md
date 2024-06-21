# uni-app常用api

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