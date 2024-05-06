## 列属性（字段属性）

6个属性：

null、默认值、列描述、主键、唯一键、自动增长

## 1、null

代表字段为空

注意：

1. 在设计表的时候，尽量不要让数据为空
2. MySQL的记录长度为65535个字节，如果一个表中有字段允许为null, 那么系统就会设计保留一个字节来存储null,最终有效存储长度为65534个字节

## 2、默认值default

用户不设置数据的时候，默认赋值

```sql
create table my_default(
  name varchar(10) not null,
  age int default 18
);

mysql> desc my_default;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(10) | NO   |     | NULL    |       |
| age   | int(11)     | YES  |     | 18      |       |
+-------+-------------+------+-----+---------+-------+

-- 插入数据，未设置的值会使用默认值
insert into my_default (name) values('Tom');
mysql> select * from my_default;
+------+------+
| name | age  |
+------+------+
| Tom  |   18 |
+------+------+

-- 显示告知，使用默认值
insert into my_default values('Tom', default);
mysql> select * from my_default;
+------+------+
| name | age  |
+------+------+
| Tom  |   18 |
| Tom  |   18 |
+------+------+
```

## 3、列描述

comment 注释说明

```sql
 create table my_comment(
  name varchar(10) not null comment '姓名，不能为空',
  age int default 18  comment '年龄，默认18岁'
);

-- 查看注释
show create table my_comment;

CREATE TABLE `my_comment` (
  `name` varchar(10) COLLATE utf8mb4_general_ci NOT NULL COMMENT '姓名，不能为空',
  `age` int(11) DEFAULT '18' COMMENT '年龄，默认18岁'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

```

## 4、主键 

primary key 主要的键，在一张表中，有且只有一个值，具有唯一性

主键默认不允许为空`not null`

### 4.1、创建主键

1、随表创建

- 方案1：直接在需要当做主键的字段之后，增加`primary key`
- 方案2：在所有字段之后增加`primary key(字段信息)`

```sql
create table my_primary_key_1(
    username varchar(10) primary key
);

create table my_primary_key_2(
    username varchar(10),
    primary key(`username`)
);

```

2、表后增加


基本语法
```sql
alter table 表名 add primary key(字段名);
```

示例
```sql
create table my_primary_key_3(
    username varchar(10)
); 

alter table my_primary_key_3 add primary key(username);
```

### 4.2、查看主键

```sql
-- 方案一：查看表结构
desc my_primary_key_1;
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| username | varchar(10) | NO   | PRI | NULL    |       |
+----------+-------------+------+-----+---------+-------+

-- 方案二：查看创建语句
show create table my_primary_key_2;
CREATE TABLE `my_primary_key_2` (
  `username` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

```

### 4.3、删除主键

```sql
alter table 表名 drop primary key;
```

示例

```sql
alter table my_primary_key_1 drop primary key;

mysql> desc my_primary_key_1;
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| username | varchar(10) | NO   |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

### 4.4、复合主键

案例：一张学生选修课表
- 一个学生可以选修多个选修课
- 一个选修课也可以由多个学生来选
- 一个学生在一个选修课中只有一个成绩

```sql
-- 添加复合主键
create table my_score(
  student_no char(10),
  course_no char(10),
  score tinyint not null,
  primary key(student_no, course_no)
);

desc my_score;
+------------+------------+------+-----+---------+-------+
| Field      | Type       | Null | Key | Default | Extra |
+------------+------------+------+-----+---------+-------+
| student_no | char(10)   | NO   | PRI | NULL    |       |
| course_no  | char(10)   | NO   | PRI | NULL    |       |
| score      | tinyint(4) | NO   |     | NULL    |       |
+------------+------------+------+-----+---------+-------+
```


### 4.5、主键约束

1. 当前字段对应的数据不能为空
2. 当前字段对应的数据不能有任何重复

```sql
-- 第一次可以成功插入
mysql> insert into my_primary_key_2 (username) values('Tom');
Query OK, 1 row affected (0.00 sec)

-- 第二次插入失败
mysql> insert into my_primary_key_2 (username) values('Tom');
ERROR 1062 (23000): Duplicate entry 'Tom' for key 'PRIMARY'

mysql> select * from my_primary_key_2;
+----------+
| username |
+----------+
| Tom      |
+----------+
```

### 4.6、主键分类

- 业务主键: 学生ID，课程ID
- 逻辑主键: 自然增长的整型（应用广泛）

## 5、自动增长

auto_increment 如果没有提供该字段的值，系统会根据之前存在的数据进行自动增长

通常用于逻辑主键

### 5.1、自动增长的原理

1. 系统保存当前自动增长字段，记录当前对应的数据值，在给定一个指定的步长
2. 当用户进行数据插入时，如果没有给值，系统在原始值上加上步长变成新的数据
3. 自动增长的触发，给定属性的字段没有提供值
4. 自动增长只适用于数值

### 5.2、使用自动增长

基本语法

```sql
字段 auto_increment
```
```sql
create table my_auto(
  id int primary key auto_increment,
  name varchar(10) not null comment '用户名',
  password varchar(50) not null comment '密码'
);

mysql> desc my_auto;
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| id       | int(11)     | NO   | PRI | NULL    | auto_increment |
| name     | varchar(10) | NO   |     | NULL    |                |
| password | varchar(50) | NO   |     | NULL    |                |
+----------+-------------+------+-----+---------+----------------+

insert into my_auto(name, password) values('Tom', '123456');

mysql> select * from my_auto;
+----+------+----------+
| id | name | password |
+----+------+----------+
|  1 | Tom  | 123456   |
+----+------+----------+
```

### 5.3、修改自动增长

```sql
show create table my_auto;

CREATE TABLE `my_auto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(50) COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

-- 修改auto_increment
alter table my_auto auto_increment=10;

show create table my_auto;

CREATE TABLE `my_auto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(50) COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
```

### 5.4、删除自动增长

通过修改字段属性，去掉auto_increment

```sql
alter table my_auto modify id int;

show create table my_auto;

CREATE TABLE `my_auto` (
    `id` int(11) NOT NULL,
    `name` varchar(10) COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
    `password` varchar(50) COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
```

### 5.5、初始设置
```sql
show variables like 'auto_increment%';
+--------------------------+-------+
| Variable_name            | Value |
+--------------------------+-------+
| auto_increment_increment | 1     |
| auto_increment_offset    | 1     |
+--------------------------+-------+
```

- auto_increment_increment 步长
- auto_increment_offset 初始值

### 5.6、细节问题

1. 一张表只有一个自增长，自增长属于表选项
2. 手动修改表的的自增长值，要比原有数据大

```sql
-- 指定id值, auto_increment会自动增长
insert into my_auto(id, name, password) values(10, 'Tom', '123456');

mysql> select * from my_auto;
+----+------+----------+
| id | name | password |
+----+------+----------+
|  1 | Tom  | 123456   |
| 10 | Tom  | 123456   |
+----+------+----------+
```

## 6、唯一键

unique key 
可以有多个，
允许数据为null, 可以有多个null，null不参与比较

### 6.1、创建唯一键

和主键类似

- 直接在表字段后增加唯一键标识 `unique [key]`
- 所有字段之后使用 `unique key(字段列表)`
- 创建完表之后也可以增加唯一键

```sql
alter table 表名 add unique key(字段)

-- 方式一：
create table my_unique1(
    id int primary key auto_increment,
    username varchar(10) unique
);

-- 方式二：
create table my_unique2(
    id int primary key auto_increment,
    username varchar(10),
    unique key(username)
);

-- 方式三：
create table my_unique3(
    id int primary key auto_increment,
    username varchar(10)
);

alter table my_unique3 add unique key(username);
```

### 6.2、查看唯一键

```sql
mysql> desc my_unique1;
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| id       | int(11)     | NO   | PRI | NULL    | auto_increment |
| username | varchar(10) | YES  | UNI | NULL    |                |
+----------+-------------+------+-----+---------+----------------+
```

不为空null的时候，不允许重复

```sql
-- 可以插入多个null
insert into my_unique1 (username) values(null);
insert into my_unique1 (username) values(null);

-- 不为null时，不允许重复
insert into my_unique1 (username) values('Tom');
insert into my_unique1 (username) values('Tom');
ERROR 1062 (23000): Duplicate entry 'Tom' for key 'username'
```

### 6.3、删除唯一键

一个表中允许存在多个唯一键


```sql
alter table 表名 drop index 唯一键名字;


alter table my_unique2 drop index username;

mysql> desc my_unique2;
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| id       | int(11)     | NO   | PRI | NULL    | auto_increment |
| username | varchar(10) | YES  |     | NULL    |                |
+----------+-------------+------+-----+---------+----------------+
```

修改唯一键：先删除后增加

### 6.4、复合唯一键

可以使用多个字段来共同保证唯一性
