# enum 枚举类型

例如：

```
性别 gender 男 女 保密
```

基本语法

```
enum(数据值 1，数据值 2...);
```

- 数据值列表在 255 个以内，使用 1 个字节来存储
- 数据值列表超过 255，但是小于 65535，使用 2 个字节来存储

```sql
-- Enum(0=>'男', 1=>'女', 2=>'保密')
create table my_enum(
    gender enum('男', '女', '保密')
)

mysql> desc my_enum;
+--------+----------------------------+------+-----+---------+-------+
| Field  | Type                       | Null | Key | Default | Extra |
+--------+----------------------------+------+-----+---------+-------+
| gender | enum('男','女','保密')     | YES  |     | NULL    |       |
+--------+----------------------------+------+-----+---------+-------+

-- 插入规范数据
insert into my_enum (gender) values ('男');
insert into my_enum (gender) values ('女');

mysql> select * from my_enum;
+--------+
| gender |
+--------+
| 男     |
| 女     |
+--------+

```

枚举可以规范数据

枚举类型存储的不是真正的字符串，而是存储了下标

```sql
-- MySQL 会自动类型转换，+、-、\*、/ 会将数据转换成数值，普通字符串转换为数值 0
select gender + 0 from my_enum;

mysql> select gender + 0 from my_enum;
+------------+
| gender + 0 |
+------------+
|          1 |
|          2 |
+------------+

-- 可以直接插入数值数据
insert into my_enum (gender) values (1);

mysql> select * from my_enum;
+--------+
| gender |
+--------+
| 男     |
| 女     |
| 男     |
+--------+

```

枚举的意义

- 规范数据本身，限定只能插入规定的数据项
- 节省存储空间

