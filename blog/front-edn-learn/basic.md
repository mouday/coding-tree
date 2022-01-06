# HTML 基本认知

## 1、常见 5 大浏览器

- IE
- 火狐 FireFox
- 谷歌 Chrome
- Safari
- 欧朋 Opera

## 2、渲染引擎

| 浏览器       | 内核    |
| ------------ | ------- |
| IE           | Trident |
| FireFox      | Gecko   |
| Safari       | Webkit  |
| Chrome/Opera | Blink   |

## 3、Web 标准

保证不同浏览器打开页面显示效果一样

| 构成 | 语言       | 说明     |
| ---- | ---------- | -------- |
| 结构 | HTML       | 页面元素 |
| 表现 | CSS        | 页面样式 |
| 行为 | JavaScript | 页面交互 |

## 4、HTML

Hyper Text Markup Language 超文本标记语言

## 5、hello world

需要设置显示`文件扩展名`

文件扩展名：`.html`

index.html

```html
<strong>hello world</strong>
```

<output>
    <strong>hello world</strong>
</output>

## 6、HTML 骨架

```html
<html>
  <head>
    <title></title>
  </head>

  <body></body>
</html>
```

- html 最外层标签
- head 头部
- title 标题
- body 主体

## 7、开发工具

- Visual Studio Code （首选）
- WebStorm
- Sublime Text
- DreamWeaver
- HBuilder

## 8、VS Code 使用

快速生成 html 网页结构：

- `! + Tab` 多了一行代码`<!DOCTYPE html>`
- `doc + Tab`

快捷键

- 浏览器打开：`Alt + B` / `option⌥ + B`
- ÏLive Server 打开：`[command⌘ + L, command⌘ + O]`

## 9、注释

```html
<!-- 注释内容 -->
```

- 浏览器中不显示注释内容
- 添加和取消注释快捷键：`command + /`

## 10、标签结构

- 双标签 `<开始标签>内容</结束标签>`, 例如：`<strong>内容</strong>`
- 单标签 `<标签 />`, 例如：`<br>`

## 11、标签关系

- 父子关系（嵌套关系）

```html
<html>
  <head></head>
</html>
```

- 兄弟关系（并列关系）

```html
<head></head>
<body></body>
```
