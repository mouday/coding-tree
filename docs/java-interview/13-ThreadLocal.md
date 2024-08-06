# 并发篇-ThreadLocal


## 要求
- 掌握 ThreadLocal 的作用与原理
- 掌握 ThreadLocal 的内存释放时机

## 作用
- ThreadLocal 可以实现【资源对象】的线程隔离，让每个线程各用各的【资源对象】，避免争用引发的线程安全问题
- ThreadLocal 同时实现了线程内的资源共享

## 原理
每个线程内有一个 ThreadLocalMap 类型的成员变量，用来存储资源对象

- 调用 set 方法，就是以 ThreadLocal 自己作为 key，资源对象作为 value，放入当前线程的 ThreadLocalMap 集合中
- 调用 get 方法，就是以 ThreadLocal 自己作为 key，到当前线程中查找关联的资源值
- 调用 remove 方法，就是以 ThreadLocal 自己作为 key，移除当前线程关联的资源值

ThreadLocalMap 的一些特点

- key 的 hash 值统一分配
- 初始容量 16，扩容因子 2/3，扩容容量翻倍
- key 索引冲突后用`开放寻址法`解决冲突

## 弱引用 key

ThreadLocalMap 中的 key 被设计为弱引用，原因如下

- Thread 可能需要长时间运行（如线程池中的线程），如果 key 不再使用，需要在内存不足（GC）时释放其占用的内存

## 内存释放时机

- 被动 GC 释放 key
  - 仅是让 key 的内存释放，关联 value 的内存并不会释放
- 懒惰被动释放 value
  - get key 时，发现是 null key，则释放其 value 内存
  - set key 时，会使用启发式扫描，清除临近的 null key 的 value 内存，启发次数与元素个数，是否发现 null key 有关
- 主动 remove 释放 key，value
  - 会同时释放 key，value 的内存，也会清除临近的 null key 的 value 内存
  - 推荐使用它，因为一般使用 ThreadLocal 时都把它作为静态变量（即强引用），因此无法被动依靠 GC 回收

