[返回目录](/blog/microservices/index)

# Gateway 服务网关

- 为什么需要网关
- gateway 快速入门
- 断言工厂
- 过滤器工厂
- 全局过滤器
- 跨域问题

## 1、为什么需要网关

网关的核心功能特性

- 身份认证、权限控制
- 请求路由
- 请求限流

两种实现

- gateway： 基于 WebFlux，响应式编程
- zuul： 基于 Servlet，阻塞式编程

![](img/gateway.png)

## 2、gateway 快速入门

1、创建 SpringBoot 工程 gateway，引入网关依赖

```xml
<!--网关-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>

<!--nacos服务发现依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

2、编写启动类

```java
package cn.itcast.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GateWayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GateWayApplication.class, args);
    }
}

```

3、编写基础配置和路由规则

```yaml
server:
  port: 10010 # 网关端口
spring:
  application:
    name: gateway # 服务名称
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
    gateway:
      routes: # 网关路由配置
        - id: user-service # 路由id，自定义，只要唯一即可
          # uri: http://127.0.0.1:8081 # 路由的目标地址 http就是固定地址
          uri: lb://userservice # 路由的目标地址 lb就是负载均衡，后面跟服务名称
          predicates: # 路由断言，也就是判断请求是否符合路由规则的条件
            - Path=/user/** # 这个是按照路径匹配，只要以/user/开头就符合要求
        - id: order-service # 路由id，自定义，只要唯一即可
          # uri: http://127.0.0.1:8081 # 路由的目标地址 http就是固定地址
          uri: lb://orderservice # 路由的目标地址 lb就是负载均衡，后面跟服务名称
          predicates: # 路由断言，也就是判断请求是否符合路由规则的条件
            - Path=/order/** # 这个是按照路径匹配，只要以/user/开头就符合要求
```

4、启动网关服务进行测试

http://127.0.0.1:10010/user/1

```json
{
  "id": 1,
  "username": "柳岩",
  "address": "湖南省衡阳市"
}
```

路由配置包括：

1. 路由 id：路由的唯一标示

2. 路由目标（uri）：路由的目标地址

   - http：代表固定地址
   - lb：代表根据服务名负载均衡

3. 路由断言（predicates）：判断路由的规则

4. 路由过滤器（filters）：对请求或响应做处理

![](img/gateway-process.png)

## 3、断言工厂

处理类：
`org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory`


| 名称       | 说明                            | 示例                                                                                                    |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| After      | 是某个时间点后的请求            | `After=2037-01-20T17:42:47.789-07:00[America/Denver]`                                                   |
| Before     | 是某个时间点之前的请求          | `Before=2031-04-13T15:14:47.433+08:00[Asia/Shanghai]`                                                   |
| Between    | 是某两个时间点之前的请求        | `Between=2037-01-20T17:42:47.789-07:00[America/Denver],  2037-01-21T17:42:47.789-07:00[America/Denver]` |
| Cookie     | 请求必须包含某些 cookie         | `Cookie=chocolate, ch.p`                                                                                |
| Header     | 请求必须包含某些 header         | `Header=X-Request-Id, \d+`                                                                              |
| Host       | 请求必须是访问某个 host（域名） | `Host=**.somehost.org,**.anotherhost.org`                                                               |
| Method     | 请求方式必须是指定方式          | `Method=GET,POST`                                                                                       |
| Path       | 请求路径必须符合指定规则        | `Path=/red/{segment},/blue/**`                                                                          |
| Query      | 请求参数必须包含指定参数        | `Query=name, Jack`或者 `Query=name`                                                                     |
| RemoteAddr | 请求者的 ip 必须是指定范围      | `RemoteAddr=192.168.1.1/24`                                                                             |
| Weight     | 权重处理                        |                                                                                                         |

## 4、过滤器工厂

![](img/gateway-filter.png)

过滤器的作用

1. 对路由的请求或响应做加工处理，比如添加请求头

2. 配置在路由下的过滤器只对当前路由的请求生效

3. defaultFilters对所有路由都生效的过滤器


常用的路由过滤器工厂

| 名称            | 说明                     |
| -------------------- | ---------------------------- |
| AddRequestHeader     | 给当前请求添加一个请求头     |
| RemoveRequestHeader  | 移除请求中的一个请求头       |
| AddResponseHeader    | 给响应结果中添加一个响应头   |
| RemoveResponseHeader | 从响应结果中移除有一个响应头 |
| RequestRateLimiter   | 限制请求的流量               |

局部过滤器

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://userservice
          predicates:
            - Path=/user/**
          filters: # 过滤器
            - AddRequestHeader=X-Token, token-value # 添加请求头
```

默认过滤器

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://userservice
          predicates:
            - Path=/user/**
      default-filters: # 默认过滤器
        - AddRequestHeader=X-Token, token-value # 添加请求头
```

## 5、全局过滤器

## 6、跨域问题
