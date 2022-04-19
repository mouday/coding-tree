# 函数 function

将实现某一功能的代码块封装到一个结构中，实现代码复用

## 函数定义和使用

1、函数定义

```php
function 函数名(参数){
    // 函数体
    return 返回值
}
```

实现复用：一个功能一个函数

2、函数的使用

```php
函数名(参数);
```

3、函数调用的特点：

只要系统在内存中能够找到对应的函数，就可以执行（函数的调用可以在函数定义之前）

3.1、变量使用在定义之前会报错

```php
<?php

echo $a;

$a = 'hello';
// PHP Notice:  Undefined variable
```

3.2、函数可以在定义之前使用

```php
<?php

hello();
// hello


function hello()
{
    echo 'hello';
}

```

原因：先编译后执行

4、函数执行的内存分析

1. 读取代码进入带代码段（编译：将代码变成字节码存储到内存）
2. 根据代码逐行执行

## 函数命名规范

命名规范：字母、数字、下划线组成，不能以数字开头

函数命名遵循以下规则

1. 驼峰法 getName()
2. 下划线法 get_name()

函数名字，在一个脚本周期中，不允许出现同名函数

## 参数详解

1、函数的参数分两种：形参和实参

形参：形式参数，不具有实际意义的参数，函数定义时使用的参数

实参：实际参数，具有实际数据意义的参数，函数调用时使用的参数

形参是实参的载体

```php
// 定义函数，形参可以有多个，逗号分隔
function add($a, $b){
    echo $a + $b;
}

// 调用函数
add(1, 2);
```

注意：

1. PHP 中允许实参个数多余形参，函数内部不使用
2. PHP 中形参个数没有限制
3. 实参不能少于形参

2、默认值

形参可以指定默认值，default value

实参没有传递，就使用用默认值

```php
function add($a, $b = 0){
    echo $a + $b;
}

// 使用实参
add(1, 2);

// 使用默认值
add(1);
```

注意：

1. 默认值放在最后

3、引用传递

值传递：调用函数时，传递实参给形参，通常是（实参的值赋值给形参）

引用传递: 有时候，希望函数内部改变外部的数据（实参的地址赋值给形参）

```php
function 函数名(形参1, &形参2){
    // 函数体
}
```

## 函数体

函数内部的代码（大括号内）

1、函数返回值

return 返回函数执行的结果

如果没有明确返回值，系统默认返回 null;

```php
function add($a, $b){
    return $a + $b;
}

echo add(1, 2);
```

函数返回值，可以是任意类型

return 作用：

1. 返回函数执行结果
2. 结束函数执行，不再执行后面的代码
3. 在文件中使用，返回值给包含的文件, 通常在配置文件中使用

```php
<?php
// config.php

return 'hello';
```

```php
<?php
// main.php

$hello = include_once('config.php');

echo $hello;
// hello
```

## 作用域

变量（常量）能够被访问的区域

- 变量可以在普通代码中定义
- 变量可以在函数内部中定义

1、作用域分类：

- 超全局变量：系统定义的变量（预定义变量：`$_POST`）
  - 没有访问限制
- 全局变量：函数外部定义的变量
  - 只允许在全局空间中使用，理论上函数内部不可用
  - 脚本周期：直到脚本运行结束
- 局部变量：函数内容定义的变量
  - 只允许在函数内部使用
  - 脚本周期：直到函数执行结束

```php
<?php

// 会被保存到超全局变量$GLOBALS 中
$global = '全局变量';

function foo()
{
    $inner = '局部变量';
    // 不能访问到全局变量
    // echo $global;

    // 可以通过超全局变量访问
    echo $GLOBALS['global'];
}

foo();

var_dump($GLOBALS);

```

2、函数内部使用外部变量

1. 通过$GLOBALS
2. 通过参数传值
3. global 关键字
4. 使用常量，常量没有空间限制

## global 关键字

函数内部和外部对同名变量使用同一个内存地址

- 全局空间存在变量，直接引用
- 全局空间不存在，新定义一个全局变量

```php
<?php

// 会被保存到超全局变量$GLOBALS 中
$global = '全局变量';

function foo()
{
    // 直接使用会报错 PHP Notice:  Undefined variable
    // echo $global;


    // 声明为全局变量后，可以使用
    global $global;
    echo $global;
}

foo();

```

## 静态变量 static

在函数内部定义的变量，实现跨函数共享数据,同一个函数被多次调用

```php
<?php
function foo()
{
    // 局部变量
    $num = 1;

    // 静态变量
    static $count = 1;

    echo $num++, $count++, ' ';
    // 11 12 13
}

foo();
foo();
foo();

```

静态变量的原理：

- 系统在编译的时候会对 static 变量初始化：为静态变量赋值
- 函数调用的时候，会自动跳过 static 关键字这一行

静态变量的使用：

1. 统计当前函数的调用次数
2. 统筹函数多次调用得到的不同结果（递归思想）

## 可变函数

当前变量保存的值，是函数的名字，可以使用`变量()`，来调用函数

示例 1

```php
<?php
function foo()
{
    echo 'hello';
}

$foo_func = 'foo';
$foo_func();
// hello

```

示例 2 回调函数

```php
<?php

function callback($a)
{
    return $a * $a;
}

function foo($func, $a)
{
    //  执行一些代码
    return $func($a);
}

$result = foo('callback', 2);
echo $result;
// 4


```

## 匿名函数

没有名字的函数

基本语法

```php
// 定义匿名函数
$foo = function(){
    // 函数体
};

// 调用匿名函数
$foo();
```

示例

```php
<?php

$foo = function () {
    echo 'hello';
};

$foo();
// hello

// 得到一个对象
var_dump($foo);
// object(Closure)#1 (0) {}

```

## 闭包 closure

构成

- 要执行的代码块（由于自由变量）被包含在代码块中，这些自由变量以及由他们引起的对象没有被释放
- 为自由变量提供绑定的计算机环境（作用域）

简单理解：函数内部有一些局部变量在函数执行之后没有被释放，是因为在函数内部还有对应的函数在引用

```php
<?php

function foo()
{
    // 局部变量
    $count = 1;

    // 匿名函数 通过use将外部变量保留给内部使用（闭包）
    $inner_func = function () use ($count) {
        // 不能直接使用，会报错PHP Notice:  Undefined variable
        echo $count++;
    };

    return $inner_func;
};

$func = foo();
$func();
$func();
$func();
// 111

```

## 伪类型

PHP 中实际上不存在的类型

伪类型主要有两种

- Mixed： 混合型，可以是多种 PHP 的数据类型
- Number: 数值型，可以是任意数值类型（整型和浮点型）
