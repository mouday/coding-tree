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
  configuration:
    # 开启SQL语句打印
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
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

### 数据表和数据

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

### 定义Mapper

```java
package com.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.demo.domain.Book;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BookMapper extends BaseMapper<Book> {
}

```

### 测试类


```java
package com.demo.mapper;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.demo.domain.Book;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class BookMapperTest {
    @Autowired
    private BookMapper bookMapper;

    @Test
    public void getById(){
        Book book = bookMapper.selectById(1);
        System.out.println(book);
    }

    @Test
    public void save(){
        Book book = new Book();
        book.setTitle("明朝那些事");
        book.setAuthor("当年明月");

        int ret = bookMapper.insert(book);
        System.out.println(ret);
    }

    @Test
    public void delete(){
        int ret = bookMapper.deleteById(1);
        System.out.println(ret);
    }

    @Test
    public void update(){
        Book book = new Book();
        book.setId(2L);
        book.setTitle("水浒传2");

        int ret = bookMapper.updateById(book);
        System.out.println(ret);
    }

    @Test
    public void getAll(){
        List<Book> books = bookMapper.selectList(null);
        System.out.println(books);
    }

    @Test
    public void getBy(){
        LambdaQueryWrapper<Book> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Book::getTitle, "三国演义");

        List<Book> books = bookMapper.selectList(queryWrapper);
        System.out.println(books);
    }
}
```

### 报错
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

### MP开启日志输出

将日志输出到控制台

```yaml
mybatis-plus:
  configuration:
    # 开启SQL语句打印
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

### 分页功能

配置分页拦截器

```java
package com.demo.config;

import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MybatisPlus配置
 */
@Configuration
public class MPConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 添加分页拦截器
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        return interceptor;
    }
}

```


使用分页对象IPage

```java
// 两个参数：current, size
IPage<Book> page = Page.of(2, 3);

bookMapper.selectPage(page, null);
System.out.println(page);
```

### 条件查询

```java
String name = "三国演义";

LambdaQueryWrapper<Book> queryWrapper = new LambdaQueryWrapper<>();

// 按照条件拼装
queryWrapper.like(StringUtils.hasText(name), Book::getTitle, name);

List<Book> books = bookMapper.selectList(queryWrapper);
System.out.println(books);
```

## 业务层开发

定义接口

```java
package com.demo.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.demo.domain.Book;

import java.util.List;

public interface BookService {
    boolean save(Book book);

    boolean update(Book book);

    boolean delete(Integer id);

    Book getById(Integer id);

    List<Book> getAll();

    IPage<Book> getByPage(int currentPage, int pageSize);
}

```

实现接口

```java
package com.demo.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.demo.domain.Book;
import com.demo.mapper.BookMapper;
import com.demo.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {
    @Autowired
    private BookMapper bookMapper;


    @Override
    public boolean save(Book book) {
        return bookMapper.insert(book) > 0;
    }

    @Override
    public boolean update(Book book) {
        return bookMapper.updateById(book) > 0;
    }

    @Override
    public boolean delete(Integer id) {
        return bookMapper.deleteById(id) > 0;
    }

    @Override
    public Book getById(Integer id) {
        return bookMapper.selectById(id);
    }

    @Override
    public List<Book> getAll() {
        return bookMapper.selectList(null);
    }

    @Override
    public IPage<Book> getByPage(int currentPage, int pageSize) {
        IPage<Book> page = Page.of(currentPage, pageSize);
        return bookMapper.selectPage(page, null);
    }
}

```

测试接口

```java
package com.demo.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.demo.domain.Book;
import org.junit.jupiter.api.Test;
import org.junit.platform.commons.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Primary;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BookServiceTest {
    @Autowired
    private BookService bookService;

    @Test
    void save() {
        Book book = new Book();
        book.setTitle("明朝那些事");
        book.setAuthor("当年明月");

        boolean ret = bookService.save(book);
        System.out.println(ret);
    }

    @Test
    void update() {
        Book book = new Book();
        book.setId(2L);
        book.setTitle("水浒传2");

        boolean ret = bookService.update(book);
        System.out.println(ret);
    }

    @Test
    void delete() {
        boolean ret = bookService.delete(1);
        System.out.println(ret);
    }

    @Test
    void getById() {
        Book book = bookService.getById(1);
        System.out.println(book);
    }

    @Test
    void getAll() {
        List<Book> list = bookService.getAll();
        System.out.println(list);
    }

    @Test
    void getByPage() {
        IPage<Book> page = bookService.getByPage(1, 2);

        System.out.println(page.getCurrent());
        System.out.println(page.getSize());
        System.out.println(page.getTotal());
        System.out.println(page.getPages());
        System.out.println(page.getRecords());
    }
}
```

通用接口和实现类

```java
// 通用接口
public interface BookService 
  extends IService<Book> {}

// 实现类
@Service
public class BookServiceImpl 
  extends ServiceImpl<BookMapper, Book> 
  implements BookService {}
```

## 表现层开发

基于Restful开发表现层接口

- 新增 POST
- 删除 DELETE
- 修改 PUT
- 查询 GET

接收参数

- 实体数据 @RequestBody
- 路径变量 @PathVariable


```java
package com.demo.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.demo.domain.Book;
import com.demo.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getAll() {
        return bookService.list();
    }

    @PostMapping
    public boolean save(@RequestBody Book book) {
        return bookService.save(book);
    }

    @PutMapping
    public boolean update(@RequestBody Book book) {
        return bookService.update(book);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Integer id) {
        return bookService.delete(id);
    }

    @GetMapping("/{id}")
    public Book getById(@PathVariable Integer id) {
        return bookService.getById(id);
    }

    @GetMapping("/{currentPage}/{pageSize}")
    public IPage<Book> getPage(@PathVariable Integer currentPage, @PathVariable Integer pageSize) {
        return bookService.getByPage(currentPage, pageSize);
    }
}

```

测试

```json
GET http://localhost:8080/books


返回值：
[
  {
    "id": 2,
    "title": "水浒传",
    "author": "施耐庵"
  },
  {
    "id": 3,
    "title": "三国演义",
    "author": "罗贯中"
  }
]
###

GET http://localhost:8080/books/8


返回值
{
  "id": 9,
  "title": "三国演义2",
  "author": "罗贯中2"
}
###

GET http://localhost:8080/books/1/3


返回值
{
  "records": [
    {
      "id": 2,
      "title": "水浒传2",
      "author": "施耐庵"
    }
  ],
  "total": 7,
  "size": 3,
  "current": 1,
  "orders": [],
  "optimizeCountSql": true,
  "searchCount": true,
  "countId": null,
  "maxLimit": null,
  "pages": 3
}
###

POST http://localhost:8080/books
Content-Type: application/json

{
  "title": "三国演义2",
   "author": "罗贯中2"
}


返回值
true
###

PUT http://localhost:8080/books
Content-Type: application/json

{
  "id": 8,
  "title": "三国演义3",
   "author": "罗贯中3"
}


返回值
true
###

DELETE http://localhost:8080/books/8


返回值
true
```

## 统一返回值结果

设计表现层返回结果的模型类，用于后端与前端进行数据格式统一，也称为`前后端数据协议`


```java
package com.demo.vo;


import lombok.Data;

/**
 * 统一的返回结果对象
 *
 * @param <T>
 */
@Data
public class ResultVO<T> {

    /**
     * read only
     */
    private Boolean ok;

    private Integer code;

    private T data;

    private String message;

    public static ResultVO of(boolean ok) {
        if (ok) {
            return ResultVO.success();
        } else {
            return ResultVO.error();
        }
    }

    public Boolean getOk() {
        return this.code == 0;
    }

    public static <T> ResultVO<T> success() {
        return ResultVO.success(null);
    }

    public static <T> ResultVO<T> success(T data) {
        ResultVO<T> resultVO = new ResultVO<>();
        resultVO.setData(data);
        resultVO.setCode(0);
        resultVO.setMessage("success");
        return resultVO;
    }

    public static <T> ResultVO<T> error() {
        return ResultVO.error("error");
    }

    public static <T> ResultVO<T> error(String message) {
        ResultVO<T> resultVO = new ResultVO<>();
        resultVO.setCode(-1);
        resultVO.setMessage(message);
        return resultVO;
    }
}

```

返回结果为
```json
{
  "ok": false,
  "code": -1,
  "data": null,
  "message": "error"
}

{
  "ok": true,
  "code": 0,
  "data": null,
  "message": "success"
}

{
  "ok": true,
  "code": 0,
  "data": {
    "id": 9,
    "title": "三国演义2",
    "author": "罗贯中2"
  },
  "message": "success"
}


{
  "ok": true,
  "code": 0,
  "data": [
    {
      "id": 3,
      "title": "三国演义",
      "author": "罗贯中"
    }
  ],
  "message": "success"
}
```

## 前后端联调

使用axios发送异步请求

```js
axios.get('/books').then(res=>{
    console.log(res)
})
```

删除操作防抖，避免误操作

## 全局异常统一处理

```java
package com.demo.advice;

import com.demo.vo.ResultVO;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler
    public ResultVO handle(Exception ex) {
        ex.printStackTrace();
        return ResultVO.error(ex.getMessage());
    }
}

```

## 总结

pom.xml

application.yml

dao （BaseMapper）

dao测试类

service (MyBatis-Plus)

service 测试类

contorller Restful

页面

整合的技术

- JUnit
- MyBatis
- MyBatis-Plus
- Druid
