# Java基础知识总结

参考：[毕向东—Java基础知识总结（超级经典）](https://www.cnblogs.com/In-order-to-tomorrow/p/3652315.html)

写代码：

1. 明确需求。我要做什么？
2. 分析思路。我要怎么做？1,2,3。
3. 确定步骤。每一个思路部分用到哪些语句，方法，和对象。
4. 代码实现。用具体的java语言代码把思路体现出来。

学习新技术的四点：

1. 该技术是什么？
2. 该技术有什么特点(使用注意)：
3. 该技术怎么使用。demo
4. 该技术什么时候用？test。

## 一：java概述：

1991 年Sun公司的James Gosling等人开始开发名称为 Oak 的语言，希望用于控制嵌入在有线电视交换盒、PDA等的微处理器；

1994年将Oak语言更名为Java；

Java的三种技术架构:

- `JAVAEE`：Java Platform Enterprise Edition，开发企业环境下的应用程序，主要针对web程序开发；

- `JAVASE`：Java Platform Standard Edition，完成桌面应用程序的开发，是其它两者的基础；

- `JAVAME`：Java Platform Micro Edition，开发电子消费产品和嵌入式设备，如手机中的程序；

1，`JDK`：Java Development Kit：java的开发和运行环境，java的开发工具和jre。

2，`JRE`：Java Runtime Environment：java程序的运行环境，java运行的所需的类库+JVM(java虚拟机)。

3，配置环境变量：让java jdk\bin目录下的工具，可以在任意目录下运行，原因是，将该工具所在目录告诉了系统，当使用该工具时，由系统帮我们去找指定的目录。

环境变量的配置：

①：永久配置方式：

```bash
JAVA_HOME=%安装路径%\Java\jdk

path=%JAVA_HOME%\bin
```

②：临时配置方式：

```bash
set path=%path%;C:\Program Files\Java\jdk\bin
```

特点：系统默认先去当前路径下找要执行的程序，如果没有，再去path中设置的路径下找。

classpath的配置:

①：永久配置方式：
```
classpath=.;c:\;e:\
```

②：临时配置方式：

```
set classpath=.;c:\;e:\
```

注意：在定义classpath环境变量时，需要注意的情况

如果没有定义环境变量classpath，java启动jvm后，会在当前目录下查找要运行的类文件；

如果指定了classpath，那么会在指定的目录下查找要运行的类文件。

还会在当前目录找吗？两种情况：

①：如果classpath的值结尾处有分号，在具体路径中没有找到运行的类，会默认在当前目录再找一次。

②：如果classpath的值结果出没有分号，在具体的路径中没有找到运行的类，不会再当前目录找。

一般不指定分号，如果没有在指定目录下找到要运行的类文件，就报错，这样可以调试程序。

4，javac命令和java命令做什么事情呢？

要知道java是分两部分的：一个是编译，一个是运行。
![](https://mouday.github.io/img/2024/06/11/ci2mbpb.png)