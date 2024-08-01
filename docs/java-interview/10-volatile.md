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

## 可见性举例

示例

```java
package learn.thread;

public class ForeverLoop {
    private static boolean stop = false;

    public static void main(String[] args) {
        new Thread(() -> {

            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            stop = true;
            System.out.println("stop");

        }).start();

        foreverLoop();
    }

    private static void foreverLoop() {
        int i = 0;
        while (!stop) {
            i++;
        }
        System.out.println("i=" + i);
    }
}

```

输出

```
stop
```

实际发现，上面的代码并不会停止，不符合预期

原因：

![](https://mouday.github.io/img/2024/07/29/jyoplob.png)

上图可见，每个CPU对共享变量的操作都是将内存中的共享变量复制一份副本到自己高速缓存中，然后对这个副本进行操作。

如果没有正确的同步，即使CPU0修改了某个变量，这个已修改的值还是只存在于副本中，此时CPU1需要使用到这个变，从内存中读取的还是修改前的值，这就是其中一种可见性问题。


```java
package learn.thread;

public class ForeverLoop {
    private static boolean stop = false;

    public static void main(String[] args) {
        // 修改线程
        new Thread(() -> {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            stop = true;
            System.out.println("stop");

        }).start();

        // 读取线程
        new Thread(() -> {

            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }


            System.out.println("stop=" + stop);

        }).start();
    }
}

```

可以看到，一个线程修改数据，另一个线程读取数据，是可以读取到的

```
stop
stop=true
```

### 方式一

通过增加参数`-Xint`，禁用JIT，该代码就能停止运行

```bash
$ javac learn/thread/ForeverLoop.java

$ java -Xint learn/thread/ForeverLoop
stop
i=21533683
```

### 方式二

减少停止时间为1毫秒，也能正常运行完成

```java
package learn.thread;

public class ForeverLoop {
    private static boolean stop = false;

    public static void main(String[] args) {
        new Thread(() -> {

            try {
                // 修改停止时间为1毫秒
                Thread.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            stop = true;
            System.out.println("stop");

        }).start();

        foreverLoop();
    }

    private static void foreverLoop() {
        int i = 0;
        while (!stop) {
            i++;
        }
        System.out.println("i=" + i);
    }
}


```

输出
```
stop
i=288105
```

### 方式三

增加volatile修饰符

```java
package learn.thread;

public class ForeverLoop {
    // 增加volatile修饰符
    private static volatile boolean stop = false;

    public static void main(String[] args) {
        new Thread(() -> {

            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            stop = true;
            System.out.println("stop");

        }).start();

        foreverLoop();
    }

    private static void foreverLoop() {
        int i = 0;
        while (!stop) {
            i++;
        }
        System.out.println("i=" + i);
    }
}

```

输出结果

```
i=281509749
stop
```

## 有序性举例

引入压测工具库 [jcstress](https://github.com/openjdk/jcstress)

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>thread-unsafe</groupId>
    <artifactId>demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>org.openjdk.jcstress</groupId>
            <artifactId>jcstress-core</artifactId>
            <version>0.14</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <compilerArgument>--add-exports=java.base/jdk.internal.misc=ALL-UNNAMED</compilerArgument>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>2.2</version>
                <executions>
                    <execution>
                        <id>main</id>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <finalName>jcstress</finalName>
                            <transformers>
                                <transformer
                                        implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>org.openjdk.jcstress.Main</mainClass>
                                </transformer>
                                <transformer
                                        implementation="org.apache.maven.plugins.shade.resource.AppendingTransformer">
                                    <resource>META-INF/TestList</resource>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

测试用例

```java
package com.demo;

import org.openjdk.jcstress.annotations.*;
import org.openjdk.jcstress.infra.results.II_Result;

// 有序性例子
// java -XX:+UnlockDiagnosticVMOptions -XX:+LogCompilation -jar target/jcstress.jar -t com.demo.Reordering.Case1
// java -XX:+UnlockDiagnosticVMOptions -XX:+LogCompilation -jar target/jcstress.jar -t com.demo.Reordering.Case2
// java -XX:+UnlockDiagnosticVMOptions -XX:+LogCompilation -jar target/jcstress.jar -t com.demo.Reordering.Case3
public class Reordering {
    @JCStressTest
    @Outcome(id = {"0, 0", "1, 1", "0, 1"}, expect = Expect.ACCEPTABLE, desc = "ACCEPTABLE")
    @Outcome(id = "1, 0", expect = Expect.ACCEPTABLE_INTERESTING, desc = "INTERESTING")
    @State
    public static class Case1 {
        int x;
        int y;

        @Actor
        public void actor1() {
            x = 1;
            y = 1;
        }

        @Actor
        public void actor2(II_Result r) {
            r.r1 = y;
            r.r2 = x;
        }
    }

    @JCStressTest
    @Outcome(id = {"0, 0", "1, 1", "0, 1"}, expect = Expect.ACCEPTABLE, desc = "ACCEPTABLE")
    @Outcome(id = "1, 0", expect = Expect.FORBIDDEN, desc = "FORBIDDEN")
    @State
    public static class Case2 {
        int x;
        volatile int y;

        @Actor
        public void actor1() {
            x = 1;
            y = 1;
        }

        @Actor
        public void actor2(II_Result r) {
            r.r1 = y;
            r.r2 = x;
        }
    }

    @JCStressTest
    @Outcome(id = {"0, 0", "1, 1", "0, 1"}, expect = Expect.ACCEPTABLE, desc = "ACCEPTABLE")
    @Outcome(id = "1, 0", expect = Expect.ACCEPTABLE_INTERESTING, desc = "ACCEPTABLE_INTERESTING")
    @State
    public static class Case3 {
        volatile int x;
        int y;

        @Actor
        public void actor1() {
            x = 1;
            y = 1;
        }

        @Actor
        public void actor2(II_Result r) {
            r.r1 = y;
            r.r2 = x;
        }
    }
}
```
打包

```bash
$ mvn package -Dmaven.test.skip=true
```

运行
```bash
java -XX:+UnlockDiagnosticVMOptions -XX:+LogCompilation -jar target/jcstress.jar -t com.demo.Reordering.Case1
```



case1
```
  RESULT      SAMPLES     FREQ       EXPECT  DESCRIPTION
    0, 0    7,384,800    6.75%   Acceptable  ACCEPTABLE
    0, 1    1,046,952    0.96%   Acceptable  ACCEPTABLE
    1, 0       18,429    0.02%  Interesting  INTERESTING
    1, 1  100,956,027   92.28%   Acceptable  ACCEPTABLE

```

case2符合预期

case3
```
  RESULT      SAMPLES     FREQ       EXPECT  DESCRIPTION
    0, 0   92,831,988   33.06%   Acceptable  ACCEPTABLE
    0, 1    6,487,823    2.31%   Acceptable  ACCEPTABLE
    1, 0      282,156    0.10%  Interesting  ACCEPTABLE_INTERESTING
    1, 1  181,197,265   64.53%   Acceptable  ACCEPTABLE

```

volatile 内存屏障

- 写：阻止之前的代码下来
- 读：阻止下面的代码上去

口诀：先读后写

屏障是单向的，即阻止一个方向重排序


Volatile详解，太详细了 https://www.cnblogs.com/cxy2020/p/12951333.html
