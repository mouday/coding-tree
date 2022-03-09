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

## 字符串相关函数

1、转换函数

implode — 将一个一维数组的值转化为字符串

```php
implode(string $glue, array $pieces): string
implode(array $pieces): string

print_r(implode('|', ['北京', '上海', '广州']));
// 北京|上海|广州

```

explode — 使用一个字符串分割另一个字符串

```php
explode(string $separator, string $string, int $limit = PHP_INT_MAX): array


print_r(explode('|', '北京|上海|广州'));
// Array
// (
//     [0] => 北京
//     [1] => 上海
//     [2] => 广州
// )

```

str_split — 将字符串转换为数组

```php
str_split(string $string, int $split_length = 1): array

// 注意：中文字符拆分有问题
print_r(str_split('helloworld', 5));
// Array
// (
//     [0] => hello
//     [1] => world
// )
```

2、截取函数

trim — 去除字符串首尾处的空白字符（或者其他字符）

```php
trim(string $str, string $character_mask = " \t\n\r\0\x0B"): string
```

ltrim — 删除字符串开头的空白字符（或其他字符）

```php
ltrim(string $str, string $character_mask = ?): string
```

rtrim — 删除字符串末端的空白字符（或者其他字符）

```php
rtrim(string $str, string $character_mask = ?): string
```

示例

```php
<?php

var_dump(trim(' 你好，世界 '));
// string(15) "你好，世界"

var_dump(ltrim(' 你好，世界 '));
// string(16) "你好，世界 "

var_dump(rtrim(' 你好，世界 '));
// string(16) " 你好，世界"
```

substr — 返回字符串的子串

```php
substr(string $string, int $offset, ?int $length = null): string

// 注意：中文字符截取有问题
var_dump(substr('Hello World', 6, 5));
// string(5) "World"
```

strstr — 返回 haystack 字符串从 needle 第一次出现的位置开始到结尾的字符串（取文件后缀名）

```php
strstr(string $haystack, mixed $needle, bool $before_needle = false): string

var_dump(strstr('Hello,World', 'W'));
// string(5) "World"
```

3、大小写转换

strtolower — 将字符串转化为小写

```php
strtolower(string $string): string
```

strtoupper — 将字符串转化为大写

```php
strtoupper(string $string): string
```

ucfirst — 将字符串的首字母转换为大写

```php
ucfirst(string $str): string
```

示例
```php
var_dump(strtolower('Hello, World'));
// string(12) "hello, world"

var_dump(strtoupper('Hello, World'));
// string(12) "HELLO, WORLD"

var_dump(ucfirst('hello, world'));
// string(12) "Hello, world"
```

4、查找函数

strpos —  返回 needle 在 haystack 中首次出现的数字位置。

```php
strpos(string $haystack, mixed $needle, int $offset = 0): int

var_dump(strpos('Hello, World', 'o'));
// int(4)
```

strrpos — 返回字符串 haystack 中 needle 最后一次出现的数字位置。
```php
strrpos(string $haystack, string $needle, int $offset = 0): int

var_dump(strrpos('Hello, World', 'o'));
// int(8)
```

5、替换函数

str_replace — 子字符串替换, 该字符串或数组是将 subject 中全部的 search 都被 replace 替换之后的结果。

```php
str_replace(
    mixed $search,
    mixed $replace,
    mixed $subject,
    int &$count = ?
): mixed

var_dump(str_replace('o', 'A', 'Hello, World'));
// string(12) "HellA, WArld"
```


6、格式化函数

printf — 输出格式化字符串

```php
printf(string $format, mixed $args = ?, mixed $... = ?): int
```

sprintf — 返回格式化字符串
```php
sprintf(string $format, mixed ...$values): string
```
格式化参数：[https://www.php.net/manual/zh/function.sprintf.php](https://www.php.net/manual/zh/function.sprintf.php)

```php

// 直接输出，返回数字
$ret1 = printf('my name is %s, and year old is %d', 'Tom', 18);
// my name is Tom, and year old is 18
var_dump($ret1); // int(34)


// 返回字符串
$ret2 = sprintf('my name is %s, and year old is %d', 'Tom', 18);
var_dump($ret2);
// string(34) "my name is Tom, and year old is 18"
```

7、其他

str_repeat — 重复一个字符串

```php
str_repeat(string $input, int $multiplier): string

echo str_repeat('ABC', 5);
// ABCABCABCABCABC
```


str_shuffle — 随机打乱一个字符串
```php
str_shuffle(string $str): string

echo str_shuffle('ABCDEFG');
// GBEACDF
```
