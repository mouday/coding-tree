# 高级数据操作-更新数据

1、通常一定是跟随条件更新

```sql
update 表名 set 字段名 = 新值 where 判断条件;
```

2、如果没有条件，是全表更新。可以使用limit来显示控制更新的数量

```sql
update 表名 set 字段名 = 新值 [ where 判断条件 ] limit 数量;

create table my_update(
    id int primary key auto_increment,
    name varchar(10)
);

insert into my_update (name) values ('A'), ('A'), ('A'), ('A');

mysql> select * from my_update;
+----+------+
| id | name |
+----+------+
|  1 | A    |
|  2 | A    |
|  3 | A    |
|  4 | A    |
+----+------+

update my_update set name = 'B' where name = 'A' limit 2;

mysql> select * from my_update;
+----+------+
| id | name |
+----+------+
|  1 | B    |
|  2 | B    |
|  3 | A    |
|  4 | A    |
+----+------+
```