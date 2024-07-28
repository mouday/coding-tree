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


问题3：索引如何计算?hashcode 都有了，为何还要提供 hash()方法?数组容量为何是2的n次幂?

1. 计算对象的 hashcode()，再进行调用 HashMap 的 hash()方法进行二次哈希，最后 & (capacity - 1)得到索引
2. 二次 hash()是为了综合高位数据，让哈希分布更为均匀
3. 计算索引时，如果是2的n次幂可以使用位与运算代替取模，效率更高; 扩容时 hash & oldcap = 0 的元素留在原来位置，否
则新位置=旧位置+oldcap

4. 但 ①、②、③ 都是为了配合容量为2 的 n次幂时的优化手段，例如 Hashtable 的容量就不是2的n次幂，并不能说哪种设计更优，应该是设计者综合了各种因素，最终选择了使用2的n次幂作为容量

```
求模运算
97 % 16 = 1

可以优化成：按位与运算（效率高，需要是2的n次方才能转换)
97 & (16 - 1) = 1
```

```java
// jdk 18
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

问题4：介绍-下 put 方法流程，1.7 与 1.8有何不同?

1. HashMap 是懒惰创建数组的，首次使用才创建数组
2. 计算索引(桶下标)
3. 如果桶下标还没人占用，创建 Node 占位返回
4. 如果桶下标已经有人占用
    - 已经是 TreeNode 走红黑树的添加或更新逻辑
    - 是普通 Node，走链表的添加或更新逻辑，如果链表长度超过树化阈值，走树化逻辑
5. 返回前检查容量是否超过阈值，一旦超过进行扩容

6. 不同
    - 链表插入节点时，1.7 是头插法，1.8是尾插法
    - 1.7 是大于等于阈值且没有空位时才扩容，而 1.8 是大于阈值就扩容
    - 1.8 在扩容计算 Node 索引时，会优化

问题5：加载因子为何默认是 0.75f

1. 在空间占用与查询时间之间取得较好的权衡
2. 大于这个值，空间节省了，但链表就会比较长影响性能
3. 小于这个值，冲突减少了，但扩容就会更频繁，空间占用多

问题6：多线程下会有啥问题?

1. 扩容死链(1.7)
2. 数据错乱(1.7，1.8)

问题7：key 能否为 null，作为 key 的对象有什么要求?

- HashMap 的 key 可以为 null，但 Map 的其他实现则不然
- 作为 key 的对象，必须实现 hashcode 和 equals，并且 key 的内容不能修改(不可变)

问题8：String 对象的 hashcode() 如何设计的，为啥每次乘的是 31?

- 目标是达到较为均匀的散列效果，每个字符串的 hashcode 足够独特
- 字符串中的每个字符都可以表现为一个数字，称为Si;，其中i的范围是`0~n-1`

散列公式为:

```
S0 * 31^(n-1) + S1 * 31^(n-2) + ... + Si * 31(n-1-i) + ... Sn-1 * 31^0 
```

31 代入公式有较好的散列特性，并且 31 * h 可以被优化为
- 即 `32 * h - h`
- 即 `2^5 *h -h`
- 即 `h<< 5 -h`
