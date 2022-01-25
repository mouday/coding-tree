# CSS 实战 2

## 网站骨架结构标签

```html
<!-- 文档类型声明，HTML5 -->
<!DOCTYPE html>

<!-- 网页语言，中文zh-CN -->
<html lang="en">
  <!-- 网页字符编码 -->
  <meta charset="UTF-8" />

  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

  <!-- 移动端使用 -->
  <meta
    name="viewport"
    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
  />
</html>
```

## SEO

Search Engine Optimization 搜索引擎优化

提升网站排名方法：

1. 竞价排名

2. 将网页制作成 html 后缀

3. 标签语义化，适合的地方使用合适的标签

## SEO 三大标签

1. title 标题

2. description 描述

3. keywords 关键词，英文逗号分隔

```html
<title>Coding Tree</title>

<meta name="description" content="Description" />

<meta name="keywords" content="keywords1,keywords2" />
```

## icon 图标

favicon.ico 文件放根路径

```html
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
```

## 项目结构搭建

文件和目录准备

```
favicon.ico

index.html  首页

css/

  base.css   基本公共的样式 清除浏览器默认样式

  common.css 重复使用样式 网页头，网页尾

  index.css  页面单独的样式

images/       固定使用的图片素材

uploads/      非固定使用的图片素材

```

https://www.bilibili.com/video/BV1Kg411T7t9?p=177&spm_id_from=pageDriver
