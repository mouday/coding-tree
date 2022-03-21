## 字符串类型

## char 和 varchar

1、char 定长字符

char(L) L 代表字符数（0-255）

2、varchar 变长字符

varchar(L) L 代表字符数（0-65535）

每个 varchar 数据，都会增加 1-2 个字节来保存数据所占用的空间长度

- 数据本身小于 127 个字符，额外开销 1 个字节
- 数据本身大于 127 个字符，额外开销 2 个字节

char 和 varchar 对比, utf8，一个字符都会占用 3 个字节

| 存储数据 | char(2) | varchar(2) | char 所占字节 | varchar 所占字节 |
| -------- | ------- | ---------- | ------------- | ---------------- |
| A        | A       | A          | `2 * 3 = 6`   | `1 * 3 + 1 = 4`  |
| AB       | AB      | AB         | `2 * 3 = 6`   | `2 * 3 + 1 = 7`  |

char 和 varchar 区别

- char 一定会使用指定的空间，varchar 根据数据来定空间
- char 的数据查询效率比 varchar 高，varchar 需要通过后面的记录数来计算

char 和 varchar 选择

- 如果确定数据的长度，使用 char
- 不确定数据的长度，使用 varchar
- 如果数据长度超过 255 个字符，一般使用 text

## text 文本类型

- text 存储普通的字符文本
- blob 存储二进制文件（图片，文件），一般不使用，通常使用一个连接来指向对应的文件

| 类型       | 字节数   | 实际存储数据量 |
| ---------- | -------- | -------------- |
| tinytext   | 1 个字节 | `2^8 + 1`      |
| text       | 2 个字节 | `2^16 + 2`     |
| mediumtext | 3 个字节 | `2^24 + 3`     |
| longtext   | 4 个字节 | `2^32 + 4`     |

注意：

1、不用刻意选择 text 类型，系统会自动根据存储的数据长度来选择合适的文本类型

2、如果数据超过 255 个字符，一定选择 text

## enum 枚举类型

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

https://www.bilibili.com/video/BV1Vx411g7uJ?p=22&spm_id_from=pageDriver
