[返回目录](/blog/mybatis/index.md)

# 二、MyBatis框架搭建

## 1、开发环境

- JDK 1.8
- IDEA 2019.2
- Maven 3.5.4
- MySQL 8.0（课程用的5.7）
- Mybatis 3.5.7

## 2、创建Maven工程

- 创建一个 Empty Project
- 设置Maven 配置文件

引入依赖坐标 pom.xml

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
            <!--mysql 8.0 -->
            <version>8.0.20</version>
            <!--mysql 5.7 -->
            <!--<version>5.1.3</version>-->
        </dependency>
    </dependencies>
</project>
```

## 3、核心配置文件

文件位置：src/main/resources/mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>  
<!DOCTYPE configuration  
PUBLIC "-//mybatis.org//DTD Config 3.0//EN"  
"http://mybatis.org/dtd/mybatis-3-config.dtd">  
<configuration>  
	<!--设置连接数据库的环境-->  
	<environments default="development">  
		<environment id="development">  
			<transactionManager type="JDBC"/>  
			<dataSource type="POOLED">  
				<property name="driver" value="com.mysql.cj.jdbc.Driver"/>  
				<property name="url" value="jdbc:mysql://localhost:3306/MyBatis"/>  
				<property name="username" value="root"/>  
				<property name="password" value="123456"/>  
			</dataSource>  
		</environment>  
	</environments>  
	
    <!--引入映射文件-->  
	<mappers>  
		<mapper resource="mappers/UserMapper.xml"/>  
	</mappers>  
</configuration>
```

## 4、创建表结构

```sql
create table t_user(
    id int primary key auto_increment,
    username varchar(20),
    password varchar(20),
    age int,
    sex char,
    email varchar(20)
);
```

## 5、创建实体类 User 

```java
package com.atguigu.mybatis.pojo;

/**
 * 实体类
 */
public class User {
    private Integer id;

    private String username;

    private String password;

    private Integer age;

    private String gender;

    private  String email;

    // 省略setter/getter/constructor
}

```

## 6、创建mapper接口

```java
package com.atguigu.mybatis.mapper;  
  
public interface UserMapper {  
	/**  
	* 添加用户信息  
	*/  
	int insertUser();  
}
```

## 7、创建MyBatis的映射文件

相关概念:ORM(Object Relationship Mapping)对象关系映射。

- 对象: Java的实体类对象
- 关系: 关系型数据库
- 映射: 二者之间的对应关系

| Java概念 | 数据库概念 |
| - | - |
| 类 |表 |
| 属性 | 字段/列 |
| 对象 |记录/行 |

MyBatis面向接口编程的两个一致：

1. 映射文件namespace和Mapper接口的全类名一致
2. 映射文件中sql语句的id和mapper接口中的方法一致

映射文件

/src/main/java/com/atguigu/mybatis/mapper/xml/UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.atguigu.mybatis.mapper.UserMapper">

    <insert id="insertUser">
        insert into t_user
            (username, password, age, sex, email)
        values
            ('admin','123456',23,'男', "123456@qq.com")
    </insert>
</mapper>
```

配置xml编译方式：

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

引入映射文件 mybatis-config.xml

```xml
<configuration>
    <!--引入映射文件-->
    <mappers>
        <!-- 使用相对于类路径的资源引用 -->
        <!--<mapper resource="mappers/UserMapper.xml"/>-->

        <!-- 使用映射器接口实现类的完全限定类名 -->
        <mapper class="com.atguigu.mybatis.mapper.UserMapper"/>
    </mappers>
</configuration>
```

## 8、新建测试类

在test目录（src/test/java）下新建测试类

```java
package com.atguigu.mybatis.mapper;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

public class UserMapperTest {
    /**
     * @throws IOException
     */
    @Test
    public void testInsertUser() throws IOException {
        //加载核心配置文件
        InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
        //获取sqlsessionfactorybuilder
        SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
        //获取factory
        SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
        //获取sqlsession
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        //获取mapper接口对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class); //代理模式

        //测试功能
        int result = mapper.insertUser();

        // 提交事务
        // sqlSession.commit();

        System.out.println("result: " + result);
        // result: 1
    }
}
```

sqlsession默认不自动提交事务，如果需要自动提交事务，可以使用

```java
SqlSessionFactory.openSession(true)
```

## 9、log4j日志

```xml
<!-- log4j日志 -->
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```

配置文件 src/main/resources/log4j.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
<log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">
    <appender name="STDOUT" class="org.apache.log4j.ConsoleAppender">
        <param name="Encoding" value="UTF-8" />
        <layout class="org.apache.log4j.PatternLayout">
			<param name="ConversionPattern" value="%-5p %d{MM-dd HH:mm:ss,SSS} %m (%F:%L) \n" />
        </layout>
    </appender>
    <logger name="java.sql">
        <level value="debug" />
    </logger>
    <logger name="org.apache.ibatis">
        <level value="info" />
    </logger>
    <root>
        <level value="debug" />
        <appender-ref ref="STDOUT" />
    </root>
</log4j:configuration>

```

日志的级别：

- FATAL(致命)
- ERROR(错误)
- WARN(警告)
- INFO(信息)
- DEBUG(调试) 

从上到下打印的内容越来越详细
