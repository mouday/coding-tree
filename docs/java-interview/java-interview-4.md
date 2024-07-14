# ArrayList和HashMap

## 面试题ArrayList

目标

- 掌握 ArrayList 的扩容机制
- 掌握 Iterator 的 fail-fast、fail-safe 机制

### ArrayList扩容机制

- `ArrayList()` 会使用长度为零的数组
- `ArrayList(int initialcapacity)` 会使用指定容量的数组
- `ArrayList(collection<? extends E>c)` 会使用c的大小作为数组容量
- `add(Object o)`首次扩容为 `10`，再次扩容为上次容量的 `1.5 倍`
- `addAll(Collection c)`
    - 没有元素时，扩容为 `Math.max(10, 实际元素个数)`
    - 有元素时为 `Math.max(原容量 1.5 倍, 实际元素个数)`

```java
public ArrayList()

public ArrayList(int initialCapacity)

public ArrayList(Collection<? extends E> c)
```

### fail-fast 与 fail-safe

- ArrayList 是 fail-fast 的典型代表，遍历的同时不能修改，尽快失败
- CopyOnWriteArrayList 是 fail-safe 的典型代表，遍历的同时可以修改，原理是读写分离

如下代码

两个线程分别打印输出和修改List对象

- ArrayList 会触发`ConcurrentModificationException` 异常
- CopyOnWriteArrayList 不会触发异常

```java
package com.demo;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class ArrayListTest {

    public static void main(String[] args) {
        //List<String> list = new ArrayList<>();
        // Exception in thread "Thread-0" java.util.ConcurrentModificationException

        List<String> list = new CopyOnWriteArrayList<>();
        
        printAndModifyArray(list);
    }

    private static void printAndModifyArray(List<String> list) {
        list.add("A");
        list.add("B");
        list.add("C");

        new Thread(() -> {
            printArray(list);
        }).start();

        new Thread(() -> {
            modifyArray(list);
        }).start();
    }


    private static void modifyArray(List<String> list) {
        list.add("E");
    }

    private static void printArray(List<String> list) {
        for (String item : list) {
            System.out.println(item);
        }
    }
}
```

## 面试题: LinkedList

### 目标

- 掌握 ArrayList 与 LinkedList 的比较


### ArrayList vs LinkedList

ArrayList

- 基于数组，需要连续内存
- 随机访问快(指根据下标访问)
- 尾部插入、删除性能可以，其它部分插入、删除都会移动数据，因此性能会低
- 可以利用 cpu 缓存，局部性原理

LinkedList

- 基于双向链表，无需连续内存
- 随机访问慢(要沿着链表遍历)
- 头尾插入删除性能高
- 占用内存多

## 面试题：HashMap

问题1：底层数据结构，1.7与 1.8 有何不同?

- 1.7 数组+链表
- 1.8 数组+(链表|红黑树)

问题2：为何要用红黑树，为何一上来不树化，树化值为何是8，何时会树化，何时会退化为链表?

红黑树用来避免 DoS 攻击，防止链表超长时性能下降，树化应当是偶然情况

- hash 表的查找，更新的时间复杂度是 `O(1)`，而红黑树的查找，更新的时间复杂度是 `O(log2_n)`，TreeNode 占用空间也比普通 Node 的大，如非必要，尽量还是使用链表。

- hash 值如果足够随机，则在 hash 表内按泊松分布，在负载因子 `0.75` 的情况下，长度超过`8`的链表出现概率是0.00000006，选择8就是为了让树化几率足够小

树化两个条件:
- 链表长度超过树化阈值8;
- 数组容量>=64

退化为链表:

- 退化情况1: 在扩容时如果拆分树时，树元素个数<=6 则会退化链表

- 退化情况2: remove 树节点时，若 root、root.left、root.right、root.left.left 有一个为 null ，也会退化为链表
