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

按照ASCII码排序

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

reset
end
next
prev
current
key

## 其他函数

count
array_push()
array_pop
array_reverse
in_array
array_keys
array_values

https://www.bilibili.com/video/BV18x411H7qD?p=87&spm_id_from=pageDriver