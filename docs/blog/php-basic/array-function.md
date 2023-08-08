# 数组相关函数

自定义数组打印函数，便于查看

```php

function print_array($array){
    foreach($array as $key => $value){
        echo "$key => $value\n";
    }
}

```

## 排序函数

按照 ASCII 码排序

`sort` 对 array 本身按照值（value）升序排序。(下标重排)

```php
sort(array &$array, int $flags = SORT_REGULAR): bool


// eg:
$arr = ['Tom', 'Jack', 'Steve'];

sort($arr);

print_array($arr);
// 0 => Jack
// 1 => Steve
// 2 => Tom

```

`rsort` 对 array 本身按照值（value）降序排序。

```php
rsort(array &$array, int $flags = SORT_REGULAR): bool


// eg:
$arr = ['Tom', 'Jack', 'Steve'];

rsort($arr);

print_array($arr);
// 0 => Tom
// 1 => Steve
// 2 => Jack
```

`asort` 对 array 自身按照升序进行排序(下标保留)

```php
asort(array &$array, int $flags = SORT_REGULAR): bool


// eg:
$arr = ['Tom', 'Jack', 'Steve'];

asort($arr);

print_array($arr);
// 1 => Jack
// 2 => Steve
// 0 => Tom
```

`arsort` 对 array 本身按照降序排序

```php
arsort(array &$array, int $flags = SORT_REGULAR): bool


// eg:
$arr = ['Tom', 'Jack', 'Steve'];

arsort($arr);

print_array($arr);
// 0 => Tom
// 2 => Steve
// 1 => Jack
```

`ksort` 对 array 本身进行按键（key）升序排序。

```php
ksort(array &$array, int $flags = SORT_REGULAR): bool


// eg:
$arr = ['Tom', 'Jack', 'Steve'];

ksort($arr);

print_array($arr);
// 0 => Tom
// 1 => Jack
// 2 => Steve
```

`krsort` 对 array 本身按照键（key）降序排序。

```php
krsort(array &$array, int $flags = SORT_REGULAR): bool


// eg:
$arr = ['Tom', 'Jack', 'Steve'];

krsort($arr);

print_array($arr);
// 2 => Steve
// 1 => Jack
// 0 => Tom
```

`shuffle` 随机打乱

```php
shuffle(array &$array): bool


// eg:
$arr = ['Tom', 'Jack', 'Steve'];

shuffle($arr);

print_array($arr);
// 0 => Jack
// 1 => Steve
// 2 => Tom
```

## 指针函数

reset 将 array 的内部指针倒回到第一个单元并返回第一个数组单元的值。

```php
reset(array|object &$array): mixed
```

end 将 array 的内部指针移动到最后一个单元并返回其值。

```php
end(array|object &$array): mixed
```

next 将数组中的内部指针向前移动一位

```php
next(array|object &$array): mixed
```

prev 将数组的内部指针倒回一位

```php
prev(array|object &$array): mixed
```

current 返回数组中的当前值

```php
current(array|object $array): mixed
```

key 返回数组中当前单元的键名。

```php
key(array|object $array): int|string|null
```

> 注意：next 和 prev 移动指针，可能移出数组，只能通过 end 或者 reset 重置指针

示例

```php

$arr = [1, 3, 5, 7, 9];

echo next($arr);
echo next($arr);
echo prev($arr);
echo current($arr);
echo key($arr);
echo reset($arr);
echo end($arr);
// 3533119
```

## 其他函数

count 统计数组、Countable 对象中所有元素的数量

```php
count(Countable|array $value, int $mode = COUNT_NORMAL): int

// eg:
$arr = [1, 2, 3, 4, 5];

echo count($arr);
// 5
```

array_push 将 array 当成一个栈，并将传入的变量压入 array 的末尾。

```php
array_push(array &$array, mixed $value1, mixed $... = ?): int

// 和如下效果相同：
$array[] = $var;
```

array_pop 弹出并返回 array 最后一个元素的值

```php
array_pop(array &$array): mixed
```

array_shift 将 array 的第一个单元移出并作为结果返回

```php
array_shift(array &$array): mixed
```

array_unshift 在数组开头插入一个或多个单元

```php
array_unshift(array &$array, mixed ...$values): int
```

数据结构

- 栈 压栈，FILO先进后出
- 队列 排队，FIFO 先进先出

实现栈：
- 前面 array_unshift/array_shift
- 后面 array_push/array_pop

```php
<?php

$arr = [];

// 入栈
array_push($arr, 1);
array_push($arr, 2);
array_push($arr, 3);

// 出栈
echo array_pop($arr), array_pop($arr), array_pop($arr);
// 321
```

实现队列：
- 后进前出 array_push/array_shift
- 前进后出 array_unshift/array_pop

```php
<?php

$arr = [];

// 入队
array_push($arr, 1);
array_push($arr, 2);
array_push($arr, 3);

// 出队
echo array_shift($arr), array_shift($arr), array_shift($arr);
// 123
```

array_reverse 返回一个单元为相反顺序的新数组

```php
array_reverse(array $array, bool $preserve_keys = false): array

// eg
$arr = [1, 2, 3, 4, 5];

print_array(array_reverse($arr));
// 0 => 5
// 1 => 4
// 2 => 3
// 3 => 2
// 4 => 1
```

in_array 检查数组中是否存在某个值

```php
in_array(mixed $needle, array $haystack, bool $strict = false): bool

// eg
$arr = [1, 2, 3, 4, 5];

var_dump(in_array(5, $arr));
// bool(true)

```

array_keys 返回数组中部分的或所有的键名

```php
array_keys(array $array): array

array_keys(array $array, mixed $search_value, bool $strict = false): array


// eg
$arr = ['Tom', 'Jack', 'Steve'];

echo json_encode(array_keys($arr));
// [0,1,2]
```

array_values 返回 input 数组中所有的值并给其建立数字索引。

```php
array_values(array $array): array

// eg
$arr = ['Tom', 'Jack', 'Steve'];

echo json_encode(array_values($arr));
// ["Tom","Jack","Steve"]
```
