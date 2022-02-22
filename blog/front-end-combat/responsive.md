# 响应式

## 媒体查询

根据设备宽度的变化，设置差异化样式

```css
@media (媒体查询) {
  /* 样式 */
}

/* eg: */

/* 视口宽度小于等于768px*/
@media (max-width: 768px) {
  /* 样式 */
}

/* 视口宽度大于等于1200px*/
@media (min-width: 1200px) {
  /* 样式 */
}
```

> 多个媒体查询，需要注意顺序，遵循 css 层叠性

## 完整写法

```css
@media 关键词 媒体类型 and (媒体特性) {
    css代码
}
```

1、关键词

- and
- only
- not

2、媒体类型

| 类型名称   | 值     | 描述                      |
| ---------- | ------ | ------------------------- |
| 屏幕       | screen | 带屏幕的设备              |
| 打印预览   | print  | 打印预览模式              |
| 阅读器     | speech | 屏幕阅读模式              |
| 不区分类型 | all    | 默认值，包括以上 3 种情形 |

3、媒体特性

| 特性名称           | 属性                    | 值                             |
| ------------------ | ----------------------- | ------------------------------ |
| 视口宽和高         | width、height           | 数值                           |
| 视口最大宽或最大高 | `max-width`、max-height | 数值                           |
| 视口最小宽或最小高 | `min-width`、min-height | 数值                           |
| 屏幕方向           | orientation             | portrait：竖屏/ landscape 横屏 |

常用写法

```css
@media (min-width: 1200px) {
  /* PC样式 */
}

@media (min-width: 992px) {
  /* 样式 */
}

@media (min-width: 768px) {
  /* >=768px 样式 */
}
```

外链式 css 引入

```html
<link
  rel="stylesheet"
  media="逻辑符 媒体类型 and (媒体特性)"
  href="index.css"
/>

<!-- eg: 注意小括号不能丢 -->
<link rel="stylesheet" media="(min-width: 992px)" href="index-992.css" />
<link rel="stylesheet" media="(min-width: 1200px)" href="index-1200.css" />
```
