# 二、Spring入门

## 入门案例开发步骤

1. 引入Spring相关依赖
2. 创建类，定义属性和方法
3. 按照Spring要求出创建配置文件（xml格式）
4. 在Spring配置文件配置相关信息
5. 进行最终测试

## 入门案例开发

项目结构

```bash
$ tree -I target
.
├── pom.xml
└── spring-first
    ├── pom.xml
    └── src
        ├── main
        │   ├── java
        │   │   └── com
        │   │       └── atguigu
        │   │           └── spring6
        │   │               └── User.java
        │   └── resources
        │       └── bean.xml
        └── test
            └── java
                └── com
                    └── atguigu
                        └── spring6
                            └── UserTest.java

```

pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>spring-demo</artifactId>
        <groupId>com.atguigu</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>spring-first</artifactId>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- spring context -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>6.0.2</version>
        </dependency>

        <!-- junit -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>5.6.3</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

User.java
```java
package com.atguigu.spring6;

public class User {

    public void add(){
        System.out.println("add...");
    }
}

```

创建对象

bean标签

- id属性：唯一标识
- class属性：创建对象类的全路径（包名+类名）


bean.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="user" class="com.atguigu.spring6.User"></bean>
</beans>
```
UserTest.java

```java
package com.atguigu.spring6;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

class UserTest {

    @Test
    void add() {
        //加载spring配置文件，创建对象
        ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

        //获取创建的对象
        User user = (User) context.getBean("user");

        //调用对象的方法
        user.add();

    }
}
```

## 入门案例原理分析

1、无参构造函数创建对象

2、使用反射创建对象

1. 加载bean.xml配置文件
2. 解析xml文件
3. 获取xml文件bean标签属性值
    - id和class属性值
4. 使用反射根据全类名路径创建对象

```java
Class clazz = Class.forName("com.atguigu.spring6.User");
User user = (User)clazz.getDeclaredConstructor().newInstance();
System.out.println(user);
```

3、创建的对象存放容器

```java
public class DefaultListableBeanFactory 
        extends AbstractAutowireCapableBeanFactory
        implements ConfigurableListableBeanFactory, BeanDefinitionRegistry, Serializable {
    // key 唯一标识
    // value 类的定义 描述信息
    private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<>(256);
}
```

## 启用Log4j2日志

### 重要的组件

1、优先级：（由低到高）

- Trace 追踪
- debug 调试
- info 信息
- warn 警告
- error 错误
- fatal 严重错误

2、日志输出目的地
- 控制台
- 文件

3、日志输出的格式

### 引入依赖

```xml
<!--log4j-->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.19.0</version>
</dependency>

<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.19.0</version>
</dependency>
```

### 配置文件

resources/log4j2.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <loggers>
        <!--
            level指定日志级别，从低到高的优先级：
                TRACE < DEBUG < INFO < WARN < ERROR < FATAL
                trace：追踪，是最低的日志级别，相当于追踪程序的执行
                debug：调试，一般在开发中，都将其设置为最低的日志级别
                info：信息，输出重要的信息，使用较多
                warn：警告，输出警告的信息
                error：错误，输出错误信息
                fatal：严重错误
        -->
        <root level="DEBUG">
            <appender-ref ref="spring6log"/>
            <appender-ref ref="RollingFile"/>
            <appender-ref ref="log"/>
        </root>
    </loggers>

    <appenders>
        <!--输出日志信息到控制台-->
        <console name="spring6log" target="SYSTEM_OUT">
            <!--控制日志输出的格式-->
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss SSS} [%t] %-3level %logger{1024} - %msg%n"/>
        </console>

        <!--文件会打印出所有信息，这个log每次运行程序会自动清空，由append属性决定，适合临时测试用-->
        <File name="log" fileName="logs/test.log" append="false">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} %-5level %class{36} %L %M - %msg%xEx%n"/>
        </File>

        <!-- 这个会打印出所有的信息，
            每次大小超过size，
            则这size大小的日志会自动存入按年份-月份建立的文件夹下面并进行压缩，
            作为存档-->
        <RollingFile name="RollingFile" fileName="logs/app.log"
                     filePattern="log/$${date:yyyy-MM}/app-%d{MM-dd-yyyy}-%i.log.gz">
            <PatternLayout pattern="%d{yyyy-MM-dd 'at' HH:mm:ss z} %-5level %class{36} %L %M - %msg%xEx%n"/>
            <SizeBasedTriggeringPolicy size="50MB"/>
            <!-- DefaultRolloverStrategy属性如不设置，
            则默认为最多同一文件夹下7个文件，这里设置了20 -->
            <DefaultRolloverStrategy max="20"/>
        </RollingFile>
    </appenders>
</configuration>
```

### 使用Logger

```java
package com.atguigu.spring6;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class UserTest {
    // 获取logger
    private Logger logger = LoggerFactory.getLogger(UserTest.class);

    @Test
    public void helo() {
        logger.info("调用成功");
    }
}
```
