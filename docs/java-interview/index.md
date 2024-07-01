# Java面试题

## 目录

基础篇： 
P2 - P8 二分查找法
P9 - P15 冒泡排序
P16 - 18 选择排序
P19 - 21 插入排序
P22 希尔排序
P23 插入与选择推到
P24 - P31 快速排序
P31 - P38 List
P39 - P55 Map *
P56 - P61 单例模式

并发篇：
P63 - P65 线程状态
P66 - P67 线程池
P68 - P67 wait&sleep
P70 lock与synchronized区别
P71 - P73 lock
P74 - P80 volatile *
P81 - P83 乐观锁与悲观锁
P84 - P85 HashTable
P86 - P94 ConcurrentHashMap
P 95- P100 ThreadLocal
虚拟机：
P101 - P104 基础
P105 - P112 垃圾回收
P113 - P116 内存溢出
P117 - P126 类加载
P127 - P130 四种引用
P131 - P133 finalize
框架 Spring 无分类，具有原子性，要看就一次性看完。（循环依赖常考！）

## 基础篇： 

### 二分查找法

编写二分查找代码

1. 前提: 有已排序数组 `A`(假设已经做好)

2. 定义左边界 `L`、右边界 `R`，确定搜索范围，循环执行二分查找(3、4两步)

3. 获取中间索引 `M=Floor((L+R) /2)`

4. 中间索引的值 `A[M]`与待搜索的值`T`进行比较

    - ① `A[M]==T` 表示找到，返回中间索引
    - ② `A[M]>T`，中间值右侧的其它元素都大于`T`，无需比较，中间索引左边去找，`M-1`设置为右边界，重新查找
    - ③ `A[M]<T`，中间值左侧的其它元素都小于`T`，无需比较，中间索引右边去找，`M+1`设置为左边界，重新查找

5. 当`L>R` 时，表示没有找到，应结束循环

代码实现

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

https://www.bilibili.com/video/BV15b4y117RJ/?p=4