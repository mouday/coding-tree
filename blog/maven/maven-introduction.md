[返回目录](/blog/maven/index.md)

# Maven 入门篇

## 第一章 Maven 概述

### 第一节 为什么要学习 Maven

1、Maven 作为`依赖管理` 工具

2、Maven 作为`构建管理` 工具

### 第二节 什么是 Maven

Maven 是 Apache 软件基金会组织维护的一款专门为 Java 项目提供构建和依赖管理支持的工具。

1、构建

构建过程包含的主要的环节：

1. 清理：删除上一次构建的结果，为下一次构建做好准备
2. 编译：Java 源程序编译成 \*.class 字节码文件
3. 测试：运行提前准备好的测试程序
4. 报告：针对刚才测试的结果生成一个全面的信息
5. 打包
   - Java 工程：jar 包
   - Web 工程：war 包
6. 安装：把一个 Maven 工程经过打包操作生成的 jar 包或 war 包存入 Maven 仓库
7. 部署
   - 部署 jar 包：把一个 jar 包部署到 Nexus 私服服务器上
   - 部署 war 包：借助相关 Maven 插件（例如 cargo），将 war 包部署到 Tomcat 服务器上

2、依赖

依赖管理中要解决的具体问题：

1. jar 包的下载：使用 Maven 之后，jar 包会从规范的远程仓库下载到本地
2. jar 包之间的依赖：通过依赖的传递性自动完成
3. jar 包之间的冲突：通过对依赖的配置进行调整，让某些 jar 包不会被导入

3、Maven 的工作机制

![](img/img003.f9cc536c.png)

## 第二章 Maven 核心程序解压和配置

### 第一节 Maven 核心程序解压与配置

1、Maven 官网地址

- 首页：[https://maven.apache.org/](https://maven.apache.org/)
- 下载页面：[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

2、解压 Maven 核心程序

```
$ tree -L 1
.
├── LICENSE
├── NOTICE
├── README.txt
├── bin
├── boot
├── conf
├── lib
└── repository
```

3、指定本地仓库

本地仓库默认值：

```bash
# 用户家目录下
~/.m2/repository
```

核心配置文件：conf/settings.xml

```xml
<localRepository>/opt/maven-repository</localRepository>
```

> 注意：本地仓库本身也需要使用一个`非中文`、`没有空格` 的目录

4、配置阿里云提供的镜像仓库

[https://developer.aliyun.com/mvn/guide](https://developer.aliyun.com/mvn/guide)

```xml
<mirror>
  <id>aliyunmaven</id>
  <mirrorOf>*</mirrorOf>
  <name>阿里云公共仓库</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

5、配置 Maven 工程的基础 JDK 版本

Java 工程使用的默认 JDK 版本是 1.5

```xml
<profile>
    <id>jdk-1.8</id>
    <activation>
        <activeByDefault>true</activeByDefault>
        <jdk>1.8</jdk>
    </activation>
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
    </properties>
</profile>
```

### 第二节 配置环境变量

1、检查 JAVA_HOME 配置是否正确

```bash
# windows
$ echo %JAVA_HOME%

# linux
$ echo $JAVA_HOME

$ java -version
java version "1.8.0_361"
Java(TM) SE Runtime Environment (build 1.8.0_361-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.361-b09, mixed mode)
```

2、配置 MAVEN_HOME 和 PATH

> TIP：
> 配置环境变量的规律：
> XXX_HOME 通常指向的是 bin 目录的上一级；
> PATH 指向的是 bin 目录

`vim ~/.bash_profile`

```bash
# maven
export MAVEN_HOME=/Users/tom/Applications/apache-maven-3.6.3
export PATH=${PATH}:${MAVEN_HOME}/bin
```

3、验证

```bash
$ mvn -v
Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
Maven home: /Users/hina/Applications/apache-maven-3.6.3
Java version: 1.8.0_361, vendor: Oracle Corporation, runtime: /Users/hina/Applications/jdk/jdk1.8.0_361.jdk/Contents/Home/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "mac os x", version: "10.14.4", arch: "x86_64", family: "mac"
```

## 第三章 使用 Maven：命令行环境

### 第一节 实验一：根据坐标创建 Maven 工程

1、Maven 核心概念：坐标

1.1、数学中的坐标：

使用 x、y、z 三个『向量』作为空间的坐标系，可以在『空间』中唯一的定位到一个『点』。

1.2、Maven中的坐标

（1）向量说明

使用三个『向量』在『Maven的仓库』中唯一的定位到一个『jar』包。

- groupId：公司或组织的 id
- artifactId：一个项目或者是项目中的一个模块的 id
- version：版本号

（2）三个向量的取值方式

- groupId：公司或组织域名的倒序，通常也会加上项目名称

例如：com.atguigu.maven

- artifactId：模块的名称，将来作为 Maven 工程的工程名
- version：模块的版本号，根据自己的需要设定

例如：SNAPSHOT 表示快照版本，正在迭代过程中，不稳定的版本

例如：RELEASE 表示正式版本

举例：

- groupId：com.atguigu.maven
- artifactId：pro01-atguigu-maven
- version：1.0-SNAPSHOT

（3）坐标和仓库中 jar 包的存储路径之间的对应关系

坐标：

```xml
<groupId>javax.servlet</groupId>
<artifactId>servlet-api</artifactId>
<version>2.5</version>
```

上面坐标对应的 jar 包在 Maven 本地仓库中的位置：
```
Maven本地仓库根目录\javax\servlet\servlet-api\2.5\servlet-api-2.5.jar
```

2、实验操作

（1）创建目录作为后面操作的工作空间

此时我们已经有了三个目录，分别是：

- Maven 核心程序
- Maven 本地仓库
- 本地工作空间

（2）使用命令生成Maven工程

![](img/img008.be45c9ad.png)

运行命令
```bash
mvn archetype:generate 
```

重要的两项，其余项可以直接回车，使用默认值

```bash
Define value for property 'groupId': com.atguigu.maven
Define value for property 'artifactId': pro01-maven-java
```

当前路径下生成的工程目录

```bash
$ tree
.
└── pro01-maven-java
    ├── pom.xml
    └── src
        ├── main
        │   └── java
        │       └── com
        │           └── atguigu
        │               └── maven
        │                   └── App.java
        └── test
            └── java
                └── com
                    └── atguigu
                        └── maven
                            └── AppTest.java
```

（3）调整

Maven 默认生成的工程，对 junit 依赖的是较低的 3.8.1 版本，我们可以改成较适合的 4.12 版本。

自动生成的 App.java 和 AppTest.java 可以删除。

```xml
<!-- 依赖信息配置 -->
<!-- dependencies复数标签：里面包含dependency单数标签 -->
<dependencies>
    <!-- dependency单数标签：配置一个具体的依赖 -->
    <dependency>
        <!-- 通过坐标来依赖其他jar包 -->
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <!-- <version>3.8.1</version> -->
        <version>4.10</version>
        <!-- 依赖的范围 -->
        <scope>test</scope>
    </dependency>
</dependencies>
```

（4）自动生成的 pom.xml 解读

```xml

<!-- pom.xml所采用的标签结构 -->
<modelVersion>4.0.0</modelVersion>

  <!-- 项目名 -->
  <groupId>com.atguigu.maven</groupId>
  <!-- 模块名 -->
  <artifactId>pro01-maven-java</artifactId>
  <!-- 版本号 -->
  <version>1.0-SNAPSHOT</version>
  
  <!-- 当前Maven工程的打包方式，可选值有下面三种： -->
  <!-- jar：表示这个工程是一个Java工程  -->
  <!-- war：表示这个工程是一个Web工程 -->
  <!-- pom：表示这个工程是“管理其他工程”的工程 -->
  <packaging>jar</packaging>

  <name>pro01-maven-java</name>
  <url>http://maven.apache.org</url>

  <!-- 定义属性 -->
  <properties>
	<!-- 工程构建过程中读取源码时使用的字符集 -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <!-- 当前工程所依赖的jar包 -->
  <dependencies>
	<!-- 使用dependency配置一个具体的依赖 -->
    <dependency>
	
	  <!-- 在dependency标签内使用具体的坐标依赖我们需要的一个jar包 -->
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
	  
	  <!-- scope标签配置依赖的范围 -->
      <scope>test</scope>
    </dependency>
  </dependencies>
```

3、Maven核心概念：POM

①含义

POM：Project Object Model，项目对象模型。和 POM 类似的是：DOM（Document Object Model），文档对象模型。它们都是模型化思想的具体体现。

②模型化思想

POM 表示将工程抽象为一个模型，再用程序中的对象来描述这个模型。这样我们就可以用程序来管理项目了。我们在开发过程中，最基本的做法就是将现实生活中的事物抽象为模型，然后封装模型相关的数据作为一个对象，这样就可以在程序中计算与现实事物相关的数据。

③对应的配置文件

POM 理念集中体现在 Maven 工程根目录下 pom.xml 这个配置文件中。所以这个 pom.xml 配置文件就是 Maven 工程的核心配置文件。其实学习 Maven 就是学这个文件怎么配置，各个配置有什么用。

4、Maven核心概念：约定的目录结构

①各个目录的作用

```bash
├── pom.xml
└── src                     # 源码目录
    ├── main                # 主体程序目录
    │   └── resources       # 配置文件
    │   └── java            # java源代码
    │       └── com         # package目录
    └── test                # 测试程序目录
        └── java            # java源代码
            └── com         # package目录
```

另外还有一个 target 目录专门存放构建操作输出的结果。

②约定目录结构的意义

Maven 为了让构建过程能够尽可能自动化完成，所以必须约定目录结构的作用。例如：Maven 执行编译操作，必须先去 Java 源程序目录读取 Java 源代码，然后执行编译，最后把编译结果存放在 target 目录。

③约定大于配置

Maven 对于目录结构这个问题，没有采用配置的方式，而是基于约定。这样会让我们在开发过程中非常方便。如果每次创建 Maven 工程后，还需要针对各个目录的位置进行详细的配置，那肯定非常麻烦。

目前开发领域的技术发展趋势就是：约定大于配置，配置大于编码。

### 第二节 实验二：在 Maven 工程中编写代码

1、主体程序

主体程序指的是被测试的程序，同时也是将来在项目中真正要使用的程序。

在main目录下创建Calculator类

```java
package com.atguigu.maven;
	
public class Calculator {
	
	public int sum(int i, int j){
		return i + j;
	}
	
}
```

2、测试程序

在test目录下创建CalculatorTest类

```java
package com.atguigu.maven;
	
import org.junit.Test;
import com.atguigu.maven.Calculator;
	
// 静态导入的效果是将Assert类中的静态资源导入当前类
// 这样一来，在当前类中就可以直接使用Assert类中的静态资源，不需要写类名
import static org.junit.Assert.*;
	
public class CalculatorTest{
	
	@Test
	public void testSum(){
		
		// 1.创建Calculator对象
		Calculator calculator = new Calculator();
		
		// 2.调用Calculator对象的方法，获取到程序运行实际的结果
		int actualResult = calculator.sum(5, 3);
		
		// 3.声明一个变量，表示程序运行期待的结果
		int expectedResult = 8;
		
		// 4.使用断言来判断实际结果和期待结果是否一致
		// 如果一致：测试通过，不会抛出异常
		// 如果不一致：抛出异常，测试失败
		assertEquals(expectedResult, actualResult);
		
	}
	
}
```
### 第三节 实验三：执行 Maven 的构建命令

1、要求

运行 Maven 中和构建操作相关的命令时，必须进入到 pom.xml 所在的目录。如果没有在 pom.xml 所在的目录运行 Maven 的构建命令，那么会看到下面的错误信息：

```
The goal you specified requires a project to execute 
but there is no POM in this directory
```

`mvn -v`命令和构建操作无关，只要正确配置了 PATH，在任何目录下执行都可以。而构建相关的命令要在 pom.xml 所在目录下运行——操作哪个工程，就进入这个工程的 pom.xml 目录。


2、清理操作

效果：删除 target 目录

```bash
mvn clean
```

3、编译操作

主程序编译

```bash
mvn compile
# 主体程序编译结果存放的目录：target/classes
```

测试程序编译

```bash
mvn test-compile
# 测试程序编译结果存放的目录：target/test-classes
```

4、测试操作

```bash
mvn test
# 测试的报告存放的目录：target/surefire-reports
```

5、打包操作

```bash
mvn package
# 打包的结果——jar 包，存放的目录：target
```

6、安装操作

```bash
mvn install
```

安装的效果是将本地构建过程中生成的 jar 包存入 Maven 本地仓库。这个 jar 包在 Maven 仓库中的路径是根据它的坐标生成的。

坐标信息如下：

```xml
<groupId>com.atguigu.maven</groupId>
<artifactId>pro01-maven-java</artifactId>
<version>1.0-SNAPSHOT</version>
```

在 Maven 仓库中生成的路径如下：
```
D:\maven-rep1026\com\atguigu\maven\pro01-maven-java\1.0-SNAPSHOT\pro01-maven-java-1.0-SNAPSHOT.jar
```

另外，安装操作还会将 pom.xml 文件转换为 XXX.pom 文件一起存入本地仓库。所以我们在 Maven 的本地仓库中想看一个 jar 包原始的 pom.xml 文件时，查看对应 XXX.pom 文件即可，它们是名字发生了改变，本质上是同一个文件。

### 第四节 实验四：创建 Maven 版的 Web 工程


1、说明

使用 mvn archetype:generate 命令生成 Web 工程时，需要使用一个专门的 archetype。这个专门生成 Web 工程骨架的 archetype 可以参照官网看到它的用法：

参数 archetypeGroupId、archetypeArtifactId、archetypeVersion 用来指定现在使用的 maven-archetype-webapp 的坐标。


2、操作

注意：如果在上一个工程的目录下执行 mvn archetype:generate 命令，那么 Maven 会报错：不能在一个非 pom 的工程下再创建其他工程。所以不要再刚才创建的工程里再创建新的工程，请回到工作空间根目录来操作。

然后运行生成工程的命令：

```bash
mvn archetype:generate -DarchetypeGroupId=org.apache.maven.archetypes -DarchetypeArtifactId=maven-archetype-webapp -DarchetypeVersion=1.4
```


3、生成的pom.xml

确认打包的方式是war包形式

```xml
<groupId>com.atguigu.maven</groupId>
<artifactId>pro02-maven-web</artifactId>
<version>1.0-SNAPSHOT</version>
<packaging>war</packaging>
```

4、生成的Web工程的目录结构

```bash
$ tree pro02-maven-web
pro02-maven-web
├── pom.xml
└── src
    └── main
        └── webapp
            ├── WEB-INF
            │   └── web.xml
            └── index.jsp

```

webapp 目录下有 index.jsp

WEB-INF 目录下有 web.xml

5、创建 Servlet

①在 main 目录下创建 java 目录

②在 java 目录下创建 Servlet 类所在的包的目录

```bash
$ tree -I target
.
├── pom.xml
└── src
    └── main
        ├── java
        │   └── com
        │       └── atguigu
        │           └── maven
        │               └── HelloServlet.java
        └── webapp
            ├── WEB-INF
            │   └── web.xml
            └── index.jsp
```

③在包下创建 Servlet 类

```java
package com.atguigu.maven;
	
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import java.io.IOException;
	
public class HelloServlet extends HttpServlet{
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		response.getWriter().write("hello maven web");
		
	}
	
}
```

④在 web.xml 中注册 Servlet

```xml
  <servlet>
	<servlet-name>helloServlet</servlet-name>
	<servlet-class>com.atguigu.maven.HelloServlet</servlet-class>
  </servlet>
  <servlet-mapping>
	<servlet-name>helloServlet</servlet-name>
	<url-pattern>/helloServlet</url-pattern>
  </servlet-mapping>
```

6、在 index.jsp 页面编写超链接

```html
<html>
<body>
<h2>Hello World!</h2>
<a href="helloServlet">Access Servlet</a>
</body>
</html>
```

JSP全称是 Java Server Page，和 Thymeleaf 一样，是服务器端页面渲染技术。这里我们不必关心 JSP 语法细节，编写一个超链接标签即可。


7、编译
此时直接执行 mvn compile 命令出错：

```
DANGER

程序包 javax.servlet.http 不存在

程序包 javax.servlet 不存在

找不到符号

符号: 类 HttpServlet

……
```

上面的错误信息说明：我们的 Web 工程用到了 HttpServlet 这个类，而 HttpServlet 这个类属于 servlet-api.jar 这个 jar 包。此时我们说，Web 工程需要依赖 servlet-api.jar 包。


8、配置对 servlet-api.jar 包的依赖

对于不知道详细信息的依赖可以到 [https://mvnrepository.com/](https://mvnrepository.com/) 网站查询。使用关键词搜索，然后在搜索结果列表中选择适合的使用。

比如，我们找到的 servlet-api 的依赖信息：

```xml
<!-- https://mvnrepository.com/artifact/javax.servlet/javax.servlet-api -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
    <scope>provided</scope>
</dependency>
```

这样就可以把上面的信息加入 pom.xml。重新执行 `mvn compile` 命令。

9、将 Web 工程打包为 war 包

运行 `mvn package` 命令，生成 war 包的位置如下图所示：

```bash
$ tree target -L 1
target
├── classes
├── generated-sources
├── maven-archiver
├── maven-status
├── pro02-maven-web-1.0-SNAPSHOT
├── pro02-maven-web-1.0-SNAPSHOT.war
└── test-classes
```

10、将 war 包部署到 Tomcat 上运行

将 war 包复制到 Tomcat/webapps 目录下

```
webapps/
    pro02-maven-web.war
```

启动 Tomcat：

```bash
$ bash ./bin/startup.sh
```

通过浏览器尝试访问：http://localhost:8080/pro02-maven-web/index.jsp

### 第五节 实验五：让 Web 工程依赖 Java 工程

1、观念

明确一个意识：从来只有 Web 工程依赖 Java 工程，没有反过来 Java 工程依赖 Web 工程。本质上来说，Web 工程依赖的 Java 工程其实就是 Web 工程里导入的 jar 包。最终 Java 工程会变成 jar 包，放在 Web 工程的 WEB-INF/lib 目录下。

2、操作

在 pro02-maven-web 工程的 pom.xml 中，找到 dependencies 标签，在 dependencies 标签中做如下配置：

```xml
<!-- 配置对Java工程pro01-maven-java的依赖 -->
<!-- 具体的配置方式：在dependency标签内使用坐标实现依赖 -->
<dependency>
	<groupId>com.atguigu.maven</groupId>
	<artifactId>pro01-maven-java</artifactId>
	<version>1.0-SNAPSHOT</version>
</dependency>
```

3、在 Web 工程中，编写测试代码

①补充创建目录

```bash
pro02-maven-web\src\test\java\com\atguigu\maven

# 命令
mkdir -p src/test/java/com/atguigu/mave
```

②确认 Web 工程依赖了 junit

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.10</version>
    <scope>test</scope>
</dependency>
```

③创建测试类

把 Java 工程的 CalculatorTest.java 类复制到目录下 

```
pro02-maven-wb\src\test\java\com\atguigu\maven
```

4、执行Maven命令

①测试命令

```
mvn test
```

说明：测试操作中会提前自动执行编译操作，测试成功就说明编译也是成功的。

②打包命令

```
mvn package
```


通过查看 war 包内的结构，我们看到被 Web 工程依赖的 Java 工程确实是会变成 Web 工程的 `WEB-INF/lib` 目录下的 jar 包。

```bash
$ tree ./target/pro02-maven-web-1.0-SNAPSHOT
./target/pro02-maven-web-1.0-SNAPSHOT
├── META-INF
├── WEB-INF
│   ├── classes
│   │   └── com
│   │       └── atguigu
│   │           └── maven
│   │               └── HelloServlet.class
│   ├── lib
│   │   └── pro01-maven-java-1.0-SNAPSHOT.jar
│   └── web.xml
└── index.jsp
```

③查看当前 Web 工程所依赖的 jar 包的列表

```
mvn dependency:list
```

```bash
[INFO]    junit:junit:jar:4.10:test
[INFO]    javax.servlet:javax.servlet-api:jar:3.1.0:provided
[INFO]    com.atguigu.maven:pro01-maven-java:jar:1.0-SNAPSHOT:compile
[INFO]    org.hamcrest:hamcrest-core:jar:1.1:test
```

说明：`javax.servlet:javax.servlet-api:jar:3.1.0:provided` 格式显示的是一个 jar 包的坐标信息。格式是：

```
groupId:artifactId:打包方式:version:依赖的范围
```


这样的格式虽然和我们 XML 配置文件中坐标的格式不同，但是本质上还是坐标信息，大家需要能够认识这样的格式，将来从 Maven 命令的日志或错误信息中看到这样格式的信息，就能够识别出来这是坐标。进而根据坐标到Maven 仓库找到对应的jar包，用这样的方式解决我们遇到的报错的情况。

④以树形结构查看当前 Web 工程的依赖信息

```
mvn dependency:tree
```

```bash
[INFO] com.atguigu.maven:pro02-maven-java:war:1.0-SNAPSHOT
[INFO] +- junit:junit:jar:4.10:test
[INFO] |  \- org.hamcrest:hamcrest-core:jar:1.1:test
[INFO] +- javax.servlet:javax.servlet-api:jar:3.1.0:provided
[INFO] \- com.atguigu.maven:pro01-maven-java:jar:1.0-SNAPSHOT:compile
```
我们在 pom.xml 中并没有依赖 hamcrest-core，但是它却被加入了我们依赖的列表。原因是：junit 依赖了hamcrest-core，然后基于依赖的传递性，hamcrest-core 被传递到我们的工程了。

### 第六节 实验六：测试依赖范围

1、依赖范围

标签的位置：dependencies/dependency/scope

标签的可选值：compile/test/provided/system/runtime/import

①compile 和 test 对比

| scope | main目录（空间）|test目录（空间）|开发过程（时间）| 部署到服务器（时间）
| - | - | - | - | - | 
| compile| 	有效	| 有效	| 有效| 	有效
| test	| 无效	| 有效	| 有效	| 无效


②compile 和 provided 对比

| scope | main目录（空间）|test目录（空间）|开发过程（时间）| 部署到服务器（时间）
| - | - | - | - | - | 
| compile	| 有效	| 有效	| 有效|有效
| provided	| 有效	| 有效	| 有效	| 无效

③结论

compile：通常使用的第三方框架的 jar 包这样在项目实际运行时真正要用到的 jar 包都是以 compile 范围进行依赖的。比如 SSM 框架所需jar包。

test：测试过程中使用的 jar 包，以 test 范围依赖进来。比如 junit。

provided：在开发过程中需要用到的“服务器上的 jar 包”通常以 provided 范围依赖进来。比如 servlet-api、jsp-api。而这个范围的 jar 包之所以不参与部署、不放进 war 包，就是避免和服务器上已有的同类 jar 包产生冲突，同时减轻服务器的负担。说白了就是：“服务器上已经有了，你就别带啦！”

2、测试

①验证 compile 范围对 main 目录有效

main目录下的类：HelloServlet 使用compile范围导入的依赖：pro01-atguigu-maven

验证：使用compile范围导入的依赖对main目录下的类来说是有效的

有效：HelloServlet 能够使用 pro01-atguigu-maven 工程中的 Calculator 类

验证方式：在 HelloServlet 类中导入 Calculator 类，然后编译就说明有效。

②验证test范围对main目录无效

测试方式：在主体程序中导入org.junit.Test这个注解，然后执行编译。

具体操作：在pro01-maven-java\src\main\java\com\atguigu\maven目录下修改Calculator.java

```java
package com.atguigu.maven;

import org.junit.Test;

public class Calculator {
	
	public int sum(int i, int j){
		return i + j;
	}
	
}
```

执行Maven编译命令：

```
[ERROR] /D:/maven-workspace/space201026/pro01-maven-java/src/main/java/com/atguigu/maven/Calculator.java:[3,17] 程序包org.junit不存在
```

③验证test和provided范围不参与服务器部署

其实就是验证：通过compile范围依赖的jar包会放入war包，通过test范围依赖的jar包不会放入war包。


④验证provided范围对测试程序有效

测试方式是在pro02-maven-web的测试程序中加入servlet-api.jar包中的类。

修改：pro02-maven-web\src\test\java\com\atguigu\maven\CalculatorTest.java

```java
package com.atguigu.maven;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;

import org.junit.Test;
import com.atguigu.maven.Calculator;

// 静态导入的效果是将Assert类中的静态资源导入当前类
// 这样一来，在当前类中就可以直接使用Assert类中的静态资源，不需要写类名
import static org.junit.Assert.*;

public class CalculatorTest{
	
	@Test
	public void testSum(){
		
		// 1.创建Calculator对象
		Calculator calculator = new Calculator();
		
		// 2.调用Calculator对象的方法，获取到程序运行实际的结果
		int actualResult = calculator.sum(5, 3);
		
		// 3.声明一个变量，表示程序运行期待的结果
		int expectedResult = 8;
		
		// 4.使用断言来判断实际结果和期待结果是否一致
		// 如果一致：测试通过，不会抛出异常
		// 如果不一致：抛出异常，测试失败
		assertEquals(expectedResult, actualResult);
		
	}
	
}
```

然后运行Maven的编译命令：mvn compile

然后看到编译成功。


### 第七节 实验七：测试依赖的传递性

http://heavy_code_industry.gitee.io/code_heavy_industry/pro002-maven/chapter03/verse06.html

### 第八节 实验八：测试依赖的排除

### 第九节 实验九：继承

### 第十节 实验十：聚合

## 第四章 使用 Maven：IDEA 环境

## 第五章 其他核心概念

## 第六章 单一架构案例
