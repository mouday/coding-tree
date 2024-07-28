# 并发篇-volatile

面试题: volatile 能否保证线程安全

1、线程安全要考虑三个方面: 可见性、有序性、原子性

- 可见性指，一个线程对共享变量修改，另一个线程能看到最新的结果
- 有序性指，一个线程内代码按编写顺序执行
- 原子性指，一个线程内多行代码以一个整体运行，期间不能有其它线程的代码插队

2、volatile 能够保证共享变量的可见性与有序性，但并不能保证原子性

- 原子性举例
- 可见性举例
- 有序性举例

## 原子性举例

```java
package learn.thread;

import java.util.concurrent.CountDownLatch;

public class AddAndSubtract {
    private static volatile int balance = 10;

    public static void add() {
        balance += 5;
    }

    public static void subtract() {
        balance -= 5;
    }

    public static void main(String[] args) throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(2);

        new Thread(() -> {
            add();
            countDownLatch.countDown();
        }).start();

        new Thread(() -> {
            subtract();
            countDownLatch.countDown();
        }).start();

        countDownLatch.await();

        System.out.println("balance: " + balance);
        // balance: 10
    }
}
```


反编译

```
$ javap -p -v AddAndSubtract.class
```

结果

```
  public static void add();
    descriptor: ()V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=0, args_size=0
         0: getstatic     #2                  // Field balance:I
         3: iconst_5
         4: iadd
         5: putstatic     #2                  // Field balance:I
         8: return
      LineNumberTable:
        line 9: 0
        line 10: 8

  public static void subtract();
    descriptor: ()V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=0, args_size=0
         0: getstatic     #2                  // Field balance:I
         3: iconst_5
         4: isub
         5: putstatic     #2                  // Field balance:I
         8: return
      LineNumberTable:
        line 13: 0
        line 14: 8
```

可以看到分成了4步

1. 读取`静态变量balance`
2. 定义`数字5`
3. 将`静态变量balance` 和 `数字5` 相加
4. 将相加结果写回`静态变量balance`中


用以下代码模拟

```java
package learn.thread;

import java.util.concurrent.CountDownLatch;

public class AddAndSubtract {
    private static volatile int balance = 10;

    public static void add() {
        int b = balance;
        b += 5;

        // 由于某些原因，耗时
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        balance = b;
    }

    public static void subtract() {
        int b = balance;
        b -= 5;
        balance = b;
    }

    public static void main(String[] args) throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(2);

        new Thread(() -> {
            add();
            countDownLatch.countDown();
        }).start();

        new Thread(() -> {
            subtract();
            countDownLatch.countDown();
        }).start();

        countDownLatch.await();

        System.out.println("balance: " + balance);
        // balance: 15
    }
}

```

由于不是原子性操作，所以最终结果并不是我们所期待的10，而是15
