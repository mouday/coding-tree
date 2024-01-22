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

### 问题

1、MySQL 8.x 驱动要求设置时区

- 修改url, 添加serverTimezone参数
- 修改MySQL数据库配置

```yaml
url: jdbc:mysql://127.0.01:3306/data?serverTimezone=Asia/Shanghai
```

2、提示驱动过时

```yaml
driver-class-name: com.mysql.jdbc.Driver
# 替换为：
driver-class-name: com.mysql.cj.jdbc.Driver
```


## 整合MyBatis-Plus

引入依赖

```xml
<!-- pom.xml -->

<!-- mybatis-plus -->
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

配置数据库信息

```yaml
# application.yml
# 配置数据库信息
spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/data
    username: root
    password: 123456

```

定义实体

```java
package com.example.demo.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("tb_book") // 指定表名
public class Book {
    private Long id;

    private String title;

    private String author;
}

```

继承接口

```java
package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.domain.Book;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BookMapper extends BaseMapper<Book> {
}

```

测试

```java
package com.example.demo.mapper;


import com.example.demo.domain.Book;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class BookMapperTest {
    @Autowired
    private BookMapper bookMapper;

    @Test
    public void selectAll(){
        List<Book> books = bookMapper.selectList(null);
        System.out.println(books);
    }
}

```



## 整合Druid

引入starter

```xml
<!-- Druid -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.2.6</version>
</dependency>
```

修改配置

```yaml
# application.yml

# 配置数据库信息
spring:
  datasource:
    druid:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/data
      username: root
      password: 123456

```

## 整合Lombok

Lombok：一个java类库，提供了一组注解，简化POJO实体类的开发


```xml
<!--lombok-->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

定义实体类

```java
package demo.domain;

import lombok.Data;

@Data
public class Book {
    private Long id;

    private String title;

    private String author;
}

```

自动生成的结果

```java
package com.demo.domain;

public class Book {
    private Long id;
    private String title;
    private String author;

    public Book() { }

    public Long getId() { }

    public String getTitle() { }

    public String getAuthor() { }

    public void setId(Long id) {  }

    public void setTitle(String title) {  }

    public void setAuthor(String author) {  }

    public boolean equals(Object o) { }

    protected boolean canEqual(Object other) {  }

    public int hashCode() {  }

    public toString() {}
}
```


整合任意第三方技术

- 导入对应的starter
- 配置对应的参数或者使用默认设置

