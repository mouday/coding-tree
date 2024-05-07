# CSS 背景相关属性

## 背景颜色

```css
/* 默认背景色是透明；背景色在背景图之下*/
background-color: transparent;
```

## 背景图片

```css
background-image: url(图片路径);
```

示例：

[](demo/css-background-1.html ':include :type=code')

[](demo/css-background-1.html ':include height=540')

## 背景平铺

background-repeat

| 取值      | 效果                           |
| --------- | ------------------------------ |
| repeat    | （默认值）水平和垂直方向都平铺 |
| no-repeat | 不平铺                         |
| repeat-x  | 水平方向平铺（x 轴）           |
| repeat-y  | 垂直方向平铺（y 轴）           |

示例：

[](demo/css-background-2.html ':include :type=code')

[](demo/css-background-2.html ':include height=540')

## 背景位置

```css
background-position: 水平方向位置 垂直方向位置;
```

属性值

方位名词（最多只能表示 9 个位置）

- 水平方向：left center right
- 垂直方向：top center bottom

数字+px（坐标）

- 坐标轴 原点(0,0) 盒子的左上角
- x 轴 水平方向
- y 轴 垂直方向
- 图片左上角与坐标原点重合

示例：

[](demo/css-background-3.html ':include :type=code')

[](demo/css-background-3.html ':include height=540')

## 背景属性连写

```css
/* 不分先后顺序 */
background: color image repeat position;
```

示例：

[](demo/css-background-4.html ':include :type=code')

[](demo/css-background-4.html ':include height=540')

## img 标签和背景图片区别

img

- 不设置高宽会默认显示
- 重要突出的图使用 img

background-image

- 需要设置元素尺寸
- 装饰性图片使用背景图
