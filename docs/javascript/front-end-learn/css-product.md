# CSS 实战

网站项目目录

```
index.html
css
js
img
```

清除浏览器默认样式

```css
/* reset.css */

* {
  margin: 0;
  padding: 0;
  /* 内减模式 */
  box-sizing: border-box;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
}

/* 清除浮动 */
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
}

.clearfix::after {
  clear: both;
}

body {
  background-color: #f3f5f7;
}

/* 版心居中 */
.wrapper {
  width: 1200px;
  margin: 0 auto;
}
```

控制 input placeholder 样式

```css
input::placeholder {
}
```

调节图片上下对齐

```css
img {
  vertical-align: middel;
}
```

通栏盒子

```css
/* 占据屏幕整个宽度 */
.box {
  width: 100%;
}
```
