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
