# 微信小程序学习笔记-基础

录屏工具：Snipaste

学习视频：[黑马程序员微信小程序开发前端教程\_零基础玩转微信小程序](https://www.bilibili.com/video/BV1nE41117BQ)

开发文档：[https://developers.weixin.qq.com/miniprogram/dev/framework/](https://developers.weixin.qq.com/miniprogram/dev/framework/)

## 环境准备

1、小程序开发工具：
https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

1. 新建页面技巧：

- pages 目录右键新建 page，会自动新建 json/js/wxml/wxss 四个文件，并且自动注册到 app.json
- app.json 配置 pages 保存，会自动创建页面

2、使用 vscode 开发微信小程序安装的插件:

1. wechat-snippet
   微信小程序代码辅助,代码片段自动完成

2. minapp
   微信小程序标签、属性的智能补全（同时支持原生小程序、mpvue 和 wepy 框架，并提供 snippets）
   需要输入才会触发标签补全
   输入空格会触发对应标签的属性补全

3. wxapp-helper
   选择创建 wx 组件，自动生成配套的文件，简直不要太爽

4. 小程序开发助手

5. 插件 CSS Tree，html 结构生成 css 结构树

6. vscode 插件 easy less

7. wxml 高亮插件

3、Web Storm 设置小程序开发环境

```
settings -> Editor -> File Types -> 关联文件
```

## VS Code 配置

工作区配置 .vscode/settings.json

```json
{
  "files.autoSave": "afterDelay",
  "minapp-vscode.prettyHtml": {
    "useTabs": false,
    "tabWidth": 2,
    "printWidth": 100,
    "singleQuote": false,
    "usePrettier": true,
    "wrapAttributes": false,
    "sortAttributes": false
  },
  "less.compile": {
    "out": true,
    "outExt": ".wxss"
  }
}
```

## 项目结构

```
app.js                全局入口文件
app.json              全局配置文件
app.wxss              全局样式文件
project.config.json   项目配置文件
sitemap.json          配置微信搜索
pages/                页面文件夹
static/               静态资源
components/           自定义组件
```

## 全局配置文件 app.json

https://developers.weixin.qq.com/miniprogram/dev/framework/config.html

1、pages 页面路径列表

可以调整显示顺序

```json
{
  "pages": ["pages/home/home"]
}
```

2、window 全局的默认窗口表现

```json
{
  "window": {
    // 下拉刷新文本风格: dark/light
    "backgroundTextStyle": "light",

    // 顶部导航背景颜色，仅支持HexColor
    "navigationBarBackgroundColor": "#fff",

    // 顶部导航文本
    "navigationBarTitleText": "Weixin",

    // 顶部导航文本风格: black/white
    "navigationBarTextStyle": "black",

    // 开启下拉刷新
    "enablePullDownRefresh": true
  }
}
```

3、tabBar 底部 tab 栏

```json
{
  "tabBar": {
    "color": "#0094ff",
    "selectedColor": "#ff9400",
    "borderStyle": "white",

    "list": [
      {
        "text": "首页",
        "pagePath": "pages/index/index",
        "iconPath": "icon/index_.png",
        "selectedIconPath": "icon/index.png"
      },
      {
        "text": "我的",
        "pagePath": "pages/logs1/logs1",
        "iconPath": "icon/self_.png",
        "selectedIconPath": "icon/self.png"
      }
    ]
  }
}
```

## 页面配置

对本页面的窗口表现进行配置
会覆盖 app.json 的 window 中相同的配置项

## sitemap.json 配置

配置其小程序页面是否允许微信索引

## 数据绑定

核心：数据代理

```js
Object.defineProperty(object, key, { get, set });
```

```
小程序：
  初始化数据：data
  修改数据：this.setData()
  修改数据始终是同步的
  数据流：
    单向数据流：Model->View
    简易数据双向绑定：model:value

Vue
  初始化数据：data
  修改数据：this.key = value;
  数据流：
    单向数据流：Model->View
    数据双向绑定：v-model

React
  初始化数据：state
  修改数据：this.setState()
  自身钩子函数是异步
  非自身钩子函数（定时器回调）是同步
  数据流：
    单向数据流：Model->View
```

index.js

```js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: 'Tom',
    age: 23,
    isShow: true,
    person: {
      name: 'Jack',
      age: 24,
    },
    isChecked: true,
  },
});
```

index.wxml

```
text 相当于 span 行内元素 不会换行
view 相当于 div  块级元素 会换行
image 可以使用相对路径，也可以使用绝对路径
```

```html
<!-- 1、字符串 -->
<view>{{name}}</view>

<!-- 2、数字 -->
<view>{{age}}</view>

<!-- 3、布尔值 -->
<view>{{isShow}}</view>

<!-- 4、对象 -->
<view>{{person.name}}</view>
<view>{{person.age}}</view>

<!-- 5、标签属性中使用 -->
<view data-age="{{age}}">{{age}}</view>

<!-- 6、使用checkbox, 注意："{{之间不能有空格 -->
<checkbox checked="{{isChecked}}"></checkbox>

<!-- 7、使用相对路径 -->
<image src="../../static/img/logo.png"></image>
<!-- 使用绝对路径 -->
<image src="/static/img/logo.png"></image>
```

## 运算

1、表达式： 简单运算 1. 数字的加减 2. 字符串拼接 3. 三元运算符

2、运算：复杂的代码段 1. if else 2. switch 3. do while

```html
<!-- 数字加减 -->
<view>{{1 + 1}}</view>

<!-- 字符串拼接 -->
<view>{{"1" + "1"}}</view>

<!-- 三元运算 -->
<view>{{10 % 2 === 0 ? '偶数': '奇数'}}</view>
```

## 数组和对象循环

1、列表循环

```
wx:for="{{列表}}"
wx:for-item="循环项的名称"
wx:for-index="循环项的索引"
wx:key="唯一值" 用来提高渲染渲染
wx:key="*this" 表示普通列表的循环项 eg: [1, 2, 3]

注意：数组嵌套循环不要重名

可以省略属性：`wx:for-item="item" wx:for-index="index"`

```

```js
list: [
  {
    id: 1,
    name: 'Tom',
  },
  {
    id: 2,
    name: 'Jack',
  },
];
```

```html
<view wx:for="{{list}}" 
  wx:for-item="item" 
  wx:for-index="index" 
  wx:key="id">
  {{index}} - {{item.name}}
</view>
```

1、对象循环

```
wx:for="{{对象}}"
wx:for-item="对象的值"
wx:for-index="对象的属性"

推荐：wx:for-item="value" wx:for-index="key"

```

```js
person: {
    name: "Jack",
    age: 24
}
```

```html
<view wx:for="{{person}}" wx:for-item="value" wx:for-index="key" wx:key="age">
  {{key}} - {{value}}
</view>
```

## block 标签

占位符标签
写代码时候可以看到
渲染后会把它移除
类似 vue 中的 template

```html
<block></block>
```

## 条件渲染

```html
<!-- 标签不频繁切换 移除节点 -->
<view wx:if="{{true}}">true</view>
<view wx:elif="{{false}}">false</view>
<view wx:else>default</view>

<!-- 标签频繁切换 添加样式 display:none -->
<view hidden>隐藏的内容</view>
<view hidden="{{true}}">隐藏的内容</view>
```

## 事件绑定

事件流的三个阶段

- 捕获阶段：从外向内
- 执行目标阶段：
- 冒泡阶段：从内向外

```
父元素 -> 子元素 -> 父元素
```

- 冒泡事件： 该事件会向父节点传递
- 非冒泡事件

https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html

1、bind 不阻止冒泡

```html
<view bind:tap="handleBindTap"> click me!</view>
```

2、catch 阻止冒泡

```html
<view catch:tap="handleCatchTap">click me!</view>
```

示例：实现+1 和-1 操作

小程序模板中函数不支持传参

```js
Page({
  data: {
    num: 0,
  },

  handleInput(e) {
    // 获取事件输出的值，并且更新数据
    this.setData({
      num: e.detail.value,
    });
  },

  handleTap(e) {
    // 获取data数据, this是当前实例
    console.log(this.data.num);

    console.log(e);

    // 获取节点的传递参数
    const num = e.currentTarget.dataset.num;

    // 设置data
    this.setData({
      num: this.data.num + num,
    });
  },
});
```

```html
<!-- 绑定input事件 -->
<input type="text" bindinput="handleInput" />

<view>{{num}}</view>

<!-- 通过自定义属性传递参数 -->
<button bindtap="handleTap" data-num="{{1}}">+</button>
<!-- 或者冒号分隔 : -->
<button bind:tap="handleTap" data-num="{{-1}}">-</button>
```

## 路由跳转

| 方法            | 说明                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| wx.switchTab    | 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面                                                                                |
| wx.reLaunch     | 关闭所有页面，打开到应用内的某个页面                                                                                            |
| wx.redirectTo   | 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。                                                            |
| wx.navigateTo   | 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层。 |
| wx.navigateBack | 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。                               |

配置文件页面路径 app.json

```json
{
  "pages": ["pages/home/home"]
}
```

跳转需要使用绝对路径

```js
wx.navigateTo({
  url: '/pages/home/home',
});
```

页面参数

- tabBar 页面的路径不能带参数
- 非 tabBar 的页面可以携带参数

```
path?key=value&key2=value2
```

## 尺寸单位 rpx

规定：屏幕宽度 750rpx

计算方式：

```
750px  = 750rpx
1px = 1rpx

iPhone6：
375px = 750rpx
1px = 2rpx
0.5px = 1rpx

```

公式：

```
page_width px = 750rpx

100px = ?

1 px = 750rpx / page_width

100 px = 100 * 750rpx / page_width

=>

width px = width * 750 / page_width rpx

```

属性设置

```css
width: calc(750rpx * 100 / 375);
```

## flex 布局

flex子元素会自动设置为block元素

盒子内元素居中显示

```html
<view class="box"></view>
```

```css
.box {
  display: flex;
  align-items: center;
  flex-direction: column;
}
```

## 样式引入

```css
// 只能是相对路径
@import './common.css';
```

## 选择器和 less

样式重置 reset.less

```css
/* 不支持通配符 error */
* {
  margin: 0,
  padding: 0,
  box-sizing: border-box;
}

/* 需要将*改为所有标签名 ok */
page,
view,
text,
image {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* 设置所有页面高度 */
page {
  height: 100%
}
```

settings.json

```json
"less.compile": {
  "outExt": "wxss"
}
```

less 使用示例

```less
// 定义变量
@color: yellow;

// 使用变量
.text {
  color: @color;
}

// 引入
@import '../../style/reset.less';

.text {
  color: @themeColor;
}
```

style/reset.less

```less
// out: false
// 不单独数输出 reset.css

// 主题颜色
@themeColor: green;
```

## 常见组件

1、view 替代 div

2、text 文本标签，只能嵌套 text，长按可复制

- 长按复制： selectable
- 文本内容解码 decode

3、image 默认宽高： 320px \* 240px

- mode 图片内容和宽高适配
- lazy-load 懒加载

4、swiper 轮播图

- 默认宽高：100% \* 150px
- autoplay 自动轮播
- interval 间隔时间

5、navigator 导航组件

- 块级元素
- url 绝对路径/相对路径
- target self / miniProgram
- open-type 跳转方式

6、rich-text 富文本

7、button 标签

- size 尺寸
- type 颜色
- plain 镂空
- open-type 开放能力(手机号，个人信息，联系客服)

8、icon 图标

9、radio 单选框

10、checkbox 复选框

## 自定义组件

- Page 页面自定义函数放在 data 同层级下
- Components 组件自定义函数放在 methods 下

1、定义组件

目录结构

```
components/
  tabs/
    tabs.json
    tabs.js
    tabs.wxml
    tabs.less
```

tabs.json

```json
{
  "component": true
}
```

tabs.js

```js
Component({
  // 接收父组件传递的参数
  properties: {
    // 接收参数名
    tabs: {
      // 数据类型
      type: Array,
      // 默认值
      value: null,
    },
  },

  // 组件数据
  data: {},

  methods: {
    /**
     * methods中绑定点击事件
      获取被点击索引
      获取原数组
      对数组循环
        每项改为false
        单签项改为true
     */
    handleTabItemTap(e) {
      // 获取索引
      let index = e.target.dataset.index;

      // 向父组件传递点击事件
      this.triggerEvent('change', { index });
    },
  },
});
```

tabs.wxml

```html
<view class="tabs">
  <view class="tab-title">
    <block
      wx:for="{{tabs}}"
      wx:for-item="item"
      wx:for-index="index"
      wx:key="id"
    >
      <view
        class="tab-title-item {{item.isActive ? 'active': ''}}"
        bind:tap="handleTabItemTap"
        data-index="{{index}}"
        >{{item.name}}</view
      >
    </block>
  </view>

  <view class="tab-content">
    <!-- 占位符 -->
    <slot></slot>
  </view>
</view>
```

tabs.less

```less
.tabs {
  .tab-title {
    display: flex;
    padding: 10rpx 0;

    .tab-title-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .active {
      color: red;
      // border-bottom: 5rpx solid currentColor;
    }

    .active::after {
      // display: block;
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50%;
      height: 2rpx;
      transform: translateX(50%);
      background-color: currentColor;
    }
  }

  .tab-content {
  }
}
```

2、页面中使用组件
目录结构

```
pages/
  demo/
    demo.json
    demo.js
    demo.wxml
    demo.less
```

demo.json

```json
{
  "usingComponents": {
    // 使用绝对路径查找组件
    "Tabs": "/components/tabs/tabs"
  }
}
```

demo.js

```js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 0,

    tabs: [
      {
        id: 1,
        name: '首页',
        isActive: true,
      },
      {
        id: 2,
        name: '新闻',
        isActive: false,
      },
      {
        id: 3,
        name: '资讯',
        isActive: false,
      },
      {
        id: 4,
        name: '关于',
        isActive: false,
      },
    ],
  },

  // 处理子组件传递的事件
  handleTabItemTap(e) {
    console.log('handleTabItemTap', e);

    // 获取索引
    let index = e.detail.index;
    // let item = e.target.dataset.item;
    // item.isActive = !item.isActive;
    // 获取数组，严谨的做法是重新拷贝一份数组, 该方法需自己实现
    let tabs = app.$util.deepCopy(this.data.tabs);

    // 修改数组状态
    tabs.forEach((item, idx) => {
      if (idx == index) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });

    // 更新数据
    this.setData({ tabs: tabs });

    // 向父组件传递点击事件
  },
});
```

demo.wxml

```html
<!--pages/demo/demo.wxml-->

<!-- 父组件向子组件传递数据 -->
<Tabs tabs="{{tabs}}" bind:change="handleTabItemTap">
  <block wx:if="{{tabs[0].isActive}}"> 0 </block>
  <block wx:elif="{{tabs[1].isActive}}"> 1 </block>
  <block wx:elif="{{tabs[2].isActive}}"> 2 </block>
  <block wx:elif="{{tabs[3].isActive}}"> 3 </block>
</Tabs>
```

demo.less

```less
// 没有样式
```

## 生命周期

APP 应用生命周期

app.js

```js
App({
  // 1、应用 第一次启动
  onLaunch(){
    // 获取用户个人信息
  }

  // 2、应用 被看到
  onShow(){
    // 对应用数据重置
  }

  // 3、应用 被隐藏
  onHide(){
    // 暂停或清除定时器
  }

  // 4、应用 代码发生报错
  onError(err){
    // 收集代码报错信息
  }

  // 5、应用 入口页面找不到
  onPageNotFound(){
    // 重定向到第二个首页
  }

})

```

Page 页面生命周期

```js
Page({
  // 页面初始数据
  data: {},

  // 页面加载
  onLoad() {
    // 初始化页面数据, 发起网络请求
  },

  // 页面显示
  onShow() {},

  // 页面初次渲染完成
  onReady() {},

  // 页面隐藏
  onHide() {},

  // 页面卸载
  onUnload() {},

  // 下拉动作
  onPullDownRefresh() {},

  // 上拉触底
  onReachBottom() {},

  // 右上角分享转发
  onShareAppMessage() {},

  // 页面滚动
  onPageScroll() {},

  // 页面尺寸发生改变(横屏、竖屏)
  onResize() {},

  // 点击当前页面的tabbar按钮
  onTabItemTap() {},
});
```

Component 组件生命周期

```js
Component({
  created() {},
  attached() {
    // 可以使用setData
  },
  ready() {},
  moved() {},
  detached() {},
});
```
