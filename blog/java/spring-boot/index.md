# spring-boot


[黑马程序员SpringBoot2全套视频教程](https://www.bilibili.com/video/BV15b4y1a7yG/)

[Spring Boot 文档](https://felord.cn/_doc/_springboot/2.1.5.RELEASE/_book/pages/boot-documentation.html)


## 开发环境

- Maven 3.6.1
- SpringBoot 2.5.4 （稳定版）

## SpringBoot入门案例

创建项目

- 方式1、基于IDEA创建
- 方式2、基于SpringBoot脚手架创建：https://start.spring.io/
- 方式3、基于Alibaba脚手架创建：https://start.aliyun.com/
- 方式4、基于普通Maven工程创建

目录结构如下

```bash
$ tree -I target
.
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── example
    │   │           └── demo
    │   │               ├── Application.java
    │   │               └── controller
    │   │                   └── IndexController.java
    │   └── resources
    └── test
        └── java
```

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- 1、继承 spring-boot parent -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.7</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.example</groupId>
    <artifactId>spring_01_01</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <!-- 2、引入 web 依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
</project>
```

Application.java

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 创建引导类
 */
@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
```


IndexController.java

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {
    @GetMapping("/")
    public String index(){
        return "Hello";
    }
}
```

访问页面：http://127.0.0.1:8080/


## 项目解析

- parent
- starter
- 引导类
- 内嵌tomcat

### parent

GAV可以只写GA，不写version

```
spring-boot-dependencies
spring-boot-starter-parent 定义了依赖管理，减少依赖冲突
```

### starter

spring-boot-starter-web 进行依赖传递，减少依赖配置

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
        <version>2.7.7</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-json</artifactId>
        <version>2.7.7</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-tomcat</artifactId>
        <version>2.7.7</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-web</artifactId>
        <version>5.3.24</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.3.24</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```

### 引导类

### 内嵌tomcat


https://www.bilibili.com/video/BV15b4y1a7yG?p=10&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da