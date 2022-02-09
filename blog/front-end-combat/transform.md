# 平面转换

使用 transform 实现位移、旋转、缩放等效果

平面坐标

```
   -y
-x  0  +x
   +y
```

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
- translate 只给一个值，表示x轴方向移动距离
- 单独设置某个方向的移动：translateX(), translateY()



```css
/* 背景图从右显示 */
background-position: right 0;
```

https://www.bilibili.com/video/BV1xq4y1q7jZ?p=12&spm_id_from=pageDriver