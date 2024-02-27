[返回目录](/blog/java/spring-boot/index.md)

# 13、SpringBoot测试

测试环境

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.7</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <!-- test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

SpringBoot应用入口

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```


## 加载测试专用属性

application.yml

```yaml
person:
  name: "Tom"
```

读取yaml文件配置

```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class PropTest {
    @Value("${person.name}")
    private String name;

    @Test
    public void testProp() {
        System.out.println(name); // Tom
    }
}

```

使用临时属性配置，优先级高于yaml文件配置

```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {"person.name=Jack"})
public class PropTest {
    @Value("${person.name}")
    private String name;

    @Test
    public void testProp() {
        System.out.println(name); // Jack
    }
}

```

使用临时的命令行参数，命令行参数优先级高于yaml文件配置

```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(args = {"--person.name=Steve"})
public class PropTest {
    @Value("${person.name}")
    private String name;

    @Test
    public void testProp() {
        System.out.println(name); // Steve
    }
}

```

同时使用临时属性配置和临时的命令行参数时，临时属性优先级高于命令行参数，不同版本优先级可能不一样，不建议同时使用

```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest(properties = {"person.name=Jack"}, args = {"--person.name=Steve"})
public class PropTest {
    @Value("${person.name}")
    private String name;

    @Test
    public void testProp() {
        System.out.println(name); // Jack
    }
}

```

## 加载测试专用配置

使用`@Import` 注解加载当前测试类专用的配置

```java
package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestConfig {
    @Bean
    public String msg() {
        return "message";
    }
}

```

```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import({TestConfig.class})
public class ConfigurationTest {
    @Autowired
    private String msg;

    @Test
    public void testMsg() {
        System.out.println(msg);
    }
}

```


Web环境模拟测试
数据层测试回滚
测试用例数据设定
