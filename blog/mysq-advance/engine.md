
# 1、存储引擎

## 1. MySQL体系结构
- 连接层
- 服务层
- 引擎层
- 存储层

![](./img/MySQL体系结构.png)

## 2. 存储引擎简介

存储引擎就是存储数据、建立索引、更新/查询数据等技术的实现方式。

存储引擎是基于表的，而不是基于库的，所以存储引擎也可以成为表类型

创建表的时候，指定存储引擎

```sql
-- 默认存储引擎：InnoDB
create table 表名(
    字段 字段类型 [comment 字段注释]
) engine = InnoDB [comment 表注释];
```

查看当前数据库支持的存储引擎

```sql
show engines;
```

示例1、创建表 my_myisam ，指定MyISAM存储引擎

```sql
create table my_myisam(
    id int,
    name varchar(10)
) engine = MyISAM
```

示例2、创建表 my_memory ，指定MEMORY存储引擎

```sql
create table my_memory(
    id int,
    name varchar(10)
) engine = MEMORY
```
