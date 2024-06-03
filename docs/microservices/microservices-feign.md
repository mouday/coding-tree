[返回目录](/blog/microservices/index)

# Feign远程调用

- Feign替代RestTemplate
- 自定义配置
- Feign使用优化
- 最佳实践

## 1、Feign替代RestTemplate

RestTemplate方式调用存在的问题

- 代码可读性差，编程体验不统一
- 参数复杂URL难以维护

Feign：声明式HTTP客户端

https://github.com/OpenFeign/feign

1、引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

2、启动类添加注解

```java
@EnableFeignClients
@SpringBootApplication
public class OrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}
```

3、编写Feign的客户端

```java
package cn.itcast.order.client;

import cn.itcast.order.pojo.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("userservice")
public interface UserClient {
    @GetMapping("/user/{id}")
    User getUserById(@PathVariable("id") Long id);
}

```

客户端主要是基于SpringMVC的注解来声明远程调用的信息，比如：

- 服务名称：userservice
- 请求方式：GET
- 请求路径：/user/{id}
- 请求参数：Long id
- 返回值类型：User

4、使用Feign客户端代替RestTemplate

```java
package cn.itcast.order.service;

import cn.itcast.order.client.UserClient;
import cn.itcast.order.mapper.OrderMapper;
import cn.itcast.order.pojo.Order;
import cn.itcast.order.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserClient userClient;


    public Order queryOrderById(Long orderId) {
        // 1.查询订单
        Order order = orderMapper.findById(orderId);

        // 2. 查询用户
        // String url = "http://127.0.0.1:8081/user/" + order.getUserId();

        // String url = "http://userservice/user/" + order.getUserId();
        // User user = restTemplate.getForObject(url, User.class);

        User user = userClient.getUserById(order.getUserId());

        // 3. 设置用户字段数据
        order.setUser(user);

        // 4.返回
        return order;
    }
}

```


## 2、自定义配置

Feign支持的自定义配置：

| 类型                   | 作用             | 说明                                                   |
| ---------------------- | ---------------- | ------------------------------------------------------ |
| **feign.Logger.Level** | 修改日志级别     | 包含四种不同的级别：NONE、BASIC、HEADERS、FULL         |
| feign.codec.Decoder    | 响应结果的解析器 | http远程调用的结果做解析，例如解析json字符串为java对象 |
| feign.codec.Encoder    | 请求参数编码     | 将请求参数编码，便于通过http请求发送                   |
| feign. Contract        | 支持的注解格式   | 默认是SpringMVC的注解                                  |
| feign. Retryer         | 失败重试机制     | 请求失败的重试机制，默认是没有，不过会使用Ribbon的重试 |


日志的级别分为四种：

- NONE：不记录任何日志信息，这是`默认值`。
- BASIC：仅记录请求的方法，URL以及响应状态码和执行时间
- HEADERS：在BASIC的基础上，额外记录了请求和响应的头信息
- FULL：记录所有请求和响应的明细，包括头信息、请求体、元数据。


### 1、配置文件方式

application.yml

1、所有服务

```yaml
feign:
  client:
    config: 
      default: # 这里用default就是全局配置
        loggerLevel: FULL #  日志级别 
```


2、单个服务

```yaml
feign:  
  client:
    config: 
      userservice: # 针对某个微服务的配置
        loggerLevel: FULL #  日志级别 
```

### 2、Java代码方式

配置类

```java
package cn.itcast.order.config;

import feign.Logger;
import org.springframework.context.annotation.Bean;

/**
 * Feign配置
 */
public class FeignConfiguration {

    @Bean
    public Logger.Level feignLogLevel(){
        return Logger.Level.BASIC; // 日志级别为BASIC
    }
}

```

1、全局生效

```java
// 启动类
@EnableFeignClients(defaultConfiguration = FeignConfiguration.class)
```

2、局部生效

```java
// 客户端类
@FeignClient(value = "userservice", configuration = FeignConfiguration.class)
```

## 3、Feign使用优化

Feign底层客户端实现包括：

| 实现方式 | 连接池 |
| - | - |
| URLConnection `默认`| 不支持
| Apache HttpClient | 支持
| OKHttp | 支持


提高Feign的性能主要手段

- 使用`连接池`代替默认的URLConnection
- 日志级别：使用Basic或none


1）引入依赖

引入Apache的HttpClient依赖

```xml
<!--httpClient的依赖 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```

2）配置连接池

application.yml配置

```yaml
feign:
  client:
    config:
      default: # default全局的配置
        loggerLevel: NONE # 日志级别,默认
  httpclient:
    enabled: true # 开启feign对HttpClient的支持
    max-connections: 200 # 最大的连接数
    max-connections-per-route: 50 # 每个路径的最大连接数
```

## 4、最佳实践

### 1、继承方式

Feign客户端和Controller都继承同一个接口

![](img/feign-extends.png)

缺点：

- 服务提供方、服务消费方紧耦合


### 2、抽取方式

将Feign的Client和有关的POJO、默认的Feign配置抽取为独立模块，提供给所有消费者使用。

![](img/feign-extract.png)

## 5、抽取案例

将抽取为feign-api模块

```bash
feign-api/
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── cn.itcast.feign
    │   │       ├── client
    │   │       │   └── UserClient.java
    │   │       ├── config
    │   │       │   └── DefaultFeignConfiguration.java
    │   │       └── pojo
    │   │           └── User.java
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
    <parent>
        <artifactId>cloud-demo</artifactId>
        <groupId>cn.itcast.demo</groupId>
        <version>1.0</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>feign-api</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
    </dependencies>

</project>
```

User.java
```java
package cn.itcast.feign.pojo;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String username;
    private String address;
}
```

DefaultFeignConfiguration.java

```java
package cn.itcast.feign.config;

import feign.Logger;
import org.springframework.context.annotation.Bean;

/**
 * Feign配置
 */
public class DefaultFeignConfiguration {

    @Bean
    public Logger.Level feignLogLevel(){
        return Logger.Level.BASIC; // 日志级别为BASIC
    }
}

```

UserClient.java

```java
package cn.itcast.feign.client;

import cn.itcast.feign.pojo.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "userservice")
public interface UserClient {
    @GetMapping("/user/{id}")
    User getUserById(@PathVariable("id") Long id);
}

```

### 解决扫描包问题

1、方式一

指定Feign应该扫描的包

```java
@EnableFeignClients(basePackages = "cn.itcast.feign.clients")
```

2、方式二

指定需要加载的Client接口

```java
@EnableFeignClients(clients = {UserClient.class})
```