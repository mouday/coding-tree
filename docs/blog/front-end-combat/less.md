# Less

less 一个 css 预处理器

网站：

- [https://lesscss.org/](https://lesscss.org/)
- [https://less.bootcss.com/](https://less.bootcss.com/)

作用：

- 更简单的完成 css
- 扩充 css 语言，具备逻辑性，计算能力
- 浏览器不识别 Less 代码

用途：

- 保存 less 文件自动生成 css 文件
- less 运算写法完成 px 单位到 rem 单位

VS Code 插件： Easy Less

## 注释

```
// 单行注释  快捷键 ctrl + ，单行注释不会出现在css /

/* 快注释 快捷键 shift + alt + A */
```

## 运算

- 加、减、乘直接书写表达式
- 除法需要添加小括号或.

```css
.box {
  width: 100 + 10px; // 110px;
  width: 100 - 20px; // 80px;
  width: 100 * 2px; // 200px;

  // 除法
  // 推荐小括号写法
  width: (100 / 4px); // 25px;
  // 不支持 height: 100 ./ 4px; // 25px;
}
```

输出

```css
.box {
  width: 110px;
  width: 80px;
  width: 200px;
  width: 25px;
}
```

## 嵌套

使用嵌套写法生成后代选择器

```css
.father {
  color: red;

  .son {
    width: 100px;
  }
}
```

输出

```css
.father {
  color: red;
}

.father .son {
  width: 100px;
}
```

`&` 表示当前选择器

## 变量

存储数据，方便使用和修改

语法

```
// 定义变量
@变量名：值;

// 使用变量
CSS属性：@变量名;
```

示例

```css
@color: red;

.box {
  color: @color;
}
```

输出

```css
.box {
  color: red;
}
```

## 导入 less 文件

```css
// 可以省略后缀.less
@import './other.less';
```

## 导出 css 文件

less 文件夹输出到 css 文件夹

VS Code 插件 Easy Less 设置 settings.json

```json
{
  "less.compile": {
    "out": "../css/"
  }
}
```

控制单个文件导出路径,文件第一行指定输出路径

```css
// out: ./css/
```

禁止导出

```css
// out: false
```

https://www.bilibili.com/video/BV1xq4y1q7jZ?p=130&spm_id_from=pageDriver