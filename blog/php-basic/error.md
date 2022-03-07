# 错误处理 error

系统执行代码的时候，发现错误就会通过错误处理的形式告知程序员

## 错误分类

1. 语法错误（Parse error）：代码不符合 PHP 的语法规范，编译不通过
2. 运行时错误（runtime error）：编译通过，但是运行代码出错
3. 逻辑错误：写代码不规范导致的逻辑性错误

```php
// 此处 == 写成了 =, 永远为true
if($a = 0){}
```

## 错误代号

PHP 中定义的系统常量

1、系统错误

```
E_PARSE:        编译错误, 代码不会执行
E_ERROR:        fatal error，致命错误，代码不能继续执行
E_WARNING:      warning ，警告错误，不会影响代码执行，但是可能回得到意想不到的结果
E_NOTICE:       notice，通知错误，不影响代码执行
```

2、用户错误

```
E_USER_ERROR
E_USER_WARNING
E_USER_NOTICE
```

3、其他

```
E_ALL
```

所有 E 开头的错误常量都是由一个字节存储，每一种错误占据一个对应的位

如果想进行一些错误的控制，可以使用位运算

例如：

```php
// 排除通知级别
E_ALL & ~E_NOTICE

// 只要警告和通知
E_WARNING | E_NOTICE
```

## 错误触发

- 系统触发
- 人为触发

```php
trigger_error(错误提示);

// 可以传入第二个参数
trigger_error(错误提示, E_USER_ERROR);
```

## 错误显示设置

方式一：全局配置 php.ini

```bash
# 开发环境显示，生产环境不显示
display_errors = On / Off

error_reporting = E_ALL
```

方式二：运行脚本中设置（推荐）

```php
// 设置对应的错误显示级别
error_reporting(级别)

// 获取当前的错误显示级别
error_reporting()

// 设置配置
init_set(配置文件中的配置项, 配置值);

init_set('error_reporting', E_ALL);
init_set('display_errors', 1);
```

## 错误日志设置

实际生产环境中，一般不显示错误

1. 不友好
2. 不安全

一般会将错误保存到日志文件中

ini.php 配置文件

```bash
# 开启日志
log_errors = On

# 指定路径
error_log = 'php_errors.log'
```

## 自定义错误处理

最简单的错误处理

```php
trigger_error(string $error_msg, int $error_type = E_USER_NOTICE): bool
```

自定义错误处理函数

```php
set_error_handler(callable $error_handler, int $error_types = E_ALL | E_STRICT): mixed

// 处理函数
handler(
    int $errno,
    string $errstr,
    string $errfile = ?,
    int $errline = ?,
    array $errcontext = ?
): bool
```

示例

```php
<?php

// 自定义错误处理函数
function error_handler(
    int $errno,
    string $errstr,
    string $errfile,
    int $errline,
    array $errcontext
) {
    // 判断当前错误是否需要处理
    if (!(error_reporting() & $errno)) {
        return;
    }

    echo $errfile, ' ', $errline, ' ';

    // 处理错误类型
    switch ($errno) {
        case E_ERROR:
        case E_USER_ERROR:
            echo 'ERROR';
            break;
        case E_WARNING:
        case E_USER_WARNING:
            echo 'WARNING';
            break;
        case E_NOTICE:
        case E_USER_NOTICE:
            echo 'NOTICE';
            break;
    }
}

// 修改错误处理机制之前
echo $a;
// PHP Notice:  Undefined variable

// 设置错误处理机制，注册自定义函数
set_error_handler('error_handler');

// 修改错误处理机制之后
echo $a;
// NOTICE

```
