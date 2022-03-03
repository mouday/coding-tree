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
