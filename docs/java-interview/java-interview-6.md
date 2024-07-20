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
   
        NEW,

        RUNNABLE,

        BLOCKED,

        WAITING,

        TIMED_WAITING,

        TERMINATED;
    }
}
```

打印线程状态

```java
public static void testNewRunnableTerminated() {
    Thread t1 = new Thread(() -> {
        System.out.println("running"); // 3
    }, "t1");

    System.out.println(t1.getState()); // 1
    t1.start();
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

