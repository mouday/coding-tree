# CSS 特性

- 继承性
- 层叠性
- 优先级

## 继承性 inherited

（1）子元素有默认继承父元素样式的特点

可继承的常见属性（文字属性都可以继承）

```html
color font-style font-weight font-size font-family text-align text-indent
line-height
```

通过调试工具判断样式是否可继承

（2）继承失效的特殊情况

如果元素有浏览器默认样式，就不继承父元素属性

- a 标签的 color 会继承时效
- h 系列标签的 font-size 会继承失效

示例 ：

[](demo/css-inherited-1.html ':include :type=code')

[](demo/css-inherited-1.html ':include height=200')

## 层叠性

同一个标签设置`不同`的样式

- 样式`层叠叠加`，共同作用在标签上

同一个标签设置`相同`的样式

- 样式会`层叠覆盖`，最终写在最后的样式生效

当样式冲突时，只有当选择器优先级相同时，才能通过层叠性判断结果

> 技巧: 编辑器多行输入

示例 ：

[](demo/css-cascade-1.html ':include :type=code')

[](demo/css-cascade-1.html ':include height=50')

## 优先级

不同选择器具有不同的优先级，

优先级高的选择器样式会覆盖优先级低的选择器

（1）优先级公式（由低到高）

- 继承

- 通配符选择器

- 标签选择器

- 类选择器

- id 选择器

- 行内样式

- !important（慎重使用）

总结：选择范围越小，优先级越高

（2）复合选择器权重叠加

计算公式，每级之间不进位

```
（0, 0, 0, 0）

(行内, ID, 类, 标签)
```

- 第一级 行内样式个数
- 第二级 id 选择器个数
- 第三级 类选择器个数
- 第四级 标签选择器个数

需要注意：

- !important 权重最高
- 继承权重最低

> chrome 调试: 元素右键 -> 检查元素

工具：PxCook [https://www.fancynode.com.cn/pxcook](https://www.fancynode.com.cn/pxcook)

示例 1：

[](demo/css-priority-1.html ':include :type=code')

[](demo/css-priority-1.html ':include height=50')

示例 2：

[](demo/css-priority-2.html ':include :type=code')

[](demo/css-priority-2.html ':include height=50')

示例 3：

[](demo/css-priority-3.html ':include :type=code')

[](demo/css-priority-3.html ':include height=50')

示例 4：

[](demo/css-priority-4.html ':include :type=code')

[](demo/css-priority-4.html ':include height=50')

示例 5：

[](demo/css-priority-5.html ':include :type=code')

[](demo/css-priority-5.html ':include height=50')
