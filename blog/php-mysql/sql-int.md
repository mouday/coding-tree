# 数据类型-整数

字段类型 |名称 | 字节数 | 表示范围
- | - | - | -  | 
tinyint  | 迷你整型  |  1个字节=8位 | 0-255
smallint |  小整型   |  2个字节  | 0-65535
mediumint |  中整型  |  3个字节 | 
int  | 整型（标准整型） | 4个字节 | 
bigint |  大整型 |  8个字节 | 

通常使用较多的是int和tinyint

示例

```sql
create table my_int(
    tiny_int tinyint,
    small_int smallint,
    medium_int mediumint,
    int_ int,
    big_int bigint
);

-- 插入正确的值
insert into my_int 
(tiny_int, small_int, medium_int, int_, big_int) 
values
(10, 10000, 100000, 10000000, 1000000);

mysql> select * from my_int;
+----------+-----------+------------+----------+---------+
| tiny_int | small_int | medium_int | int_     | big_int |
+----------+-----------+------------+----------+---------+
|       10 |     10000 |     100000 | 10000000 | 1000000 |
+----------+-----------+------------+----------+---------+

-- 插入一个超出范围的值
insert into my_int 
(tiny_int, small_int, medium_int, int_, big_int) 
values
(255, 255, 255, 255, 255);
ERROR 1264 (22003): Out of range value for column 'tiny_int' at row 1
-- 原因是tinyint实际取值范围：-128~127，包含了负数

insert into my_int 
(tiny_int, small_int, medium_int, int_, big_int) 
values
(-128, 255, 255, 255, 255);

select * from my_int;
+----------+-----------+------------+----------+---------+
| tiny_int | small_int | medium_int | int_     | big_int |
+----------+-----------+------------+----------+---------+
|       10 |     10000 |     100000 | 10000000 | 1000000 |
|     -128 |       255 |        255 |      255 |     255 |
+----------+-----------+------------+----------+---------+
```

## 无符号标识（unsigned）

只要正数(0-255)

```sql
alter table my_int add unsigned_tiny_int tinyint unsigned first;

-- 插入255
insert into my_int 
(unsigned_tiny_int, tiny_int, small_int, medium_int, int_, big_int) 
values
(255, 127, 255, 255, 255, 255);

mysql> select * from my_int;
+-------------------+----------+-----------+------------+----------+---------+
| unsigned_tiny_int | tiny_int | small_int | medium_int | int_     | big_int |
+-------------------+----------+-----------+------------+----------+---------+
|              NULL |       10 |     10000 |     100000 | 10000000 | 1000000 |
|              NULL |     -128 |       255 |        255 |      255 |     255 |
|               255 |      127 |       255 |        255 |      255 |     255 |
+-------------------+----------+-----------+------------+----------+---------+


mysql> desc my_int;
+-------------------+---------------------+------+-----+---------+-------+
| Field             | Type                | Null | Key | Default | Extra |
+-------------------+---------------------+------+-----+---------+-------+
| unsigned_tiny_int | tinyint(3) unsigned | YES  |     | NULL    |       |
| tiny_int          | tinyint(4)          | YES  |     | NULL    |       |
| small_int         | smallint(6)         | YES  |     | NULL    |       |
| medium_int        | mediumint(9)        | YES  |     | NULL    |       |
| int_              | int(11)             | YES  |     | NULL    |       |
| big_int           | bigint(20)          | YES  |     | NULL    |       |
+-------------------+---------------------+------+-----+---------+-------+
```

## 显示长度zerofill

整型数据在显示的时候，最多可以显示的位数

- tinyint(3) 表示最长显示3位，unsigned是正数，0-255不会超过3个长度
- tinyint(4) 表示最长可以显示4位 -128~127

显示长度，只是代表了数据是否可以达到指定的长度，但是不会自动满足到指定长度，如果想要数据显示的时候，保持最高位（显示长度），需要增加zerofill属性

zerofill：从左侧开始填充0到指定位数，自动设置为unsigned

示例

```sql
alter table my_int add zerofill_tiny_int tinyint zerofill first;

desc my_int;
+-------------------+------------------------------+------+-----+---------+-------+
| Field             | Type                         | Null | Key | Default | Extra |
+-------------------+------------------------------+------+-----+---------+-------+
| zerofill_tiny_int | tinyint(3) unsigned zerofill | YES  |     | NULL    |       |
| unsigned_tiny_int | tinyint(3) unsigned          | YES  |     | NULL    |       |
| tiny_int          | tinyint(4)                   | YES  |     | NULL    |       |
| small_int         | smallint(6)                  | YES  |     | NULL    |       |
| medium_int        | mediumint(9)                 | YES  |     | NULL    |       |
| int_              | int(11)                      | YES  |     | NULL    |       |
| big_int           | bigint(20)                   | YES  |     | NULL    |       |
+-------------------+------------------------------+------+-----+---------+-------+

-- 插入数据
insert into my_int 
(zerofill_tiny_int, unsigned_tiny_int, tiny_int, small_int, medium_int, int_, big_int) 
values
(1, 1, 1, 1, 1, 1, 1);

select * from my_int;
+-------------------+-------------------+----------+-----------+------------+----------+---------+
| zerofill_tiny_int | unsigned_tiny_int | tiny_int | small_int | medium_int | int_     | big_int |
+-------------------+-------------------+----------+-----------+------------+----------+---------+
|              NULL |              NULL |       10 |     10000 |     100000 | 10000000 | 1000000 |
|              NULL |              NULL |     -128 |       255 |        255 |      255 |     255 |
|              NULL |               255 |      127 |       255 |        255 |      255 |     255 |
|               001 |                 1 |        1 |         1 |          1 |        1 |       1 |
+-------------------+-------------------+----------+-----------+------------+----------+---------+
```


自定义显示长度，不会改变字段所能表示的数据长度，超出长度不受影响，长度不足会补0


示例

```sql
alter table my_int add zerofill_tiny_int_2 tinyint(2) zerofill first;


desc my_int;
+---------------------+------------------------------+------+-----+---------+-------+
| Field               | Type                         | Null | Key | Default | Extra |
+---------------------+------------------------------+------+-----+---------+-------+
| zerofill_tiny_int_2 | tinyint(2) unsigned zerofill | YES  |     | NULL    |       |
| zerofill_tiny_int   | tinyint(3) unsigned zerofill | YES  |     | NULL    |       |
| unsigned_tiny_int   | tinyint(3) unsigned          | YES  |     | NULL    |       |
| tiny_int            | tinyint(4)                   | YES  |     | NULL    |       |
| small_int           | smallint(6)                  | YES  |     | NULL    |       |
| medium_int          | mediumint(9)                 | YES  |     | NULL    |       |
| int_                | int(11)                      | YES  |     | NULL    |       |
| big_int             | bigint(20)                   | YES  |     | NULL    |       |
+---------------------+------------------------------+------+-----+---------+-------+


insert into my_int 
(zerofill_tiny_int_2, zerofill_tiny_int, unsigned_tiny_int, tiny_int, small_int, medium_int, int_, big_int) 
values
(100, 100, 100, 100, 100, 100, 100, 100),
(1, 1, 1, 1, 1, 1, 1, 1);

select * from my_int;
+---------------------+-------------------+-------------------+----------+-----------+------------+----------+---------+
| zerofill_tiny_int_2 | zerofill_tiny_int | unsigned_tiny_int | tiny_int | small_int | medium_int | int_     | big_int |
+---------------------+-------------------+-------------------+----------+-----------+------------+----------+---------+
|                NULL |              NULL |              NULL |       10 |     10000 |     100000 | 10000000 | 1000000 |
|                NULL |              NULL |              NULL |     -128 |       255 |        255 |      255 |     255 |
|                NULL |              NULL |               255 |      127 |       255 |        255 |      255 |     255 |
|                NULL |               001 |                 1 |        1 |         1 |          1 |        1 |       1 |
|                 100 |               100 |               100 |      100 |       100 |        100 |      100 |     100 |
|                  01 |               001 |                 1 |        1 |         1 |          1 |        1 |       1 |
+---------------------+-------------------+-------------------+----------+-----------+------------+----------+---------+

```