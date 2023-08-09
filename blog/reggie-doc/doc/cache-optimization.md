# 缓存优化

- 环境搭建
- 缓存短信验证码
- 缓存菜品数据
- Spring Cache
- 缓存套餐数据

## 环境搭建

1、通过git管理代码

新建分支v1.0，开发优化功能

2、mave坐标

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

3、配置文件

```yml
spring:
  # redis相关配置
  redis:
    host: "localhost"
    port: 6379
    # password: "123456"
    # 操作0号数据库
    database: 0
```

4、配置类

```java
package com.github.mouday.reggie.config;

import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis配置
 */
@Configuration
public class RedisConfig extends CachingConfigurerSupport {

    /**
     * 自定义RedisTemplate 序列化器
     *
     * @param factory
     * @return 等价于
     * @see org.springframework.data.redis.core.StringRedisTemplate
     */
    @Bean
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<Object, Object> redisTemplate = new RedisTemplate<>();

        // 默认string的序列化器 JdkSerializationRedisSerializer
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());

        // 默认hash field的序列化器
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new StringRedisSerializer());

        redisTemplate.setConnectionFactory(factory);

        return redisTemplate;
    }
}

```

## 缓存短信验证码

实现思路

1. 将验证码存入Redis中
2. 登录时从Redis中获取验证码，比对用户输入
3. 登录成功后，删除Redis中的验证码

关键代码

```java
// 存入redis 过期时间5分钟
redisTemplate.opsForValue().set(phone, code, 5, TimeUnit.MINUTES);

// 从 redis 取出验证码
String sessionCode = redisTemplate.opsForValue().get(phone);

// 登录成功后，删除redis中的验证码
redisTemplate.delete(phone);

```

## 缓存菜品数据

实现思路

1. 查询数据的时候先尝试从redis中获取
2. 获取失败再走数据库查询，查询结果缓存到redis中
3. 如果数据库中的数据变化了，需要及时清理缓存，保证数据库中的数据和缓存中的数据一致

关键代码

```java
// 动态构造缓存的key
String key = "dish:" + dish.getCategoryId() + "_" + dish.getStatus();

// 1、查询数据的时候先尝试从redis中获取
String value = redisTemplate.opsForValue().get(key);
if (value != null) {
    return R.success(JSON.parseArray(value, DishDto.class));
}

// 2、获取失败再走数据库查询，查询结果缓存到redis中
redisTemplate.opsForValue().set(key, JSON.toJSONString(dishDtolist), 60, TimeUnit.MINUTES);

// 3. 如果数据库中的数据变化了，需要及时清理缓存，保证数据库中的数据和缓存中的数据一致
redisTemplate.delete(key);
```

## Spring Cache

## 缓存套餐数据