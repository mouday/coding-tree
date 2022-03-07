# 字符串 String

## 字符串类型

- 单引号字符串
- 双引号字符串
- nowdoc 字符串
- heredoc 字符串

示例

```php
<?php

// 1、单引号字符串
$str1 = 'hello world';

var_dump($str1);
// string(11) "hello world"

// 2、双引号字符串
$str2 = "hello world";

var_dump($str2);
// string(11) "hello world"

// 3、nowdoc
$str2 = <<<'EOD'
hello world
EOD;

var_dump($str2);
// string(11) "hello world"


// 4、heredoc
$str1 = <<<EOD
hello world
EOD;

var_dump($str1);
// string(11) "hello world"

```

## 字符串转义

系统会特殊处理：反斜杠 + 字母

例如：

```
\r\n 回车换行
```

PHP 中常用的转义字符

```
\'  在单引号字符串中显示单引号
\"  在双引号字符串中显示双引号
\r  回车（回到当行的行首）
\n  换行
\t  tab
\$  $在PHP中作为变量符号

```

## 单引号和双引号的区别

1、单引号中能够识别`\'`, 而双引号中不能识别`\'`

```php
<?php


$str1 = 'hello \'world';
$str2 = "hello \'world";

var_dump($str1);
// string(12) "hello 'world"
var_dump($str2);
// string(13) "hello \'world"

```

2、单引号中不能识别变量，而双引号中能识别`$`，解析变量

- 变量本省需要与后面内容有区分，保证变量独立性
- 使用变量标识符区分，加一组大括号`{}`

```php
<?php

$a = 'Tom';

$str1 = 'hello $a world';
var_dump($str1);
// string(14) "hello $a world"

$str2 = "hello $a world";
var_dump($str2);
// string(15) "hello Tom world"

$str3 = "hello $aworld";
var_dump($str3);
// PHP Notice:  Undefined variable: aworld

$str4 = "hello {$a}world";
var_dump($str4);
// string(14) "hello Tomworld"

```

## 结构化定义字符串变量的规则

1. 结构化定义字符串对应的边界符有条件
   - 上边界符后面不能有任何内容
   - 下边界符必须最左边顶格
   - 下边界符后面只能跟符号，不能跟任何字符
2. 结构化定义字符串的内部（边界符之间）的所有内容都是字符串本身


```php
<?php
$str1 = <<<EOD
hello world
EOD;

var_dump($str1);
// string(11) "hello world"

```

## 字符串长度

```php
strlen(string $string): int
```

示例

```php
<?php

$str1 = 'hello world';
$str2 = '你好世界'; // 中文在utf8字符集下占3个字节

var_dump(strlen($str1)); // int(11)
var_dump(strlen($str2)); // int(12)
```

多字节字符串扩展模块 mbstring(Multi String)

```php
<?php

$str1 = 'hello world';
$str2 = '你好世界';

var_dump(mb_strlen($str1)); // int(11)
var_dump(mb_strlen($str2)); // int(4)

```

https://www.bilibili.com/video/BV18x411H7qD?p=79&spm_id_from=pageDriver
