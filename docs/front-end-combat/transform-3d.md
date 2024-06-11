# 空间转换（3D 转换）

空间内位移、旋转、缩放

z 轴的正方向指向用户（屏幕外边方向）

语法

```css
transform: translate3d(x, y, z);

transform: translateX(x);
transform: translateY(y);
transform: translateZ(z);
```

取值：

- 正负均可
- 百分比
- 像素值

## 1、透视

perspective 视线透视效果

透视效果：近大远小，近实远虚

父级添加属性

```css
/* 透视距离(视距): 人眼睛到屏幕的距离 */
perspective: 像素值; /* (800-1200) */
```

示例：

[](demo/transform-3d-perspective.html ':include :type=code')

[](demo/transform-3d-perspective.html ':include height=220')

## 2、空间旋转 rotate

语法

```css
transform: rotateZ(角度);
transform: rotateX(角度);
transform: rotateY(角度);
```

示例：

[](demo/transform-rotate3d.html ':include :type=code')

[](demo/transform-rotate3d.html ':include height=220')

## 左手法则: 判断旋转方向

左手握住旋转轴，拇指指向正值方向，手指弯曲方向为旋转正值方向

## rotate3d（了解）

自定义旋转周的位置及旋转角度

```css
rotate3d(x, y, z, 角度);
```

x, y, z 取 0-1 之间的数字

## 呈现立体图形

让子级元素处于 3d 空间中

```css
transform-style: preserve-3d;
```

示例:

[](demo/transform-style.html ':include :type=code')

[](demo/transform-style.html ':include height=220')

示例: 3D 导航

[](demo/transform-3d-nav.html ':include :type=code')

[](demo/transform-3d-nav.html ':include height=70')

## 总结

```css
/* 位移 */
transform: translate3d(x, y, z);

transform: translateX(x);
transform: translateY(y);
transform: translateZ(z);

/* 旋转，效果相同*/
transform: rotate(角度);
transform: rotateZ(角度);

/* 透视距离 */
perspective: 像素值; /* (800-1200) */

/* 实现3d */
transform-style: preserve-3d;
```

# 空间缩放 scale

```css
transform: scaleX(x);
transform: scaleY(y);
transform: scaleZ(z);
transform: scale3d(x, y, z);
```
