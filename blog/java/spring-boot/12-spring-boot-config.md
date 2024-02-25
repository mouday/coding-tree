[返回目录](/blog/java/spring-boot/index.md)

# 12、SpringBoot配置高级

## `@ConfigurationProperties`

### 自定义配置回顾

application.yml

```yaml
person:
  name: Tom
  age: 20
```

配置类

```java
package com.example.demo;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "person")
public class PersonConfig {
    private String name;
    private Integer age;
}

```

在程序入口获取配置打印测试

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        ConfigurableApplicationContext ctx = SpringApplication.run(Application.class, args);
        
        PersonConfig personConfig = ctx.getBean(PersonConfig.class);
        System.out.println(personConfig);
        // PersonConfig(name=Tom, age=20)
    }
}

```

### 使用`@ConfigurationProperties`为第三方bean绑定属性

```yaml
datasource:
  driver-class-name: com.mysql.cj.jdbc.Driver
```

```java
@Bean
@ConfigurationProperties(prefix = "datasource")
public DruidDataSource dataSource(){
    DruidDataSource druidDataSource = new DruidDataSource();
    return druidDataSource;
}
```

### 使用`@EnableConfigurationProperties`

使用`@EnableConfigurationProperties`可以将使用`@ConfigurationProperties`注解的类加入Spring容器

```java
// @Component
@ConfigurationProperties(prefix = "person")
@Data
public class PersonConfig {
    private String name;
    private Integer age;
}
```

```java
@EnableConfigurationProperties(PersonConfig.class)
@SpringBootApplication
public class Application {
}
```


> 注意：`@EnableConfigurationProperties`和`@Component` 不能同时使用


如果`@ConfigurationProperties` 有注释警告，可以加入以下依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
</dependency>
```


## 宽松绑定/松散绑定
`@ConfigurationProperties`绑定属性大小写不敏感，自动忽略中划线和下划线

```
@Data
@Component
@ConfigurationProperties(prefix = "person")
public class ServerConfig {
    private String ipAddress;
}
```

```yaml
ipAddress: 127.0.0.1   # 驼峰
ip_address: 127.0.0.1  # 下划线
ip-address: 127.0.0.1  # 中划线，推荐写法
IP_ADDRESS: 127.0.0.1  # 常量

ip_Address: 127.0.0.1
```

> 注意：宽松绑定不支持注解@Value引用单个属性的方式

绑定的前缀命名规范：仅能使用纯小写字母、数字、下划线作为合法的字符

## 常用计量单位绑定

SpringBoot支持JDK8提供的时间与空间计量单位

```java
@ConfigurationProperties(prefix = "server")
@Data
public class ServerConfig {
    @DataSizeUnit(DataUnit.MEGABYTES)
    private DataSize dataSize;

    @DurationUnit(ChronoUnit.DAYS)
    private Duration duration;
}
```

也可以配置单位

```yaml
server:
    dataSize: 10MB
```

## 数据校验

使用JSR303校验规范

引入依赖

```xml
<!--JSR303校验规范-->
<dependency>
    <groupId>javax.validation</groupId>
    <artifactId>validation-api</artifactId>
</dependency>

<!--hibernate实现类-->
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
</dependency>
```

使用`@Validated` 开启校验功能和指定校验规则

```java
@Component
@ConfigurationProperties(prefix = "config")
@Data
@Validated
public class Config {
    @Max(100)
    private Integer age;

}
```
