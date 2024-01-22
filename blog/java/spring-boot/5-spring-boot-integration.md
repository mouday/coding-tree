[返回目录](/blog/java/spring-boot/index.md)

# 5、SpringBoot整合第三方技术

## 整合JUnit

引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

```java
package com.example.demo.dao;

public interface BookDao {
    void save();
}
```

```java
package com.example.demo.dao.impl;

import com.example.demo.dao.BookDao;
import org.springframework.stereotype.Repository;

@Repository
public class BookDaoImpl implements BookDao {
    @Override
    public void save() {
        System.out.println("save");
    }
}

```

测试用例

```java
package com.example.demo.dao;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class BookDaoTest {
    @Autowired
    private BookDao bookDao;

    @Test
    public void save() {
        bookDao.save();
    }
}

```

启动类查找范围：所在包及其父包

如果测试类不在启动引导类同一个包或者子包下面，需要指定启动类

```java
@SpringBootTest(classes = Application.class)
```

## 整合MyBatis

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

引入依赖

```xml
<!-- pom.xml -->
<!-- 引入mybatis 依赖 -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.3.1</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- 测试 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

配置数据库信息

```yaml
# application.yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/data
    username: root
    password: 123456
```

实体类

```java
// Book.java
package com.example.demo.domain;

import lombok.Data;

@Data
public class Book {
    private Long id;

    private String title;

    private String author;
}

```

```java
// BookDao.java
package com.example.demo.dao;

import com.example.demo.domain.Book;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BookDao {
    @Select("select * from tb_book where id = #{id}")
    public Book getById(Long id);
}

```

测试类

```java
package com.example.demo.dao;

import com.example.demo.domain.Book;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class BookDaoTest {
    @Autowired
    private BookDao bookDao;

    @Test
    public void save() {
        Book book = bookDao.getById(2L);
        System.out.println(book);
        // Book(id=2, title=水浒传, author=施耐庵)
    }
}

```