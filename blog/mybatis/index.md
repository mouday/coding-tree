
# MyBatis

学习笔记:【尚硅谷】MyBatis零基础入门教程（细致全面，快速上手）

视频地址：https://www.bilibili.com/video/BV1VP4y1c7j7

学习时间：2023-09-04 ~ 待定

学员笔记：
- https://blog.csdn.net/qq_19387933/article/details/123256034
- https://blog.csdn.net/CherryChenieth/article/details/123237754

学习笔记相关代码：https://github.com/mouday/mybatis-note

相关资料：

- 中文文档: [https://mybatis.org/mybatis-3/zh/index.html](https://mybatis.org/mybatis-3/zh/index.html)
- github: [https://github.com/mybatis/mybatis-3](https://github.com/mybatis/mybatis-3)

## 一、MyBatis简介

1、历史

- iBatis = internet abatis
- iBatis 3.x => MyBatis

2、特性

MyBatis是一个基于Java的持久层框架

将 Java POJO（Plain Old Java Objects，普通老式 Java 对象）映射成数据库中的记录

MyBatis是一个半自动的ORM （Object Relation Mapping）框架

DAO（Data Access Objects）

3、和其他持久化层技术对比

- JDBC 开发效率低
- MyBatis 开发效率尚可
- Hibernate和JPA 开发效率高

## 二、MyBatis框架搭建

1、开发环境

- JDK 1.8
- IDEA 2019.2
- Maven 3.5.4
- MySQL 5.7
- Mybatis 3.5.7


2、创建Maven工程

- 创建一个 Empty Project
- 设置Maven 配置文件

引入依赖坐标

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.demo</groupId>
    <artifactId>mybatis-demo-1</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <!-- Mybatis核心 -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.7</version>
        </dependency>

        <!-- junit测试 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>

        <!-- MySQL驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.3</version>
        </dependency>
    </dependencies>
</project>
```


基础功能
    核心配置文件
    映射文件
    实现增删改查
    获取参数值的两种方式
    各种查询功能
    自定义映射resultMap
    动态SQL
分页插件
逆向工程
缓存



https://www.bilibili.com/video/BV1VP4y1c7j7?p=8&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da