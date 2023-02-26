[返回目录](/blog/microservices/index)

# Feign远程调用

- Feign替代RestTemplate
- 自定义配置
- Feign使用优化
- 最佳实践

## Feign替代RestTemplate

RestTemplate方式调用存在的问题

- 代码可读性差，编程体验不统一
- 参数复杂URL难以维护

## Feign

声明式HTTP客户端

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