# PHP 流程控制

代码执行的方向

## 控制分类

- 顺序结构 代码从上往下，顺序执行
- 分支结构 根据条件执行某一段代码
- 循环结构 指定代码块重复执行

## 顺序结构

最基本的结构，所有代码默认都是从上往下依次执行

## 分支结构

1、if 分支

基本语法

```
1、最简if
if(条件表达式){
    满足条件所要执行的代码
}

2、基础if
if(条件){
    满足
}
else{
    不满足
}

3、复杂if
if(条件1){
    满足条件1
}
else if(条件2){
    满足条件2
}
else{
    不满足
}
```

注意: 嵌套层数不宜过多

示例

```php
<?php

$a = 1;

if ($a == 1) {
    echo '星期一';
} else if ($a == 2) {
    echo '星期二';
} else {
    echo '未知';
}

// 星期一
```

2、switch 分支

使用场景：同一个条件有多个值

基本语法

```
switch(条件表达式){
    case 值1: // 判断表达式的结果与值相等
        要执行的代码段1;
        break;
    case 值2:
        要执行的代码段2;
        break;
    ...
    default:
        默认自行的代码;
}
```

switch 匹配成功后，会执行之后的代码，需要使用 break 跳出

```php
<?php

$a = 1;

switch ($a) {
    case 1:
        echo '星期一';
        break;
    case 2:
        echo '星期二';
        break;
    default:
        echo '未知';
}

// 星期一
```

if 和 switch 的选择

- if 能做所有的的分支结构
- switch 处理的条件多，用于固定的条件

## 循环结构

- for 循环
- while 循环
- do-while 循环
- foreach 循环，专门针对数组

1、for 循环

基本语法

```
for(初始化条件; 边界表达式; 条件变化){
   // 循环体
}
```


https://www.bilibili.com/video/BV18x411H7qD?p=37&spm_id_from=pageDriver