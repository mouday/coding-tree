# 数据操作

## 插入操作

```sql
-- 方式一：插入指定字段数据（推荐使用）
insert into 表名 [(字段列表)] values (对应列数据);

-- 方式二：插入所有字段对应的数据
insert into 表名 values (对应列数据);
```

示例

```sql
create table tb_teacher(
 name varchar(10),
 age int
);

-- 插入一条数据
insert into tb_teacher (name, age) values ('Jack', 24);

-- 字段名和值需要一一对应
insert into tb_teacher (age, name) values (25, 'Tom');

-- 可以只插入部分字段数据
insert into tb_teacher (name) values ('Steve');

-- 插入全部字段对应的数据,此时值列表需要对应表结构
insert into tb_teacher values ('Jery', 23);
```

## 查询操作

```sql
-- 查询表中全部字段数据
select * from 表名;

-- 查询表中部分字段数据
select 字段列表 from 表名;

-- 简单条件查询数据
select 字段列表/* from 表名 where 字段名 = 值;
```

示例

```sql
-- 查询所有数据
select * from tb_teacher;
+-------+------+
| name  | age  |
+-------+------+
| Jack  |   24 |
| Tom   |   25 |
| Steve | NULL |
| Jery  |   23 |
+-------+------+

-- 指定字段
select name from tb_teacher;
+-------+
| name  |
+-------+
| Jack  |
| Tom   |
| Steve |
| Jery  |
+-------+

-- 限制条件, 年龄==23
select name from tb_teacher where age = 23;
+------+
| name |
+------+
| Jery |
+------+
```

## 删除操作

```sql
-- 如果没有条件，会删除所有数据
delete from 表名 [where 条件];
```

```sql
-- 删除年龄为23的数据
delete from tb_teacher where age = 23;

select * from tb_teacher;
+-------+------+
| name  | age  |
+-------+------+
| Jack  |   24 |
| Tom   |   25 |
| Steve | NULL |
+-------+------+
```

## 更新操作

```sql
-- 如果没有where条件，将会更新表中所有的值
update 表名 set 字段名 = 新值 [where 条件];
```

示例

```sql
-- 更新Tom的年龄为26
update tb_teacher set age = 26 where name = 'Tom';

select * from tb_teacher;
+-------+------+
| name  | age  |
+-------+------+
| Jack  |   24 |
| Tom   |   26 |
| Steve | NULL |
+-------+------+
```

