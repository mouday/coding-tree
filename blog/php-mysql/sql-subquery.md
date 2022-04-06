# 子查询 sub query

## 1、基本概念

### 1.1、子查询

嵌套查询下层的程序模块，当一个查询是另一个查询的条件时，称之为子查询

一条select语句中，嵌入了另一条select语句

### 1.2、主查询

主要的查询对象，第一条select语句，确定所获取的数据目标（数据源）


### 1.3、子查询和主查询的关系

1. 子查询是嵌入到主查询中的
2. 子查询辅助主查询，要么作为条件，要么作为数据源
3. 子查询可以独立存在，是一条完整的select语句


### 1.4、子查询的分类

1、按功能分

1. 标量子查询：子查询返回的结果是一个数据（一行一列）
2. 列子查询：返回一列（一列多行）
3. 行子查询：返回一行（一行多列）
4. 表子查询：返回多行多列
5. exists子查询 返回1或者0（类似布尔操作）

2、按位置分

1. where子查询
2. from子查询

## 2、标量子查询

查询结果是一个数据（一行一列）

### 2.1、基本语法

```sql
-- 子查询得到的结果只有一个值
select * from 数据源 where 条件判断 =/<> (select 字段名 form 数据源 where 条件判断);
```

### 2.2、示例

```sql
-- 知道学生的id，查询所在班级名字
-- 主查询：班级，子查询：班级id

mysql> select * from my_student;
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  2 | 李四   |        1 |   19 |      1 |
|  3 | 王五   |        2 |   20 |      2 |
|  4 | 张飞   |        2 |   21 |      1 |
|  5 | 关羽   |        1 |   22 |      2 |
|  6 | 曹操   |        1 |   20 |   NULL |
+----+--------+----------+------+--------+


mysql> select * from my_class;
+----+--------+
| id | name   |
+----+--------+
|  1 | 一班   |
|  3 | 三班   |
|  2 | 二班   |
+----+--------+

select class_id from my_student where id = 1;
+----------+
| class_id |
+----------+
|        1 |
+----------+

select * from my_class where id = (
    select class_id from my_student where id = 1
);
+----+--------+
| id | name   |
+----+--------+
|  1 | 一班   |
+----+--------+

```

## 3、列子查询

列子查询得到的结果是一列数据，一列多行

### 3.1、基本语法

```sql
主查询 where 条件 in (列子查询)
```

### 3.2、示例

```sql
-- 获取有学生的班级名字
-- 1、找到学生表中的所有班级id
-- 2、找出班级表中对应的名字

select distinct(class_id) from my_student;
+----------+
| class_id |
+----------+
|        1 |
|        2 |
+----------+

select name from my_class where id in (
    select distinct(class_id) from my_student
);
+--------+
| name   |
+--------+
| 一班   |
| 二班   |
+--------+
```

## 4、行子查询

行子查询返回的结果是一行多列

- 字段元素：一个字段对应的值
- 行元素：多个字段合起来作为一个元素参与运算

### 4.1、基本语法

```sql
主查询 where 条件 [(构造一个行元素)] = (行子查询);
```

### 4.2、示例
```sql
获取班级年龄最大，且班级号最大的学生

1、求年龄最大
2、求班级号最大
3、求出学生

-- 错误示例
select * from my_student having age = max(age) and class_id = max(class_id);
-- 1、having在group by之后，代表group by执行了一次，聚合函数使用
-- 2、group by 一旦执行，结果就是只返回一行记录，第一行 

select max(age), max(class_id) from my_student;
+----------+---------------+
| max(age) | max(class_id) |
+----------+---------------+
|       22 |             2 |
+----------+---------------+

select * from my_student where (age, class_id) = (
    select max(age), max(class_id) from my_student
);
Empty set (0.01 sec)

select * from my_student where (age, class_id) = (
    select max(age), min(class_id) from my_student
);
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  5 | 关羽   |        1 |   22 |      2 |
+----+--------+----------+------+--------+
```

总结：

标量子查询、列子查询、行子查询都属于where子查询

## 5、表子查询

表子查询返回结果是多行多列，与行子查询相似

行子查询需要行元素，表子查询没有

- 行子查询用于where条件判断，属于where子查询
- 表子查询用于from数据源，属于from子查询

### 5.1、基本语法
```sql
select 字段表 from (表子查询) as 别名 [where] [group by] [having] [order by] [limit]
```

### 5.2、示例
```sql
获取每个班级年龄最大的学生

-- 错误示例
select * from my_student group by class_id having age = max(age);

将每个班年龄最大的学生排在最前面 order by
针对结果进行group by 保留每组第一条数据

-- 
select * from (
    select * from my_student order by age desc
) as t group by t.class_id;
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  3 | 王五   |        2 |   20 |      2 |
+----+--------+----------+------+--------+

```

## 6、exists子查询

返回结果只有0或者1，1代表成立，0代表不成立

### 6.1、基本语法

```sql
where exists (查询语句)

-- 永远为真
where 1;
```

### 6.2、示例

```sql
-- 查询有学生的所有班级
select * from my_class as c where exists (
    select id from my_student as s where s.class_id = c.id
);
+----+--------+
| id | name   |
+----+--------+
|  1 | 一班   |
|  2 | 二班   |
+----+--------+
```

## 7、子查询中的特定关键字

```sql
mysql> select * from my_student;
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  2 | 李四   |        1 |   19 |      1 |
|  3 | 王五   |        2 |   20 |      2 |
|  4 | 张飞   |        2 |   21 |      1 |
|  5 | 关羽   |        1 |   22 |      2 |
|  6 | 曹操   |        1 |   20 |   NULL |
+----+--------+----------+------+--------+

mysql> select id from my_class;
+----+
| id |
+----+
|  1 |
|  3 |
|  2 |
+----+
```

### 7.1、in

```sql
主查询 where 条件 in (列子查询)

select * from my_student where class_id in (select id from my_class);
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  2 | 李四   |        1 |   19 |      1 |
|  3 | 王五   |        2 |   20 |      2 |
|  4 | 张飞   |        2 |   21 |      1 |
|  5 | 关羽   |        1 |   22 |      2 |
|  6 | 曹操   |        1 |   20 |   NULL |
+----+--------+----------+------+--------+
```

### 7.2、any

```sql
-- 查询结果中有任意一个匹配即可，等价于in
主查询 where 条件 any (列子查询)

select * from my_student where class_id = any (select id from my_class);
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  2 | 李四   |        1 |   19 |      1 |
|  3 | 王五   |        2 |   20 |      2 |
|  4 | 张飞   |        2 |   21 |      1 |
|  5 | 关羽   |        1 |   22 |      2 |
|  6 | 曹操   |        1 |   20 |   NULL |
+----+--------+----------+------+--------+

-- 不等于任意一个
主查询 where 条件 any <> (列子查询)
select * from my_student where class_id <> any (select id from my_class);
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  2 | 李四   |        1 |   19 |      1 |
|  3 | 王五   |        2 |   20 |      2 |
|  4 | 张飞   |        2 |   21 |      1 |
|  5 | 关羽   |        1 |   22 |      2 |
|  6 | 曹操   |        1 |   20 |   NULL |
+----+--------+----------+------+--------+
```

### 7.3、some

与any完全一样

### 7.4、all

```sql
-- 等于其中所有
=all(列子查询)

select * from my_student where class_id = all (select id from my_class);
Empty set (0.00 sec)

select * from my_class where id = all (select class_id from my_student);
Empty set (0.00 sec)

-- 不等于其中所有
<>all(列子查询)
select * from my_student where class_id <> all (select id from my_class);
Empty set (0.00 sec)

select * from my_class where id <> all (select class_id from my_student);
+----+--------+
| id | name   |
+----+--------+
|  3 | 三班   |
+----+--------+
```

### 7.5、值为null

如果值为null,不参与匹配
```sql
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

mysql> select * from my_student where class_id = any (select id from my_class);
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  2 | 李四   |        1 |   19 |      1 |
|  3 | 王五   |        2 |   20 |      2 |
|  4 | 张飞   |        2 |   21 |      1 |
|  6 | 曹操   |        1 |   20 |   NULL |
+----+--------+----------+------+--------+

mysql> select * from my_student where class_id <> any (select id from my_class);
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  2 | 李四   |        1 |   19 |      1 |
|  3 | 王五   |        2 |   20 |      2 |
|  4 | 张飞   |        2 |   21 |      1 |
|  6 | 曹操   |        1 |   20 |   NULL |
+----+--------+----------+------+--------+
```
