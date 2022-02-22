# BootStrap

- github：[https://github.com/twbs/bootstrap](https://github.com/twbs/bootstrap)
- Bootstrap 官网：[https://getbootstrap.com/](https://getbootstrap.com/)
- Bootstrap 中文文档：[https://www.bootcss.com/](https://www.bootcss.com/)

## BootStrap 使用步骤

1、引入 css 代码

```html
<!-- Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="./bootstrap@3.4.1/css/bootstrap.min.css" />
```

2、使用样式类名

```html
<!-- 响应式布局版心类 -->
<div class="container"></div>
```

代码示例

[](demo/bootstrap-1.html ':include :type=code')

## BootStrap 栅格系统

实现响应式网页布局

栅格化：网页宽度等分为 12 等份


| | 超小屏幕 |    小屏幕   | 中等屏幕   | 大屏幕 
|- | - | - | -| -|
设备 | 手机 | 平板 | 桌面显示器 | 大桌面显示器
响应断点 | <768px | ≥768px | ≥992px  | ≥1200px
别名| xs | sm | md | lg
容器宽度(container) | 100% | 750px | 970px | 1170px
类前缀 | col-xs-* |  col-sm-* | col-md-* | col-lg-*
列（column）数 | 12 |12 |12 |12 |
槽（gutter）宽 | 30px | 30px | 30px| 30px

https://www.bilibili.com/video/BV1xq4y1q7jZ?p=166&spm_id_from=pageDriver


全局样式
组件
插件
