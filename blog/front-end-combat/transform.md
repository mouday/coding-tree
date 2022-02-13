# 平面转换 transform

使用 transform 实现位移、旋转、缩放等效果

平面坐标

```
   -y
-x  0  +x
   +y
```

## 位移 translate

语法

```css
transform: translate(水平移动距离，垂直移动距离);
```

取值

- 正负均可
- 像素单位数值
- 百分比（参照盒子自身大小）

配合过渡使用

```css
transition: all 0.5s;
```

示例：(元素居中效果)

[](demo/transform.html ':include :type=code')

[](demo/transform.html ':include height=220')

技巧

- translate 只给一个值，表示 x 轴方向移动距离
- 单独设置某个方向的移动：translateX(), translateY()

```css
/* 背景图从右显示 */
background-position: right 0;
```

示例：双开门

[](demo/transform-2.html ':include :type=code')

[](demo/transform-2.html ':include height=220')

## 旋转 rotate

语法

```css
transform: rotate(角度);
```

角度单位`deg`, 正负数均可

- 正数：顺时针
- 负数：逆时针

示例：

[](demo/transform-rotate.html ':include :type=code')

[](demo/transform-rotate.html ':include height=70')

## 改变转换原点 transform-origin

默认的旋转原点是盒子中心点

语法

```
transform-origin 原点水平位置, 原点垂直位置;
```

取值

- 方位名词 top left right bottom center
- 像素单位数值
- 百分比（参照盒子自身尺寸）

示例：

[](demo/transform-rotate-2.html ':include :type=code')

[](demo/transform-rotate-2.html ':include height=120')

## 多重转换

```css
/* 复合属性 先后顺序不一样，效果也不一样 */
transform: translate() rotate();
```

示例：边走边转

[](demo/transform-translate-rotate.html ':include :type=code')

[](demo/transform-translate-rotate.html ':include height=240')

## 缩放 scale

实现元素从中心点缩放效果

语法

```css
transform: scale(x轴缩放倍数, y轴缩放倍数);

/* x、y等比例缩放 */
transform: scale(缩放倍数);
```

| 效果 | 取值   | 示例       |
| ---- | ------ | ---------- |
| 放大 | 数值>1 | scale(1.2) |
| 不变 | 数值=1 | scale(1)   |
| 缩小 | 数值<1 | scale(0.8) |

示例：

[](demo/transform-scale.html ':include :type=code')

[](demo/transform-scale.html ':include height=270')

https://www.bilibili.com/video/BV1xq4y1q7jZ?p=19&spm_id_from=pageDriver

## 渐变背景 background-image

示例 1：

[](demo/background-image.html ':include :type=code')

[](demo/background-image.html ':include height=220')

示例 2：

[](demo/transform-mask.html ':include :type=code')

[](demo/transform-mask.html ':include height=170')


