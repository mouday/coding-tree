# MyBatis-Plus 进阶

https://baomidou.com/guide/

高级功能：

- 逻辑删除
- 自动填充
- 乐观锁插件
- 性能分析插件
- 多租户 SQL 解析器
- 动态表名 SQL 解析器
- SQL 注入器

需要掌握的技能

- Lambda 表达式
- SpringBoot Maven MySQL
- MP 核心功能

## 项目环境

依赖 pom.xml

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
        <relativePath/>
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

</project>

```

配置 application.properties

```bash
# 数据源
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/data?useSSL=false&characterEncoding=UTF-8&serverTimezone=GMT%2B8
spring.datasource.username=root
spring.datasource.password=123456

# 日志级别
logging.level.root=warn
logging.level.com.example.demo.dao=trace
logging.pattern.console=%p%m%n

# 全局逻辑删除和逻辑不删除（默认值）
mybatis-plus.global-config.db-config.logic-not-delete-value=0
mybatis-plus.global-config.db-config.logic-delete-value=1

```

数据表

```sql
#创建用户表
CREATE TABLE user (
    id BIGINT(20) PRIMARY KEY NOT NULL COMMENT '主键',
    name VARCHAR(30) DEFAULT NULL COMMENT '姓名',
    age INT(11) DEFAULT NULL COMMENT '年龄',
    email VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
    manager_id BIGINT(20) DEFAULT NULL COMMENT '直属上级id',
    create_time DATETIME DEFAULT NULL COMMENT '创建时间',
	update_time DATETIME DEFAULT NULL COMMENT '修改时间',
	version INT(11) DEFAULT '1' COMMENT '版本',
	deleted INT(1) DEFAULT '0' COMMENT '逻辑删除标识(0.未删除,1.已删除)',
    CONSTRAINT manager_fk FOREIGN KEY (manager_id)
        REFERENCES user (id)
)  ENGINE=INNODB CHARSET=UTF8;

#初始化数据：
INSERT INTO user (id, name, age, email, manager_id
	, create_time)
VALUES (1087982257332887553, '大boss', 40, 'boss@baomidou.com', NULL
		, '2019-01-11 14:20:20'),
	(1088248166370832385, '王天风', 25, 'wtf@baomidou.com', 1087982257332887553
		, '2019-02-05 11:12:22'),
	(1088250446457389058, '李艺伟', 28, 'lyw@baomidou.com', 1088248166370832385
		, '2019-02-14 08:31:16'),
	(1094590409767661570, '张雨琪', 31, 'zjq@baomidou.com', 1088248166370832385
		, '2019-01-14 09:15:15'),
	(1094592041087729666, '刘红雨', 32, 'lhm@baomidou.com', 1088248166370832385
		, '2019-01-14 09:48:16');
```

实体

```java
package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.TableLogic;
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

    // 创建时间
    private LocalDateTime updateTime;

    // 版本
    private Integer version;

    // 逻辑删除标识(0.未删除,1.已删除)
    @TableLogic
    private Integer deleted;
}

```

Mapper

```java
package com.example.demo.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.User;

public interface UserMapper extends BaseMapper<User> {

}

```

启动类

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

## 逻辑删除

```java
@Data
public class User {
    ...

    // 逻辑删除标识(0.未删除,1.已删除)
    @TableLogic
    private Integer deleted;
}
```

```java
/**
* 删除数据
*/
int rows = userMapper.deleteById(1094590409767661570L);
// UPDATE user SET deleted=1 WHERE id=? AND deleted=0


/**
* 查询数据
*/
List<User> rows = userMapper.selectList(null);
// SELECT id,name,age,email,manager_id,create_time,update_time,version,deleted FROM user WHERE deleted=0


/**
* 更新数据
*/
User user = new User();
user.setId(1094590409767661570L);
user.setAge(24);

int rows = userMapper.updateById(user);
// UPDATE user SET age=? WHERE id=? AND deleted=0
```

排除字段

```java
@Data
public class User {
    ...

    // 逻辑删除标识(0.未删除,1.已删除)
    @TableLogic
    @TableField(select = false) // 查询的时候排除
    private Integer deleted;
}
```

自定义 sql

```java

/**
* 自定义sql
*/
public interface UserMapper extends BaseMapper<User> {

    @Select("select * from user ${ew.customSqlSegment}")
    List<User> selectAllUser(@Param(Constants.WRAPPER)Wrapper<User> wrapper);
}


/**
* 查询
*/
List<User> rows = userMapper.selectAllUser(Wrappers.<User>lambdaQuery()
                .gt(User::getAge, 25)
                .eq(User::getDeleted, 0));
// select * from user WHERE (age > ? AND deleted = ?)
```

## 自动填充

配置自动更新字段

```java
package com.example.demo.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        setFieldValByName("createTime", LocalDateTime.now(), metaObject);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        setFieldValByName("updateTime", LocalDateTime.now(), metaObject);
    }
}

```

```java

@Data
public class User {
    ...

    // 创建时间
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    // 创建时间
    @TableField(fill = FieldFill.UPDATE)
    private LocalDateTime updateTime;

}

```

```java
/**
* 插入数据
*/
User user = new User();
user.setId(1094590409767661571L);
user.setAge(24);
user.setName("tom");

int rows = userMapper.insert(user);
// INSERT INTO user ( id, name, age, create_time ) VALUES ( ?, ?, ?, ? )

/**
* 更新数据
*/
User user = new User();
user.setId(1094590409767661571L);
user.setAge(24);
user.setName("tom");

int rows = userMapper.updateById(user);
// UPDATE user SET name=?, age=?, update_time=? WHERE id=? AND deleted=0

```

自动填充优化

```java
package com.example.demo.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        boolean hasCreateTimeSetter = metaObject.hasSetter("createTime");
        // 如果有createTime字段才进行自动填充
        if (hasCreateTimeSetter) {
            setFieldValByName("createTime", LocalDateTime.now(), metaObject);
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        Object updateTime = getFieldValByName("updateTime", metaObject);
        // 如果updateTime 为空才进行自动填充
        if (updateTime == null) {
            setFieldValByName("updateTime", LocalDateTime.now(), metaObject);
        }
    }
}

```

## 乐观锁

简介

```
取出记录时，获取当前version

更新时，带上这个version

版本正确更新成功，错误更新失败
```

多读，使用乐观锁
多写，使用悲观锁

配置乐观锁

```java
package com.example.demo.config;

import com.baomidou.mybatisplus.extension.plugins.OptimisticLockerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MyBatisPlusConfiguration {

    // 乐观锁插件
    @Bean
    public OptimisticLockerInterceptor optimisticLockerInterceptor(){
        return new OptimisticLockerInterceptor();
    }
}

```

设置版本号字段

```java

public class User {
    ...
    // 版本
    @Version
    private Integer version;

}

```

更新数据

```java
User user = new User();

user.setId(1094590409767661571L);
user.setAge(24);
user.setVersion(1);
user.setName("tom");

int rows = userMapper.updateById(user);
```

执行 sql

```
UPDATE user SET name=?, age=?, update_time=?, version=? WHERE id=? AND version=? AND deleted=0
tom(String), 24(Integer), 2020-08-20T22:54:35.515(LocalDateTime), 2(Integer), 1094590409767661571(Long), 1(Integer)
```

## 性能分析

PerformanceInterceptor 在 3.2.0 被移除了

## 执行 SQL 分析打印

```xml
<!--打印sql-->
<dependency>
    <groupId>p6spy</groupId>
    <artifactId>p6spy</artifactId>
    <version>3.9.1</version>
</dependency>
```

数据源 application.properties

```bash
#spring.datasource.url=jdbc:mysql://127.0.0.1:3306/data?useSSL=false&characterEncoding=UTF-8&serverTimezone=GMT%2B8
spring.datasource.url=jdbc:p6spy:mysql://127.0.0.1:3306/data?useSSL=false&characterEncoding=UTF-8&serverTimezone=GMT%2B8
spring.datasource.driver-class-name: com.p6spy.engine.spy.P6SpyDriver

```

spy.properties

```bash
#3.2.1以上使用
modulelist=com.baomidou.mybatisplus.extension.p6spy.MybatisPlusLogFactory,com.p6spy.engine.outage.P6OutageFactory
#3.2.1以下使用或者不配置
#modulelist=com.p6spy.engine.logging.P6LogFactory,com.p6spy.engine.outage.P6OutageFactory
# 自定义日志打印
logMessageFormat=com.baomidou.mybatisplus.extension.p6spy.P6SpyLogger
#日志输出到控制台
appender=com.baomidou.mybatisplus.extension.p6spy.StdoutLogger
# 使用日志系统记录 sql
#appender=com.p6spy.engine.spy.appender.Slf4JLogger
# 设置 p6spy driver 代理
deregisterdrivers=true
# 取消JDBC URL前缀
useprefix=true
# 配置记录 Log 例外,可去掉的结果集有error,info,batch,debug,statement,commit,rollback,result,resultset.
excludecategories=info,debug,result,commit,resultset
# 日期格式
dateformat=yyyy-MM-dd HH:mm:ss
# 实际驱动可多个
#driverlist=org.h2.Driver
# 是否开启慢SQL记录
outagedetection=true
# 慢SQL记录标准 2 秒
outagedetectioninterval=2
# 输出到文件， 需要注释 日志输出到控制台
logfile=log.log
```

执行结果

```
 Consume Time：2 ms 2020-08-20 23:22:20
 Execute SQL：UPDATE user SET name='tom', age=24, update_time='2020-08-20T23:22:20.570', version=2 WHERE id=1094590409767661571 AND version=1 AND deleted=0

```

## 多租户

1. 不同享数据库
2. 共享数据库
3. 共享数据表

## 动态表名

## SQL 注入器

1. 创建自定义方法的类
2. 创建注入器
3. 在 Mapper 中加入自定义方法

选装件
