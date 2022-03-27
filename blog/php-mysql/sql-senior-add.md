# 高级数据操作-新增数据

## 多数据插入

只要写一次insert，可以插入多条数据

基本语法

```sql
insert into 表名 [(字段列表)] values (值列表), (值列表)...;


create table my_student(
    id int primary key auto_increment,
    name varchar(10)
);

insert into my_student (name) values ('张三'), ('李四'), ('王五');

mysql> select * from my_student;
+----+--------+
| id | name   |
+----+--------+
|  1 | 张三   |
|  2 | 李四   |
|  3 | 王五   |
+----+--------+

```

## 主键冲突

```sql
insert into my_student (id, name) values (1, '张飞');
ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY'
```

### 1、主键冲突更新

如果插入过程中主键冲突，那么采用更新方式

```sql
insert into 表名 [(字段列表)] on duplicate key update 字段=新值;

insert into my_student (id, name) values (1, '张飞') 
on duplicate key update name = '张飞';

mysql> select * from my_student;
+----+--------+
| id | name   |
+----+--------+
|  1 | 张飞   |
|  2 | 李四   |
|  3 | 王五   |
+----+--------+
```

### 2、主键冲突替换

```sql
replace into 表名 [(字段列表)] values (值列表);

replace into  my_student (id, name) values (1, '刘备');

mysql> select * from my_student;
+----+--------+
| id | name   |
+----+--------+
|  1 | 刘备   |
|  2 | 李四   |
|  3 | 王五   |
+----+--------+
```

## 蠕虫复制

一分为二，成倍增加

从已有的数据中获取数据，并且插入到数据表中

```sql
insert into 表名 [(字段列表)] select */字段列表 from 表名;

insert into my_student (name) select name from my_student;

mysql> select * from my_student;
+----+--------+
| id | name   |
+----+--------+
|  1 | 刘备   |
|  2 | 李四   |
|  3 | 王五   |
|  4 | 刘备   |
|  5 | 李四   |
|  6 | 王五   |
+----+--------+
```

注意：

1. 蠕虫复制通常是重复数据，可以短期内复制大量的数据，从而测试表的压力
2. 需要注意主键冲突
























