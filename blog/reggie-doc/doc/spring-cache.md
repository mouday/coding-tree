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



