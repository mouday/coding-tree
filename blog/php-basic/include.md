# PHP 文件包含include/require

在一个 PHP 脚本中，去将另一个文件包含进来

## 文件包含的作用

实现代码共享重用，协作共同完成一件事

1. 使用被包含文件中的内容：向上包含（所要）

2. 自己的东西可以给别的文件使用：向下包含（给与）

## 文件包含的四种形式

1. include 包含文件
2. include_once 一个文件最多被包含一次
3. require 与 include 相同
4. require_once 与 include_once 相同

语法

```php
include '文件路径';
include('文件路径');
```

- 向上包含：先包含文件，再使用文件中的内容
- 向下包含：先准备内容，然后包含另外的文件，在另外的文件中使用当前内容

示例： 向上包含

```php
<?php
// demo1.php

$PI = 3.14;

```

```php
<?php
// demo.php

include 'demo1.php';

echo $PI;
// 3.14
```

示例： 向下包含

```php
<?php
// demo1.php

$PI = 3.14;

include 'demo.php';
// 3.14
```

```php
<?php
// demo.php

echo $PI;
```

## 文件加载原理

文件加载（include 或者 require）的时候，系统会自动将被包含的文件中的代码嵌入到当前文件中

在哪里加载，就嵌入到哪里

PHP 代码的执行流程

1. 读取 PHP 代码文件
2. 编译：将 PHP 代码转换成字节码（opcode）
3. zendengine 来解析 opcode,按照字节码去进行逻辑运算
4. 转换成对应的 HTML 代码

PHP 中被包含的文件是单独进行编译的

PHP 文件在编译的过程中，如果出现了语法错误，那么会失败（不会执行）；

但是，如果被包含的文件有错误的时候，系统会在执行到包含 include 这条语句的时候才会报错

示例

```php
<?php
// demo.php

// 此处故意少了一个分号
echo $PI
```

```php
<?php
// demo1.php

$PI = 3.14;

// 该行正常输出
echo 'hello';

// 执行到该行会报错
include 'demo.php';
// helloPHP Parse error:  syntax error, unexpected end of file, expecting ',' or ';'
```

## include 和 require 区别

include 和 include_once 区别

- include：系统碰到一次，执行一次，如果多次加载，会执行多次
- include_once：系统碰到多次，也只会执行一次

include 和 require 区别

- 相同点：都是包含文件
- 不同点：包含不到文件时，报错的形式不一样
  - include 如果包含出错代码，会继续执行 Warning
  - require 如果包含出错代码，不在继续执行 Fatal

文件加载路径

1、绝对路径：(`/`)

- 从磁盘的根目录开始（本地绝对路径）
- 从网站根目录开始（网络绝对路径）

2、相对路径：从当前文件所在目录开始的路径
- `.` 表示当前文件夹
- `./` 表示当前路径
- `../` 表示上级目录

绝对路径和相对路径的加载区别

- 绝对路径效率偏低，路径不会出错
- 相对路径效率高，容错出错

```php
// 相对路径
include_once 'demo.php'; // 默认当前文件本身
include_once './demo.php';
include_once '../demo.php';

// 绝对路径
include_once '/lib/demo.php';
```

文件嵌套包含

一个文件包含另个文件，另个文件又包含其他文件

嵌套包含相对路径容易出错
