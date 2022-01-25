# CSS 装饰

## 1. 垂直对齐 vertical-align

基线(baseline)：浏览器文字类型元素排版中存在用于对齐的基线

| 属性值   | 效果           |
| -------- | -------------- |
| baseline | 默认，基线对齐 |
| top      | 顶部对齐       |
| middle   | 中部对齐       |
| bottom   | 底部对齐       |

```css
vertical-align: middle;
```

示例:

[](demo/css-decorate-1.html ':include :type=code')

[](demo/css-decorate-1.html ':include height=50')

> 浏览器把行内和行内块当做文字处理，文字默认基线对齐

示例一：输入框垂直居中对齐

[](demo/css-decorate-2.html ':include :type=code')

[](demo/css-decorate-2.html ':include height=70')

示例二：图片垂直居中对齐

[](demo/css-decorate-3.html ':include :type=code')

[](demo/css-decorate-3.html ':include height=450')

示例三：图片水平垂直居中

[](demo/css-decorate-4.html ':include :type=code')

[](demo/css-decorate-4.html ':include height=420')

## 2. 光标类型 cursor

| 属性值  | 效果                 |
| ------- | -------------------- |
| default | 默认，箭头           |
| pointer | 小手，提示可点击     |
| text    | 工字型，提示可选择   |
| move    | 十字光标，提示可移动 |

示例：

[](demo/css-decorate-5.html ':include :type=code')

[](demo/css-decorate-5.html ':include height=110')

## 3. 边框圆角 border-radius

```css
/* 单值 4个角一样*/
border-radius: 数字px/百分比;

/* 多值 左上角开始，顺时针赋值，没有赋值看对角*/
border-radius: 左上 右上 右下 左下;
```

（1）正圆

- 盒子必须是正方形
- 设置边框圆角为盒子宽高的一半

示例：

[](demo/css-decorate-6.html ':include :type=code')

[](demo/css-decorate-6.html ':include height=220')

```css
/* 最大值 50% */
border-radius: 50%;
```

（2）胶囊按钮

- 盒子设置为长方形
- 设置边框圆角为高度的一半

```css
border-radius: height/2;
```

示例：

[](demo/css-decorate-7.html ':include :type=code')

[](demo/css-decorate-7.html ':include height=70')

## 4. 溢出部分效果 overflow

溢出部分：盒子内容部分超出盒子范围的区域

| 属性值  | 效果                               |
| ------- | ---------------------------------- |
| visible | 默认，溢出部分可见                 |
| hidden  | 溢出部分隐藏                       |
| scroll  | 无论是否溢出都显示滚动条           |
| auto    | 根据是否溢出，自动显示或隐藏滚动条 |

示例：

[](demo/css-decorate-8.html ':include :type=code')

[](demo/css-decorate-8.html ':include height=120')

## 5. 元素本身隐藏

```css
/* 占位隐藏 */
visibility: hidden;

/* 不占位隐藏（常用） */
display: none;
```

[](demo/css-decorate-9.html ':include :type=code')

[](demo/css-decorate-9.html ':include height=120')

示例：默认隐藏 鼠标悬停显示

[](demo/css-decorate-10.html ':include :type=code')

[](demo/css-decorate-10.html ':include height=220')

## 6. 元素整体透明 opacity

属性值：

- 0-1 之间的数字；
- 0 完全透明，1 完全不透明

示例：

[](demo/css-decorate-11.html ':include :type=code')

[](demo/css-decorate-11.html ':include height=120')

## 7.半透明

```css
background-color: rgba(0, 0, 0, 0.5);
```

示例：

[](demo/css-decorate-12.html ':include :type=code')

[](demo/css-decorate-12.html ':include height=120')

## 精灵图（雪碧图, sprite）

将多张小图合并成一张大图

- 优点：减少服务器发送次数，减轻服务器压力，提高页面加载速度
- 缺点：修改起来比较麻烦

精灵图使用步骤

1. 设置盒子尺寸和小图尺寸相同

2. 将精灵图设置为盒子的背景图片

3. 修改背景图位置

[](demo/css-decorate-13.html ':include :type=code')

[](demo/css-decorate-13.html ':include height=70')

## 背景图片大小 background-size

```css
background-size: 宽度 高度;
```

| 取值    | 场景                                                                 |
| ------- | -------------------------------------------------------------------- |
| 数字+px | 简单方便                                                             |
| 百分比  | 相对于当前盒子自身的宽高百分比                                       |
| contain | 包含，背景图等比缩放，直到不会超出盒子的最大，可能有留白             |
| cover   | 覆盖，背景图等比缩放，直到刚好填满整个盒子没有空白，图片可能显示不全 |

background 连写

```css
background： color image repeat position/size;
```

## 盒子阴影 box-shadow

| 参数     | 作用                       |
| -------- | -------------------------- |
| h-shadow | 必须，水平偏移量，允许负值 |
| v-shadow | 必须，垂直偏移量，允许负值 |
| blur     | 可选，模糊度               |
| spread   | 可选，阴影扩大             |
| color    | 可选，阴影颜色             |
| inset    | 可选，将阴影改为内部阴影   |

[](demo/css-decorate-14.html ':include :type=code')

[](demo/css-decorate-14.html ':include height=120')

## 过渡 transition

- 让元素样式慢慢变化

- 常配合 hover 使用

```css
transition 属性 时长, 属性 时长;
```

| 参数     | 取值                         |
| -------- | ---------------------------- |
| 过渡属性 | 所有属性 all；具体属性 width |
| 过渡时长 | 数字 + s(秒)                 |

注意：

- 过渡需要默认状态和 hover 样式不同，才能有过渡效果
- transition 属性给需要过渡的元素本身加
- transition 属性设置在不同状态中，效果不同
  - 给默认状态设置，鼠标移入移出都有过渡效果
  - 给 hover 状态设置，鼠标移入有过渡效果，移出没有过渡效果

[](demo/css-decorate-15.html ':include :type=code')

[](demo/css-decorate-15.html ':include height=120')
