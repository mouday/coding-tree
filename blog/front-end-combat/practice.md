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

```css
// 根字号基量 基于375px的设计图
@rootSize: 37.5rem;

.box{
    // px => rem
    width: (50 / @rootSize);
}
```
