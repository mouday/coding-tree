# 并发篇-线程状态

面试题：线程有哪些状态


**要求**

* 掌握 Java 线程六种状态
* 掌握 Java 线程状态转换
* 能理解五种状态与六种状态两种说法的区别

**六种状态及转换**


![](https://mouday.github.io/img/2024/08/01/3fzaiwn.png)

分别是

* 新建
  * 当一个线程对象被创建，但还未调用 start 方法时处于**新建**状态
  * 此时未与操作系统底层线程关联
* 可运行
  * 调用了 start 方法，就会由**新建**进入**可运行**
  * 此时与底层线程关联，由操作系统调度执行
* 终结
  * 线程内代码已经执行完毕，由**可运行**进入**终结**
  * 此时会取消与底层线程关联
* 阻塞
  * 当获取锁失败后，由**可运行**进入 Monitor 的阻塞队列**阻塞**，此时不占用 cpu 时间
  * 当持锁线程释放锁时，会按照一定规则唤醒阻塞队列中的**阻塞**线程，唤醒后的线程进入**可运行**状态
* 等待
  * 当获取锁成功后，但由于条件不满足，调用了 wait() 方法，此时从**可运行**状态释放锁进入 Monitor 等待集合**等待**，同样不占用 cpu 时间
  * 当其它持锁线程调用 notify() 或 notifyAll() 方法，会按照一定规则唤醒等待集合中的**等待**线程，恢复为**可运行**状态
* 有时限等待
  * 当获取锁成功后，但由于条件不满足，调用了 wait(long) 方法，此时从**可运行**状态释放锁进入 Monitor 等待集合进行**有时限等待**，同样不占用 cpu 时间
  * 当其它持锁线程调用 notify() 或 notifyAll() 方法，会按照一定规则唤醒等待集合中的**有时限等待**线程，恢复为**可运行**状态，并重新去竞争锁
  * 如果等待超时，也会从**有时限等待**状态恢复为**可运行**状态，并重新去竞争锁
  * 还有一种情况是调用 sleep(long) 方法也会从**可运行**状态进入**有时限等待**状态，但与 Monitor 无关，不需要主动唤醒，超时时间到自然恢复为**可运行**状态

> ***其它情况（只需了解）***
>
> * 可以用 interrupt() 方法打断**等待**、**有时限等待**的线程，让它们恢复为**可运行**状态
> * park，unpark 等方法也可以让线程等待和唤醒

**五种状态**

五种状态的说法来自于操作系统层面的划分


![](https://mouday.github.io/img/2024/08/01/y5cnmst.png)

* 运行态：分到 cpu 时间，能真正执行线程内代码的
* 就绪态：有资格分到 cpu 时间，但还未轮到它的
* 阻塞态：没资格分到 cpu 时间的
  * 涵盖了 java 状态中提到的**阻塞**、**等待**、**有时限等待**
  * 多出了阻塞 I/O，指线程在调用阻塞 I/O 时，实际活由 I/O 设备完成，此时线程无事可做，只能干等
* 新建与终结态：与 java 中同名状态类似，不再啰嗦

目标
- 掌握 Java 线程的状态
- 掌握 Java 线程状态之间的转换
- 辨析两种说法，六种状态 vs 五种状态

## 线程的状态

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

注意 Java 中的 `RUNNABLE` 涵盖了就绪、运行、阻塞 I/O

![](https://mouday.github.io/img/2024/07/21/n3sllud.png)