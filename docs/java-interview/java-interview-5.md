# 设计模式-单例模式

目标
- 掌握单例模式常见五种实现方式
- 了解 jdk 中有哪些地方体现了单例模式

## 1、饿汉式单例

### 代码实现

```java
package com.demo.singleton;

/**
 * 饿汉式
 */
public class Singleton1 {
    // 构造函数私有
    private Singleton1() {
    }

    // 实例私有
    private static final Singleton1 INSTANCE = new Singleton1();

    // 提供获取实例的方法
    public static Singleton1 getInstance() {
        return INSTANCE;
    }
}

```

测试单例

```java
package com.demo.singleton;

public class Singleton1Test {
    public static void main(String[] args) {

        Singleton1 instance1 = Singleton1.getInstance();
        Singleton1 instance2 = Singleton1.getInstance();

        System.out.println(instance1);
        // com.demo.singleton.Singleton1@66d3c617

        System.out.println(instance2);
        // com.demo.singleton.Singleton1@66d3c617
    }
}
```

可以看到两次获得的实例是同一个对象


### 反射破坏单例

通过反射创建实例，破坏单例

```java
package com.demo.singleton;

import java.io.*;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public class Singleton1Test {
    public static void main(String[] args)
            throws InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        Singleton1 instance1 = Singleton1.getInstance();
        System.out.println(instance1);
        // com.demo.singleton.Singleton1@66d3c617

        // 通过反射创建实例，破坏单例
        Singleton1 instance = Singleton1Test.reflection(Singleton1.class);
        System.out.println(instance);
        // com.demo.singleton.Singleton1@63947c6b
    }

    public static <T> T reflection(Class<T> clazz) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        Constructor<T> constructor = clazz.getDeclaredConstructor();
        constructor.setAccessible(true);
        return constructor.newInstance();
    }
}


```

防止破坏单例模式，可以在构造函数中判断实例是否已经存在，如果存在则抛出异常

```java
package com.demo.singleton;

/**
 * 饿汉式
 */
public class Singleton1 {
    // 构造函数私有
    private Singleton1() {

        // 防止破坏单例模式，
        // 可以在构造函数中判断实例是否已经存在，如果存在则抛出异常
        if(INSTANCE!=null){
            throw new RuntimeException("单例对象不能重复创建");
        }
    }

    // 实例私有
    private static final Singleton1 INSTANCE = new Singleton1();

    // 提供获取实例的方法
    public static Singleton1 getInstance() {
        return INSTANCE;
    }
}
    
```

再次运行代码，输出如下

```bash
com.demo.singleton.Singleton1@66d3c617

Exception in thread "main" java.lang.reflect.InvocationTargetException
	at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
	at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
	at java.lang.reflect.Constructor.newInstance(Constructor.java:423)
	at com.demo.singleton.Singleton1Test.reflection(Singleton1Test.java:23)
	at com.demo.singleton.Singleton1Test.main(Singleton1Test.java:15)
Caused by: java.lang.RuntimeException: 单例对象不能重复创建
	at com.demo.singleton.Singleton1.<init>(Singleton1.java:12)
	... 6 more
```

### 反序列化破坏单例

通过反序列化创建实例，破坏单例

```java
package com.demo.singleton;

import java.io.*;

public class Singleton1Test {
    public static void main(String[] args) throws  IOException, ClassNotFoundException {
        Singleton1 instance1 = Singleton1.getInstance();
        System.out.println(instance1);
        // com.demo.singleton.Singleton1@66d3c617

        // 通过序列化和反序列化创建实例，破坏单例
        Object instance2 = Singleton1Test.serializable(instance1);
        System.out.println(instance2);
        // com.demo.singleton.Singleton1@37a71e93
    }
    
    public static Object serializable(Object instance) throws IOException, ClassNotFoundException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(bos);
        oos.writeObject(instance);

        ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(bos.toByteArray()));
        return ois.readObject();
    }
}

```

防止破坏单例, 在类中添加`readResolve`方法

```java
package com.demo.singleton;

import java.io.Serializable;

/**
 * 饿汉式
 */
public class Singleton1 implements Serializable {
    // 构造函数私有
    private Singleton1() {
        if (INSTANCE != null) {
            throw new RuntimeException("单例对象不能重复创建");
        }
    }

    // 实例私有
    private static final Singleton1 INSTANCE = new Singleton1();

    // 提供获取实例的方法
    public static Singleton1 getInstance() {
        return INSTANCE;
    }

    // 反序列化时，如果存在这个方法，则会调用这个方法，而不是返回新的对象
    public Object readResolve(){
        return INSTANCE;
    }
}
```

再次运行代码，输出结果如下

```bash
com.demo.singleton.Singleton1@66d3c617
com.demo.singleton.Singleton1@66d3c617
```

### unsafe破坏单例

通过unsafe创建实例，破坏单例

引入spring依赖

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>5.3.31</version>
</dependency>
```

代码实现

```java
package com.demo.singleton;

import org.springframework.objenesis.instantiator.util.UnsafeUtils;

public class Singleton1Test {
    public static void main(String[] args)
            throws InstantiationException {
        Singleton1 instance1 = Singleton1.getInstance();
        System.out.println(instance1);
        // com.demo.singleton.Singleton1@66d3c617

        // 通过unsafe创建实例，破坏单例
        Object instance = Singleton1Test.unsafe(Singleton1.class);
        System.out.println(instance);
        // com.demo.singleton.Singleton1@4d7e1886
    }

    public static Object unsafe(Class<?> clazz) throws InstantiationException {
        return UnsafeUtils.getUnsafe().allocateInstance(clazz);
    }
}

```

预防手段：暂无

## 2、枚举饿汉式单例

### 代码实现

```java
package learn.singleton;

public enum Singleton2 {
    INSTANCE;

    // 提供获取实例的方法
    public static Singleton2 getInstance() {
        return INSTANCE;
    }

    @Override
    public String toString() {
        return getClass().getName() + "@" + Integer.toHexString(hashCode());
    }
}
```

测试单例

```java
package learn.singleton;

public class Singleton2Test {
    public static void main(String[] args) {
        Singleton2 instance1 = Singleton2.getInstance();
        Singleton2 instance2 = Singleton2.getInstance();

        System.out.println(instance1);
        // learn.singleton.Singleton2@6504e3b2

        System.out.println(instance2);
        // learn.singleton.Singleton2@6504e3b2
    }
}

```

### 反射破坏单例

通过反射创建实例，不能破坏单例

```java
package learn.singleton;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public class Singleton2Test {
    public static void main(String[] args)
            throws InstantiationException, NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        Singleton2 instance1 = Singleton2.getInstance();
        System.out.println(instance1);
        // learn.singleton.Singleton2@6504e3b2

        // 通过反射创建实例，破坏单例
        Object instance = Singleton2Test.reflection(Singleton2.class);
    }


    public static <T> T reflection(Class<T> clazz) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException, InvocationTargetException {
        Constructor<T> constructor = clazz.getDeclaredConstructor(String.class, int.class);
        constructor.setAccessible(true);
        return constructor.newInstance("INSTANCE", 0);
    }
}

```

使用无参构造会报错`NoSuchMethodException`

```java
Constructor<T> constructor = clazz.getDeclaredConstructor();
```

```bash
Exception in thread "main" java.lang.NoSuchMethodException: learn.singleton.Singleton2.<init>()
    at java.lang.Class.getConstructor0(Class.java:3082)
    at java.lang.Class.getDeclaredConstructor(Class.java:2178)
    at learn.singleton.Singleton2Test.reflection(Singleton2Test.java:23)
    at learn.singleton.Singleton2Test.main(Singleton2Test.java:16)

```

因为枚举类的父类是Enum，有2个参数的构造函数

```java
public abstract class Enum<E extends Enum<E>>
        implements Comparable<E>, Serializable {
    protected Enum(String name, int ordinal) {
        this.name = name;
        this.ordinal = ordinal;
    }
```

正确获取构造函数的方法

```java
Constructor<T> constructor = clazz.getDeclaredConstructor(String.class, int.class);
```

反射获取枚举单例，最后还是会报错`Cannot reflectively create enum objects`

```bash
Exception in thread "main" java.lang.IllegalArgumentException: Cannot reflectively create enum objects
    at java.lang.reflect.Constructor.newInstance(Constructor.java:417)
    at learn.singleton.Singleton2Test.reflection(Singleton2Test.java:25)
    at learn.singleton.Singleton2Test.main(Singleton2Test.java:16)

```

### 反序列化破坏单例

通过反序列化创建实例，不能破坏单例

反序列化得到的对象，和原有实例相等

```java
package learn.singleton;

import java.io.*;

public class Singleton2Test {
    public static void main(String[] args)
            throws IOException, ClassNotFoundException {
        Singleton2 instance1 = Singleton2.getInstance();
        System.out.println(instance1);
        // learn.singleton.Singleton2@6504e3b2

        // 通过反射创建实例，破坏单例
        Object instance2 = Singleton2Test.serializable(instance1);
        System.out.println(instance2);
        // learn.singleton.Singleton2@6504e3b2

        System.out.println(instance1 == instance2);
        // true
    }

    public static Object serializable(Object instance) throws ClassNotFoundException, IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(bos);
        oos.writeObject(instance);

        ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(bos.toByteArray()));
        return ois.readObject();
    }
}
```

### unsafe破坏单例

通过unsafe创建实例，可以实现破坏单例

```java
package learn.singleton;

import org.springframework.objenesis.instantiator.util.UnsafeUtils;

public class Singleton2Test {
    public static void main(String[] args)
            throws InstantiationException {
        Singleton2 instance1 = Singleton2.getInstance();
        System.out.println(instance1);
        // learn.singleton.Singleton2@6504e3b2

        // 通过反射创建实例，破坏单例
        Object instance2 = Singleton2Test.unsafe(Singleton2.class);
        System.out.println(instance2);
        // learn.singleton.Singleton2@123a439b
    }

    public static Object unsafe(Class<?> clazz) throws InstantiationException {
        return UnsafeUtils.getUnsafe().allocateInstance(clazz);
    }
}

```

## 3、懒汉式单例

### 代码实现

```java
package learn.singleton;

import java.io.Serializable;

/**
 * 懒汉式单例
 */
public class Singleton3 implements Serializable {
    // 构造函数私有
    private Singleton3() {}

    // 实例私有
    private static  Singleton3 INSTANCE = null;

    // 提供获取实例的方法
    public static Singleton3 getInstance() {
        if(INSTANCE == null){
            INSTANCE = new Singleton3();
        }

        return INSTANCE;
    }
}

```

单例测试

```java
package learn.singleton;

public class Singleton3Test {
    public static void main(String[] args) {
        Singleton3 instance1 = Singleton3.getInstance();
        Singleton3 instance2 = Singleton3.getInstance();

        System.out.println(instance1);
        // learn.singleton.Singleton3@6504e3b2

        System.out.println(instance2);
        // learn.singleton.Singleton3@6504e3b2
    }
}

```

### 线程安全

多线程获取单例，会出现多个实例

```java
package learn.singleton;

public class Singleton3Test {
    public static void main(String[] args) {
        // 线程1
        new Thread(new Runnable() {
            @Override
            public void run() {
                Singleton3 instance1 = Singleton3.getInstance();

                System.out.println(instance1);
                // learn.singleton.Singleton3@5b8d42e2

            }
        }).start();

        // 线程2
        new Thread(new Runnable() {
            @Override
            public void run() {
                Singleton3 instance2 = Singleton3.getInstance();

                System.out.println(instance2);
                // learn.singleton.Singleton3@44e2d7cc

            }
        }).start();
    }
}

```

解决办法：通过增加`synchronized`关键字

```java
package learn.singleton;

import java.io.Serializable;

/**
 * 懒汉式单例
 */
public class Singleton3 implements Serializable {
    // 构造函数私有
    private Singleton3() {}

    // 实例私有
    private static  Singleton3 INSTANCE = null;

    // 提供获取实例的方法
    public static synchronized Singleton3 getInstance() {
        if(INSTANCE == null){

            // 线程耗时
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            INSTANCE = new Singleton3();
        }

        return INSTANCE;
    }
}

```

再次运行多线程获取单例对象，则不会出现多个实例

```
learn.singleton.Singleton3@b6e42e3
learn.singleton.Singleton3@b6e42e3
```


## 4、懒汉式单例-DCL

双检锁 Double-Check Locking

```java
package learn.singleton;

import java.io.Serializable;

/**
 * 懒汉式单例-DCL
 */
public class Singleton3 implements Serializable {
    // 构造函数私有
    private Singleton3() {
    }

    // 实例私有
    private static volatile Singleton3 INSTANCE = null;

    // 提供获取实例的方法
    public static Singleton3 getInstance() {
        if (INSTANCE == null) {
            synchronized (Singleton3.class) {
                if (INSTANCE == null) {
                    INSTANCE = new Singleton3();
                }
            }
        }

        return INSTANCE;
    }
}

```

### volatile的作用

volatile 可见性 有序性

```bash
# 反编译
javap -c -v -p xxx.class
```

指令重排序示意图

![](https://mouday.github.io/img/2024/07/20/xyr8k0p.png)

volatile修饰共享变量，可以阻止指令重排序

![](https://mouday.github.io/img/2024/07/20/xtknu5l.png)

## 5、懒汉式单例-内部类

### 代码实现

```java
package learn.singleton;

import java.io.Serializable;

/**
 * 懒汉式单例-内部类
 */
public class Singleton5 implements Serializable {
    // 构造函数私有
    private Singleton5() {
        System.out.println("call constructor");
    }

    private static class Holder{
        // 实例私有
        static Singleton5 INSTANCE = new Singleton5();
    }

    // 提供获取实例的方法
    public static Singleton5 getInstance() {
        return Holder.INSTANCE;
    }

    public static void method(){
        System.out.println("call method");
    }
}

```

测试

```java
package learn.singleton;

public class Singleton5Test {
    public static void main(String[] args) {
        Singleton5.method();

        Singleton5 instance1 = Singleton5.getInstance();
        System.out.println(instance1);
        // learn.singleton.Singleton5@6504e3b2

        Singleton5 instance2 = Singleton5.getInstance();
        System.out.println(instance2);
        // learn.singleton.Singleton5@6504e3b2

    }
}
```

输出结果

```
call method
call constructor
learn.singleton.Singleton5@6504e3b2
learn.singleton.Singleton5@6504e3b2
```
