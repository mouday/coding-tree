# Java面试题-基础篇

## 二分查找法

编写二分查找代码

1. 前提: 有已排序数组 `A`(假设已经做好)

2. 定义左边界 `L`、右边界 `R`，确定搜索范围，循环执行二分查找(3、4两步)

3. 获取中间索引 `M=Floor((L+R) /2)`

4. 中间索引的值 `A[M]`与待搜索的值`T`进行比较

    - ① `A[M]==T` 表示找到，返回中间索引
    - ② `A[M]>T`，中间值右侧的其它元素都大于`T`，无需比较，中间索引左边去找，`M-1`设置为右边界，重新查找
    - ③ `A[M]<T`，中间值左侧的其它元素都小于`T`，无需比较，中间索引右边去找，`M+1`设置为左边界，重新查找

5. 当`L>R` 时，表示没有找到，应结束循环

### 代码实现

```java
public class BinarySearch {
    public static void main(String[] args) {
        int[] array =  {1, 5, 6, 8, 10, 20, 30};
        int target = 10;
        System.out.println(binarySearch(array, target));
    }

    /**
     * 二分查找，找到元素返回索引，找不到返回-1
     * @param array
     * @param target
     * @return
     */
    public static int binarySearch(int[] array, int target) {
        // 左边指针
        int left = 0;

        // 右边指针
        int right = array.length - 1;

        // 中间指针
        int middle;

        while (left <= right) {
            middle = (left + right) / 2;

            if (array[middle] == target) {
                return middle;
            } else if (array[middle] > target) {
                right = middle - 1;
            }else {
                left = middle + 1;
            }
        }

        return -1;
    }
}

```

### 整数溢出问题

```java
package com.demo;

public class IntegerOverflow {
    public static void main(String[] args) {
        int left = 0;
        int right = Integer.MAX_VALUE;

        int middle = (left + right) / 2;

        System.out.println(middle);
        // 1073741823

        // 移动左指针
        left = middle + 1;
        middle = (left + right) / 2;
        System.out.println(middle);
        // -536870912
    }
}
```

### 整数溢出解决

1、方式一：

推导过程

```
(left + right) / 2
= left / 2 + right / 2
= left - left/2 + right / 2
= left + (-left/2 + right / 2)
= left + (right - left)/ 2

即：
(left + right) / 2 == left + (right - left)/ 2
```

改进后的方法

```java
package com.demo;

public class IntegerOverflow {
    public static void main(String[] args) {
        int left = 0;
        int right = Integer.MAX_VALUE;
        //int middle = (left + right) / 2;
        int middle = left + (right - left)/ 2;

        System.out.println(middle);
        // 1073741823


        left = middle + 1;
        //middle = (left + right) / 2;
        middle = left + (right - left)/ 2;
        System.out.println(middle);
        // 1610612735
    }
}

```

2、方式二：

使用无符号右移运算

```java
package com.demo;

public class IntegerOverflow {
    public static void main(String[] args) {
        int left = 0;
        int right = Integer.MAX_VALUE;
        //int middle = (left + right) / 2;
        //int middle = left + (right - left)/ 2;
        int middle = (left + right) >>> 1;
        System.out.println(middle);
        // 1073741823


        left = middle + 1;
        //middle = (left + right) / 2;
        //middle = left + (right - left) / 2;
        middle = (left + right) >>> 1;
        System.out.println(middle);
        // 1610612735
    }
}

```

### 相关面试题

解题规则

- 奇数二分取中间
- 偶数二分取中间靠左

1、（京东实习生招聘）有一个有序表为 1,5,8,11,19,22,31,35,40,45,48,49,50 当二分査找值为 48 的结点时，查找成功需要比较的次数

答案：4次

解题：

```
第1次查找13/2= 6+1 = 7
1,5,8,11,19,22,[31],35,40,45,48,49,50

第2次查找6/2= 3
35,40,[45],48,49,50

第3次查找3/2= 1 + 1 = 2
48,[49],50

第4次查找
48
```


2、（美团点评校招）使用二分法在序列 1,4,6,7,15,33,39,50,64,78,75,81,89,96 中查找元素 81 时，需要经过( )次比较

答案：4次

解题：

```
第1次查找14/2=7
1,4,6,7,15,33,[39],50,64,78,75,81,89,96

第2次查找7/2= 3 + 1 =4
50,64,78,[75],81,89,96

第3次查找3/2= 1 + 1 =2
81,[89],96

第4次查找
81
```

3、（北京易道博识社招）在拥有128个元素的数组中二分查找一个数，需要比较的次数最多不超过多少次

答案：7次

常规解题，适用于数据较小的情况

```
128 / 2 = 64
64 / 2 = 32
32 / 2 = 16
16 / 2 = 8
8 / 2 = 4
4 / 2 = 2
2 / 2 = 1
```

对数求解

```
2^n = 128

转换为：

log2(128) = log10(128) / log10(2)

向上取整得到最终结果

$ echo 'l(128)/l(2)' | bc -l
7.00000000000000000007
```

### 注意事项

1. 目前介绍的二分查找是以jdk 中`Arrays.binarySearch` 的实现作为讲解示范，后续选择题的解答思路也是以此为准
2. 但实际上，二分查找有诸多变体，一旦使用变体的实现代码，则左右边界的选取会有变化，进而会影响之前选择题的答案选择

```java
package java.util;

public class Arrays {
    /**
     * Searches a range of
     * the specified array of ints for the specified value using the
     * binary search algorithm.
     * The range must be sorted (as
     * by the {@link #sort(int[], int, int)} method)
     * prior to making this call.  If it
     * is not sorted, the results are undefined.  If the range contains
     * multiple elements with the specified value, there is no guarantee which
     * one will be found.
     *
     * @param a the array to be searched
     * @param fromIndex the index of the first element (inclusive) to be
     *          searched
     * @param toIndex the index of the last element (exclusive) to be searched
     * @param key the value to be searched for
     * @return index of the search key, if it is contained in the array
     *         within the specified range;
     *         otherwise, <tt>(-(<i>insertion point</i>) - 1)</tt>.  The
     *         <i>insertion point</i> is defined as the point at which the
     *         key would be inserted into the array: the index of the first
     *         element in the range greater than the key,
     *         or <tt>toIndex</tt> if all
     *         elements in the range are less than the specified key.  Note
     *         that this guarantees that the return value will be &gt;= 0 if
     *         and only if the key is found.
     * @throws IllegalArgumentException
     *         if {@code fromIndex > toIndex}
     * @throws ArrayIndexOutOfBoundsException
     *         if {@code fromIndex < 0 or toIndex > a.length}
     * @since 1.6
     */
    public static int binarySearch(int[] a, int fromIndex, int toIndex,
                                   int key) {
        rangeCheck(a.length, fromIndex, toIndex);
        return binarySearch0(a, fromIndex, toIndex, key);
    }

    /**
     * Checks that {@code fromIndex} and {@code toIndex} are in
     * the range and throws an exception if they aren't.
     */
    private static void rangeCheck(int arrayLength, int fromIndex, int toIndex) {
        if (fromIndex > toIndex) {
            throw new IllegalArgumentException(
                    "fromIndex(" + fromIndex + ") > toIndex(" + toIndex + ")");
        }
        if (fromIndex < 0) {
            throw new ArrayIndexOutOfBoundsException(fromIndex);
        }
        if (toIndex > arrayLength) {
            throw new ArrayIndexOutOfBoundsException(toIndex);
        }
    }

    // Like public version, but without range checks.
    private static int binarySearch0(int[] a, int fromIndex, int toIndex,
                                     int key) {
        int low = fromIndex;
        int high = toIndex - 1;

        while (low <= high) {
            int mid = (low + high) >>> 1;
            int midVal = a[mid];

            if (midVal < key)
                low = mid + 1;
            else if (midVal > key)
                high = mid - 1;
            else
                return mid; // key found
        }
        return -(low + 1);  // key not found.
    }
}
```

参数解释
- a：要搜索的数组

- fromIndex：指定范围的开始处索引（包含）

- toIndex：指定范围的结束处索引（不包含）

- key：要搜索的值

如果要搜索的元素key在指定的范围内，则返回搜索值的索引；否则返回-1或“-”（插入点）。

## JVM内存结构

### 代码执行流程

![](https://mouday.github.io/img/2024/07/03/79g5lr6.png)

线程私有：
- 程序计数器
- 虚拟机栈

线程共享
- 堆
- 方法区

### 内存溢出

哪些部分会出现内存溢出？

不会出现内存溢出的区域-`程序计数器`

出现 `OutOfMemoryError` 的情况

- `堆` 内存耗尽-对象越来越多，又一直在使用，不能被垃圾回收
- `方法区` 内存耗尽-加载的类越来越多，很多框架都会在运行期间动态产生新的类
- `虚拟机栈` 累积-每个线程最多会占用1M 内存，线程个数越来越多，而又长时间运行不销毁时

出现 `StackOverflowError` 的区域
- `虚拟机栈` 内部-方法调用次数过多
