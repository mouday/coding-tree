[返回目录](/blog/mybatis/index.md)

# 五、MyBatis获取参数值的两种方式-搭建环境

项目结构

```bash
$ tree mybatis-demo-2 -I target
mybatis-demo-2
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── atguigu
    │   │           └── mybatis
    │   │               ├── mapper
    │   │               │   └── ParameterMapper.java
    │   │               ├── pojo
    │   │               │   └── User.java
    │   │               └── utils
    │   │                   └── SqlSessionUtil.java
    │   └── resources
    │       ├── com
    │       │   └── atguigu
    │       │       └── mybatis
    │       │           └── mapper
    │       │               └── ParameterMapper.xml
    │       ├── jdbc.properties
    │       ├── log4j.xml
    │       └── mybatis-config.xml
    └── test
        └── java
            └── com
                └── atguigu
                    └── mybatis
                        └── mapper
                            └── TestParameterMapper.java

```

日志配置文件 log4j.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
<log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">
    <appender name="STDOUT" class="org.apache.log4j.ConsoleAppender">
        <param name="Encoding" value="UTF-8" />
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern" value="%-5p %d{MM-dd HH:mm:ss} %m (%F:%L) \n" />
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

数据库配置文件 jdbc.properties

```bash
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/MyBatis
jdbc.username=root
jdbc.password=123456
```

mybatis配置文件 mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--属性-->
    <properties resource="jdbc.properties"></properties>

    <!--类型别名-->
    <typeAliases>
        <package name="com.atguigu.mybatis.pojo"/>
    </typeAliases>

    <!--数据库配置-->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>

    <!--xml包路径-->
    <mappers>
        <package name="com.atguigu.mybatis.mapper"/>
    </mappers>
</configuration>
```

工具类 SqlSessionUtil.java

```java
package com.atguigu.mybatis.utils;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class SqlSessionUtil {
    public static SqlSession getSqlSession() {

        try {
            InputStream resourceAsStream = Resources.getResourceAsStream("mybatis-config.xml");
            SqlSessionFactory build = new SqlSessionFactoryBuilder().build(resourceAsStream);
            return build.openSession(true);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

```

实体类 User.java

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

    // 省略getter 和setter
}

```

Mapper接口 ParameterMapper.java

```java
package com.atguigu.mybatis.mapper;

import com.atguigu.mybatis.pojo.User;

import java.util.List;

public interface ParameterMapper {

    /**
     * 获取所有成员
     * @return
     */
    List<User> getAllUser();
}

```

Mapper.xml ParameterMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.atguigu.mybatis.mapper.ParameterMapper">

    <!-- List<User> getAllUser(); -->
    <select id="getAllUser" resultType="User">
        select * from t_user
    </select>
</mapper>
```

测试类 TestParameterMapper.java
```java
package com.atguigu.mybatis.mapper;

import com.atguigu.mybatis.pojo.User;
import com.atguigu.mybatis.utils.SqlSessionUtil;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

import java.util.List;

public class TestParameterMapper {

    @Test
    public void testGetAllUser(){
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        ParameterMapper mapper = sqlSession.getMapper(ParameterMapper.class);
        List<User> allUser = mapper.getAllUser();

        allUser.forEach(System.out::println);
    }
}

```
