# 标签元素

## 1、标题标签 Heading

`h1~h6`

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

<output>
    <h1>一级标题</h1>
    <h2>二级标题</h2>
    <h3>三级标题</h3>
    <h4>四级标题</h4>
    <h5>五级标题</h5>
    <h6>六级标题</h6>
</output>

同时选中下一个相同字符：`command + D`

特点：

- 独占一行
- 文字加粗
- 文字变大，h1->h6 文字逐渐变小

## 2、段落标签 Paragraph

```html
<p>内容</p>
```

<output>
    <p>内容</p>
</output>

特点：

- 段落之间存在间隙
- 独占一行

## 3、排版标签

（1）换行符 Line Break

```html
第一行文本<br />第二行文本
```

<output>
第一行文本<br/>第二行文本
</output>

特点

- 单标签
- 让文字强制换行

（1）水平分割线 Horizontal Rule

```html
<hr />
```

<output>
<hr/>
</output>

## 4、文本格式化标签

推荐使用后者

- b/strong 加粗
- u/ins 下划线
- i/em 倾斜
- s/del 删除线

```html
<b>加粗</b>
<strong>加粗</strong>

<u>下划线</u>
<ins>下划线</ins>

<i>倾斜</i>
<em>倾斜</em>

<s>删除线</s>
<del>删除线</del>
```

<output>
  <p>
    <b>加粗</b>
    <strong>加粗</strong>
  </p>
  <p>
    <u>下划线</u>
    <ins>下划线</ins>
  </p>
  <p>
    <i>倾斜</i>
    <em>倾斜</em>
  </p>
  <p>
    <s>删除线</s>
    <del>删除线</del>
  </p>
</output>

## 5、媒体标签

（1）图片标签 Image

```html
<img
  src="图片地址"
  alt="替换文本"
  title="提示文本"
  width="宽度"
  height="高度"
/>
```

标签属性：属性名=属性值

## 6、资源路径

（1）当前路径

```html
<img src="image.png" />

<!-- 推荐使用./ -->
<img src="./image.png" />
```

（2）下级路径

```html
<img src="./img/image.png" />
```

（3）上级路径

```html
<img src="../image.png" />
```

## 7、音频标签

```html
<audio
  src="音频地址"
  controls 显示播放控件
  autoplay 自动播放（部分浏览器不支持）
  loop 循环播放
</audio>
```

支持的格式 mp3 wav

## 8、视频标签

```html
<video src="视频地址"
  controls 显示播放控件
  autoplay 自动播放（谷歌浏览器需要配合muted静音播放）
  muted 静音播放
  loop 循环播放
</video>
```

支持的格式 mp4

## 9、链接标签 Anchor

```html
<a href="目标地址">文字内容</a>

<!-- eg: -->
<a href="https://www.baidu.com/">百度</a>
```

<output>
  <a href="https://www.baidu.com/" target="_blank">百度</a>
</output>

属性：

- target: \_self 当前窗口打开（默认） / \_blank 新窗口打开

Tips: chrome 地址栏双击可以看到完整地址

网站的默认首页 index.html

## 10、列表

- 无序列表
- 有序列表
- 自定义列表

（1）无序列表 Unordered List

列表项 List Item

```html
<ul>
  <li>苹果</li>
  <li>香蕉</li>
  <li>桃子</li>
</ul>
```

<output>
<ul>
  <li>苹果</li>
  <li>香蕉</li>
  <li>桃子</li>
</ul>
</output>

（2）有序列表 Ordered List

```html
<ol>
  <li>苹果</li>
  <li>香蕉</li>
  <li>桃子</li>
</ol>
```

<output>
<ol>
  <li>苹果</li>
  <li>香蕉</li>
  <li>桃子</li>
</ol>
</output>

（3）自定义列表 Description List

```html
<dl>
  <dt>水果</dt>
  <dd>苹果</dd>
  <dd>香蕉</dd>
  <dd>桃子</dd>
</dl>
```

<output>
<dl>
  <dt>水果</dt>
  <dd>苹果</dd>
  <dd>香蕉</dd>
  <dd>桃子</dd>
</dl>
</output>

标签含义

- dt Description Term
- dd Description Details

## 11、表格

（1）基本元素

标签含义

- tr Table Row
- th Table Header
- td Table Data

table 属性：

- border 边框宽度
- width 表格宽度
- height 表格高度

[](demo/table-1.html ':include :type=code')

[](demo/table-1.html ':include height=150')

（2）表格结构，可以省略

- thead 表格头部
- tbody 表格主体
- tfoot 表格底部

[](demo/table-2.html ':include :type=code')

[](demo/table-2.html ':include height=170')

（3）合并单元格

- 跨行合并（垂直）rowspan
- 跨列合并（水平）colspan

左上原则

- 上下合并，保留最上
- 左右合并，保留最左

> Tips: 不能跨结构合并

[](demo/table-3.html ':include :type=code')

[](demo/table-3.html ':include height=170')
