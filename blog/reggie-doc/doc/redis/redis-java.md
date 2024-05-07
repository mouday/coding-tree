# 在Java中操作Redis

Redis的Java客户端

- Jedis
- Lettuce
- Redisson
- Spring Data Redis

## 1、Jedis

Maven坐标

```xml
<!-- https://mvnrepository.com/artifact/redis.clients/jedis -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>4.0.0</version>
</dependency>
```

使用Jedis操作Redis的步骤

1. 获取链接
2. 执行操作
3. 关闭链接

单元测试junit

```xml
<!-- https://mvnrepository.com/artifact/junit/junit -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
    <scope>test</scope>
</dependency>
```

使用示例

```java
package com.example.demo;

import org.junit.Test;
import redis.clients.jedis.Jedis;

public class JedisTest {

    @Test
    public void testJedis(){
        // 1. 获取链接
        Jedis jedis = new Jedis();

        // 2. 执行操作
        jedis.set("name", "Tom");

        // 3. 关闭链接
        jedis.close();
    }
}

```

## 2、Spring Data Redis

spring-boot-starter-data-redis 坐标

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

提供了高度封装的类：RedisTemplate

- ValueOperations 字符串操作
- SetOperations   集合操作
- ZSetOperations  有序集合操作
- HashOperations  map类型操作
- ListOperations  list类型操作

### 依赖pom.xml

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
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

```

### redis连接参数配置

application.yml

```yml
spring:
  application:
    name: "spring-boot-redis-demo"

  # redis相关配置
  redis:
    host: "localhost"
    port: 6379
    # password: "123456"
    # 操作0号数据库
    database: 0

    # redis连接池配置
    jedis:
      pool:
        # 最大连接数
        max-active: 8
        # 最大阻塞等待时间
        max-wait: 1ms
        # 最小空闲连接
        min-idle: 0
        # 最大空闲连接
        max-idle: 4
```

配置序列化器

```java
package com.example.demo.config;

import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig extends CachingConfigurerSupport {

    /**
     * 自定义RedisTemplate 序列化器
     * @param factory
     * @return
     * 等价于
     * @see org.springframework.data.redis.core.StringRedisTemplate
     */
    @Bean
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory factory){
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

使用示例

```java
package com.example.demo;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
@RunWith(SpringRunner.class)
public class SpringBootRedisTest {

    @Autowired
    private RedisTemplate redisTemplate;

    // @Autowired
    // private StringRedisTemplate stringRedisTemplate;

    @Test
    public void testString(){
        redisTemplate.opsForValue().set("name", "Tom");
    }
}
```

### 操作string类型数据

```java
// 设置
redisTemplate.opsForValue().set("name", "Tom");

// 获取
String name = (String)redisTemplate.opsForValue().get("name");
System.out.println(name);

// 设置超时时间
redisTemplate.opsForValue().set("age", "23", 10L, TimeUnit.SECONDS);

// 如果不存在就设置
Boolean ret = redisTemplate.opsForValue().setIfAbsent("name", "Jack");
System.out.println(ret);

```

### 操作Hash类型数据

```java
// 获取操作对象
HashOperations hashOperations = redisTemplate.opsForHash();

// 设置属性值
hashOperations.put("001", "name", "Tom");
hashOperations.put("001", "age", "20");

// 获取属性值
String name = (String)hashOperations.get("001", "name");
System.out.println(name);

// 获取所有属性值
Set<String> keys = hashOperations.keys("001");
for (String key : keys) {
    System.out.println(key);
}
```

### 操作List类型数据

```java
// 获取操作对象
ListOperations listOperations = redisTemplate.opsForList();

// 左边插入数据
listOperations.leftPush("list", "apple");
listOperations.leftPush("list", "orange");

// 取值
List<String> list = listOperations.range("list", 0, -1);
for (String value : list) {
    System.out.println(value);
}

// 弹出队列
int size = listOperations.size("list").intValue();
for (int i = 0; i < size; i++) {
    String element = (String) listOperations.rightPop("list");
    System.out.println(element);
}
```

### 操作Set类型数据

```java
// 获取操作对象
SetOperations setOperations = redisTemplate.opsForSet();

// 存值
setOperations.add("set", "apple", "orange", "banana", "apple");

// 取值
Set<String> set = setOperations.members("set");
for (String value : set) {
    System.out.println(value);
}

// 删除
setOperations.remove("set", "banana");
```

### 操作ZSet类型数据

```java
// 获取操作对象
ZSetOperations zSetOperations = redisTemplate.opsForZSet();

// 存值
zSetOperations.add("myzset", "apple", 10.0);
zSetOperations.add("myzset", "orange", 12.0);
zSetOperations.add("myzset", "banana", 13.0);
zSetOperations.add("myzset", "apple", 15.0);

// 取值
Set<String> set = zSetOperations.range("myzset", 0, -1);
for (String value : set) {
    System.out.printf("%s ", value);
}
System.out.println();
// orange banana apple


// 增加分数值
zSetOperations.incrementScore("myzset", "orange", 20.0);
// banana apple orange

// 取值
Set<String> set1 = zSetOperations.range("myzset", 0, -1);
for (String value : set1) {
    System.out.printf("%s ", value);
}
System.out.println();

// 删除
zSetOperations.remove("myzset", "banana");

// 取值
Set<String> set2 = zSetOperations.range("myzset", 0, -1);
for (String value : set2) {
    System.out.printf("%s ", value);
}
// apple orange

```

### 通用操作

```java
// 获取所有key
Set<String> keys = redisTemplate.keys("*");
for (String key : keys) {
    System.out.println(key);
}

// 检查key是否存在
Boolean hasName = redisTemplate.hasKey("name");
System.out.println(hasName);

// 获取数据类型
DataType name = redisTemplate.type("name");
System.out.println(name.name());

// 删除key
redisTemplate.delete("name");
```

### 完整代码

```java
package com.example.demo;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.DataType;
import org.springframework.data.redis.core.*;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@SpringBootTest
@RunWith(SpringRunner.class)
public class SpringBootRedisTest {

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    /**
     * 操作String类型数据
     */
    @Test
    public void testString() {
        // 设置
        redisTemplate.opsForValue().set("name", "Tom");

        // 获取
        String name = (String) redisTemplate.opsForValue().get("name");
        System.out.println(name);

        // 设置超时时间
        redisTemplate.opsForValue().set("age", "23", 10L, TimeUnit.SECONDS);

        // 如果不存在就设置
        Boolean ret = redisTemplate.opsForValue().setIfAbsent("name", "Jack");
        System.out.println(ret);
    }

    /**
     * 操作Hash类型数据
     */
    @Test
    public void testHash() {
        // 获取操作对象
        HashOperations hashOperations = redisTemplate.opsForHash();

        // 设置属性值
        hashOperations.put("001", "name", "Tom");
        hashOperations.put("001", "age", "20");

        // 获取属性值
        String name = (String) hashOperations.get("001", "name");
        System.out.println(name);

        // 获取所有属性值
        Set<String> keys = hashOperations.keys("001");
        for (String key : keys) {
            System.out.println(key);
        }
    }

    /**
     * 操作List类型数据
     */
    @Test
    public void testList() {
        // 获取操作对象
        ListOperations listOperations = redisTemplate.opsForList();

        // 左边插入数据
        listOperations.leftPush("list", "apple");
        listOperations.leftPush("list", "orange");

        // 取值
        List<String> list = listOperations.range("list", 0, -1);
        for (String value : list) {
            System.out.println(value);
        }

        // 弹出队列
        int size = listOperations.size("list").intValue();
        for (int i = 0; i < size; i++) {
            String element = (String) listOperations.rightPop("list");
            System.out.println(element);
        }

    }

    /**
     * 操作Set类型数据
     */
    @Test
    public void testSet() {
        // 获取操作对象
        SetOperations setOperations = redisTemplate.opsForSet();

        // 存值
        setOperations.add("set", "apple", "orange", "banana", "apple");

        // 取值
        Set<String> set = setOperations.members("set");
        for (String value : set) {
            System.out.println(value);
        }

        // 删除
        setOperations.remove("set", "banana");


    }

    /**
     * 操作ZSet类型数据
     */
    @Test
    public void testZSet() {
        // 获取操作对象
        ZSetOperations zSetOperations = redisTemplate.opsForZSet();

        // 存值
        zSetOperations.add("myzset", "apple", 10.0);
        zSetOperations.add("myzset", "orange", 12.0);
        zSetOperations.add("myzset", "banana", 13.0);
        zSetOperations.add("myzset", "apple", 15.0);

        // 取值
        Set<String> set = zSetOperations.range("myzset", 0, -1);
        for (String value : set) {
            System.out.printf("%s ", value);
        }
        System.out.println();
        // orange banana apple


        // 增加分数值
        zSetOperations.incrementScore("myzset", "orange", 20.0);
        // banana apple orange

        // 取值
        Set<String> set1 = zSetOperations.range("myzset", 0, -1);
        for (String value : set1) {
            System.out.printf("%s ", value);
        }
        System.out.println();

        // 删除
        zSetOperations.remove("myzset", "banana");

        // 取值
        Set<String> set2 = zSetOperations.range("myzset", 0, -1);
        for (String value : set2) {
            System.out.printf("%s ", value);
        }
        // apple orange
    }

    /**
     * 通用操作
     */
    @Test
    public void testCommon() {

        // 获取所有key
        Set<String> keys = redisTemplate.keys("*");
        for (String key : keys) {
            System.out.println(key);
        }

        // 检查key是否存在
        Boolean hasName = redisTemplate.hasKey("name");
        System.out.println(hasName);

        // 获取数据类型
        DataType name = redisTemplate.type("name");
        System.out.println(name.name());

        // 删除key
        redisTemplate.delete("name");

    }
}

```