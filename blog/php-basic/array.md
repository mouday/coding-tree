# 数组 array

## 数组的概念

数据的组合，将一组数据存储到一个指定的容器中，用变量指向该容器。
可以通过变量一次性得到该容器中的所有数据

## 数组的定义

```php
// 1、使用array关键字
$变量 = array(元素1, 元素2, ...);

// 2、使用中括号
$变量 = [元素1, 元素2, ...];

// 3、隐形定义数组
$变量[] = 值1; // 默认下标是数字，默认从0开始
$变量[下标] = 值; // 下标或者key,可以是数字或字符串
// 下标自动为前面最大+1
```

示例

```php
// 方式一：
$arr = array('Tom', 'Jack', 'Steve');

// 方式二：
$arr = ['Tom', 'Jack', 'Steve'];

// 方式三：
$arr[] = 'Tom';
$arr[] = 'Jack';
$arr[] = 'Steve';

// 输出结果一样
var_dump($arr);
// array(3) {
//   [0]=> string(3) "Tom"
//   [1]=> string(4) "Jack"
//   [2]=> string(5) "Steve"
// }


```

## PHP 数组特点

1、可以整数下标或者字符串下标

- 索引数组：数组下标为整数
- 关联数组：数组下标为字符串
- 混合数组：不同下标可以混合存在

2、数组元素的顺序以放入顺序为准，跟下标无关

3、数字下标的自增长特性

4、特殊值下标的自动转换

```php
<?php

$arr[false] = 'Tom';
$arr[true] = 'Jack';
$arr[null] = 'Steve';

var_dump($arr);
// array(3) {
//   [0] => string(3) "Tom"
//   [1] => string(4) "Jack"
//   [""]=> string(5) "Steve"
// }
```

5、PHP 数组元素没有类型限制

6、PHP 数组元素没有长度限制

## 多维数组

多维数组：数组里的元素又是数组

1、二维数组: 数组中的所有元素都是一维数组

```php
<?php

$arr = [
    [
        'name'=> 'Tom',
        'age'=> 23
    ],
    [
        'name'=> 'Jack',
        'age'=> 24
    ],

];

var_dump($arr);


// array(2) {
//   [0]=> array(2) {
//     ["name"] => string(3) "Tom"
//     ["age"]  =>  int(23)
//   }
//   [1]=> array(2) {
//     ["name"] => string(4) "Jack"
//     ["age"]  => int(24)
//   }
// }

```

2、多维数组：二维数组中的元素可以继续是数组

不建议超过三维以上的数组

3、异型数组（不规则数组）

数组的中的元素不规则，有普通基本变量也有数组

## 数组遍历

普通数组可以通过下标来访问

```php
<?php

$arr = [
    [
        'name'=> 'Tom',
        'age' => 23
    ],
    [
        'name'=> 'Jack',
        'age' => 24
    ],
];

// 访问一维
var_dump($arr[0]);
// array(2) {
//   ["name"] => string(3) "Tom"
//   ["age"]  => int(23)
// }

// 访问二维
var_dump($arr[0]['name']);
// string(3) "Tom"

```

1、Foreach 语法

```php
foreach($数组 as [$key =>] $value){
    // key下标 value值
}
```

示例

```php
<?php

$arr = [
    [
        'name'=> 'Tom',
        'age' => 23
    ],
    [
        'name'=> 'Jack',
        'age' => 24
    ],
];

foreach($arr as $index => $item){
    echo $index, $item['name'], $item['age'] . PHP_EOL;
}
// 0Tom23
// 1Jack24

```

2、foreach 遍历原理

本质是数组内部有一个指针，默认指向数组元素的第一个元素
foreach 就是利用指针取获取数据，同时移动指针

1. foreach 会重置指针，让指针指向第一个元素
2. 进入 foreach 循环，通过指针获取元素
3. 进入循环体执行
4. 重复此过程，直到取不到元素

3、for 循环遍历数组

获取数组长度 count()
要求数组元素下标有规律

```php
<?php

$arr = ['Tom', 'Jack', 'Steve'];

for($i =0, $len =count($arr); $i < $len; $i ++){
    echo '[' . $i . '] ' . $arr[$i] . PHP_EOL;
}
// [0] Tom
// [1] Jack
// [2] Steve
```

4、while 循环

```php
<?php

$arr = ['Tom', 'Jack', 'Steve'];

$i =0;
$len =count($arr);
while($i < $len){
    echo '[' . $i . '] ' . $arr[$i] . PHP_EOL;
    $i ++;
}
// [0] Tom
// [1] Jack
// [2] Steve
```

4、each （7 版本以后已弃用）

```php

$arr = ['Tom', 'Jack', 'Steve'];


// 通过each移动数组指针下移
while($item = each($arr)){
    var_dump($item);
}
// array(4) {
//     [0]        =>  int(0)
//     [1]        =>  string(3) "Tom"
//     ["key"]    =>  int(0)
//     ["value"]  =>  string(3) "Tom"
//   }
```

5、list 按照下标取值

```php
<?php

$arr = ['Tom', 'Jack', 'Steve'];

list($name1, $name2) = $arr;
var_dump($name1, $name2);
// string(3) "Tom"
// string(4) "Jack"
```

6、while + each + list 配合

```php
<?php
$arr = ['Tom', 'Jack', 'Steve'];


// 通过each移动数组指针下移
while(list($key, $value) = each($arr)){
    echo '[' . $key . '] ' . $value . PHP_EOL;
}
// [0] Tom
// [1] Jack
// [2] Steve
```
