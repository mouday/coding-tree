# 数据表操作

## 创建数据表

1、基本语法

```sql
create table 表名 (
    字段名 字段类型 [字段属性],
    字段名 字段类型 [字段属性],
    ...
) [表选项];
```

需要注意：表需要放在对应的数据库下面

2、创建方式一

```sql
-- 先选择数据库
use mydatabase;

-- 创建数据表
create table user(
    name varchar(10)
);
```

3、创建方式二

```sql
-- 直接将数据表挂到数据库下
create table mydatabase.user(
    name varchar(10)
);
```

4、表选项

- Engine 存储引擎 
- Charset 字符集
- Collate 校对集

指定表的字符集

```sql
create table user(
    name varchar(10)
) charset utf8;
```

5、复制已有表结构

```sql
create table 表名 like 表名;

-- eg 从test数据库复制表
create table user like test.user;
```

## 显示数据表

```sql
-- 显示所有表
mysql> show tables;
+----------------------+
| Tables_in_mydatabase |
+----------------------+
| t_author             |
| user                 |
+----------------------+


-- 显示匹配表
mysql> show tables like '%author';
+--------------------------------+
| Tables_in_mydatabase (%author) |
+--------------------------------+
| t_author                       |
+--------------------------------+
```

## 显示表结构

基本语法
```sql
desc 表名(常用);
describe 表名;
show columns from 表名;
```

示例

```sql
mysql> desc user;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(10) | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
1 row in set (0.00 sec)


mysql> describe user;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(10) | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
1 row in set (0.01 sec)


mysql> show columns from user;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(10) | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
1 row in set (0.01 sec)
```

字段含义

```
Field    字段名
Type     字段类型
Null     是否允许为空
Key      索引
Default  默认值
Extra    额外的属性
```

## 显示表创建语句

基本语法
```sql
show create table 表名;
```

示例
```sql
mysql> show create table user;
+-------+----------------+
| Table | Create Table   |
+-------+----------------+
| user  | CREATE TABLE `user` (
  `name` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci |
+-------+----------------+
1 row in set (0.00 sec)
```

语句结束符

- `;` `\g` 效果一样，字段在上，数据在下
- `\G` 字段在左，数据在右

```sql
mysql> show create table user\G
*************************** 1. row ***************************
       Table: user
Create Table: CREATE TABLE `user` (
  `name` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
1 row in set (0.00 sec)
```




## 设置表属性

- engine
- charset
- collate

```sql
-- 基本语法
alter table 表名 表选项 [=] 值;

-- eg 修改表的字符集
alter table user charset gbk;
```

如果数据表已经有数据，不要轻易修改表属性

## 修改表结构

1、修改表名

```sql
--基本语法
rename table 旧表名 to 新表名;

-- eg:
rename table user to tb_user;
```

2、新增字段

```sql
-- 基本语法
alter table 表名 add [column] 字段名 字段类型 [字段属性] [位置first/after 字段名];

mysql> desc user;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(10) | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+

-- 给学生表新增age字段,默认加到表的最后
mysql> alter table tb_user add age int;

mysql> desc tb_user;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(10) | YES  |     | NULL    |       |
| age   | int(11)     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+


-- 在最前面增加一个id字段
mysql> alter table tb_user add id int first;

mysql> desc tb_user;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int(11)     | YES  |     | NULL    |       |
| name  | varchar(10) | YES  |     | NULL    |       |
| age   | int(11)     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
```

字段位置
```
first          放在最前名
alter 字段名    放在某个字段后面
```

3、修改字段名

```sql
-- 基本语法
alter table 表名 change 旧字段名 新字段名 字段类型 [字段属性] [新位置]

-- 将age字段修改为old
mysql> alter table tb_user change age old int;

mysql> desc tb_user;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int(11)     | YES  |     | NULL    |       |
| name  | varchar(10) | YES  |     | NULL    |       |
| old   | int(11)     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+

```

4、修改字段属性

```sql
-- 基本语法
alter table 表名 modify 字段名 新字段类型 [新字段属性] [新位置]

-- eg 将name的长度由10修改为20
mysql> alter table tb_user modify name varchar(20);

mysql> desc tb_user;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int(11)     | YES  |     | NULL    |       |
| name  | varchar(20) | YES  |     | NULL    |       |
| old   | int(11)     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
```

5、删除字段

```sql
-- 基本语法
alter table 表名 drop 字段名

-- eg 删除old字段
alter table tb_user drop old;
```

## 删除表结构

```sql
-- 基本语法, 可以同时删除多个表
drop table 表名 [, 表名...];

-- eg: 删除 tb_user表
mysql> drop table tb_user;

mysql> show tables;
+----------------------+
| Tables_in_mydatabase |
+----------------------+
| t_author             |
+----------------------+
```
