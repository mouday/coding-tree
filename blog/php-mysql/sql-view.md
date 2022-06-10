# 视图 view

## 1、创建视图

视图本质是SQL指令

基本语法

```sql
-- 可以是单表数据，也可以是连接查询，联合查询或子查询
create view 视图名字 as select 指令
```

示例

```sql
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

mysql> select * from my_class;
+----+--------+
| id | name   |
+----+--------+
|  1 | 一班   |
|  3 | 三班   |
+----+--------+
2 rows in set (0.00 sec)

-- 创建视图
create view student_class_view as 
select s.*, c.name class_name from my_student as s 
left join my_class as c
on s.class_id = c.id;
```

查看视图结构，视图本身是虚拟表，所以关于表的操作都适用于视图

```sql
show tables;
show create view <table_name>;
desc <table_name>;
```

## 2、使用视图

视图是一张虚拟表，可以直接把视图当做表操作，视图本身没有数据，是临时执行select语句得到对应的结果，视图主要用于查询操作

基本语法
```sql
select 字段列表 from 视图名字 [子句];
```

示例

```sql
select * from student_class_view;
+----+--------+----------+------+--------+------------+
| id | name   | class_id | age  | gender | class_name |
+----+--------+----------+------+--------+------------+
|  1 | 刘备   |        1 |   18 |      2 | 一班       |
|  2 | 李四   |        1 |   19 |      1 | 一班       |
|  3 | 王五   |     NULL |   20 |      2 | NULL       |
|  4 | 张飞   |     NULL |   21 |      1 | NULL       |
|  5 | 关羽   |     NULL |   22 |      2 | NULL       |
|  6 | 曹操   |        1 |   20 |   NULL | 一班       |
+----+--------+----------+------+--------+------------+
6 rows in set (0.00 sec)
```

## 3、修改视图

本质是修改视图对应的查语句

基本语法
```sql
alter view 视图名字 as select 语句;
```

示例

```sql
alter view student_class_view as 
select s.id, s.name, c.name class_name from my_student as s 
left join my_class as c
on s.class_id = c.id;

mysql> select * from student_class_view;
+----+--------+------------+
| id | name   | class_name |
+----+--------+------------+
|  1 | 刘备   | 一班       |
|  2 | 李四   | 一班       |
|  3 | 王五   | NULL       |
|  4 | 张飞   | NULL       |
|  5 | 关羽   | NULL       |
|  6 | 曹操   | 一班       |
+----+--------+------------+
```

## 4、删除视图

基本语法

```sql
drop view 视图名字;
```

示例
```sql
drop view student_class_view;
```
