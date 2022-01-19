# 浮动

## 结构伪类选择器

- 作用：根据元素在 HTML 中的结构关系查找元素
- 优势：减少对 HTML 中类的依赖，有利于保持代码整洁
- 场景：常用于查找某父级选择器中的子元素

| 选择器              | 说明                          |
| ------------------- | ----------------------------- |
| E:first-child       | 父元素中的第一个子元素 E      |
| E:last-child        | 父元素中的最后一个子元素 E    |
| E:nth-child(n)      | 父元素中的第 n 个子元素 E     |
| E:nth-last-child(n) | 父元素中的倒数第 n 个子元素 E |

n 可以写公式

n 可取值：0 1 2 3 4...

| 功能              | 公式          |
| ----------------- | ------------- |
| 偶数              | 2n even       |
| 奇数              | 2n+1 2n-1 odd |
| 找到前 5 个       | -n+5          |
| 找到从第 5 个往后 | n+5           |

示例：

[](demo/css-float-1.html ':include :type=code')

[](demo/css-float-1.html ':include height=220')

## 伪元素

- 元素：HTML 标签
- 伪元素：CSS 模拟出标签效果，装饰性内容

| 伪元素   | 作用                             |
| -------- | -------------------------------- |
| ::before | 在父元素内容的最前添加一个伪元素 |
| ::after  | 在父元素内容的最后添加一个伪元素 |

注意点：

- 必须设置 content 属性才能生效
- 伪元素默认是行内元素

```css
.box::before {
  content: ''; // 必须加属性
}
```

## 标准流

标准流：又称为文档流，浏览器排列元素的规则

常见标准流的排版规则

- 块级元素：从上往下，垂直布局，独占一行
- 行内元素或行内块元素：从左往右，水平布局，空间不够自动折行

## 浮动

- 早期：图文环绕
- 现在：网页布局

```css
float: left/right;
```

行内元素或行内块元素换行书写会产生一个空格

浮动的特点

- 浮动的标签默认顶对齐，可使用 margin-top 修改距离顶部距离
- 浮动元素会脱离标准流（脱标），在标准流中不占用位置
- 浮动元素比标准流高半个级别，可以覆盖标准流中的元素
- 浮动找浮动，下一个浮动元素会在上一个浮动元素后面，左右浮动
- 浮动标签具备行内块特点：

1. 一行显示多个
2. 可设置宽高

- 浮动之后盒子水平居中不生效 margin: 0 auto;

示例：

[](demo/css-float-3.html ':include :type=code')

[](demo/css-float-3.html ':include height=640')

CSS 书写顺序

- 浮动 / display
- 盒子模型 margin border padding 宽度高度背景色
- 文字样式

常用 css

- 内减模式：box-sizing: border-box;
- 版心居中： margin: 0 auto;

## 清除浮动

清除浮动带来的影响

影响：如果子元素浮动了，此时子元素不能撑开标准流的块级父元素

[](demo/css-float-4.html ':include :type=code')

[](demo/css-float-4.html ':include height=220')

清除浮动的方法

1. 直接设置父元素高度

2. 额外标签

- 在父元素内容的最后添加一个块级元素

- 给添加的块级元素设置 clear:both;

```css
.clearfix {
  clear: both;
}
```

3. 单伪元素清除法

用伪元素替代了额外标签

优点：直接给标签加类即可清除浮动

（1）基本写法

```css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

（2）补充写法

```css
.clearfix::after {
  content: '';
  display: block;
  clear: both;

  /* 兼容低版本IE */
  height: 0;
  visibility: hidden;
}
```

4. 双伪元素清除法

```css
/* 解决外边距塌陷问题 */
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
}

.clearfix::after {
  clear: both;
}
```

5. 给父元素设置 overflow:hidden

```css
overflow: hidden;
```

[](demo/css-float-5.html ':include :type=code')

[](demo/css-float-5.html ':include height=240')
