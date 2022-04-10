# 变量

MySQL本质是一种编程语言

## 1、系统变量

对所有用户客户端都有效

### 1.1、查看系统变量

1、方式一

```sql
show variables [like 'pattern'];
```

示例

```sql
mysql> show variables like 'autocommit';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| autocommit    | ON    |
+---------------+-------+
```

2、方式二：

使用select查询变量的数据值

```sql
select @@变量名;
```

示例

```sql
select @@autocommit;
+--------------+
| @@autocommit |
+--------------+
|            1 |
+--------------+
```

### 1.2、修改系统变量

1、局部修改（会话级别）

```sql
-- 只针对当前客户端当次连接有效
set 变量名 = 值;

-- eg:
set autocommit = 'off';
show variables like 'autocommit';
```

2、全局修改

```sql
-- 所有客户端，都有效
set global 变量名 = 值;
set @@global.变量名 = 值;

-- eg:
set global autocommit = 'off';
```

注意，全局修改之后,重启客户端生效


## 2、会话变量

也称为用户变量，设置的变量，只针对当前用户使用的客户端生效

```sql
-- 定义用户变量
set @变量名 = 值;

set @age = 23;
```

mysql中没有比较符号 == ，使用的是 =；
为了避免分不清是赋值还是比较，赋值使用`:=`

```sql
set @变量名 := 值;

set @name := 'Tom';
```

mysql允许将数据从表中取出存储到变量中，只能是一行数据

```sql
-- 1、赋值且查看赋值过程
select @变量1 := 字段1, @变量2 := 字段2 from 表 where 条件

select @name := name, @age := age from my_student limit 1;
+---------------+-------------+
| @name := name | @age := age |
+---------------+-------------+
| 刘备          |          18 |
+---------------+-------------+

--- 2、只赋值不看过程
select 字段1, 字段2 from 表 where 条件 into @变量1, @变量2;
select name, age from my_student limit 1 into @name, @age;
```

查看变量

```sql
select @变量名

mysql> select @name, @age;
+--------+------+
| @name  | @age |
+--------+------+
| 刘备   |   18 |
+--------+------+
```

## 3、局部变量

作用范围在begin到end语句块之间，在该语句块里设置的变量

- declare语句用于定义局部变量
- 局部变量 declare语句出现在begin到end语句块之间


声明语法 
```sql
declare 变量名 数据类型 [属性];
```
