# PHP数据类型

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
https://www.bilibili.com/video/BV18x411H7qD?p=26