# 并发篇

## 线程状态

面试题：线程有哪些状态

目标
- 掌握 Java 线程的状态
- 掌握 Java 线程状态之间的转换
- 辨析两种说法，六种状态 vs 五种状态

Java线程分为6种状态

![](https://mouday.github.io/img/2024/07/20/mqoszuf.png)

线程状态枚举

```java
package java.lang;

public class Thread implements Runnable {
    public enum State {
        // 新建
        NEW,
        
        // 可运行
        RUNNABLE,
        
        // 阻塞
        BLOCKED,

        // 等待
        WAITING,

        // 有时限的等待
        TIMED_WAITING,
        
        // 中结
        TERMINATED;
    }
}
```

## 线程状态装换

### NEW-RUNNABLE-TERMINATED

主线程在`t1`线程启动后，等待其执行完毕再继续执行

```java
public static void testNewRunnableTerminated() {
    Thread t1 = new Thread(() -> {
        // 断点
        System.out.println("running"); // 3
    }, "t1");

    System.out.println(t1.getState()); // 1
    t1.start();

    // 断点
    System.out.println(t1.getState()); // 2
    System.out.println(t1.getState()); // 4
}
```

可以通过IDEA的线程断点，控制每个线程执行的先后顺序

![](https://mouday.github.io/img/2024/07/20/we49mxh.png)

通过调试模式的打印结果

```
NEW
RUNNABLE
running
TERMINATED
```

### RUNNABLE到BLOCKED

先让主线程获取到锁，`t1`线程等待锁的时候，线程状态会从`RUNNABLE`到`BLOCKED`

```java
private static final Object LOCK = new Object();

public static void testBlocked() {
    Thread t1 = new Thread(() -> {
        // 断点
        System.out.println("before running"); // 3

        synchronized (LOCK){
            // 断点
            System.out.println("running"); // 4
        }

    }, "t1");

    t1.start();

    // 断点
    System.out.println(t1.getState()); // 1

    synchronized (LOCK){
        System.out.println(t1.getState()); // 2
    }

    System.out.println(t1.getState()); // 5

}
```

输出结果

```
RUNNABLE
before running
BLOCKED
RUNNABLE
running
```

### RUNNABLE-WAITING

1. `t1`线程先获取到锁，然后执行`wait()` 方法等待
2. 主线程获取到锁之后，可以看到`t1` 线程的状态从`RUNNABLE`到`WAITING`
3. 主线程继续执行`notify()`，此时，`t1` 线程还没有获取到锁，`t1` 线程从`WAITING` 状态到`BLOCKED`状态
4. 主线程释放锁之后，`t1` 线程从`BLOCKED` 状态到`RUNNABLE`状态

```java
public static void testWaiting() {
    Thread t1 = new Thread(() -> {

        synchronized (LOCK){
            // 断点
            System.out.println("before waiting"); // 1

            try {
                LOCK.wait(); // 3
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            // 断点
        }

    }, "t1");

    t1.start();

    System.out.println(t1.getState()); // 2
    // 断点
    synchronized (LOCK){
        System.out.println(t1.getState()); // 4

        LOCK.notify(); // 5

        System.out.println(t1.getState()); // 6
    }

    System.out.println(t1.getState()); // 7

}
```
输出结果

```
RUNNABLE
before waiting
WAITING
BLOCKED
RUNNABLE
```

## 六种状态 vs 五种状态

操作系统层面有五种状态

- 分到 CPU 时间的:`运行`
- 可以分到 CPU 时间的:`就绪`
- 分不到 CPU 时间的:`阻塞`

![](https://mouday.github.io/img/2024/07/21/n3sllud.png)