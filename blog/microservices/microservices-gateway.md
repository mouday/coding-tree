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

全局过滤器的作用：
- 对所有路由都生效的过滤器，并且可以自定义处理逻辑

实现全局过滤器的步骤：
- 实现GlobalFiler 接口
- 添加@Order 注解或实现Ordered 接口
- 编写处理逻辑

区别：

- GatewayFilter通过配置定义，处理逻辑是固定的
- GlobalFilter的逻辑需要自己写代码实现

```java
public interface GlobalFilter {
    /**
     *  处理当前请求，有必要的话通过{@link GatewayFilterChain}将请求交给下一个过滤器处理
     *
     * @param exchange 请求上下文，里面可以获取Request、Response等信息
     * @param chain 用来把请求委托给下一个过滤器 
     * @return {@code Mono<Void>} 返回标示当前过滤器业务结束
     */
    Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain);
}
```

示例

判断参数中是否含有`role=admin`

```java
package cn.itcast.gateway.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Order(-1)
@Component
public class AuthorizeFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 获取请求参数
        MultiValueMap<String, String> queryParams = exchange.getRequest().getQueryParams();

        // 获取认证参数
        String role = queryParams.getFirst("role");

        if ("admin".equals(role)) {
            // 放行
            return chain.filter(exchange);
        } else {
            // 拦截
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

    }
}
```

访问测试
```bash
GET http://127.0.0.1:10010/user/1

# 返回状态代码: 
401 Unauthorized

### 

GET http://127.0.0.1:10010/user/1?role=admin

# 返回
{
  "id": 1,
  "username": "柳岩",
  "address": "湖南省衡阳市"
}
```

### 过滤器执行顺序

三类过滤器（优先级由高到低）：
- DefaultFilter
- 路由过滤器
- GlobalFilter

Order值越小，优先级越高

![](img/gateway-order.png)

```yaml
gateway:
  routes:
      - id: user-service
        filters: # 路由过滤器
          - AddRequestHeader=X-Token, route-value
  default-filters: # 默认过滤器
    - AddRequestHeader=X-Token, default-value
```

## 6、跨域问题

跨域：域名 + 端口 不一致就是跨域

主要包括：

- 域名不同： www.taobao.com 和 www.taobao.org 和 www.jd.com 和 miaosha.jd.com

- 域名相同，端口不同：localhost:8080和localhost:8081

跨域问题：浏览器禁止请求的发起者与服务端发生跨域ajax请求，请求被浏览器拦截的问题

解决方案：CORS "跨域资源共享"（Cross-origin resource sharing）

可参考：跨域资源共享 CORS 详解 https://www.ruanyifeng.com/blog/2016/04/cors.html


### 解决跨域问题

gateway服务的application.yml文件配置

```yaml
spring:
  cloud:
    gateway:
      globalcors: # 全局的跨域处理
        add-to-simple-url-handler-mapping: true # 解决options请求被拦截问题
        corsConfigurations:
          '[/**]':
            allowedOrigins: # 允许哪些网站的跨域请求 
              - "http://localhost:8090"
            allowedMethods: # 允许的跨域ajax的请求方式
              - "GET"
              - "POST"
              - "DELETE"
              - "PUT"
              - "OPTIONS"
            allowedHeaders: "*" # 允许在请求中携带的头信息
            allowCredentials: true # 是否允许携带cookie
            maxAge: 360000 # 这次跨域检测的有效期
```

跨域配置参数
- 域名
- 请求方式 
- 请求头
- cookie
- 有效期

### 模拟跨域问题

```html
<!doctype html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
<script>
    axios.get("http://127.0.0.1:10010/user/1?role=admin")
        .then(function(res){
            console.log(res.data)
        })
</script>
</body>
</html>
```

如果没有配置允许跨域请求，会报错
```
Access to XMLHttpRequest at 'http://127.0.0.1:10010/user/1?role=admin' 
from origin 'http://localhost:63342' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```