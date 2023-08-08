[返回目录](/blog/microservices/index)

# Eureka注册中心

文档

- [https://github.com/Netflix/eureka](https://github.com/Netflix/eureka)

## 远程调用的问题

服务提供者的地址不固定

## Eureka原理

```
- EurekaServer服务端，注册中心
    - 记录服务信息
    - 心跳监控

- EurekaClient客户端
    - Provider：服务提供者，
        - 注册自己的信息到EurekaServer
        - 每30秒项EurekaServer发送心跳
    - Consumer：服务消费者
        - 根据服务名称从EurekaServer拉取服务列表
        - 基于服务列表做负载均衡，选取其中一个服务后发起远程调用
```

## 搭建EurekaServer

1、引入eureka-server依赖

```xml
<!-- eureka -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

2、添加@EnableEurekaServer注解

```java
package cn.itcast.eureka;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@EnableEurekaServer
@SpringBootApplication
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}

```

3、在application.yml中配置eureka地址

```yaml
server:
  port: 10086

spring:
  application:
    name: eurekaserver

eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka/
```


## 服务注册

1、引入eureka-client依赖

```xml
<!-- eureka-client -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

2、在application.yml中配置eureka地址

```yaml
spring:
  application:
    name: orderservice # 服务名称

eureka:
  client:
    service-url:
      # 服务地址
      defaultZone: http://127.0.0.1:10086/eureka/

```

启动多个user-service实例

```
-Dserver.port=8082
```

## 服务发现


1、用服务名称代替ip和端口

```java
// String url = "http://127.0.0.1:8081/user/" + order.getUserId();
String url = "http://userservice/user/" + order.getUserId();
```

2、RestTemplate添加负载均衡注解

```java
// RestTemplate
@Bean
@LoadBalanced // 负载均衡
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```
