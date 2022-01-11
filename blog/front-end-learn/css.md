# CSS 层叠样式表

Cascading style sheets

## 语法规则

```
选择器 {
    属性名: 属性值
}
```

## 书写位置

```
<head>
    <title></title>

    <style>
        /* 这里写css */
    </style>
<head>
```

## CSS 引入方式

| 引入方式 | 书写位置                   | 作用范围 | 使用场景     |
| -------- | -------------------------- | -------- | ------------ |
| 内嵌式   | style 标签                 | 当前页面 | 小案例       |
| 外链式   | link 标签引入单独 css 文件 | 多个页面 | 项目中       |
| 行内式   | 标签 style 属性中          | 当前标签 | 配合 js 使用 |

（1）内嵌式

- CSS 写在 style 标签中
- style 标签可以写在页面任意位置，一般放在 head 标签中

[](demo/css-1.html ':include :type=code')

[](demo/css-1.html ':include height=165')

（2）外链式

- CSS 写在单独的`.css`文件中
- 通过 link 标签引入到网页中

[](demo/css-2.css ':include :type=code')

[](demo/css-2.html ':include :type=code')

[](demo/css-2.html ':include height=60')

（3）行内式

- CSS 写在标签 style 属性中

```html
<div style="color: green; background-color: #f1f1f1;">
  这是一段设置了css样式的文字
</div>
```

<output>
<div style="color: green; background-color: #f1f1f1;">这是一段设置了css样式的文字</div>
</output>

## 基础选择器

- 标签选择器
- 类选择器
- id 选择器
- 通配符选择器

（1）标签选择器

```
标签名 {
    属性名：属性值;
}
```

[](demo/css-3.html ':include :type=code')

[](demo/css-3.html ':include height=50')

（2）类选择器

```
.类名{
    属性名：属性值;
}
```

- 合法的类名：数字、字母、下划线、中划线
- 一个元素可以有多个类名，空格隔开

[](demo/css-4.html ':include :type=code')

[](demo/css-4.html ':include height=140')

（3）id 选择器

```
#元素id{
    属性名：属性值;
}
```

- 页面中唯一，不能重复
- 一个标签只能有一个 id
- id 选择器一般与 js 配合使用

[](demo/css-5.html ':include :type=code')

[](demo/css-5.html ':include height=50')

（4）通配符选择器

```
*{
   属性名：属性值;
}
```

- 选中页面所有标签
- 一般用于统一设置页面样式

```css
/* 清除内外边距 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```
