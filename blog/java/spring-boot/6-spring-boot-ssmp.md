[返回目录](/blog/java/spring-boot/index.md)

# 6、基于SpringBoot的SSMP整合案例


## 案例实现方案分析

- 实体类开发一使用Lombok快速制作实体类
- Dao开发-整合MyBatisplus，制作数据层测试类
- Service开发-基于MyBatisplus进行增量开发，制作业务层测试类
- Controller开发-基于Restful开发，使用PostMan测试接口功能
- Controller开发-前后端开发协议制作
- 页面开发一基于VUE+ElementUI制作，前后端联调，页面数据处理，页面消息处理
    - 列表、新增、修改、删除、分页、查询
- 项目异常处理
- 按条件查询-页面功能调整、Controller修正功能、Service修正功能


## 前后端分离项目架构

简化版架构

```
浏览器 服务器
```

完整版架构
```
浏览器 前端服务器 后端服务器1、后端服务器2
```

## 创建模块

- 添加SpringMVC和MySQL坐标
- 修改配置文件为yml格式

依赖 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.7</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>spring_03_ssmp</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <!--spring MVC-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Druid -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.2.6</version>
        </dependency>

        <!-- mybatis-plus -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.5.2</version>
        </dependency>

        <!--mysql-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>

        <!-- test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

    </dependencies>

</project>
```

配置 application.yml

```yaml
# 修改服务器端口
server:
  port: 8080

# 配置数据库信息
spring:
  datasource:
    druid:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/data
      username: root
      password: 123456

mybatis-plus:
  global-config:
    db-config:
      id-type: AUTO # 数据库ID自增
```

## 实体类开发

```java
package com.demo.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("tb_book")
public class Book {
    private Long id;

    private String title;

    private String author;
}

```

## 数据层开发

数据表和数据

```sql
create table tb_book
(
    id      int primary key auto_increment comment '主键id',
    title   varchar(20) not null comment '书名',
    author  varchar(20) not null comment '作者'
) comment '图书表';

insert into tb_book (id, title, author) values (1, '红楼梦', '曹雪芹');
insert into tb_book (id, title, author) values (2, '水浒传', '施耐庵');
insert into tb_book (id, title, author) values (3, '三国演义', '罗贯中');
insert into tb_book (id, title, author) values (4, '西游记', '吴承恩');
```

定义Mapper

```java
package com.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.demo.domain.Book;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BookMapper extends BaseMapper<Book> {
}

```




报错
```
nested exception is com.mysql.cj.jdbc.exceptions.MysqlDataTruncation: 
Data truncation: Out of range value for column 'id' at row 1
```

配置

```yaml
mybatis-plus:
  global-config:
    db-config:
      id-type: AUTO # 数据库ID自增

```