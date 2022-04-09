# 外键 foreing key

外键表示了两个实体之间的联系

外键 foreing key: A表中的一个字段的值指向另B表的主键

- B: 主表
- A: 从表

```
主表：主键（主关键字） = 从表：外键（外关键字）
```

## 1、外键操作
### 1.1、增加外键


基本语法

方式一：创建表的时候增加外键
```sql
[constraint `外键名`] foreign key (外键字段) references 主表(主键);
```
方式二：创建表后增加外键
```sql
alter table 从表 add [constraint `外关键字`] foreign key (外键字段) references 主表(主键);
```

示例1： 创建表的时候增加外键

```sql
-- 创建外键
create table my_foreign(
    id int primary key auto_increment,
    name varchar(10) not null,
    class_id int,
    -- 创建时，会自动增加普通索引
    foreign key (class_id) references my_class(id)
);

mysql> show create table my_foreign;
CREATE TABLE `my_foreign` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `my_foreign_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `my_class` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci


mysql> desc my_foreign;
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| id       | int(11)     | NO   | PRI | NULL    | auto_increment |
| name     | varchar(10) | NO   |     | NULL    |                |
| class_id | int(11)     | YES  | MUL | NULL    |                |
+----------+-------------+------+-----+---------+----------------+
3 rows in set (0.01 sec)

```
MUL多索引 外键本身也是索引

示例2： 创建表后增加外键
```sql
-- 查看原来的表
mysql> desc my_class;
+-------+-------------+------+-----+---------+----------------+
| Field | Type        | Null | Key | Default | Extra          |
+-------+-------------+------+-----+---------+----------------+
| id    | int(11)     | NO   | PRI | NULL    | auto_increment |
| name  | varchar(10) | NO   | UNI | NULL    |                |
+-------+-------------+------+-----+---------+----------------+
2 rows in set (0.01 sec)

mysql> show create table my_class;
CREATE TABLE `my_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci


mysql> desc my_student;
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| id       | int(11)     | NO   | PRI | NULL    | auto_increment |
| name     | varchar(10) | YES  |     | NULL    |                |
| class_id | int(11)     | YES  |     | NULL    |                |
| age      | int(11)     | YES  |     | NULL    |                |
| gender   | int(11)     | YES  |     | NULL    |                |
+----------+-------------+------+-----+---------+----------------+

mysql> show create table my_student\G
*************************** 1. row ***************************
       Table: my_student
Create Table: CREATE TABLE `my_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

-- 增加外键
alter table my_student add constraint fk_class_id foreign key (class_id) references my_class(id);

mysql> show create table my_student\G
*************************** 1. row ***************************
       Table: my_student
Create Table: CREATE TABLE `my_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_class_id` (`class_id`),
  CONSTRAINT `fk_class_id` FOREIGN KEY (`class_id`) REFERENCES `my_class` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

```

### 1.2、删除外键

外键不允许修改，只能先删除再添加

```sql
alter table 从表 drop foreign key 外键名字;
```

示例

```sql
alter table my_student drop foreign key `fk_class_id`;

mysql> show create table my_student\G
*************************** 1. row ***************************
       Table: my_student
Create Table: CREATE TABLE `my_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_class_id` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

```

外键不会删除普通索引，只会删除外键

删除普通索引
```sql
alter table 表名 drop index 索引名字;
```

### 1.3、外键的基本要求

1. 外键字段需要与关联的主表的主关键字段类型完全一致
2. 基本属性也要相同
3. 如果是表后增加外键，对数据还有一定的要求（从表数据与主表的关联关系）
4. 外键只能使用innodb存储引擎，myisam不支持

## 2、外键约束

外键约束：通过建立外键关系后，对主表和从表都会有一定的数据约束效律

### 2.1、约束的基本概念

当外键产生时，外键所在的表（从表）会受制于主表数据的存在，从而导致数据不能进行某些不符合规范的操作
不能插入主表不存在的数据

如果一张表被其他表外键引入，那么该表的数据操作不能随意，必须保证从表数据的有效性，不能随意删除一个被从表引入的记录

```sql
mysql> select * from my_class;
+----+--------+
| id | name   |
+----+--------+
|  1 | 一班   |
|  3 | 三班   |
|  2 | 二班   |
+----+--------+

insert into my_foreign (name, class_id) values ('张飞', 1);
Query OK, 1 row affected (0.01 sec)

-- 主表没有id=4的记录，从表不能插入该数据
insert into my_foreign (name, class_id) values ('张飞', 4);
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`mydatabase`.`my_foreign`, CONSTRAINT `my_foreign_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `my_class` (`id`))

mysql> select * from my_foreign;
+----+--------+----------+
| id | name   | class_id |
+----+--------+----------+
|  1 | 张飞   |        1 |
+----+--------+----------+
1 row in set (0.00 sec)

-- 从表中引用了id=1的记录，该数据不能被删除
delete from my_class where id = 1;
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails (`mydatabase`.`my_foreign`, CONSTRAINT `my_foreign_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `my_class` (`id`))

```
### 2.2、外键约束的概念

基本语法

```sql
add foreign key (外键字段) references 主表(主键) on 约束模式;
```

约束模式有三种

- district  严格模式 默认，不允许操作
- cascade  级联模式，一起操作，主表变化，从表的数据也跟着变化
- set null 置空模式 主表变化（删除）,从表对应记录设置，前提是从表中对应的外键字段允许为空

外键约束的主要对象是主表操作，从表就是不能插入主表不存在的数据

通常在进行约束的时候，需要制定操作，update 和 delete

常用的模式
```sql
-- 更新级联, 删除置空, 空格隔开
on update cascade on delete set null;
```

```sql
-- 增加约束模式
alter table my_student
add foreign key (class_id) references my_class(id)
on update cascade on delete set null;

mysql> show create table my_student\G
*************************** 1. row ***************************
       Table: my_student
Create Table: CREATE TABLE `my_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `my_student_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `my_class` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

mysql> select * from my_class;
+----+--------+
| id | name   |
+----+--------+
|  1 | 一班   |
|  3 | 三班   |
|  2 | 二班   |
+----+--------+
3 rows in set (0.00 sec)

mysql> select * from my_student;
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  2 | 李四   |        1 |   19 |      1 |
|  3 | 王五   |        2 |   20 |      2 |
|  4 | 张飞   |        2 |   21 |      1 |
|  5 | 关羽   |     NULL |   22 |      2 |
|  6 | 曹操   |        1 |   20 |   NULL |
+----+--------+----------+------+--------+
6 rows in set (0.00 sec)

-- 更新主表
update my_class set id = 4 where id = 2;

-- 从表中所有class_id=2 的记录被修改为了 class_id=4
mysql> select * from my_student;
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  2 | 李四   |        1 |   19 |      1 |
|  3 | 王五   |        4 |   20 |      2 |
|  4 | 张飞   |        4 |   21 |      1 |
|  5 | 关羽   |     NULL |   22 |      2 |
|  6 | 曹操   |        1 |   20 |   NULL |
+----+--------+----------+------+--------+


-- 删除主表数据
delete from  my_class where id = 4;

-- 从表中记录class_id=4被修改为class_id=null;
mysql> select * from my_student;
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  2 | 李四   |        1 |   19 |      1 |
|  3 | 王五   |     NULL |   20 |      2 |
|  4 | 张飞   |     NULL |   21 |      1 |
|  5 | 关羽   |     NULL |   22 |      2 |
|  6 | 曹操   |        1 |   20 |   NULL |
+----+--------+----------+------+--------+
6 rows in set (0.00 sec)
```

### 2.3、约束的作用

保证数据的完整性，主表与从表的数据要一致

正是因为外键有非常强大的数据约束作用，而且可能导致数据再后台变化的不可控性，导致程序在设计开发逻辑的时候，没有办法很好的把握数据，所以外键很少使用

