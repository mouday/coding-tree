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

[](demo/flex-1.html ':include height=900')

https://www.bilibili.com/video/BV1xq4y1q7jZ?p=67&spm_id_from=pageDriver
