# 并发篇-lock vs synchronized

## 面试题

面试题: lock vs synchronized

**要求**

* 掌握 lock 与 synchronized 的区别
* 理解 ReentrantLock 的公平、非公平锁
* 理解 ReentrantLock 中的条件变量

**三个层面**

不同点

* 语法层面
  * synchronized 是关键字，源码在 jvm 中，用 c++ 语言实现
  * Lock 是接口，源码由 jdk 提供，用 java 语言实现
  * 使用 synchronized 时，退出同步代码块锁会自动释放，而使用 Lock 时，需要手动调用 unlock 方法释放锁
* 功能层面
  * 二者均属于悲观锁、都具备基本的互斥、同步、锁重入功能
  * Lock 提供了许多 synchronized 不具备的功能，例如获取等待状态、公平锁、可打断、可超时、多条件变量
  * Lock 有适合不同场景的实现，如 ReentrantLock， ReentrantReadWriteLock
* 性能层面
  * 在没有竞争时，synchronized 做了很多优化，如偏向锁、轻量级锁，性能不赖
  * 在竞争激烈时，Lock 的实现通常会提供更好的性能

**公平锁**

* 公平锁的公平体现
  * **已经处在阻塞队列**中的线程（不考虑超时）始终都是公平的，先进先出
  * 公平锁是指**未处于阻塞队列**中的线程来争抢锁，如果队列不为空，则老实到队尾等待
  * 非公平锁是指**未处于阻塞队列**中的线程来争抢锁，与队列头唤醒的线程去竞争，谁抢到算谁的
* 公平锁会降低吞吐量，一般不用

**条件变量**

* ReentrantLock 中的条件变量功能类似于普通 synchronized 的 wait，notify，用在当线程获得锁后，发现条件不满足时，临时等待的链表结构
* 与 synchronized 的等待集合不同之处在于，ReentrantLock 中的条件变量可以有多个，可以实现更精细的等待、唤醒控制

语法层面
- synchronized 是关键字，源码在 jvm 中，用 c++ 语言实现
- Lock 是接口，源码由jdk提供，用iava 语言实现
- 使用 synchronized 时，退出同步代码块锁会自动释放，而使用 Lock 时，需要手动调用 unlock 方法释放锁

功能层面

- 二者均属于悲观锁、都具备基本的互斥、同步、锁重入功能
- Lock 提供了许多 synchronized 不具备的功能，例如获取等待状态、公平锁、可打断、可超时、多条件变量
- Lock 有适合不同场景的实现，如 ReentrantLock，ReentrantReadWriteLock

性能层面

- 在没有竞争时，synchronized做了很多优化，如偏向锁、轻量级锁，性能不赖
- 在竞争激烈时，Lock 的实现通常会提供更好的性能

## 阻塞演示

`t1` 线程拿到锁之后，一直不释放，`t2` 线程就会一直等待

`t2` 线程在等待锁，此时 `t2` 线程会进入阻塞状态。


```java
package learn.thread;

import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockDemo {
    private static final ReentrantLock LOCK = new ReentrantLock();

    public static void main(String[] args) throws InterruptedException {
        new Thread(()->{
            LOCK.lock();
            System.out.println("t1 running");
        }, "t1").start();

        Thread.sleep(100);

        new Thread(()->{
            LOCK.lock();
            System.out.println("t2 running");
        }, "t2").start();
    }
}

```

## 使用非公平锁和公平锁

部分源码

```java
public class ReentrantLock
    // 默认使用非公平锁
    public ReentrantLock() {
        sync = new NonfairSync();
    }

    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }
}
```

示例

```java
package learn.thread;


import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockDemo {
    private static final ReentrantLock LOCK = new ReentrantLock(false);
    private static boolean STOP = false;


    public static void main(String[] args) throws InterruptedException {
        new Thread(() -> {
            LOCK.lock();
            System.out.println("t1 running");
            threadSleep(1000);
            LOCK.unlock();
        }, "t1").start();

        Thread.sleep(100);

        new Thread(() -> {
            LOCK.lock();
            System.out.println("t2 running");
            threadSleep(1000);
            LOCK.unlock();
        }, "t2").start();

        Thread.sleep(100);

        new Thread(() -> {
            LOCK.lock();
            System.out.println("t3 running");
            threadSleep(1000);
            LOCK.unlock();
        }, "t3").start();

        while (!STOP) {

            new Thread(() -> {
                try {
                    boolean locked = LOCK.tryLock(10, TimeUnit.MILLISECONDS);

                    if (locked) {
                        System.out.println("t4 running");
                        STOP = true;
                        threadSleep(1000);
                        LOCK.unlock();
                    }

                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

            }).start();

        }


    }

    private static void threadSleep(long time) {
        try {
            Thread.sleep(time);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }


}

```

使用非公平锁，不一定按照入队的顺序，先进先出

```
t1 running
t4 running
t2 running
t3 running
```

使用公平锁，按照入队的顺序，先进先出

```
t1 running
t2 running
t3 running
t4 running
```

## 条件变量 Condition

Condition 是一个接口，用来替代 Object 的 wait、notify、notifyAll 方法

```java
Condition.await(); // Object.wait()
Condition.signalAll(); // Object.notifyAll()
Condition.signal(); // Object.notify()
```

示例

```java
package learn.thread;


import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockDemo {
    private static final ReentrantLock LOCK = new ReentrantLock(true);
    private static final Condition CONDITION = LOCK.newCondition();


    public static void main(String[] args) throws InterruptedException {
        new Thread(() -> {
            LOCK.lock();
            System.out.println("t1 before await");

            try {
                CONDITION.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("t1 after running");
            LOCK.unlock();
        }, "t1").start();

        Thread.sleep(100);

        new Thread(() -> {

            LOCK.lock();
            System.out.println("t2 before await");

            try {
                CONDITION.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("t2 after running");
            LOCK.unlock();
        }, "t2").start();

        Thread.sleep(100);

        new Thread(() -> {
            LOCK.lock();
            System.out.println("t3 before signal");
            CONDITION.signalAll();
            System.out.println("t3 after signal");
            LOCK.unlock();

        }, "t3").start();

    }

}
```

输出
```
t1 before await
t2 before await
t3 before signal
t3 after signal
t1 after running
t2 after running
```