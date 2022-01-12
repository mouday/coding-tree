# CSS 选择器

## 颜色取值

- 文字颜色 color
- 背景颜色 background-color

| 颜色表示方式   | 表示含义                      | 属性值             |
| -------------- | ----------------------------- | ------------------ |
| 关键词         | 预定义的颜色名                | red、green、blue   |
| rbg 表示法     | 红绿蓝三原色，取值 0-255      | rgb(0,0,0)         |
| rgba 表示法    | 红绿蓝三原色+透明度，取值 0-1 | rgba(0, 0, 0, 0.5) |
| 十六进制表示法 | #开头                         | #000000 简写 #000  |

```html
<p style="color: green;">Hello World!</p>
<p style="color: rgb(0, 255, 0);">Hello World!</p>
<p style="color: rgba(0, 255, 0, 0.5);">Hello World!</p>
<p style="color: #00FF00;">Hello World!</p>
<p style="color: #0F0;">Hello World!</p>
```

<output>
<p style="color: green;">Hello World!</p>
<p style="color: rgb(0, 255, 0);">Hello World!</p>
<p style="color: rgba(0, 255, 0, 0.5);">Hello World!</p>
<p style="color: #00FF00;">Hello World!</p>
<p style="color: #0F0;">Hello World!</p>
</output>

## 水平居中

```css
margin: 0 auto;
```

div、p、h 需要设置元素的宽度，否则会自动撑满父元素

```html
<div
  style="margin: 0 auto; width:200px; border: 1px solid #cccccc; text-align: center;"
>
  Hello World!
</div>
```

<output>
<div style="margin: 0 auto; width:200px; border: 1px solid #cccccc; text-align: center;">Hello World!</div>
</output>

## 选择器

1、复合选择器

（1）后代选择器

```css
父选择器 后代选择器: {
}
```

示例：

[](demo/css-selector-1.html ':include :type=code')

[](demo/css-selector-1.html ':include height=100')

（2）子代选择器

```
父选择器 > 子代选择器: { }
```

示例：

[](demo/css-selector-2.html ':include :type=code')

[](demo/css-selector-2.html ':include height=100')

2、并集选择器

```css
选择器1, 选择器2: {
}
```

示例：

[](demo/css-selector-3.html ':include :type=code')

[](demo/css-selector-3.html ':include height=100')

3、交集选择器

```
选择器1选择器2: { }
```

示例：

[](demo/css-selector-4.html ':include :type=code')

[](demo/css-selector-4.html ':include height=100')

4、hover 伪类选择器

鼠标悬停状态

```css
选择器:hover {
}
```

示例：

[](demo/css-selector-5.html ':include :type=code')

[](demo/css-selector-5.html ':include height=100')

5、Emmet 语法

- 简写语法，快速生成代码
- VS Code 等代码编辑器自带

| 语法       | 示例        | 效果                                      |
| ---------- | ----------- | ----------------------------------------- |
| 标签名     | div         | `<div></div>`                             |
| 类选择器   | .red        | `<div class="red"></div>`                 |
| id 选择器  | #one        | `<div id="one"></div>`                    |
| 交集选择器 | p.red#one   | `<p class="red" id="one"></p>`            |
| 子代选择器 | ul>li       | `<ul><li></li></ul>`                      |
| 内部文本   | ul>li{内容} | `<ul><li>Hello</li></ul>`                 |
| 创建多个   | ul>li\*3    | `<ul><li></li><li></li><li></li></ul>`    |
| 创建自增   | ul>li{$}\*3 | `<ul><li>1</li><li>2</li><li>3</li></ul>` |
| 同级       | div+p       | `<div></div><p></p>`                      |

css 提示

| 单词首字母 | 效果                          |
| ---------- | ----------------------------- |
| fw         | font-weight                   |
| w          | width                         |
| h          | height                        |
| bgc        | backgroud-color               |
| lh         | line-height                   |
| w300+h200  | `width: 300px;height: 200px;` |
