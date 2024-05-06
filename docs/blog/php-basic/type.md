# PHP 数据类型

## 数据类型 data type

- 在 PHP 中指的是存储的数据本身的类型，而不是变量的类型
- PHP 是一种弱类型语言，变量本身没有数据类型

3 大类 8 小类数据类型

- 简单（基本）数据类型：4 个小类
  - 整型 int/integer
  - 浮点型 float/double
  - 字符串型 string
  - 布尔类型 bool/boolean 只有两个值 true/false
- 复合数据类型：2 个小类
  - 对象类型 object
  - 数组类型 array
- 特殊数据类型：2 个小类
  - 资源类型 resource
  - 空类型 null

## 类型转换

- 自动转换：系统根据需求自己判断
- 强制转换：人为根据需要手动转换

```php
<?php
$a = 1; $b = '2';

// 自动转换
echo $a + $b;
// 3

// 强制转换
echo $a + (int)$b;
// 3
```

## 类型判断

```php
// 返回变量所保存数据的类型
bool is_xxx(变量名);
```

```php
<?php
$a = 1;


var_dump(is_int($a));
// bool(true)

var_dump(is_string($a));
// bool(false)
```

获取/设置数据类型

```php
// 获取数据类型
string gettype(变量名)

// 设置数据类型
bool settype(变量名, 类型)
```

```php
<?php
$a = 1;

echo gettype($a);
// integer

// 设置数据类型
settype($a, 'string');

echo gettype($a);
// string

```

区别强制转换

- 强制转换：返回新值
- settype：改变数据本身

## 整数类型

1、定义整数类型的方式

```php
<?php

// 十进制 120 = 1 x 100 + 2 x 10 + 0 x 1
$a = 120;
echo $a . PHP_EOL;

// 二进制 6 = 1 x 4 + 1 x 2 + 0 x 1
$b = 0b110;
echo $b . PHP_EOL;

// 八进制 80 = 1 x 64 + 2 x 8 + 0 x 1
$c = 0120;
echo $c . PHP_EOL;

// 十六进制 288 = 1 x 16 x 16 + 2 x 16 + 0 x 1
$d = 0x120;
echo $d . PHP_EOL;

```

PHP 输出默认都是十进制

2、进制

- 十进制：逢 10 进 1，[0-9]
- 二进制：逢 2 进 1，[0-1]
- 八进制：逢 8 进 1，[0-7]
- 十六进制：逢 16 进 1，[0-9, A-F]

3、进制转换

十进制 转 二进制

方式一：除 2 取余

```
10 -> 1010

10 / 2 = 5 ... 0
5 / 2 = 2 ... 1
2 / 2 = 1 ... 0
1 / 2 = 0...1
```

方式二：取出最大的 2 的 N 次方，直到结果为 0

```
10
= 8 + 2
= 2^3 + 2^1
= 1 x 2^3 + 0 x 2^2 + 1 x 2^1 + 0 x 2^0
=> 1010
```

二进制转十进制

方式：右侧开始，对应位数乘以 2 的 N 次幂，相加求和

```
110
=> 1 x 2^2  + 1 x 2^1 + 0 x 2^0
= 4 + 2 + 0
= 6
```

4、PHP 提供的进制转换方法

```php
// 十进制 转 二进制
echo decbin(12); // 1100

// 十进制 转 八进制
echo decoct(12); // 14

// 十进制 转 十六进制
echo dechex(12); // c
```

## 浮点类型

浮点类型的定义方式

```php
<?php

$f1 = 1.23;
var_dump($f1);
// float(1.23)

// 科学计数法 e表示10为底
$f2 = 1.23e10;
var_dump($f2);
// float(12300000000)

// 整型超过自身存储的大小后会用浮点型存储
$f3 = PHP_INT_MAX + 1;
var_dump($f3);
// float(9.2233720368548E+18)
```

计算机中浮点数都不准确

```php
var_dump(2.1 / 3);
// float(0.7)

var_dump(2.1 / 3 == 0.7);
// bool(false)
```

## 布尔类型

只有两个值：true/false

通常用于判断比较

```php
var_dump(true);
// bool(true)

var_dump(FALSE);
// bool(false)
```

类型比较需要注意：

- empty() 判断数据的值是否为空，不是 null, 如果为空返回 true，不为空返回 false
- isset() 判断数据存储的变量本身是否存在，存在返回 true,不存在返回 false

## PHP 类型比较表:

https://www.php.net/manual/zh/types.comparisons.php

使用 PHP 函数对变量 $x 进行比较

| 表达式           | gettype() | empty() | is_null() | isset() | boolean : if($x) |
| ---------------- | --------- | ------- | --------- | ------- | ---------------- |
| $x = "";         | string    | `true`  | false     | `true`  | false            |
| $x = null;       | NULL      | `true`  | `true`    | false   | false            |
| var $x;          | NULL      | `true`  | `true`    | false   | false            |
| $x is undefined  | NULL      | `true`  | `true`    | false   | false            |
| $x = [];         | array     | `true`  | false     | `true`  | false            |
| $x = ['a', 'b']; | array     | false   | false     | `true`  | `true`           |
| $x = false;      | boolean   | `true`  | false     | `true`  | false            |
| $x = true;       | boolean   | false   | false     | `true`  | `true`           |
| $x = 1;          | integer   | false   | false     | `true`  | `true`           |
| $x = 42;         | integer   | false   | false     | `true`  | `true`           |
| $x = 0;          | integer   | `true`  | false     | `true`  | false            |
| $x = -1;         | integer   | false   | false     | `true`  | `true`           |
| $x = "1";        | string    | false   | false     | `true`  | `true`           |
| $x = "0";        | string    | `true`  | false     | `true`  | false            |
| $x = "-1";       | string    | false   | false     | `true`  | `true`           |
| $x = "php";      | string    | false   | false     | `true`  | `true`           |
| $x = "true";     | string    | false   | false     | `true`  | `true`           |
| $x = "false";    | string    | false   | false     | `true`  | `true`           |
