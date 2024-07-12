# Java面试题-JVM

## JVM内存结构

### 代码执行流程

![](https://mouday.github.io/img/2024/07/03/79g5lr6.png)

线程私有：
- 程序计数器
- 虚拟机栈

线程共享
- 堆
- 方法区

### 内存溢出

哪些部分会出现内存溢出？

不会出现内存溢出的区域-`程序计数器`

出现 `OutOfMemoryError` 的情况

- `堆` 内存耗尽-对象越来越多，又一直在使用，不能被垃圾回收
- `方法区` 内存耗尽-加载的类越来越多，很多框架都会在运行期间动态产生新的类
- `虚拟机栈` 累积-每个线程最多会占用1M 内存，线程个数越来越多，而又长时间运行不销毁时

出现 `StackOverflowError` 的区域
- `虚拟机栈` 内部-方法调用次数过多

### 方法区与永久代、元空间

方法区与永久代、元空间之间的关系

- `方法区`是 JM 规范中定义的一块内存4区域，用来存储类元数据、方法字节码、即时编译器需要的信息等
- `永久代`是 Hotspot 虚拟机对 JVM 规范的实现(1.8 之前)
- `元空间`(MetaData)是 Hotspot 虚拟机对 JM 规范的实现(1.8 以后)，使用本地内存作为这些信息的存储空间

1、类原始数据被放入元空间

![](https://mouday.github.io/img/2024/07/03/7yuic7k.png)

类加载器加载类的原始信息存储到元空间

2、元空间内存释放

![](https://mouday.github.io/img/2024/07/03/hx8kz3y.png)

对象实例、对象对应的类、整个类加载器不再被使用，元空间中的原始才会被数据清除

## JVM内存参数

对于JM内存配置参数:

```
-Xmx10240m -Xms10240m -Xmn5120m -XX:SurvivorRatio=3 
```

其最小内存值和Survivor区总大小分别是

![](https://mouday.github.io/img/2024/07/03/5vbw785.png)

参数解答：

- `-Xmx10240m` 最大内存 10240M = 10G
- `-Xms10240m` 最小内存 10240M = 10G
- `-Xmn5120m`  新生代内存数 5120M = 5G
- `-XX:SurvivorRatio=3` 
- `-XX:NewRatio` = old老年代 / new新生代

内存配置

- 老年代old
- 新生代new
    - 伊甸园区eden
    - survivor区（from+to）

比例计算

```
SurvivorRatio == 伊甸园区eden/from == 伊甸园区eden/to

eden = 3
from = 1
to = 1

5G / (3 + 1 + 1)
= 5G / 5
= 1G 

Survivor = from + to = 1G + 1G = 2G
```

所以：最小内存值10G；Survivor区总大小是2G


### 新生代大小设置

-XX:MaxNewSize

-XX:NewSize

-Xmn 相当于 MaxNewSize=NewSize

![](https://mouday.github.io/img/2024/07/03/60s25i9.png)

> 建议生产环境设置为一样: Xmx=Xms

### 元空间内存

-XX:CompressedClassSpaceSize
-XX:MaxMetaspaceSize

![](https://mouday.github.io/img/2024/07/03/no8wvox.png)

### 代码缓存区

-XX:ReservedCodeCacheSize

存放JIT编译后的代码

![](https://mouday.github.io/img/2024/07/03/vpaqqks.png)

### 线程

`-Xss`默认1M

![](https://mouday.github.io/img/2024/07/03/vnad104.png)

