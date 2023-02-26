[返回目录](/blog/microservices/index)

# 服务拆分及远程调用

## 服务拆分

注意事项

- 不同微服务，不要重复开发相同业务
- 微服务数据独立，不要访问其他微服务的数据库
- 微服务可以将自己的业务暴露为借口，供其他微服务调用

示例代码

- <a href="/blog/microservices/microservices-example-code/cloud-demo.zip" download="cloud-demo.zip">cloud-demo.zip</a>

新建两个数据库并导入数据表

- cloud_user

[](microservices-example-code/cloud-user.sql ':include')

- cloud_order

[](microservices-example-code/cloud-order.sql ':include')


启动服务

接口测试

- 订单服务：http://127.0.0.1:8080/order/101
- 用户服务：http://127.0.0.1:8081/user/1

## 服务远程调用

案例：根据订单id查询订单功能

需求：根据订单id查询订单的同时，把订单所属的用户信息一起返回

实现思路：基于RestTemplate发起HTTP请求实现远程调用

实现代码

```java
package cn.itcast.order.service;

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


    public Order queryOrderById(Long orderId) {
        // 1.查询订单
        Order order = orderMapper.findById(orderId);

        // 2. 查询用户
        String url = "http://127.0.0.1:8081/user/" + order.getUserId();
        User user = restTemplate.getForObject(url, User.class);

        // 3. 设置用户字段数据
        order.setUser(user);

        // 4.返回
        return order;
    }
}

```

## 提供者和消费者

- 提供者：提供接口给其他微服务
- 消费者：调用其他微服务提供的接口

一个服务既可以是提供者，也可以是消费者

