# Flex 布局

## 百分比布局

百分比布局也叫流式布局

效果：宽度自适应，高度固定

```css
width: 100%;
height: 50px;
```

## Float 浮动布局

- 最初为了实现文字环绕
- Float 布局会造成浮动的盒子脱标，不能撑开父级容器

## Flex 布局

Flex 布局: 弹性布局

- 浏览器提倡的布局模型
- 布局网页更简单，灵活
- 避免浮动脱标的问题
- 非常适合结构化布局

Flex 布局示例

```css
.box {
  display: flex;
}
```

![](img/flex.png)

查看 web 技术浏览器兼容性：

https://caniuse.com/

Flex 布局组成部分

- 弹性容器： 直接父级
- 弹性盒子：直接子级
- 主轴：默认 x 轴
- 侧轴/交叉轴：默认 y 轴

flex 容器下的元素默认水平排列：默认主轴在 x 轴，弹性盒子沿着主轴排列

## 主轴对齐方式 justify-content

Flex 布局模型中，可以调节主轴或侧轴的对齐方式来设置盒子之间的间距

| 属性值        | 作用                                                 |
| ------------- | ---------------------------------------------------- |
| flex-start    | 默认值，起点开始依次排列                             |
| flex-end      | 终点开始依次排列                                     |
| center        | 沿主轴居中排列                                       |
| space-around  | 弹性盒子沿主轴均匀排列，空白间距均分在弹性[盒子两侧] |
| space-between | 弹性盒子沿主轴均匀排列，空白间距均分在相邻[盒子之间] |
| space-evenly  | 弹性盒子沿主轴均匀排列，弹性盒子与容器之间[间距相等] |

示例:

[](demo/flex-1.html ':include :type=code')

[](demo/flex-1.html ':include')

## 侧轴对齐方式 align-items

容器属性 align-items
元素属性 align-self

| 属性值     | 作用                                       |
| ---------- | ------------------------------------------ |
| flex-start | 默认值，起点开始依次排列                   |
| flex-end   | 重点开始依次排列                           |
| center     | 沿侧轴居中排列                             |
| stretch    | 默认值，弹性盒子沿着主轴线被拉伸至铺满容器 |

示例:

[](demo/flex-align.html ':include :type=code')

[](demo/flex-align.html ':include height=900')

## 伸缩比 flex

语法

```css
flex: 数值;
```

> 注意：占用父级剩余尺寸的份数

示例:

[](demo/flex-flex.html ':include :type=code')

[](demo/flex-flex.html ':include height=220')

移动端触发区域默认大小 44x44

## 主轴方向 flex-direction

修改主轴方向，实现改变元素排列方向

主轴默认是水平方向，侧轴默认是垂直方向

| 属性值         | 作用             |
| -------------- | ---------------- |
| row            | 默认值，行，水平 |
| column         | 列，垂直         |
| row-reverse    | 行，从右往左     |
| column-reverse | 列，从下到上     |

示例:

[](demo/flex-direction.html ':include :type=code')

[](demo/flex-direction.html ':include height=220')

## 弹性盒子换行 flex-wrap

实现多行排列效果

语法

```css
felx-wrap: nowrap/wrap;
```

| 属性值 | 作用           |
| ------ | -------------- |
| nowrap | 默认值，不换行 |
| wrap   | 换行           |

## 行对齐方式 align-content

取值和 justify-content 基本相同

示例:

[](demo/felx-wrap.html ':include :type=code')

[](demo/felx-wrap.html ':include height=620')

## Flex 溢出隐藏

示例:

[](demo/flex-overflow.html ':include :type=code')

[](demo/flex-overflow.html ':include height=120')
