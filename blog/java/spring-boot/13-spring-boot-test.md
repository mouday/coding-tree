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


## Web环境模拟测试

添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 启动web环境

```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ApplicationTest {

	@Test
	void test() {
	}

}

```

控制器

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookController {
    @GetMapping("/book")
    public String getBookById() {
        return "book";
    }
}

```

### 发送虚拟请求

```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc // 开启虚拟mvc调用
public class BookControllerTest {

	// 虚拟mvc调用调用对象
	@Autowired
	public MockMvc mockMvc;

	@Test
	void getBookById() throws Exception {
		RequestBuilder builder = MockMvcRequestBuilders.get("/book");
        // 执行请求
		mockMvc.perform(builder);
	}
}

```

### 匹配状态值响应

```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.result.StatusResultMatchers;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc // 开启虚拟mvc调用
public class BookControllerTest {

	// 虚拟mvc调用调用对象
	@Autowired
	public MockMvc mockMvc;

	@Test
	void testStatus() throws Exception {
		RequestBuilder builder = MockMvcRequestBuilders.get("/book");

		// 执行请求
		ResultActions perform = mockMvc.perform(builder);

		// 设置预期值
		StatusResultMatchers status = MockMvcResultMatchers.status();
		ResultMatcher ok = status.isOk();

		// 预期值和实际执行结果比较
		perform.andExpect(ok);

	}
}

```

### 匹配文本响应

```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.ContentResultMatchers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.result.StatusResultMatchers;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc // 开启虚拟mvc调用
public class BookControllerTest {

	// 虚拟mvc调用调用对象
	@Autowired
	public MockMvc mockMvc;

	@Test
	void testContent() throws Exception {
		RequestBuilder builder = MockMvcRequestBuilders.get("/book");

		// 执行请求
		ResultActions perform = mockMvc.perform(builder);

		// 设置预期值
		ContentResultMatchers content = MockMvcResultMatchers.content();
		ResultMatcher result = content.string("book");

		// 预期值和实际执行结果比较
		perform.andExpect(result);

	}
}

```
### 匹配json响应

引入依赖

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

```java
package com.example.demo.domain;

import lombok.Data;

@Data
public class Book {
    private Long id;

    private String name;
}

```

```java
package com.example.demo.controller;

import com.example.demo.domain.Book;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookController {
    @GetMapping("/book")
    public Book getBookById() {
        Book book = new Book();
        book.setId(3000L);
        book.setName("水浒传");
        
        return book;
    }
}

```


```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.ContentResultMatchers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.result.StatusResultMatchers;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc // 开启虚拟mvc调用
public class BookControllerTest {

	// 虚拟mvc调用调用对象
	@Autowired
	public MockMvc mockMvc;

	@Test
	void testJsonContent() throws Exception {
		RequestBuilder builder = MockMvcRequestBuilders.get("/book");

		// 执行请求
		ResultActions perform = mockMvc.perform(builder);

		// 设置预期值
		ContentResultMatchers content = MockMvcResultMatchers.content();
		ResultMatcher result = content.json("{\"name\": \"水浒传\", \"id\": 3000 }");

		// 预期值和实际执行结果比较
		perform.andExpect(result);

	}
}

```

匹配响应头

```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.ContentResultMatchers;
import org.springframework.test.web.servlet.result.HeaderResultMatchers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.result.StatusResultMatchers;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc // 开启虚拟mvc调用
public class BookControllerTest {

	// 虚拟mvc调用调用对象
	@Autowired
	public MockMvc mockMvc;

	@Test
	void testHeader() throws Exception {
		RequestBuilder builder = MockMvcRequestBuilders.get("/book");

		// 执行请求
		ResultActions perform = mockMvc.perform(builder);

		// 设置预期值
		HeaderResultMatchers header = MockMvcResultMatchers.header();
		ResultMatcher result = header.string("Content-Type", "application/json");

		// 预期值和实际执行结果比较
		perform.andExpect(result);

	}
}

```

## 数据层测试回滚

创建SpringBoot项目

可参考：[6、基于SpringBoot的SSMP整合案例](/blog/java/spring-boot/6-spring-boot-ssmp.md)

测试类中使用`@Transactional`可以不提交事务

```java
package com.example.demo.service;

import com.example.demo.domain.Book;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class BookServiceTest {
    @Autowired
    private BookService bookService;

    @Test
    void save() {
        Book book = new Book();
        book.setTitle("明朝那些事");
        book.setAuthor("当年明月");

        boolean ret = bookService.save(book);
        System.out.println(ret);

    }
}
```

测试类中使用`@Rollback(false)` 可以不回滚事务，提交数据

```java
package com.example.demo.service;

import com.example.demo.domain.Book;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
@Rollback(false)
class BookServiceTest {
    @Autowired
    private BookService bookService;

    @Test
    void save() {
        Book book = new Book();
        book.setTitle("明朝那些事");
        book.setAuthor("当年明月");

        boolean ret = bookService.save(book);
        System.out.println(ret);

    }
}
```
测试用例数据设定
