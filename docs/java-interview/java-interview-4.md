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