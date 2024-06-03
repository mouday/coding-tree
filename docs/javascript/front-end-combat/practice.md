# 实战

## 项目目录

```
less/
css/
images/
uploads/
js/
lib/
favicon.ico
index.html
```

## 移动适配

1、less 中使用 rem

```css
// 根字号基量 基于375px的设计图
@rootSize: 37.5rem;

.box {
  // px => rem
  width: (50 / @rootSize);
}
```

2、less 中使用 vw

```css
/* 根字号基量 基于375px的设计图 */
@vw: 3.75vw;

.box: {
  width: (80 / @vw);
}
```

base.css:

[](demo/base.css ':include :type=code')

https://www.bilibili.com/video/BV1xq4y1q7jZ?p=150&spm_id_from=pageDriver
