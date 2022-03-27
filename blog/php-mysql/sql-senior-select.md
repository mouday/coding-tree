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


group

having

order

limit

聚合函数


https://www.bilibili.com/video/BV1Vx411g7uJ?p=36&spm_id_from=pageDriver
