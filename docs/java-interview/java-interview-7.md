# 并发篇-线程池

面试题: 线程池的核心参数

## 线程池的核心参数

1. corePoolSize 核心线程数目
    - 最多保留的线程数

2. maximumPoolSize 最大线程数目
    - 核心线程+救急线程

3. keepAliveTime 生存时间
    - 针对救急线程

4. unit 时间单位
    - 针对救急线程

5. workQueue
    - 阻塞队列

6. threadFactory 线程工厂
    - 可以为线程创建时起个好名字

7. handler 拒绝策略
    - 四种

![](https://mouday.github.io/img/2024/07/21/6zfp6qa.png)

## 创建线程池

自定义线程对象

```java
package learn.thread;

public class MyThread implements Runnable {
    private final String name;

    private final long duration;

    public MyThread(String name, long duration) {
        this.name = name;
        this.duration = duration;
    }

    public MyThread(String name) {
        this(name, 0);
    }

    @Override
    public void run() {
        try {
            System.out.println(Thread.currentThread() + " running");
            Thread.sleep(this.duration);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String toString() {
        return "MyThread{" +
                "name='" + name + '\'' +
                ", duration=" + duration +
                '}';
    }
}

```

创建线程池

```java
package learn.thread;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class ThreadPoolTest {
    public static void main(String[] args) {
        AtomicInteger count = new AtomicInteger(1);
        ArrayBlockingQueue<Runnable> queue = new ArrayBlockingQueue<>(2);

        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(
                2, // corePoolSize
                3, // maximumPoolSize
                0, // keepAliveTime
                TimeUnit.MILLISECONDS, // unit
                queue, // workQueue
                t -> new Thread(t, "Thread-" + count.getAndIncrement()), // threadFactory
                new ThreadPoolExecutor.DiscardOldestPolicy() // handler
        );

        // 前2个任务占据核心线程
        threadPoolExecutor.submit(new MyThread("1", 3600 * 100));

        threadPoolExecutor.submit(new MyThread("2", 3600 * 100));

        // 3个任务占据救急线程
        threadPoolExecutor.submit(new MyThread("3"));

        threadPoolExecutor.submit(new MyThread("4"));

        threadPoolExecutor.submit(new MyThread("5"));

        // 这个个任务会触发拒绝策略
        threadPoolExecutor.submit(new MyThread("6"));
    }
}

```

## 拒绝策略

当线程数到达最大值，并且等待队列满了，就出触发拒绝策略

1、新任务抛出异常

```java
new ThreadPoolExecutor.AbortPolicy()
```

异常
```
java.util.concurrent.RejectedExecutionException
```

2、调用者自己运行任务

```java
new ThreadPoolExecutor.CallerRunsPolicy()
```

3、直接丢弃

```java
new ThreadPoolExecutor.DiscardPolicy()
```

4、丢弃最早加入队列的任务

```java
new ThreadPoolExecutor.DiscardOldestPolicy()
```
