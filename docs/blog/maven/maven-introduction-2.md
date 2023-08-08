[返回目录](/blog/maven/index.md)

# 第二章 Maven 核心程序解压和配置

## 第一节 Maven 核心程序解压与配置

### 1、Maven 官网地址

- 首页：[https://maven.apache.org/](https://maven.apache.org/)
- 下载页面：[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

### 2、解压 Maven 核心程序

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

### 3、指定本地仓库

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

### 4、配置阿里云提供的镜像仓库

[https://developer.aliyun.com/mvn/guide](https://developer.aliyun.com/mvn/guide)

```xml
<mirror>
  <id>aliyunmaven</id>
  <mirrorOf>*</mirrorOf>
  <name>阿里云公共仓库</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

### 5、配置 Maven 工程的基础 JDK 版本

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

## 第二节 配置环境变量

### 1、检查 JAVA_HOME 配置是否正确

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

### 2、配置 MAVEN_HOME 和 PATH

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

### 3、验证

```bash
$ mvn -v
Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
Maven home: /Users/user/Applications/apache-maven-3.6.3
Java version: 1.8.0_361, vendor: Oracle Corporation, runtime: /Users/user/Applications/jdk/jdk1.8.0_361.jdk/Contents/Home/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "mac os x", version: "10.14.4", arch: "x86_64", family: "mac"
```
