[返回目录](/blog/java/spring-boot/index.md)

# 14、SpringBoot数据层解决方案

- SQL
- NoSQL

## SQL

现有数据源解决方案

- 数据源：Druid 
- 持久化技术： MyBatis-Plus/MyBatis
- 数据库：MySQL 

Druid + MyBatis-Plus + MySQL组合方案的完整配置

pom.xml 数据库相关依赖

```xml

<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.2.6</version>
</dependency>

<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.2</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

application.yml

```yaml
# 配置数据库信息
spring:
  datasource:
    druid:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/data
      username: root
      password: 123456

mybatis-plus:
  configuration:
    # 开启SQL语句打印
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      # 数据库ID自增
      id-type: AUTO
```


### SpringBoot提供了3中内嵌的数据源对象

- HikariCP（默认）
- Tomcat提供DataSource
- Commons DBCP

application.yml 数据源配置

```yaml
# 配置数据库信息
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/data
    username: root
    password: 123456
```

或者

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/data
    hikari:
      driver-class-name: com.mysql.cj.jdbc.Driver
      username: root
      password: 123456
```


使用druid数据源配置

```yaml
# 配置数据库信息
spring:
  datasource:
    druid:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/data
      username: root
      password: 123456
```

### SpringBoot提供了内嵌的持久化技术

JDBCTemplate

依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

数据源配置

application.yml

```yaml
# 配置数据库信息
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/data
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456

```

jdbc可选配置

```yaml
# 配置数据库信息
spring:
  jdbc:
    template:
      query-timeout: -1 # 查询超时时间
      max-rows: -1 # 最大行数
      fetch-size: -1 # 缓存行数

```

实体类

```java
package com.example.demo.domain;

import lombok.Data;

@Data
public class Book {
    private Long id;

    private String title;

    private String author;
}

```

测试
```java
package com.example.demo;

import com.example.demo.domain.Book;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@SpringBootTest
public class JdbcTest {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 查询操作
     */
    @Test
    public void testQuery(){
        String sql = "select * from tb_book limit 1";

        RowMapper<Book> rowMapper = new RowMapper<Book>() {
            @Override
            public Book mapRow(ResultSet resultSet, int rowNum) throws SQLException {
                Book book= new Book();

                book.setTitle(resultSet.getString("title"));
                book.setId(resultSet.getLong("id"));
                book.setAuthor(resultSet.getString("author"));

                return book;
            }
        };

        List<Book> list = jdbcTemplate.query(sql, rowMapper);
        System.out.println(list);
        // [Book(id=2, title=明朝那些事, author=当年明月)]
    }

    /**
     * 写操作
     */
    @Test
    public void testUpdate(){
        String sql = "insert into tb_book (title, author) values ('西游记', '吴承恩')";
        jdbcTemplate.update(sql);
    }
}

```




## NoSQL