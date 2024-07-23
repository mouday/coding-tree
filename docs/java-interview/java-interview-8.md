# 并发篇-sleep vs wait

面试题: sleep vs wait

## sleep vs wait

共同点:

`wait()`，`wait(long)`和 `sleep(long)`的效果都是让当前线程暂时放弃 CPU 的使用权，进入阻塞状态

方法归属不同

1. sleep(long)是 Thread 的静态方法
2. 而 wait()，wait(long)都是 Object 的成员方法，每个对象都有

醒来时机不同

1. 执行 sleep(long)和 wait(long)的线程都会在等待相应亳秒后醒来
2. wait(long)和 wait()还可以被 notify 唤醒，wait()如果不唤醒就一直等下去
3. 它们都可以被打断唤醒

锁特性不同

1. wait 方法的调用必须先获取 wait 对象的锁，而 sleep 则无此限制
2. 因wait 方法执行后会释放对象锁，允许其它线程获得该对象锁(我放弃，但你们还可以用）
3. 而 sleep 如果在 synchronized 代码块中执行，并不会释放对象锁(我放弃，你们也用不了)

## wait

锁对象不能直接调用`wait()` 方法

```java
package learn.thread;

public class SleepAndWait {
    private final static Object LOCK = new Object();

    public static void main(String[] args) throws InterruptedException {
        LOCK.wait();
    }
}
```

运行后，直接抛出异常

```
Exception in thread "main" java.lang.IllegalMonitorStateException
    at java.lang.Object.wait(Native Method)
    at java.lang.Object.wait(Object.java:502)
    at learn.thread.SleepAndWait.main(SleepAndWait.java:7)

```

正确的用法，先获取锁对象，再调用`wait()` 方法

```java
package learn.thread;

public class SleepAndWait {
    private final static Object LOCK = new Object();

    public static void main(String[] args) throws InterruptedException {
        synchronized (LOCK){
            LOCK.wait();
        }
    }
}
```

## wait(long)

```java
package learn.thread;


public class SleepAndWait {
    // 锁对象
    private final static Object LOCK = new Object();

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            synchronized (LOCK) {
                try {
                    System.out.println("before waiting");
                    // 让出锁对象
                    LOCK.wait(5000L);
                    System.out.println("after waiting");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "t1");

        t1.start();
        
        Thread.sleep(100);
        
        // 让出锁对象
        synchronized (LOCK) {
            System.out.println("main lock");
        }

    }
}

```
输出结果
```
before waiting
main lock
after waiting
```

## sleep

```java
package learn.thread;


public class SleepAndWait {
    private final static Object LOCK = new Object();

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            synchronized (LOCK) {
                try {
                    System.out.println("before sleep");
                    Thread.sleep(5000L);
                    System.out.println("after sleep");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "t1");

        t1.start();

        Thread.sleep(100);

        synchronized (LOCK) {
            System.out.println("main lock");
        }
    }
}

```

输出结果

```
before sleep
after sleep
main lock
```


## 提前唤醒线程

```java
package learn.thread;


public class SleepAndWait {
    private final static Object LOCK = new Object();

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            synchronized (LOCK) {
                try {
                    System.out.println("before sleep");
                    Thread.sleep(5000L);
                    System.out.println("after sleep");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "t1");

        t1.start();

        Thread.sleep(100);

        // 提前唤醒线程
        t1.interrupt();
        System.out.println("after interrupt");
    }
}

```

输出结果

```
before sleep
after interrupt
java.lang.InterruptedException: sleep interrupted
    at java.lang.Thread.sleep(Native Method)
    at learn.thread.SleepAndWait.lambda$sleep$1(SleepAndWait.java:44)
    at java.lang.Thread.run(Thread.java:750)

```