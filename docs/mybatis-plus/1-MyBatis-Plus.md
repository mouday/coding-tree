# MyBatis-Plus 入门

## 环境

```
JDK1.8
SpringBoot
MySQL
MyBatis-Plus
Maven
```

## MyBatis VS JPA

1、MyBatis：

（1）优势

- SQL 语句可以自由控制，更灵活，性能较高
- SQL 与代码分离，易于阅读和维护
- 提供 XML 标签，支持编写动态 SQL 语句

（2）劣势

- 简单的 CRUD 操作还需要写 SQL 语句
- XML 中有大量的 SQL 需要维护
- MyBatis 自身功能有限，但是支持 Plugin

2、JPA:
（1）优势

- JPA 移植性好 JPQL
- 提供了很多 CRUD 方法，开发效率高
- 对象化程度更高

## MyBatis-Plus

MyBatis-Plus（简称 MP）是一个 MyBatis 的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。

文档：[https://mp.baomidou.com/](https://mp.baomidou.com/)

特性：

- 无侵入
- 损耗小
- 强大的 CRUD 操作
- 支持 Lambda 形式调用
- 支持主键自动生成
- 支持 ActiveRecord 模式
- 支持自定义全局通用操作
- 内置代码生成器
- 内置分页插件
- 分页插件支持多种数据库
- 内置性能分析插件
- 内置全局拦截插件

## lombok

```xml
<!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.12</version>
    <scope>provided</scope>
</dependency>

```

## 快速入门

建库建表
引入依赖
配置
编码
测试

建表语句

```sql
-- 创建用户表
CREATE TABLE user (
    id BIGINT(20) PRIMARY KEY NOT NULL COMMENT '主键',
    name VARCHAR(30) DEFAULT NULL COMMENT '姓名',
    age INT(11) DEFAULT NULL COMMENT '年龄',
    email VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
    manager_id BIGINT(20) DEFAULT NULL COMMENT '直属上级id',
    create_time DATETIME DEFAULT NULL COMMENT '创建时间',
    CONSTRAINT manager_fk FOREIGN KEY (manager_id)
        REFERENCES user (id)
)  ENGINE=INNODB CHARSET=UTF8;

-- 初始化数据：
INSERT INTO user (id, name, age, email, manager_id, create_time)
VALUES (1087982257332887553, '大boss', 40, 'boss@baomidou.com', NULL, '2019-01-11 14:20:20'),
	(1088248166370832385, '王天风', 25, 'wtf@baomidou.com', 1087982257332887553, '2019-02-05 11:12:22'),
	(1088250446457389058, '李艺伟', 28, 'lyw@baomidou.com', 1088248166370832385, '2019-02-14 08:31:16'),
	(1094590409767661570, '张雨琪', 31, 'zjq@baomidou.com', 1088248166370832385, '2019-01-14 09:15:15'),
	(1094592041087729666, '刘红雨', 32, 'lhm@baomidou.com', 1088248166370832385, '2019-01-14 09:48:16');
```

项目结构

```
$ tree
.
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── example
    │   │           └── demo
    │   │               ├── Application.java
    │   │               ├── dao
    │   │               │   └── UserMapper.java
    │   │               └── entity
    │   │                   └── User.java
    │   └── resources
    │       ├── application.properties
    └── test
        └── java
            └── com
                └── example
                    └── demo
                        └── ApplicationTests.java
```

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.2.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.example</groupId>
    <artifactId>mybatis-plus-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <name>mybatis-plus-demo</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <!--web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--devtools-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
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
            <optional>true</optional>
        </dependency>

        <!--mybatis-plus-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.3.2</version>
        </dependency>

        <!--test-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>

```

application.properties

```bash
# 数据源
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/data?useSSL=false&serverTimezone=GMT%2B8
spring.datasource.username=root
spring.datasource.password=123456

# 日志级别
logging.level.root=warn
logging.level.com.example.demo.dao=trace
logging.pattern.console=%p%m%n
```

User.java

```java
package com.example.demo.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class User {
    // 主键
    private Long id;

    // 姓名
    private String name;

    // 年龄
    private Integer age;

    // 邮箱
    private String email;

    // 直属上级
    private Long managerId;

    // 创建时间
    private LocalDateTime createTime;

}

```

UserMapper.java

```java
package com.example.demo.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.User;

public interface UserMapper extends BaseMapper<User> {
}

```

Application.java

```java
package com.example.demo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
@MapperScan({"com.example.demo.dao"})
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}

```

ApplicationTests.java

```java
package com.example.demo;

import com.example.demo.dao.UserMapper;
import com.example.demo.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;


@SpringBootTest
class ApplicationTests {

    @Autowired
    UserMapper userMapper;

    @Test
    void select() {
        List<User> users = userMapper.selectList(null);
        users.forEach(System.out::println);
    }

    @Test
    void insert() {
        User user = new User();
        user.setName("王强");
        user.setAge(23);
        user.setCreateTime(LocalDateTime.now());

        int ret = userMapper.insert(user);
        System.out.println("ret" + ret);
    }
}
```

## MyBatis vs MyBatis-Plus

```
接口中写抽象方法
XML 或注解写 SQL
Service 中调用接口
Controller 调用 Service
```

MyBatis-Plus 采用通用 Mapper

## 常用注解

```
@TableName("user") // 自定义表名
@TableId // 对应数据库中主键
@TableField("user_name") // 指定表中对应字段名
```

## 排除非表字段

```java
// 不参与序列化
private transient String remark;

// 设置为静态变量
private static String remark;

// 排除字段
@TableField(exist=false)
private String remark;
```

## 普通查询

```java
/**
* 基础查询
*/
@Test
void testSelectById() {
    User user = userMapper.selectById(1087982257332887553L);
    // SELECT user_id,name,age,email,manager_id,create_time
    // FROM user WHERE user_id=?
    System.out.println(user);
}

@Test
void testSelectList() {
    List<User> users = userMapper.selectList(null);
    // SELECT user_id,name,age,email,manager_id,create_time
    // FROM user
    users.forEach(System.out::println);
}

@Test
void testSelectBatchIds() {
    List<Long> idList = Arrays.asList(1087982257332887553L, 1094592041087729666L);
    List<User> users = userMapper.selectBatchIds(idList);
    // SELECT user_id,name,age,email,manager_id,create_time
    // FROM user WHERE user_id IN ( ? , ? )
    users.forEach(System.out::println);
}

@Test
void testSelectByMap() {
    Map<String , Object> map = new HashMap<>();
    map.put("name", "王天风");
    map.put("age", 25);

    List<User> users = userMapper.selectByMap(map);
    // SELECT user_id,name,age,email,manager_id,create_time
    // FROM user WHERE name = ? AND age = ?
    users.forEach(System.out::println);
}

```

## 以构造器为参数的查询方法

```java

/**
    * 1、名字中包含雨并且年龄小于40
    * <p>
    * name like '%雨%' and age<40
    */
@Test
void testQueryWrapper1() {
    QueryWrapper<User> query = new QueryWrapper<>();
    query.like("name", "雨").lt("age", 40);

    List<User> users = userMapper.selectList(query);
    // SELECT id,name,age,email,manager_id,create_time
    // FROM user WHERE (name LIKE ? AND age < ?)

    users.forEach(System.out::println);
}

/**
    * 2、名字中包含雨年并且龄大于等于20且小于等于40并且email不为空
    * <p>
    * name like '%雨%' and age between 20 and 40 and email is not null
    */
@Test
void testQueryWrapper2() {
    QueryWrapper<User> query = new QueryWrapper<>();
    query.like("name", "雨")
            .between("age", 20, 40)
            .isNotNull("email");

    List<User> users = userMapper.selectList(query);
    // SELECT id,name,age,email,manager_id,create_time
    // FROM user WHERE (name LIKE ? AND age BETWEEN ? AND ? AND email IS NOT NULL)

    users.forEach(System.out::println);
}

/**
    * 3、名字为王姓或者年龄大于等于25，按照年龄降序排列，年龄相同按照id升序排列
    * <p>
    * name like '王%' or age>=25 order by age desc,id asc
    */
@Test
void testQueryWrapper3() {
    QueryWrapper<User> query = new QueryWrapper<>();
    query.likeRight("name", "王")
            .or()
            .ge("age", 25)
            .orderByDesc("age")
            .orderByAsc("id");

    List<User> users = userMapper.selectList(query);
    // SELECT id,name,age,email,manager_id,create_time
    // FROM user WHERE (name LIKE ? OR age >= ?) ORDER BY age DESC,id ASC

    users.forEach(System.out::println);
}


/**
    * 4、创建日期为2019年2月14日并且直属上级为名字为王姓
    * <p>
    * date_format(create_time,'%Y-%m-%d')='2019-02-14'
    * and manager_id in (select id from user where name like '王%')
    */
@Test
void testQueryWrapper4() {
    QueryWrapper<User> query = new QueryWrapper<>();
    // 使用占位符，避免SQL注入
    query.apply("date_format(create_time, '%Y-%m-%d') = {0}", "2019-02-14")
            .inSql("manager_id", "select id from user where name like '王%'");

    List<User> users = userMapper.selectList(query);
    // SELECT id,name,age,email,manager_id,create_time
    // FROM user WHERE (date_format(create_time, '%Y-%m-%d') = ?
    // AND manager_id IN (select id from user where name like '王%'))

    users.forEach(System.out::println);
}

/**
    * 5、名字为王姓并且（年龄小于40或邮箱不为空）
    * <p>
    * name like '王%' and (age<40 or email is not null)
    */
@Test
void testQueryWrapper5() {
    QueryWrapper<User> query = new QueryWrapper<>();
    query.likeRight("name", "王")
            .and(qw -> qw.lt("age", 40)
                    .or()
                    .isNotNull("email")
            );

    List<User> users = userMapper.selectList(query);
    //  SELECT id,name,age,email,manager_id,create_time
    //  FROM user WHERE (name LIKE ? AND (age < ? OR email IS NOT NULL))

    users.forEach(System.out::println);
}


/**
    * 6、名字为王姓或者（年龄小于40并且年龄大于20并且邮箱不为空）
    * <p>
    * name like '王%' or (age<40 and age>20 and email is not null)
    */
@Test
void testQueryWrapper6() {
    QueryWrapper<User> query = new QueryWrapper<>();
    query.likeRight("name", "王")
            .or(qw -> qw.lt("age", 40)
                    .gt("age", 20)
                    .isNotNull("email")
            );

    List<User> users = userMapper.selectList(query);
    //  SELECT id,name,age,email,manager_id,create_time
    //  FROM user WHERE (name LIKE ? OR (age < ? AND age > ? AND email IS NOT NULL))

    users.forEach(System.out::println);
}

/**
    * 7、（年龄小于40或邮箱不为空）并且名字为王姓
    * <p>
    * (age<40 or email is not null) and name like '王%'
    */
@Test
void testQueryWrapper7() {
    QueryWrapper<User> query = new QueryWrapper<>();
    query.nested(qw -> qw.lt("age", 40)
            .isNotNull("email"))
            .likeRight("name", "王");

    List<User> users = userMapper.selectList(query);
    //  SELECT id,name,age,email,manager_id,create_time
    //  FROM user WHERE ((age < ? AND email IS NOT NULL) AND name LIKE ?)

    users.forEach(System.out::println);
}

/**
    * 8、年龄为30、31、34、35
    *
    * age in (30、31、34、35)
    */
@Test
void testQueryWrapper8() {
    QueryWrapper<User> query = new QueryWrapper<>();
    query.in("age", Arrays.asList(30, 31, 34, 35));

    List<User> users = userMapper.selectList(query);
    //  SELECT id,name,age,email,manager_id,create_time
    //  FROM user WHERE (age IN (?,?,?,?))

    users.forEach(System.out::println);
}

/**
    * 9、只返回满足条件的其中一条语句即可
    *
    * limit 1
    */
@Test
void testQueryWrapper9() {
    QueryWrapper<User> query = new QueryWrapper<>();
    query.in("age", Arrays.asList(30, 31, 34, 35)).last("limit 1");

    List<User> users = userMapper.selectList(query);
    //  SELECT id,name,age,email,manager_id,create_time
    //  FROM user WHERE (age IN (?,?,?,?)) limit 1

    users.forEach(System.out::println);
}

```

## Select 中字段不全出现的处理方法

```java
/**
* 返回指定字段
*/
@Test
void testQueryWrapper10() {
    QueryWrapper<User> query = new QueryWrapper<>();
    query.select("id", "name");

    List<User> users = userMapper.selectList(query);
    //  SELECT id,name FROM user

    users.forEach(System.out::println);
}

/**
* 排除指定字段
*/
@Test
void testQueryWrapper11() {
    QueryWrapper<User> query = new QueryWrapper<>();
    query.select(User.class, info->!info.getColumn().equals("create_time") &&
            !info.getColumn().equals("manager_id"));

    List<User> users = userMapper.selectList(query);
    //  SELECT id,name,age,email FROM user

    users.forEach(System.out::println);
}

```

## Condition

```java
/**
* 条件判断
*/
@Test
void testQueryWrapper12() {
    QueryWrapper<User> query = new QueryWrapper<>();

    String name = "Tom";

    query.like(!StringUtils.isEmpty(name), "name", name);

    //等价于
    // if(!StringUtils.isEmpty(name)){
    //     query.like("name", name);
    // }

    List<User> users = userMapper.selectList(query);
    //  SELECT id,name,age,email,manager_id,create_time
    //  FROM user WHERE (name LIKE ?)

    users.forEach(System.out::println);
}
```

## 实体对象作为条件构造器方法的参数

```java
/**
* // 指定表中对应字段名, 设置条件
*     @TableField(value="name", condition= SqlCondition.LIKE)
*     private String name;
*/
@Test
void testQueryWrapper13() {
    User user = new User();
    user.setName("王强");
    user.setAge(23);

    QueryWrapper<User> query = new QueryWrapper<>(user);

    List<User> users = userMapper.selectList(query);
    //  SELECT id,name,age,email,manager_id,create_time
    //  FROM user WHERE name LIKE CONCAT('%',?,'%') AND age=?


    users.forEach(System.out::println);
}
```

## allEq

```java
@Test
void testQueryWrapper14() {
    Map<String , Object> params = new HashMap<>();

    params.put("name", "王强");
    params.put("age", 23);

    QueryWrapper<User> query = new QueryWrapper<>();
    query.allEq(params);

    List<User> users = userMapper.selectList(query);
    //  SELECT id,name,age,email,manager_id,create_time
    //  FROM user WHERE (name = ? AND age = ?)

    users.forEach(System.out::println);
}
```

## 其他查询

```java
/**
* 返回map 而不是User实体对象
*/
@Test
void testQueryWrapper15() {

    QueryWrapper<User> query = new QueryWrapper<>();
    query.select("id", "name");

    List<Map<String, Object>> list = userMapper.selectMaps(query);

    list.forEach(System.out::println);
}

/**
* 11、按照直属上级分组，查询每组的平均年龄、最大年龄、最小年龄。
* 并且只取年龄总和小于500的组。
*
* select avg(age) avg_age,min(age) min_age,max(age) max_age
* from user
* group by manager_id
* having sum(age) <500
*/
@Test
void testQueryWrapper16() {

    QueryWrapper<User> query = new QueryWrapper<>();
    query.select("avg(age) avg_age", "min(age) min_age", "max(age) max_age")
            .groupBy("manager_id").having("sum(age) < {0}", 5000);

    List<Map<String, Object>> list = userMapper.selectMaps(query);
    // SELECT avg(age) avg_age,min(age) min_age,max(age) max_age
    // FROM user
    // GROUP BY manager_id
    // HAVING sum(age) < ?
    list.forEach(System.out::println);
}

/**
* 只返回第一列
*/
@Test
void testQueryWrapper17() {

    QueryWrapper<User> query = new QueryWrapper<>();

    List<Object> list = userMapper.selectObjs(query);
    // SELECT id,name,age,email,manager_id,create_time FROM user
    list.forEach(System.out::println);
}

/**
* 计算count
*/
@Test
void testQueryWrapper18() {

    QueryWrapper<User> query = new QueryWrapper<>();

    Integer count = userMapper.selectCount(query);
    // SELECT COUNT( 1 ) FROM user
    System.out.println(count);
}

/**
* 返回一条数据,如果大于1条会报错
*/
@Test
void testQueryWrapper19() {
    QueryWrapper<User> query = new QueryWrapper<>();
    query.eq("name", "王天风");
    User user = userMapper.selectOne(query);
    // SELECT id,name,age,email,manager_id,create_time
    // FROM user WHERE (name = ?)
    System.out.println(user);
}
```

## Lambda 条件构造器

```java
@Test
void testQueryWrapper20() {

    LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
    query.ge(User::getAge, 20);
    query.ge(User::getName, 20);

    List<User> users = userMapper.selectList(query);
    // SELECT id,name,age,email,manager_id,create_time
    // FROM user
    // WHERE (age >= ? AND name >= ?)

    users.forEach(System.out::println);
}

@Test
void testQueryWrapper21() {

    LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
    query.likeRight(User::getName, "王");
    query.and(q->q.ge(User::getAge, 23).or().isNotNull(User::getEmail));

    List<User> users = userMapper.selectList(query);
    // SELECT id,name,age,email,manager_id,create_time
    // FROM user
    // WHERE (name LIKE ? AND (age >= ? OR email IS NOT NULL))

    users.forEach(System.out::println);
}

// LambdaQueryChainWrapper

List<User> users = new LambdaQueryChainWrapper<User>(userMapper)
                .like(User::getName, "王").list();
users.forEach(System.out::println);
//    SELECT id,name,age,email,manager_id,create_time
//    FROM user
//    WHERE (name LIKE ?)
```

## 自定义 SQL

1、注解方法

```java
package com.example.demo.dao;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.example.demo.entity.User;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface UserMapper extends BaseMapper<User> {

    @Select("select * from user ${ew.customSqlSegment}")
    List<User> selectAll(@Param(Constants.WRAPPER) Wrapper<User> wrapper);
}

```

使用

```java
LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
query.likeRight(User::getName, "王");

List<User> users = userMapper.selectAll(query);

users.forEach(System.out::println);
//  select * from user WHERE (name LIKE ?)

```

2、使用 Mapper

pom.xml

```xml
<build>
    <resources>
        <!--编译src/main/java目录下的xml文件-->
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
            <filtering>true</filtering>
        </resource>
    </resources>
</build>
```

application.properties

```bash
mybatis-plus.mapper-locations=com/example/demo/mapper/*
```

com/example/demo/dao/UserMapper.java

```java
package com.example.demo.dao;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.example.demo.entity.User;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface UserMapper extends BaseMapper<User> {

    // @Select("select * from user ${ew.customSqlSegment}")
    List<User> selectAll(@Param(Constants.WRAPPER) Wrapper<User> wrapper);
}

```

com/example/demo/mapper/UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.demo.dao.UserMapper">

   <select id="selectAll" resultType="com.example.demo.entity.User">
        select * from user ${ew.customSqlSegment}
   </select>
</mapper>

```

## 分页查询

配置分页生效

```java
package com.example.demo.config;

import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MyBatisPlusConfig {
    // 配置分页生效
    @Bean
    public PaginationInterceptor paginationInterceptor(){
        return new PaginationInterceptor();
    }
}

```

```java
// 返回 IPage
Page<User> page = new Page<>(1, 2);
IPage<User> iPage = userMapper.selectPage(page, null);
System.out.println("总页数" + iPage.getPages());
System.out.println("总记录数" + iPage.getTotal());
List<User> users = iPage.getRecords();
users.forEach(System.out::println);

// 返回 Map
Page<Map<String, Object>> page = new Page<>(1, 2);
IPage<Map<String, Object>> iPage = userMapper.selectMapsPage(page, null);
System.out.println("总页数" + iPage.getPages());
System.out.println("总记录数" + iPage.getTotal());
List<Map<String, Object>> users = iPage.getRecords();
users.forEach(System.out::println);
users.forEach(System.out::println);

// 总页数3
// 总记录数6

// SELECT COUNT(1) FROM user
// SELECT id,name,age,email,manager_id,create_time FROM user LIMIT ?,?

// 不查询总记录数
Page<Map<String, Object>> page = new Page<>(1, 2, false);
```

自定义查询分页

接口

```java
public interface UserMapper extends BaseMapper<User> {
    IPage<User> selectUserPage(Page<User> page, @Param(Constants.WRAPPER) Wrapper<User> wrapper);
}
```

mapper

```xml
<select id="selectUserPage" resultType="com.example.demo.entity.User">
    select * from user ${ew.customSqlSegment}
</select>
```

查询

```java
QueryWrapper<User> query = new QueryWrapper<>();
query.eq("name", "张雨琪");

Page<User> page = new Page<>(1, 2);

IPage<User> iPage = userMapper.selectUserPage(page, query);
System.out.println("总页数" + iPage.getPages());
System.out.println("总记录数" + iPage.getTotal());

List<User> users = iPage.getRecords();

users.forEach(System.out::println);
```

## 更新操作

```java
// 1、通过id更新
User user = new User();
user.setId(1289581152783228930L);
user.setAge(25);

int rows = userMapper.updateById(user);
// UPDATE user SET age=? WHERE id=?
System.out.println("rows: " + rows);


// 2、通过查询条件更新
QueryWrapper<User> query = new QueryWrapper<>();
query.eq("name", "王强");

User user = new User();
user.setAge(25);

int rows = userMapper.update(user, query);
// UPDATE user SET age=? WHERE (name = ?)
System.out.println("rows: " + rows);


// 3、更新少量字段
UpdateWrapper<User> query = new UpdateWrapper<>();
query.eq("name", "王强").set("age", 26);

int rows = userMapper.update(null, query);
// UPDATE user SET age=? WHERE (name = ?)
System.out.println("rows: " + rows);


// 4、使用Lambda
LambdaUpdateWrapper<User> query = Wrappers.lambdaUpdate();
query.eq(User::getName, "王强").set(User::getAge, 26);

int rows = userMapper.update(null, query);
// UPDATE user SET age=? WHERE (name = ?)
System.out.println("rows: " + rows);


// 5、ChainWrapper
boolean ret = new LambdaUpdateChainWrapper<User>(userMapper)
                .eq(User::getName, "王强").set(User::getAge, 23).update();
System.out.println("ret" + ret);
//    UPDATE user SET age=? WHERE (name = ?)
```

## 删除功能

```java
// 1、根据id删除
int ret = userMapper.deleteById(1094592041087729667L);
System.out.println("ret" + ret);
// DELETE FROM user WHERE id=?

// 2、根据map条件删除
Map<String, Object> map = new HashMap<>();
map.put("name", "刘备");
map.put("age", 23);

int ret = userMapper.deleteByMap(map);
System.out.println("ret" + ret);
// DELETE FROM user WHERE name = ? AND age = ?

// 3、批量删除
int ret = userMapper.deleteBatchIds(Arrays.asList(1, 2, 3));
System.out.println("ret" + ret);
// DELETE FROM user WHERE id IN ( ? , ? , ? )

// 4、条件删除
LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
query.eq(User::getName, "Tom").or().ge(User::getAge, 23);

int ret = userMapper.delete(query);
System.out.println("ret" + ret);
// DELETE FROM user WHERE (name = ? OR age >= ?)
```

## ActiveRecord 模式

AR 模式

```java
// 需要继承Model
public class User extends Model<User> {}


// 插入数据
User user = new User();
user.setAge(23);
user.setName("Tom");
user.insert();
//  INSERT INTO user ( id, name, age ) VALUES ( ?, ?, ? )


// 查询数据
User newUser = user.selectById();
// SELECT id,name,age,email,manager_id,create_time FROM user WHERE id=?


// 更新数据
User user = new User();
user.setId(123L);
user.setAge(23);
user.setName("Tom");
user.updateById();
// UPDATE user SET name=?, age=? WHERE id=?


// 删除数据
User user = new User();
user.setId(123L);
user.setAge(23);
user.setName("Tom");
user.deleteById();
// DELETE FROM user WHERE id=?


// 插入或更新
User user = new User();
user.setId(123L);
user.setAge(23);
user.setName("Tom");
user.insertOrUpdate();
//    SELECT id,name,age,email,manager_id,create_time FROM user WHERE id=?
//    INSERT INTO user ( id, name, age ) VALUES ( ?, ?, ? )
```

## 主键策略

```java
AUTO(0) // 数据库ID自增
NONE(1) // 该类型为未设置主键类型
INPUT(2) // 用户输入ID
ASSIGN_ID(3) // 分配ID
ASSIGN_UUID(4) // 分配UUID 8d3d8b402efb9aeb6252693ca71a58b8
```

局部主键策略实现

```java
@TableId(type=IdType.AUTO) // 对应数据库中主键
private Long id;
// alter table user change column id id int(11) auto_increment;
```

全局主键策略实现

```bash
# 配置全局策略
mybatis-plus.global-config.db-config.id-type=assign_uuid
```

## 配置

```bash
configLocation # MyBatis 配置文件位置
typeAliasesPackage # 别名包扫描路径
mapUnderscoreToCamelCase  # 开启自动驼峰命名规则 true

insertStrategy NOT_NULL
updateStrategy NOT_NULL
selectStrategy NOT_NULL

idType          # 主键类型
tablePrefix     # 表名前缀
tableUnderline  # 表名是否使用驼峰转下划线命名
```

## 通用 Service

接口

```java
package com.example.demo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.entity.User;

public interface UserService extends IService<User> {
}

```

实现

```java
package com.example.demo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.dao.UserMapper;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
}

```

测试

```java
// 取一个
User user = userService.getOne(Wrappers.<User>lambdaQuery()
         .gt(User::getName, "Tom")
         .last("limit 1"));
// SELECT id,name,age,email,manager_id,create_time
// FROM user WHERE (name > ?) limit 1


// 取回多个不抛出异常
User user = userService.getOne(Wrappers.<User>lambdaQuery()
        .gt(User::getName, "Tom"), false);
// SELECT id,name,age,email,manager_id,create_time
// FROM user WHERE (name > ?)

System.out.println(user);


// 取列表
List<User> users = userService.lambdaQuery().eq(User::getName, "Tom").list();
users.forEach(System.out::println);
//    SELECT id,name,age,email,manager_id,create_time
//    FROM user WHERE (name = ?)


// 更新数据
boolean ret = userService.lambdaUpdate().eq(User::getName, "Tom").set(User::getAge, 25).update();
System.out.println(ret);
// UPDATE user SET age=? WHERE (name = ?)


// 删除数据
boolean ret = userService.lambdaUpdate().eq(User::getAge, 20).remove();
System.out.println(ret);
// DELETE FROM user WHERE (age = ?)
```
