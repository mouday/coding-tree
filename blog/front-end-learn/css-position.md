# CSS 定位

## 网页常见布局方式

1. 标准流

- 块级元素独占一行 -> 垂直布局
- 行内元素/行内块元素一行显示多个 -> 水平布局

2. 浮动

- 原本垂直布局的块级元素变成水平布局

3. 定位

- 可以让元素自由的摆放在网页的任意位置
- 一般用于盒子之间的层叠情况
- 让盒子固定在页面某一位置

## 使用定位

1. 设置定位方式

属性名: position

| 定位方式 | 属性值   |
| -------- | -------- |
| 静态定位 | static   |
| 相对定位 | relative |
| 绝对定位 | absolute |
| 固定定位 | fixed    |

2. 设置偏移值

- 偏移值可以设置水平和垂直方向
- 选取原则：就近原则

3. 偏移方向

- 水平距离左边 left
- 水平距离右边 right
- 垂直距离上边 top
- 垂直距离下边 buttom

## 相对定位

- 占有原来的位置
- 相对于自己之前的位置
- 不改变显示模式

```css
position: relative
left: 100px;
top: 100px;
```

> Tips: 如果 4 个定位都有，以 top 和 left 为准

## 绝对定位

- 相对于非静态定位的父元素定位
- 不占有原来的位置
- 改变显示模式
- 默认以浏览器 body 定位

```css
position: absolue
left: 100px;
top: 100px;
```

- 子绝父相：父级相对定位，子级绝对定位
- 绝对定位查找父级的方法：逐级向上，最终是浏览器窗口

## 固定定位

```css
positions: fixed;
```

特点：

- 脱标-不占位置
- 相对于浏览器定位
- 具备行内块特点

## 元素层级关系

1. 不同布局方式元素的层级关系：

```css
标准流 < 浮动 < 定位
```

2. 同层级，后写的会覆盖在先写的元素

3. 设置元素层级

```css
/* 默认值0；数值越大，显示越靠前 */
z-index: 数值;
```

## 案例：子盒子在父盒子中水平居中

方式一：margin

[](demo/css-position-1.html ':include :type=code')

[](demo/css-position-1.html ':include height=520')

方式二：transform

[](demo/css-position-2.html ':include :type=code')

[](demo/css-position-2.html ':include height=520')
