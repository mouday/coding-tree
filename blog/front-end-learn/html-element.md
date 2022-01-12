# HTML 标签元素

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

## 12、表单

输入框 input

| type 属性 | 输入框类型 |
| --------- | ---------- |
| text      | 文本框     |
| password  | 密码框     |
| radio     | 单选框     |
| checkbox  | 多选框     |
| file      | 文件选择   |
| submit    | 提交按钮   |
| reset     | 重置按钮   |
| button    | 普通按钮   |

（1）text 文本框

placeholder 占位符

```html
<input type="text" placeholder="文本框占位符" />
```

<output>
<input type="text" placeholder="文本框占位符">
</output>

（2）password 密码框

placeholder 占位符

```html
<input type="password" placeholder="密码框占位符" />
```

<output>
<input type="password" placeholder="密码框占位符">
</output>

（3）radio 单选框

name 属性分组，一个分组只能有一个值被选中

checked 默认选中

```html
<input type="radio" name="sex" value="1" />男
<input type="radio" name="sex" value="2" checked />女
```

<output>
<input type="radio" name="sex" value="1">男
<input type="radio" name="sex" value="2" checked>女
</output>

（4）checkbox 多选框

checked 默认选中

```html
<input type="checkbox" name="city" value="beijing" />北京
<input type="checkbox" name="city" value="shanghai" checked />上海
```

<output>
<input type="checkbox" name="city" value="beijing">北京
<input type="checkbox" name="city" value="shanghai" checked>上海
</output>

（5）file 文件选择

multiple 多选(按住 ctrl 多选)

```html
<input type="file" /> <input type="file" multiple />
```

<output>
<input type="file" >
<input type="file" multiple>
</output>

（6）按钮

- submit 提交按钮
- reset 重置按钮
- button 普通按钮

需要配合 form 表单域使用

属性 value 修改按钮显示的值

```html
<input type="submit" />
<input type="reset" />
<input type="button" value="普通按钮" />
```

<output>
<input type="submit" >
<input type="reset">
<input type="button" value="普通按钮">
</output>

## button 按钮标签

type 取值

- submit 提交按钮
- reset 重置按钮
- button 普通按钮(默认)

```html
<button type="submit">提交按钮</button>
<button type="reset">重置按钮</button>
<button type="button">普通按钮</button>
<button>普通按钮</button>
```

<output>
<button type="submit">提交按钮</button>
<button type="reset">重置按钮</button>
<button type="button">普通按钮</button>
<button>普通按钮</button>
</output>

## select 下拉菜单

```html
<select>
  <option>北京</option>
  <option>上海</option>
  <option selected>广州</option>
  <select></select>
</select>
```

<output>
<select>
  <option>北京</option>
  <option>上海</option>
  <option selected>广州</option>
<select>
</output>

option 选项

默认选中第一项，可以指定默认选中 selected

## textarea 多行文本域

属性

- cols 宽度 列数
- rows 高度 行数

```html
<textarea></textarea>
```

<output>
<textarea></textarea>
</output>

## label 标签

点击文字也可选中选项

两种使用方式等效

```html
<input type="radio" name="sex" id="man" />
<label for="man">男</label>

<label><input type="radio" name="sex" />女</label>
```

<output>
<input type="radio" name="sex" id="man">
<label for="man">男</label>
<label><input type="radio" name="sex">女</label>
</output>

## 无语义标签

- div 块级标签，独占一行
- span 行内标签

## 语义化标签

手机端常用

- header 网页头部
- nav 网页导航
- footer 网页底部
- aside 网页侧边栏
- section 网页区块
- article 网页文章

以上标签和 div 等效，多了语义化

## 字符实体

在网页中显示特殊字符

- 空格 `&nbsp;`
- 版权符 `&copy;`

```html
<!-- 单词之间有5个空格，最后只显示一个空格 -->
hello world

<!-- 实现单词之间有5个空格 -->
hello&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;world

<!-- 版权符号 -->
&copy;
```

<output>

hello world

hello&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;world

&copy;
</output>

## 综合案例

[](demo/form-1.html ':include :type=code')

[](demo/form-1.html ':include height=470')
