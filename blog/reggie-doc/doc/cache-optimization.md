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

## 缓存菜品数据
## Spring Cache
## 缓存套餐数据