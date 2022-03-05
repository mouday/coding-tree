# PHP 常用的系统函数

## 输出函数

- print() 类似 echo 输出，返回 1
- print_r() 类似 var_dump(), 不会输出类型，只会输出值

```php
<?php

echo 'hello world';
// hello world

print 'hello world';
// hello world

print('hello world');
// hello world

print_r('hello world');
// hello world

var_dump('hello world');
// string(11) "hello world"
```

## 时间函数

时间戳：格林威治时间 (`1970-01-01 00:00:00`)到当前时间的秒数

1、date() 格式化一个本地时间／日期

```php
date(string $format, int $timestamp = ?): string

// eg:
echo date('Y-m-d H:i:s');
// 2022-03-03 22:13:20

```

format 参数：[https://www.php.net/manual/zh/function.date.php](https://www.php.net/manual/zh/function.date.php)

2、time() 获取当前时间的时间戳

```php
time(): int

// eg:
echo time();
// 1646316860
```

3、microtime() 返回当前 Unix 时间戳以及微秒数

```php
microtime(bool $get_as_float = ?): mixed
PHP >= 5.0.0 get_as_float=true，microtime() 将返回一个浮点数

// eg:
echo microtime();
// 0.61349600 1646316936

echo microtime(true);
// 1646317009.6239
```

4、strtotime(): 将任何字符串的日期时间描述解析为 Unix 时间戳

```php
strtotime(string $datetime, int $now = time()): int

// eg:
echo strtotime('2022-03-03 22:13:20');
// 1646316800
```

## 数学函数

```
max() 较大值
min() 较小值
rand() 随机整数
mt_rand() 效率比rand()高，建议使用
round() 四舍五入
ceil() 向上取整
floor() 向下取整
pow() 指数
abs() 绝对值
sqrt() 平方根
```

示例

```php
<?php

echo max(1, 10);
// 10

echo min(1, 10);
// 1

echo rand(1, 10);
// 9

echo mt_rand(1, 10);
// 1

echo round(3.14);
// 3

echo ceil(3.14);
// 4

echo floor(3.14);
// 3

echo pow(3, 2);
// 9

echo abs(-10);
// 10

echo sqrt(4);
// 2
```

## 函数有关

```
function_exists() 判断函数是否存在
func_get_arg() 获取指定数值对应的参数
func_get_args() 获取所有参数（数组）
func_num_args() 获取实参数量
```

```php
<?php

function foo($a, $b)
{
    // 获取参数数量
    echo func_num_args();
    // 2

    // 获取指定参数
    echo func_get_arg(0);
    // 2

    // 获取所有参数
    var_dump(func_get_args());
    // array(2) {
    //   [0]=> int(1)
    //   [1]=> int(2)
    // }

}

// 判断函数是否存在
var_dump(function_exists('foo'));
// bool(true)

foo(1, 2);

```
