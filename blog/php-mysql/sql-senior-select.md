# 高级数据操作-查询数据

完整的查询指令

```sql
select 选项 字段列表 
from 数据源 
where 条件 
group by 分组 
having 条件 
order by 排序 
limit 限制;
```

## 1、select选项

处理查询到的结果

- all 默认值，表示保存所有记录
- distinct 去重，只保留一条（所有字段都相同认为重复）

```sql
create table my_select(
    name varchar(10)
);

insert into my_select (name) values ('A'), ('A'), ('A'), ('B');

mysql> select all * from my_select;
+------+
| name |
+------+
| A    |
| A    |
| A    |
| B    |
+------+

mysql> select distinct * from my_select;
+------+
| name |
+------+
| A    |
| B    |
+------+
```

## 2、字段列表

多张表获取数据，可能存在不同表中有同名字段，需要使用别名alias

```sql
字段名 [as] 字段别名;
```

```sql
select distinct name as name1, name as name2 from my_select;
+-------+-------+
| name1 | name2 |
+-------+-------+
| A     | A     |
| B     | B     |
+-------+-------+
```

## 3、from数据源

为前面的查询提供数据

数据源只要是一个符合二维表结构的数据即可

### 3.1、单表数据

```sql
from 表名;

select * from my_select;
```

### 3.2、多表数据

基本语法

```sql
from 表名1, 表名2...;
```

```sql
mysql> select * from my_select;
+------+
| name |
+------+
| A    |
| B    |
+------+
2 rows in set (0.00 sec)

mysql> select * from my_student;
+----+--------+
| id | name   |
+----+--------+
|  1 | 刘备   |
|  2 | 李四   |
|  3 | 王五   |
+----+--------+
3 rows in set (0.00 sec)

mysql> select * from my_select, my_student;
+------+----+--------+
| name | id | name   |
+------+----+--------+
| A    |  1 | 刘备   |
| B    |  1 | 刘备   |
| A    |  2 | 李四   |
| B    |  2 | 李四   |
| A    |  3 | 王五   |
| B    |  3 | 王五   |
+------+----+--------+
6 rows in set (0.00 sec)
```

结果是两张表记录数据相乘，字段数拼接

本质：从第一张表取出一条记录，去拼凑第二张表所有记录，保留所有结果

笛卡尔积，会给数据库造成压力，尽量避免


### 3.3、动态数据

from后面不是一个实体表，而是一个从表中查询出来得到的二维结果表（子查询）

基本语法

```sql
from (select 字段列表 from 表名) as 别名
```

```sql
mysql> select * from (select * from my_student) as t1;
+----+--------+
| id | name   |
+----+--------+
|  1 | 刘备   |
|  2 | 李四   |
|  3 | 王五   |
+----+--------+
```

## 4、Where条件

通过运算符进行结果比较，来判断符合条件的数据

## 5、Group by分组

根据指定的字段，将数据进行分组，分组的目的是为了统计

## 5.1、分组统计

```sql
group by 字段名
```

分组后，只保留每组的第一条数据

```sql
mysql> select * from my_student;
+----+--------+----------+
| id | name   | class_id |
+----+--------+----------+
|  1 | 刘备   |        1 |
|  2 | 李四   |        1 |
|  3 | 王五   |        2 |
+----+--------+----------+

mysql> select  class_id  from my_student group by class_id;
+----------+
| class_id |
+----------+
|        1 |
|        2 |
+----------+
```

## 5.2、统计函数（聚合函数）

- count() 统计数量。如果是字段，不统计null字段
- avg 平均值
- sum 求和
- max 最大值
- min 最小值
- group_concat 分组中指定字段拼接

按照班级统计每班人数，最大年龄，最小年龄，平均年龄

```sql
mysql> select * from my_student;
+----+--------+----------+------+
| id | name   | class_id | age  |
+----+--------+----------+------+
|  1 | 刘备   |        1 |   18 |
|  2 | 李四   |        1 |   19 |
|  3 | 王五   |        2 |   20 |
+----+--------+----------+------+

mysql> select class_id, count(*), max(age), min(age), avg(age) from my_student group by class_id;
+----------+----------+----------+----------+----------+
| class_id | count(*) | max(age) | min(age) | avg(age) |
+----------+----------+----------+----------+----------+
|        1 |        2 |       19 |       18 |  18.5000 |
|        2 |        1 |       20 |       20 |  20.0000 |
+----------+----------+----------+----------+----------+


mysql> select class_id, group_concat(name), count(*), max(age), min(age), avg(age) from my_student group by class_id;
+----------+--------------------+----------+----------+----------+----------+
| class_id | group_concat(name) | count(*) | max(age) | min(age) | avg(age) |
+----------+--------------------+----------+----------+----------+----------+
|        1 | 刘备,李四          |        2 |       19 |       18 |  18.5000 |
|        2 | 王五               |        1 |       20 |       20 |  20.0000 |
+----------+--------------------+----------+----------+----------+----------+
```


多分组
分组排序
回溯统计



having

order

limit

聚合函数


https://www.bilibili.com/video/BV1Vx411g7uJ?p=37&spm_id_from=pageDriver