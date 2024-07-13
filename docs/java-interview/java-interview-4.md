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