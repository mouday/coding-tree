# 微信小程序学习笔记-实战

学习视频：

- [尚硅谷 2021 版微信小程序开发（零基础小程序开发入门到精通）](https://www.bilibili.com/video/BV12K411A7A2)

## 技术选型

小程序第三方框架

- 腾讯 wepy 类似 vue
- 美团 mpvue 类似 vue
- 京东 taro 类似 react
- 滴滴 chameleon
- uni-app 类似 vue
- 原生框架 mina

## 目录结构

```
styles 公共样式
components 组件
lib 第三方库
utils 工具库
request 接口请求
```

网络请求

```js
wx.request({
  url: '',
  data: {},
  header: { 'content-type': 'application/json' },
  method: 'GET',
  dataType: 'json',
  responseType: 'text',
  success: (result) => {},
  fail: () => {},
  complete: () => {},
});
```

请求接口域名问题

1. 开发环境可以勾选【不校验合法域名】
2. 生产环境需要配置【服务器域名】

请求函数封装

request.js

```js
/**
封装请求函数
返回一个Promise对象
ref: https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
*/

// 同时发送请求的数量
let requestCount = 0;

export function request({ url, data = null, method = 'GET' }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: method,

      // 请求成功
      success(res) {
        console.log(url);
        console.log(res.data);
        resolve(res.data);
      },

      // 请求失败
      fail(err) {
        reject(err);
      },

      // 请求结束
      complete() {
        requestCount--;
        if (requestCount <= 0) {
          // 停止当前页面下拉刷新
          wx.stopPullDownRefresh();
        }
      },
    });
  });
}
```

默认宽高：

```
swiper 100% * 150px
image  320px * 240px
```

image
swiper 标签高度变成和图片高一样

less 原样输出

```less
width: ~'calc(100vh - 90rpx)';
```

数据缓存

web 和小程序中本地存储区别

```js
// 1、写代码方式不一样
web: localStrorage.setItem(key, data); localStrorage.getItem(key)
小程序: wx.setStorageSync(key, data); wx.getStorageSync(key);

// 2、存入时类型转换
web: 先转为字符串再存
小程序：原类型存储
```

小程序支持 ES7 async await 语法

引入扩展

```js
const regeneratorRuntime = require('../libs/regeneratorRuntime.js');
```

## 列表

监听滚动条触底事件，实现翻页

```js
// 页面上拉触底事件的处理函数
onReachBottom (){}
```

开启下拉刷新

```json
"enablePullDownRefresh": true,
"backgroundTextStyle": "dark"
```

```js
// 监听用户下拉动作
onPullDownRefresh(){
    // 停止当前页面下拉刷新
    wx.stopPullDownRefresh()
}
```

自定义 request

```js
// 同时发送请求的数量
let requestCount = 0;

function request(url, data = null) {
  requestCount++;

  // 全局添加加载提示
  wx.showLoading({
    title: '加载中',
    mask: true,
  });

  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url, //仅为示例，并非真实的接口地址
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      },
      complete() {
        requestCount--;
        if (requestCount === 0) {
          wx.hideLoading();
        }
      },
    });
  });
}

export default request;
```

iPhone 部分手机不识别 webp 格式

大图预览

```js
wx.previewImage();
```

超出隐藏

```css
display: -webkit-box;
overflow: hidden;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
```

富文本显示

```html
<rich-text nodes="{{content}}"><rich-text></rich-text></rich-text>
```

底部栏

```css
position: fixed;
```

隐藏 button

```css
.parent {
  position: relative;

  .children {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
```

css3 filter 滤镜效果

```css
// 高斯模糊
filter: blur(510rpx);
```

获取收获地址

```js
wx.chooseAddress({
  success: (result) => {
    console.log(result);
  },
});
```

授权情况检查

```
wx.getSetting

scope.address
true         可以获取收货地址
undefined    可以获取收货地址
false        用户主动拒绝，需要引导用户打开授权设置页面

wx.openSetting()
```

```js
[].every();
```

页面栈

```js
// onShow不像onLoad一样有形参options
onShow(){
    // 页面栈数组
    let pages = getCurrentPages();

    // 当前页面
    let currentPage = pages[pages.length - 1];

    // 当前页面的参数
    currentPage.options
}
```

防抖和节流 定时器

防抖： 用于输入框，防止重复请求

```js
let Timer = null;

function foo() {
  clearTimeout(Timer);

  Timer = setTimeout(() => {
    request();
  }, 1000);
}

foo();
foo();
```

节流：用于页面下拉和上拉

```
wx:if  v-if
hidden v-show
```

选择图片

```js
wx: chooseImage();
```

## 获取用户信息

```html
<button open-type="getUserInfo" bindgetuserinfo="handleGetUserInfo">
  获取用户信息
</button>
```

```js
handleGetUserInfo(e) {
    // 获取用户信息，需用户确认
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明用途
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
```

## 使用 iconfont

https://www.iconfont.cn/

将选中的图表添加至项目

推荐 font class 格式

打开文件地址，复制内容到小程序项目中，修改后缀为`wxss`

## 文本溢出隐藏

```css
// 单行文本溢出隐藏显示省略号，作用域块级元素
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;

// 多行文本溢出隐藏显示省略号
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical; // 设置纵向对齐
-webkit-line-clamp: 2; // 设置多行行数
```
