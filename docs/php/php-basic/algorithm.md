# 算法 algorithm

1. 排序算法
    1. 冒泡排序 Bubble Sort
    2. 选择排序 Selection Sort
    3. 插入排序 Insert Sort
    4. 快速排序 Quick Sort
    5. 归并排序 Merge Sort

2. 查找算法
    1. 顺序查找
    2. 二分查找

## 冒泡排序

两两比较，顺序错误就交换，直到该数列已经完成排序

算法思路

比较相邻的元素，顺序不对就交换

代码实现

```php
<?php

// 将数组由小到大排序
$arr = [3, 4, 2, 8, 9, 1, 6];

// 每次遍历将最大值放在最右边
for($i = 0, $len = count($arr); $i < $len; $i++){
    // 将大值的放在右边
    for($j = 0, $len = count($arr); $j < $len - 1 - $i; $j++){
        // 如果左边的值比右边的大，就交换位置
        if($arr[$j] > $arr[$j + 1]){
            $temp = $arr[$j];
            $arr[$j] = $arr[$j + 1];
            $arr[$j + 1] = $temp;
        }
    }
}

echo json_encode($arr);
// [1,2,3,4,6,8,9]

```

## 选择排序

每次从待排的数据中选择最小或最大的一个元素，放在起始位置，直到全部待排序的元素排完

```php
<?php

// 将数组由小到大排序
$arr = [3, 4, 2, 8, 9, 1, 6];

// 1、需要选择的次数，每次只能选择一个最大或者最小值
for($i = 0, $len = count($arr); $i < $len; $i++){
    // 2、假设第一个值就是最小值
    $min = $i;

    // 3、将最小值和其他剩余值一一比较
    for($j = 1 + $i, $len = count($arr); $j < $len; $j++){
        // 4、找到最小值
        if($arr[$min] > $arr[$j]){
            $min = $j;
        }
    }

    // 5、当前值与最小值交换位置
    if($min != $i){
        $temp = $arr[$i];
        $arr[$i] = $arr[$min];
        $arr[$min] = $temp;
    }
}

echo json_encode($arr);
// [1,2,3,4,6,8,9]

```

## 插入排序

将一个数据插入到已排序数据中

```php
<?php

// 将数组由小到大排序
$arr = [3, 4, 2, 8, 9, 1, 6];

// 1、循环次数，插入次数 length - 1，第一个数已经是有序的了
for($i = 1, $len = count($arr); $i < $len; $i++){
    
    // 待插入数据
    $temp = $arr[$i];

    // 2、前面的序列是已排序区域
    for($j = $i - 1; $j >= 0; $j--){
        // 3、将该值插入到合适的位置
        if($arr[$j] > $temp){
            // 有序数组后移一位
            $arr[$j + 1] = $arr[$j];
            $arr[$j] = $temp;
        } else{
            // 该值最大，位置正确
            break;
        }
    }
}

echo json_encode($arr);
// [1,2,3,4,6,8,9]

```

优化版本, 减少交换次数

```php
<?php

// 将数组由小到大排序
$arr = [3, 4, 2, 8, 9, 1, 6];

// 1、循环次数，插入次数 length - 1，第一个数已经是有序的了
for($i = 1, $len = count($arr); $i < $len; $i++){
    
    // 待插入数据
    $temp = $arr[$i];
    
    // 记录插入位置
    $insert_index = -1;
    
    // 2、前面的序列是已排序区域
    for($j = $i - 1; $j >= 0; $j--){
        // 3、将该值插入到合适的位置
        if($arr[$j] > $temp){
            // 有序数组后移一位
            $arr[$j + 1] = $arr[$j];
            // $arr[$j] = $temp;
            $insert_index = $j;
        } else{
            // 该值最大，位置正确
            break;
        }
    }

    // 如果位置有变动，交换数据
    if($insert_index > -1){
        $arr[$insert_index] = $temp;
    }
}

echo json_encode($arr);
// [1,2,3,4,6,8,9]
```

## 快速排序

不稳定排序

冒泡排序的改进，通过一趟排序将要排序的数据分割为独立的两部分，其中一部分的数据都比另外一部分所有数据都要小，然后重复此过程

排序步骤：

1. 从数组中选出一个元素（通常是第一个），作为参照
2. 定义两个数组，将目标数组中剩余元素与参照元素挨个比较，小的放到一组，大的放到另一组
3. 第二步执行完后，前后数组顺序不确定，但是确定了自己的位置
4. 将得到的小数组按照第1步第3步，重复操作（子问题）
5. 回溯最小数组（第一个元素）

```php
<?php

// 将数组由小到大排序
$arr = [3, 4, 2, 8, 9, 1, 6];

/**
 * 快速排序
 */
function quick_sort($arr){
    // 递归出口
    $len = count($arr);
    if($len <= 1){
        return $arr;
    }

    // 定义两个数组，分别存小数和大数
    $left = [];
    $right = [];
    for($i = 1; $i < $len; $i++){
        // 比较：小的放左边，大的放右边
        if($arr[$i] < $arr[0]){
            $left[] = $arr[$i];
        } else {
            $right[] = $arr[$i];
        }
    }

    // 递归点：将两个数组继续排序
    $left = quick_sort($left);
    $right = quick_sort($right);

    // 和并数组返回
    return array_merge($left, [$arr[0]], $right);
}

echo json_encode(quick_sort($arr));
// [1,2,3,4,6,8,9]



```

## 归并排序

分治算法

二路归并
```php
<?php

// 将数组由小到大排序
$arr1 = [2, 3, 4, 8];
$arr2 = [1, 6, 9];

// 定义归并空间
$arr3 = [];
while(count($arr1) && count($arr2)){
    // 每次取出一个最小值
    $arr3[] = $arr1[0] < $arr2[0] ? array_shift($arr1): array_shift($arr2);
}
// 合并结果
$ret = array_merge($arr3, $arr1, $arr2);

echo json_encode($ret);
// [1,2,3,4,6,8,9]

```

```php
<?php

// 将数组由小到大排序
$arr = [3, 4, 2, 8, 9, 1, 6];

function merge_sort($arr){
    // 递归出口
    $len = count($arr);
    if($len <= 1){
        return $arr;
    }

    // 拆分为两个数组
    $middle_index = floor($len/2);
    $left = array_slice($arr, 0, $middle_index);
    $right = array_slice($arr, $middle_index);

    // 递归点
    $left = merge_sort($left);
    $right = merge_sort($right);
    
    // 定义归并空间
    $merge_array = [];
    while(count($left) && count($right)){
        // 每次取出一个最小值
        $merge_array[] = $left[0] < $right[0] ? array_shift($left): array_shift($right);
    }
    
    // 合并结果
    return array_merge($merge_array, $left, $right);

}

// 合并结果
$ret = merge_sort($arr);

echo json_encode($ret);
// [1,2,3,4,6,8,9]



```

## 顺序查找

按照列表顺序，依次查找
```php
<?php


/**
 * 顺序查找，逐项匹配
 */
function order_find($arr, $value){
    for($i = 0, $len = count($arr); $i < $len; $i++){
        // 判断
        if($arr[$i] == $value){
            return $i;
        }
    }

    return -1;
}

$arr = [3, 4, 2, 8, 9, 1, 6];

$ret = order_find($arr, 1);
var_dump($ret);
// int(5)
```

## 二分查找

要求元素组有序，先与中间节点比较，分成两个子表，确定继续在哪个子表查找，递归进行

折半查找

```php
<?php
/**
 * 二分查找，从中间的值开始比较
 */
function binary_find($arr, $value){

    // 边界条件
    $left = 0;
    $right = count($arr);

    // 循环匹配
    while($left <= $right){
        // 每次循环获取中间值
        $middle = floor(($left + $right) / 2);

        if($value > $arr[$middle]){
            $left = $middle + 1;
        } else if($value < $arr[$middle]){
            $right = $middle - 1;
        } else{
            return $middle;
        }
    }
    
    return -1;
}

// 有序数组
$arr = [1, 2, 4, 8, 9, 13, 16];

$ret = binary_find($arr, 9);
var_dump($ret);
// float(4)

```