# Spring Cache

## Spring Cache简介

Spring Cache实现了基于注解的缓存功能

```java
CacheManager
    - EhCacheManager
    - GuavaCacheManager
    - RedisCacheManager
```

## Spring Cache常用注解

| 注解 | 说明 | 
| - | - | 
| @EnableCaching | 开启缓存注解功能
| @Cacheable | 如果有缓存直接返回，没有则执行方法，返回值放入缓存中
| @CachePut | 将方法的返回值放到缓存中
| @CacheEvict | 将数据从缓存中删除


## Spring Cache使用方式

Spring Cache 使用Redis作为缓存存储介质

1、导入缓存坐标

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

2、开启缓存注解功能

在启动类加`@EnableCaching`

3、使用缓存功能

控制器方法上加`@CachePut`、`@CacheEvict`、`@Cacheable`


## 缓存套餐数据

实现思路

1. 引入spring cache 和 Redis 的 maven坐标
2. application.yml中配置过期时间
3. 启动类上加上@EnableCaching注解
4. list方法加缓存@Cacheable注解
5. save和delete方法加缓存删除@CacheEvict注解
