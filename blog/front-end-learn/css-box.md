# CSS 盒模型

## 元素显示模式

- 块级
- 行内
- 行内块

## 块级元素

- 独占一行
- 宽度默认为父元素 100%；高度默认由元素撑开
- 可以设置宽度和高度

代表标签

```
div p h ul li dl dt dd form
header nav footer
```

## 行内元素

- 一行显示多个
- 宽度和高度默认由内容撑开
- 不可以设置宽度和高度

代表标签

```
a span b u i s strong ins em del
```

## 行内块元素

- 一行显示多个
- 可以设置宽度和高度

代表标签

```
input textarea button select
```

## 元素显示模式转换

```css
display: block;
```

| 属性值       | 效果       |
| ------------ | ---------- |
| block        | 块级元素   |
| inline-block | 行内块元素 |
| inline       | 行内元素   |

## HTML 嵌套规范注意点

- 块级元素一般作为大容器;
- 可以嵌套文本、块级元素、行内元素、行内块元素

> p 标签中不要嵌套 div p h 等块级元素

- a 标签内部可以嵌套任意内容

> a 标签不能嵌套 a 标签

## 盒子模型

（1）盒子

标签可以看做是一个盒子

（2）盒子模型：

- 外边距区域 margin
- 边框区域 border
- 内边距区域 padding
- 内容区域 content

（3）盒子内容的宽高

- width
- height

（4）边框

```css
/* 粗细 线条样式 颜色（不分先后顺序）*/
/* 默认4个方向都有*/
border: 10px solid red;

/* 单个方向 */
border-top: 10px solid red;
border-bottom: 10px solid red;
border-left: 10px solid red;
border-right: 10px solid red;

/* 单个属性 */
border-width: 边框粗细
border-style: 边框样式
border-color: 边框颜色
```

线条可选样式

- solid 实线
- dashed 虚线
- dotted 点线

盒子尺寸 = width / height + 边框线

布局顺序：从外到内，从上到下

（5）内边距 padding

```css
/* 可取 4 个值、3 个值、2 个值、1 个值 */
padding: 上 右 下 左;
padding: 上 左右 下;
padding: 上下 左右;
padding: 上下左右;
```

规律：顺时针，值不够看对边

（6）导航实例

[](demo/css-box-1.html ':include :type=code')

[](demo/css-box-1.html ':include height=70')
