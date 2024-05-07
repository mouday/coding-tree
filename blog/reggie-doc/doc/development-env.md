## 开发环境搭建

1、数据库环境搭建

- 数据库名 reggie
- 字符集 uft8mb4
- 排序规则 utf8mb4_general_ci

可以使用 Navicat 图形界面操作

也可以使用 MySQL 命令行操作

```bash
$ mysql -uroot -p

mysql> show database;

mysql> CREATE DATABASE IF NOT EXISTS db_reggie DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;

mysql> SHOW CREATE DATABASE db_reggie;

mysql> drop database db_reggie;
```

导入表结构

[db_reggie.sql](/resource/db_reggie.sql)

```bash
mysql> use db_reggie;


# 避免中文路径
# 可以直接拖拽文件到此处，自动转换为文件路径
mysql> source db_reggie.sql


mysql> show tables;
+------------------+
| Tables_in_reggie |
+------------------+
| address_book     |
| category         |
| dish             |
| dish_flavor      |
| employee         |
| order_detail     |
| orders           |
| setmeal          |
| setmeal_dish     |
| shopping_cart    |
| user             |
+------------------+
11 rows in set (0.02 sec)
```

![](image/数据表.png)

Maven 项目搭建

```
GroupId: com.github.mouday
ArtifactId: reggie_take_out
Version: 1.0-SNAPSHOT
```

检查 Maven 配置

```
VM Options: -DarchetypeCatalog=local
```

检查 JDK

```bash
$ java -version
java version "1.8.0_251"
Java(TM) SE Runtime Environment (build 1.8.0_251-b08)
Java HotSpot(TM) -64Bit Server VM (build 25.251-b08, mixed mode)
```

pom.xml

[pom.xml](resource/pom.xml)

application.yml

[application.yml](resource/application.yml)

项目启动入口

```java
package com.github.mouday.reggie;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@Slf4j
@SpringBootApplication
public class ReggieApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReggieApplication.class, args);
        log.info("项目启动成功：http://127.0.0.1:8080");
    }
}

```

设置静态资源映射

```java
package com.github.mouday.reggie.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

@Slf4j
@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {

    // 设置静态资源映射
    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.info("设置静态资源映射");

        registry.addResourceHandler("/backend/**")
                .addResourceLocations("classpath:/backend/");

        registry.addResourceHandler("/front/**")
                .addResourceLocations("classpath:/front/");
    }
}

```

将前端代码拷贝到`resources`目录下
