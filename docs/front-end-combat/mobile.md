# 移动端网页适配

## 屏幕尺寸

屏幕对角线的长度，一般用英寸来度量

## PC 分辨率

```
1920 * 1080
1366 * 768
```

- 硬件分辨率 物理分辨率 不可改变，固定的
- 软件分辨率 逻辑分辨率 由软件驱动决定

移动端主流设备分辨率

| 手机型号    | 物理分辨率  | 逻辑分辨率 | 比例关系 |
| ----------- | ----------- | ---------- | -------- |
| iPhone6/7/8 | 750 \* 1334 | 375 \* 667 | 2:1      |

## 视口

- 移动端网页宽度默认：`980px`
- PC 端网页宽度和屏幕宽度相同

视口的作用:

```
网页宽度 = 逻辑宽度
```

视口标签

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

二倍图：750px

## 移动适配

解决方案：

- rem 目前
- vw/vh 未来

## rem

rem 单位

- 相对单位
- rem 单位是相对于 HTML 标签的字号计算结果
- `1rem=1HTML` 字号大小

实现效果：屏幕宽度不同，网页元素尺寸不同（等比缩放）

示例:

[](demo/rem-1.html ':include :type=code')

[](demo/rem-1.html ':include height=120')

使用 rem 需要解决的问题

- 不同设备屏幕尺寸，设置不同的 HMLT 标签字号
- 设备宽度不同，HTML 标签字号设置多少合适

rem 布局方案中，将网页等分成 10 份，HTML 标签的字号为视口宽度 `1/10`

## rem 单位尺寸

确定设计稿对应的设备 HTML 标签字号

```
基准根字号 = 设备宽度（视口宽度）/ 10

rem单位的尺寸 = px单位数值 / 基准根字号

eg:

设计稿设备宽度  375px
设计稿元素宽度  75px
rem宽度 = 75px / (375px / 10) = 2rem
```

## 媒体查询

媒体查询 根据不同的视口宽度，设置差异化 css 样式

```css
@media (媒体特性) {
  /* css样式 */
}

/* eg:  */

@media (width: 375px) {
  html {
    font-size: 37.5px;
  }
}

@media (width: 320px) {
  html {
    font-size: 32px;
  }
}
```

示例:

[](demo/media.html ':include :type=code')

[](demo/media.html ':include height=120')

## flexible.js

flexible.js 适配移动端的 js 框架

原理：根据不同的视口宽度，给网页 html 根节点设置不同的 font-size

github: [https://github.com/amfe/lib-flexible](https://github.com/amfe/lib-flexible)

示例:

[](demo/flexible.js.html ':include :type=code')

[](demo/flexible.js.html ':include height=120')

## 长度单位：vw/vh

- 相对单位
- 相对视口的尺寸计算结果

含义

- vw: viewport width
- vh: viewport height

换算方式

```
1vw = 1/100视口宽度
1vh = 1/100视口高度

vw单位的尺寸 = px单位数值 / ( 1 / 100 * 视口宽度)
```

例如：

```
357px宽的设备

1vw = 357px / 100 = 3.57px
```

```css
// index.less
// 375的设计稿：68 * 29
.box {
  width: (68 / 3.75vw);
  height: (29 / 3.75vw);
}
```

统一使用 vw 或者 vh 作为单位
