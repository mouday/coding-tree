# MySQL索引

1. 索引概述
2. 索引结构
3. 索引分类
4. 索引语法
5. SQL 性能分析
6. 索引使用
7. 索引失效的场景
8. 索引设计原则
9. 总结

## 1. 索引概述

索引（index）帮助 MySQL 高效获取数据的数据结构（有序）。

索引的优缺点

| 优点                                                          | 缺点                                                                 |
| ------------------------------------------------------------- | -------------------------------------------------------------------- |
| 提高数据检索的效率，降低数据库的 IO 成本                      | 索引列也要占用空间                                                   |
| 通过索引列对数据进行排序，降低数据排序的成本，降低 CPU 的消耗 | 索引大大提高查询效率，同时却降低更新表的速度（insert,update,delete） |

## 2. 索引结构

MySQL 的索引是在存储引擎层实现的，不同的存储引擎有不同的结构

主要包含以下几种

| 索引结构    | 描述                                                                         |
| ----------- | ---------------------------------------------------------------------------- |
| B+Tree 索引 | B+树索引是最常见的索引类型，大部分引擎都支持                                 |
| Hash 索引   | 底层数据结构是用哈希表实现的，只有精确匹配索引列的查询才有效，不支持范围查询 |
| R-tree      | 空间索引是 MyISAM 引擎的特殊索引类型，主要用于地理空间数据类型，通常很少使用 |
| Full-text   | 全文索引是一种通过倒排索引，快速匹配文档的方式，类似 Lucene,Solr,ES          |

各数据库对不同类型索引的支持情况

| 索引        | innoDB       | MyISAM | Memory |
| ----------- | ------------ | ------ | ------ |
| B+Tree 索引 | 支持         | 支持   | 支持   |
| Hash 索引   | 不支持       | 不支持 | 支持   |
| R-tree      | 不支持       | 支持   | 不支持 |
| Full-text   | 5.6 之后支持 | 支持   | 不支持 |

算法可视化演示：[https://www.cs.usfca.edu/~galles/visualization/Algorithms.html](https://www.cs.usfca.edu/~galles/visualization/Algorithms.html)

![](img/index.png)

### 2.1、二叉树

二叉树的缺点：

1. 顺序插入时，会行成一个链表，查询性能大大降低
2. 大数据量情况下，层级较深，检索速度慢

![](img/binary-tree.png)

### 2.2、红黑树

红黑树:

1. 大数据量的情况下，层级较深，检索数独慢

![](img/red-black-tree.png)

### 2.3、 B Tree

B Tree（多路平衡查找树）

以一颗最大度数（max-degree）为5（5阶）的B-Tree为例（每个节点最多存储4个Key,5个指针）

树的度数指的是一个节点的子节点个数

![](img/B-Tree.png)


### 2.4、 B+Tree

以一颗最大度数（max-degree）为 4（4 阶）的 B+Tree 为例

B Tree 和 B+Tree 的区别

1. 所有的数据都会出现在叶子节点
2. 叶子结点行成一个单向链表

![](img/B+Tree.png)

### 2.5、MySQL 索引

MySQL 索引数据结构对经典的 B+Tree 进行了优化，在原有 B+Tree 的基础之上，增加了一个指向相邻叶子节点的链表指针，就形成了带有顺序指针的 B+Tree，提高了区间访问的性能

![](img/mysql-b+tree.png)


### 2.6、Hash

哈希索引就是采用一定的hash算法，将键值换算成新的hash值，映射到对应的槽位上，然后存储在hash表中

如果两个或多个键值，映射到一个相同的槽位上，他们就产生了hash冲突（哈希碰撞），可以通过链表来解决

![](img/hash.png)

Hash索引的特点:

1. hash索引只能用于等值比较（=，in），不支持范围查询（between, >, <）
2. 无法利用索引完成排序操作
3. 查询效率高，通常只需要一次检索就可以，效率通常要高于B+Tree索引

支持Hash索引的存储引擎：Memory

InnoDB中具有自适应hash功能


### 2.7、思考

为什么InnoDB存储引擎选择使用B+Tree索引结构？

1. 相对于二叉树，层级更少，搜索效率高

2. 相对于B-Tree，无论是叶子节点还是非叶子节点，都会保存数据，这样导致一页中存储的键值减少，指针减少，要保存同样的数据量，只能增加树的高度，导致性能降低

3. 相对于Hash索引，B+Tree支持范围匹配及排序操作

## 3、索引分类

|分类 | 含义 | 特点 | 关键字|
|-|-|-|-|
|主键索引 | 针对于表中主键创建的索引|默认自动创建，只能有一个 | primary |
|唯一索引 | 避免同一个表中某列数据中的值重复 | 可以有多个 | unique |
|常规索引|快读定位特定数据 | 可以有多个| index |
|全文索引 |全文索引查找的是文本中的关键词，而不是比较索引中的值 | 可以有多个| fulltext |

根据索引存储形式，又可以分为

|分类 | 含义 | 特点|
|-|-|-|
| 聚集索引 clustered index | 将数据存储与索引放到了一块，索引结构的叶子节点保存了行数据 | 必须有，而且只有一个 |
| 二级索引 secondary index | 将数据与索引分开存储，索引结构的叶子节点关联的是对应的主键 | 可以存在多个 | 

聚集索引选取规则：

1. 如果存在主键，主键索引就是聚集索引
2. 如果不存在主键，将使用第一个唯一索引（unique）作为聚集索引
3. 如果表没有主键，或没有合适的唯一索引，则InnoDB会自动生成一个rowid作为隐藏的聚集索引

索引示例

![](img/cluster-index.png)

查询示例

![](img/index-return.png)





### 3.1、思考1

以下SQL语句，哪个执行效率高？为什么？

```sql
select * from user where id = 10;

select * from user where name = 'Arm';
```

备注：id为主键，name字段有索引

直接用id查询效率较高

1. id查询可以使用聚集索引

2. name查询需要使用回表查询，先查询二级索引，查询到id，再查询聚集索引

### 3.2、思考2

InnoDB主键索引的B+Tree高度为多高？

假设：

一页中可以存储16k数据，一行数据大小为1k，可以存储16行。InnoDB的指针占用6个字节，主键即使为bigint，占用字节数为8。

树的高度为2：

```js
// n为key的数量 (n+1)表示指针数量
n * 8 + ( n + 1) * 6 = 16 * 1024 // 算出n约等于1170

1171 * 16 = 18736
```

如果高度为3

```js
1171 * 1171 * 16 = 21939856
```

## 4、索引的语法

创建索引

```sql
create [unique|fulltext] index index_name on table_name (index_column_name,...);
```

查看索引

```sql
show index form table_name;
```


删除索引

```sql
drop index index_name on table_name;
```

### 4.1、案例

需求：

1. name姓名字段，该字段的值可能会重复，该字段创建索引
2. phone手机号字段，是非空，且唯一的，创建唯一索引
3. 为profession、age、status创建联合索引
4. 为email建立合适的索引来提升查询效率


准备测试数据

```sql
create table tb_user(
    id int primary key auto_increment comment '主键',
    name varchar(20) comment '姓名',
    phone varchar(11) comment '手机号',
    profession varchar(10) comment '专业',
    age int comment '年龄',
    status int comment '状态',
    email varchar(50) comment '邮箱'
);

-- 插入测试数据
insert into tb_user (name, phone, profession, age, status, email)
values ('张飞', '17712345678', '美术', 23, 1, '123@qq.com');
insert into tb_user (name, phone, profession, age, status, email)
values ('关羽', '17722345678', '物理', 24, 1, '3339@qq.com');
insert into tb_user (name, phone, profession, age, status, email)
values ('刘备', '17732345678', '数学', 25, 0, '666@qq.com');
insert into tb_user (name, phone, profession, age, status, email)
values ('孙权', '17742345678', '语文', 20, 1, '111@qq.com');

-- 查看数据
mysql> select * from tb_user;
+----+--------+-------------+------------+------+--------+-------------+
| id | name   | phone       | profession | age  | status | email       |
+----+--------+-------------+------------+------+--------+-------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com  |
|  2 | 关羽   | 17722345678 | 物理       |   24 |      1 | 3339@qq.com |
|  3 | 刘备   | 17732345678 | 数学       |   25 |      0 | 666@qq.com  |
|  4 | 孙权   | 17742345678 | 语文       |   20 |      1 | 111@qq.com  |
+----+--------+-------------+------------+------+--------+-------------+
4 rows in set (0.00 sec)

-- 查看已有索引
mysql> show index from tb_user;
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY  |            1 | id          | A         |           4 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
1 row in set (0.01 sec)

-- 或者
mysql> show index from tb_user\G
*************************** 1. row ***************************
        Table: tb_user
   Non_unique: 0
     Key_name: PRIMARY
 Seq_in_index: 1
  Column_name: id
    Collation: A
  Cardinality: 4
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
      Visible: YES
   Expression: NULL
1 row in set (0.00 sec)
```

完成需求

```sql
-- 创建普通索引
create index idx_user_name on tb_user (name);

-- 默认创建B+Tree的索引结构
show index from tb_user;
+---------+------------+---------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name      | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+---------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY       |            1 | id          | A         |           4 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name |            1 | name        | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+---------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
2 rows in set (0.00 sec)


-- 创建唯一索引
create unique index idx_user_phone on tb_user (phone);

mysql> show index from tb_user;
+---------+------------+----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY        |            1 | id          | A         |           4 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone |            1 | phone       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name  |            1 | name        | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
3 rows in set (0.01 sec)


-- 创建联合索引
create index idx_user_profession_age_status on tb_user (profession, age, status);

mysql> show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |           4 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
6 rows in set (0.00 sec)


-- 创建普通索引
create index idx_user_email on tb_user (email);

mysql> show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |           4 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_email                 |            1 | email       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
7 rows in set (0.00 sec)
```


## 5、SQL性能分析

### 5.1、SQL执行频次

```sql
-- 查看服务器状态信息
show [session|global] status

-- 查看当前数据库的CURD（insert、update、delete、select）访问频次
-- 7个下划线
show global status like 'Com_______';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Com_binlog    | 0     |
| Com_commit    | 62    |
| Com_delete    | 4     |
| Com_import    | 0     |
| Com_insert    | 32    |
| Com_repair    | 0     |
| Com_revoke    | 0     |
| Com_select    | 1967  |
| Com_signal    | 0     |
| Com_update    | 52    |
| Com_xa_end    | 0     |
+---------------+-------+
11 rows in set (0.01 sec)
```

重点关注以下4个指标：

- Com_delete
- Com_insert
- Com_select
- Com_update

### 5.2、慢查询日志

慢查询日志记录了所有执行时间超过指定参数(long_query_time，单位：秒，默认10秒)的所有SQL语句的日志

MySQL的慢查询日志默认没有开启

```sql
show variables like 'slow_query_log';
+----------------+-------+
| Variable_name  | Value |
+----------------+-------+
| slow_query_log | OFF   |
+----------------+-------+
1 row in set (0.01 sec)
```

查找`my.cnf`文件路径

```bash
$ mysql --help|grep 'my.cnf'
```

开启MySQL的慢查询日志，需要在MySQL的配置文件(/etc/my.cnf)中配置如下信息


```bash
# vim /etc/my.cnf
# 开启慢查询日志开关
slow_query_log=1

# 设置慢查询时间为2秒，SQL语句执行时间超过2秒，就会视为慢查询，记录慢查询日志
long_query_time=2
```

修改参数后，重启MySQL服务

```bash
systemctl restart mysqld
```

mac环境下：

配置文件路径：`/usr/local/etc/my.cnf`

重启服务
```bash
mysql.server restart
```


```sql
show variables like 'slow_query_log';
+----------------+-------+
| Variable_name  | Value |
+----------------+-------+
| slow_query_log | ON    |
+----------------+-------+
1 row in set (0.01 sec)
```

查看慢查询日志信息
```sql
mysql> show variables like 'slow_query_log_file';
+---------------------+-------------------------------------------------+
| Variable_name       | Value                                           |
+---------------------+-------------------------------------------------+
| slow_query_log_file | /usr/local/var/mysql/localhost-slow.log |
+---------------------+-------------------------------------------------+
1 row in set (0.00 sec)
```

查看慢日志

```bash
tail -f /usr/local/var/mysql/localhost-slow.log

# Time: 2022-05-06T14:41:31.330012Z
# User@Host: root[root] @ localhost []  Id:     8
# Query_time: 0.000408  Lock_time: 0.000184 Rows_sent: 5  Rows_examined: 5
SET timestamp=1651848091;
select * from tb_student;
```

如果看不到效果，可以设置一个较小的慢查询时间
```bash
long_query_time=0.0001
```

### 5.3、profile详情

了解时间都耗费在哪里

通过`have_profiling`参数，可以查看当前MySQL是否支持profile操作

```sql
mysql> select @@have_profiling;
+------------------+
| @@have_profiling |
+------------------+
| YES              |
+------------------+
1 row in set, 1 warning (0.00 sec)
```

默认profiling是关闭的， 通过set语句在session/global级别开启profiling

```sql
select @@profiling;
+-------------+
| @@profiling |
+-------------+
|           0 |
+-------------+
1 row in set, 1 warning (0.00 sec)

-- 开启profiling
set profiling = 1;
```

查看执行耗时

```sql
-- 查看每一条SQL的耗时基本操作
show profiles;

-- 查看指定query_id的SQL语句各个阶段的耗时情况
show profile for query <query_id>;

-- 查看指定query_id 的SQL语句CPU的使用情况
show profile cpu for query <query_id>;
```

示例

```sql
mysql> show profiles;
+----------+------------+--------------------------+
| Query_ID | Duration   | Query                    |
+----------+------------+--------------------------+
|        1 | 0.00282500 | select * from tb_student |
+----------+------------+--------------------------+
1 row in set, 1 warning (0.00 sec)

mysql> show profile for query 1;
+--------------------------------+----------+
| Status                         | Duration |
+--------------------------------+----------+
| starting                       | 0.000109 |
| Executing hook on transaction  | 0.000028 |
| starting                       | 0.000016 |
| checking permissions           | 0.000012 |
| Opening tables                 | 0.000069 |
| init                           | 0.000036 |
| System lock                    | 0.000027 |
| optimizing                     | 0.000012 |
| statistics                     | 0.000048 |
| preparing                      | 0.000021 |
| executing                      | 0.000006 |
| Sending data                   | 0.000060 |
| end                            | 0.000012 |
| query end                      | 0.000008 |
| waiting for handler commit     | 0.000015 |
| closing tables                 | 0.000017 |
| freeing items                  | 0.000031 |
| logging slow query             | 0.002269 |
| cleaning up                    | 0.000029 |
+--------------------------------+----------+
19 rows in set, 1 warning (0.01 sec)

mysql> show profile cpu for query 1;
+--------------------------------+----------+----------+------------+
| Status                         | Duration | CPU_user | CPU_system |
+--------------------------------+----------+----------+------------+
| starting                       | 0.000109 | 0.000071 |   0.000012 |
| Executing hook on transaction  | 0.000028 | 0.000012 |   0.000010 |
| starting                       | 0.000016 | 0.000012 |   0.000004 |
| checking permissions           | 0.000012 | 0.000009 |   0.000003 |
| Opening tables                 | 0.000069 | 0.000052 |   0.000016 |
| init                           | 0.000036 | 0.000019 |   0.000011 |
| System lock                    | 0.000027 | 0.000020 |   0.000007 |
| optimizing                     | 0.000012 | 0.000009 |   0.000004 |
| statistics                     | 0.000048 | 0.000022 |   0.000024 |
| preparing                      | 0.000021 | 0.000019 |   0.000003 |
| executing                      | 0.000006 | 0.000004 |   0.000002 |
| Sending data                   | 0.000060 | 0.000058 |   0.000002 |
| end                            | 0.000012 | 0.000007 |   0.000004 |
| query end                      | 0.000008 | 0.000006 |   0.000003 |
| waiting for handler commit     | 0.000015 | 0.000012 |   0.000003 |
| closing tables                 | 0.000017 | 0.000015 |   0.000002 |
| freeing items                  | 0.000031 | 0.000015 |   0.000017 |
| logging slow query             | 0.002269 | 0.000042 |   0.001699 |
| cleaning up                    | 0.000029 | 0.000014 |   0.000015 |
+--------------------------------+----------+----------+------------+
19 rows in set, 1 warning (0.00 sec)
```

### 5.4、explain 执行计划

获取MySQL如何执行select语句信息，包括在select语句执行过程中表如何连接和连接的顺序

```sql
explain/desc select 字段列表 from 表名 where 条件;

-- eg
explain select * from tb_user where id = 1;
+----+-------------+---------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

字段含义

id:  select 查询的序列号，表示查询中执行select子句或者是操作表的顺序
- id相同，执行顺序从上到下；
- id不同，值越大，越先执行。

select_type 表示SElect 类型，常见取值
- simple 简单表，即不使用表连接或者子查询
- primary 主查询，即外层的查询
- union union中的第二个或者后面的查询语句
- subquery select/where之后包含了子查询等

type 表示连接类型

- 性能由好到差：null, system,const(主键、唯一索引),eq_ref,ref(非唯一索引),range,index,all

possible_key 可能用到的索引，一个或多个

key 实际使用的索引，如果为null，则没有使用索引

key_len 表示索引中使用的字节数，该值为索引字段最大可能长度，并非实际使用长度，在不损失精确性的前提下，长度越短越好

rows MySQL认为必须要执行查询的行数，在innoDB引擎的表中，是一个估计值，可能并不总是准确的


filtered 表示返回结果的行数，占需读取行数的百分比，值越大越好

extra 额外信息


初始化测试数据

```sql
-- 学生表和课程表行成多对多的关系

create table tb_student(
    id int primary key auto_increment,
    name varchar(20)
) comment '学生表';

create table tb_course(
    id int primary key auto_increment,
    name varchar(20)
) comment '课程表';

create table tb_student_course(
    id int primary key auto_increment,
    student_id int,
    course_id int
) comment '学生课程关联表';


insert into tb_student (name) values ('张飞'), ('关羽'), ('刘备'), ('曹操'), ('孙权');
insert into tb_course (name) values ('语文'), ('数学'), ('英语'), ('历史'), ('化学');
insert into tb_student_course (student_id, course_id) values (1, 1), (1, 2), (2, 1), (2, 4), (3, 4), (4, 2);

mysql> select * from tb_student;
+----+--------+
| id | name   |
+----+--------+
|  1 | 张飞   |
|  2 | 关羽   |
|  3 | 刘备   |
|  4 | 曹操   |
|  5 | 孙权   |
+----+--------+
5 rows in set (0.01 sec)


mysql> select * from tb_course;
+----+--------+
| id | name   |
+----+--------+
|  1 | 语文   |
|  2 | 数学   |
|  3 | 英语   |
|  4 | 历史   |
|  5 | 化学   |
+----+--------+
5 rows in set (0.00 sec)

mysql> select * from tb_student_course;
+----+------------+-----------+
| id | student_id | course_id |
+----+------------+-----------+
|  1 |          1 |         1 |
|  2 |          1 |         2 |
|  3 |          2 |         1 |
|  4 |          2 |         4 |
|  5 |          3 |         4 |
|  6 |          4 |         2 |
+----+------------+-----------+
6 rows in set (0.00 sec)

```

查看执行计划

```sql
select s.*, c.* from tb_student s, tb_course c, tb_student_course sc
where s.id = sc.student_id and c.id = sc.course_id;
+----+--------+----+--------+
| id | name   | id | name   |
+----+--------+----+--------+
|  1 | 张飞   |  1 | 语文   |
|  1 | 张飞   |  2 | 数学   |
|  2 | 关羽   |  1 | 语文   |
|  2 | 关羽   |  4 | 历史   |
|  3 | 刘备   |  4 | 历史   |
|  4 | 曹操   |  2 | 数学   |
+----+--------+----+--------+
6 rows in set (0.00 sec)

-- 查看执行计划
mysql> explain select s.*, c.* from tb_student s, tb_course c, tb_student_course sc
    -> where s.id = sc.student_id and c.id = sc.course_id;
+----+-------------+-------+------------+--------+---------------+---------+---------+-------------------+------+----------+----------------------------------------------------+
| id | select_type | table | partitions | type   | possible_keys | key     | key_len | ref               | rows | filtered | Extra                                              |
+----+-------------+-------+------------+--------+---------------+---------+---------+-------------------+------+----------+----------------------------------------------------+
|  1 | SIMPLE      | s     | NULL       | ALL    | PRIMARY       | NULL    | NULL    | NULL              |    5 |   100.00 | NULL                                               |
|  1 | SIMPLE      | sc    | NULL       | ALL    | NULL          | NULL    | NULL    | NULL              |    6 |    16.67 | Using where; Using join buffer (Block Nested Loop) |
|  1 | SIMPLE      | c     | NULL       | eq_ref | PRIMARY       | PRIMARY | 4       | data.sc.course_id |    1 |   100.00 | NULL                                               |
+----+-------------+-------+------------+--------+---------------+---------+---------+-------------------+------+----------+----------------------------------------------------+
3 rows in set, 1 warning (0.00 sec)

```

查询选修了`语文`课程的学生，通过子查询实现

```sql
select id from tb_course where name = '语文';
+----+
| id |
+----+
|  1 |
+----+
1 row in set (0.00 sec)

select student_id from tb_student_course where course_id = 1;
+------------+
| student_id |
+------------+
|          1 |
|          2 |
+------------+
2 rows in set (0.00 sec)

select * from tb_student where id in (1, 2);
+----+--------+
| id | name   |
+----+--------+
|  1 | 张飞   |
|  2 | 关羽   |
+----+--------+
2 rows in set (0.00 sec)

-- 组合成子查询语句
select * from tb_student where id in (
    select student_id from tb_student_course where course_id = (
        select id from tb_course where name = '语文'
    )
);
+----+--------+
| id | name   |
+----+--------+
|  1 | 张飞   |
|  2 | 关羽   |
+----+--------+
2 rows in set (0.00 sec)

-- 查看执行计划
explain select * from tb_student where id in (
    select student_id from tb_student_course where course_id = (
        select id from tb_course where name = '语文'
    )
);

+----+-------------+-------------------+------------+------+---------------+------+---------+------+------+----------+----------------------------------------------------------------------------+
| id | select_type | table             | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra                                                                      |
+----+-------------+-------------------+------------+------+---------------+------+---------+------+------+----------+----------------------------------------------------------------------------+
|  1 | PRIMARY     | tb_student        | NULL       | ALL  | PRIMARY       | NULL | NULL    | NULL |    5 |   100.00 | NULL                                                                       |
|  1 | PRIMARY     | tb_student_course | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    6 |    16.67 | Using where; FirstMatch(tb_student); Using join buffer (Block Nested Loop) |
|  3 | SUBQUERY    | tb_course         | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    5 |    20.00 | Using where                                                                |
+----+-------------+-------------------+------------+------+---------------+------+---------+------+------+----------+----------------------------------------------------------------------------+
3 rows in set, 1 warning (0.00 sec)
```

更多示例

```sql
mysql> select 'A';
+---+
| A |
+---+
| A |
+---+
1 row in set (0.00 sec)

mysql> explain select 'A';
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra          |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
|  1 | SIMPLE      | NULL  | NULL       | NULL | NULL          | NULL | NULL    | NULL | NULL |     NULL | No tables used |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
1 row in set, 1 warning (0.01 sec)
```


```sql
mysql> select * from tb_user;
+----+--------+-------------+------------+------+--------+-------------+
| id | name   | phone       | profession | age  | status | email       |
+----+--------+-------------+------------+------+--------+-------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com  |
|  2 | 关羽   | 17722345678 | 物理       |   24 |      1 | 3339@qq.com |
|  3 | 刘备   | 17732345678 | 数学       |   25 |      0 | 666@qq.com  |
|  4 | 孙权   | 17742345678 | 语文       |   20 |      1 | 111@qq.com  |
+----+--------+-------------+------------+------+--------+-------------+
4 rows in set (0.00 sec)

mysql> show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |           4 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_email                 |            1 | email       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
7 rows in set (0.05 sec)


mysql> explain select * from tb_user where phone = '17712345678';
+----+-------------+---------+------------+-------+----------------+----------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type  | possible_keys  | key            | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+-------+----------------+----------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | const | idx_user_phone | idx_user_phone | 47      | const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+-------+----------------+----------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.01 sec)

mysql> explain select * from tb_user where name = '张飞';
+----+-------------+---------+------------+------+---------------+---------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys | key           | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+------+---------------+---------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_name | idx_user_name | 83      | const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+------+---------------+---------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.01 sec)

mysql> explain select count(*) from tb_user;
+----+-------------+---------+------------+-------+---------------+----------------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type  | possible_keys | key            | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+-------+---------------+----------------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | index | NULL          | idx_user_phone | 47      | NULL |    4 |   100.00 | Using index |
+----+-------------+---------+------------+-------+---------------+----------------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

索引使用


创建测试表

```sql
create table tb_sku(
    id int primary key auto_increment,
    uuid char(36)
);
```

## 6、索引使用

### 6.1、验证索引效率

生成测试数据（1000万条记录）

方式一：使用MySQL的自定义函数

速度较慢，适合较少的数据

```sql
-- 1、定义个生成测试数据的函数
-- 修改语句结束符
delimiter $$

-- 创建函数
create function init_data(total int) returns int
begin
    -- 声明局部变量
    declare i int default 0;

    -- 循环处理
    while i < total do
        -- 生成测试数据
        insert into tb_sku (`uuid`) values (uuid());
        set i = i + 1;
    end while;

    -- 返回值
    return i;
end

-- 结束
$$

-- 修改语句结束符
delimiter ;


-- 2、调用函数生成数据(100W)
mysql> select init_data(1000000);
+--------------------+
| init_data(1000000) |
+--------------------+
|            1000000 |
+--------------------+
1 row in set (1 min 16.08 sec)

-- 3、删除函数
drop function init_data;
```

方式二：

使用Python脚本生成，适合生成大量数据

```python
# pip install records mysqlclient
import records
import uuid

db = records.Database('mysql://root:123456@localhost/data?charset=utf8')

# 100 * 100000 = 1000万条数据
for i in range(100):
    data = [{'uuid': str(uuid.uuid4())} for i in range(100000)]
    db.bulk_query("insert into tb_sku(uuid) values(:uuid)", data)

```

```sql
mysql> select count(*) from tb_sku;
+----------+
| count(*) |
+----------+
| 10000000 |
+----------+
1 row in set (0.38 sec)


mysql> select * from tb_sku limit 1;
+----+--------------------------------------+
| id | uuid                                 |
+----+--------------------------------------+
|  1 | 166fa508-2911-494d-aed2-2a2ee81a2a64 |
+----+--------------------------------------+
1 row in set (0.00 sec)
```


验证索引效率
```sql
-- 为建立索引之前，执行如下SQL，查看SQL的耗时
mysql> select * from tb_sku where uuid = '166fa508-2911-494d-aed2-2a2ee81a2a64';
+----+--------------------------------------+
| id | uuid                                 |
+----+--------------------------------------+
|  1 | 166fa508-2911-494d-aed2-2a2ee81a2a64 |
+----+--------------------------------------+
1 row in set (2.15 sec)

-- 创建索引
mysql> create index idx_sku_uuid on tb_sku (uuid);
Query OK, 0 rows affected (21.85 sec)
Records: 0  Duplicates: 0  Warnings: 0

-- 再次执行相同的SQL语句，查看SQL耗时
mysql> select * from tb_sku where uuid = '166fa508-2911-494d-aed2-2a2ee81a2a64';
+----+--------------------------------------+
| id | uuid                                 |
+----+--------------------------------------+
|  1 | 166fa508-2911-494d-aed2-2a2ee81a2a64 |
+----+--------------------------------------+
1 row in set (0.01 sec)

-- 通过主键查询
mysql> select * from tb_sku where id = 1;
+----+--------------------------------------+
| id | uuid                                 |
+----+--------------------------------------+
|  1 | 166fa508-2911-494d-aed2-2a2ee81a2a64 |
+----+--------------------------------------+
1 row in set (0.00 sec)

-- 查看执行计划
mysql> explain select * from tb_sku where uuid = '166fa508-2911-494d-aed2-2a2ee81a2a64';
+----+-------------+--------+------------+------+---------------+--------------+---------+-------+------+----------+-------------+
| id | select_type | table  | partitions | type | possible_keys | key          | key_len | ref   | rows | filtered | Extra       |
+----+-------------+--------+------------+------+---------------+--------------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | tb_sku | NULL       | ref  | idx_sku_uuid  | idx_sku_uuid | 145     | const |    1 |   100.00 | Using index |
+----+-------------+--------+------------+------+---------------+--------------+---------+-------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```


### 6.2、最左前缀法则

如果索引了多列（联合索引），要遵守最左前缀法则。

最左前缀法则指的是查询从索引的最左侧列开始，并且不跳过索引中的列。

如果跳过某一列，索引将部分失效（后面的字段索引失效）

```sql
-- 查看表数据
select * from tb_user;
+----+--------+-------------+------------+------+--------+-------------+
| id | name   | phone       | profession | age  | status | email       |
+----+--------+-------------+------------+------+--------+-------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com  |
|  2 | 关羽   | 17722345678 | 物理       |   24 |      1 | 3339@qq.com |
|  3 | 刘备   | 17732345678 | 数学       |   25 |      0 | 666@qq.com  |
|  4 | 孙权   | 17742345678 | 语文       |   20 |      1 | 111@qq.com  |
+----+--------+-------------+------------+------+--------+-------------+
4 rows in set (0.01 sec)

-- 查看表中的索引
show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |           4 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_email                 |            1 | email       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
7 rows in set (0.06 sec)

-- 查询数据
select * from tb_user where profession = '美术' and age = 23 and status = 1;
+----+--------+-------------+------------+------+--------+------------+
| id | name   | phone       | profession | age  | status | email      |
+----+--------+-------------+------------+------+--------+------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com |
+----+--------+-------------+------------+------+--------+------------+
1 row in set (0.00 sec)

-- 查看用到的索引:profession、age、status
explain select * from tb_user where profession = '美术' and age = 23 and status = 1;
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref               | rows | filtered | Extra |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 53      | const,const,const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

-- 查询profession和age，使用到了索引
explain select * from tb_user where profession = '美术' and age = 23;
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref         | rows | filtered | Extra |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 48      | const,const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

-- 单独查询profession，使用到了索引
explain select * from tb_user where profession = '美术';
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 43      | const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.01 sec)

-- 查询age和status，没有使用到索引
explain select * from tb_user where  age = 23 and status = 1;
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    4 |    25.00 | Using where |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)

-- 单独查询status，没有使用到索引
explain select * from tb_user where status = 1;
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    4 |    25.00 | Using where |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

-- 跳过中间的age字段，只用到了profession，而status没有用到索引
explain select * from tb_user where profession = '美术' and status = 1;
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-----------------------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref   | rows | filtered | Extra                 |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-----------------------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 43      | const |    1 |    25.00 | Using index condition |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)

-- 索引字段可以交换顺序，也能使用到索引
explain select * from tb_user where age = 23 and status = 1 and profession = '美术';
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref               | rows | filtered | Extra |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 53      | const,const,const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

### 6.3、SQL提示

SQL提示是优化数据库的一个重要手段

简单来说，就是在SQL语句中加入一些认为的提示来达到优化操作的目的

```sql
-- 1、use index 推荐使用索引

explain select * from tb_user use index (idx_user_profession) where profession = '法务经理';

-- 2、ignore index  忽略使用索引

explain select * from tb_user ignore index (idx_user_profession) where profession = '法务经理';

-- 3、force index 强制使用索引

explain select * from tb_user force index (idx_user_profession) where profession = '法务经理';
```

测试数据准备
```sql
drop table if exists tb_user;

create table tb_user(
    id int primary key auto_increment comment '主键',
    name varchar(20) comment '姓名',
    phone varchar(11) comment '手机号',
    profession varchar(50) comment '专业',
    age int comment '年龄',
    status int comment '状态',
    email varchar(50) comment '邮箱'
);
```

利用Python脚本生成10万条测试数据

```python
# 安装依赖 pip install faker records mysqlclient
from faker import Faker
import records

# 简体中文：zh_CN
faker = Faker(locale="zh_CN")
# 指定随机种子，确保每次生成的数据都是一致的
faker.seed(1)

# 生成数据插入 insert sql
def get_insert_sql(table_name, fields):
    keys = ', '.join([f'`{key}`'.format(key) for key in fields])
    values = ', '.join([f':{key}'.format(key) for key in fields])
    return f'INSERT INTO `{table_name}` ({keys}) VALUES ({values})'

# 获取数据
def get_row():
    return {
        'name': faker.name(),
        'phone': faker.phone_number(),
        'email': faker.email(),
        'age': faker.random_int(20, 30),
        'status': faker.random_int(0, 1),
        'profession': faker.job(),
    }


def main():
    db = records.Database('mysql://root:123456@localhost/data?charset=utf8')

    # 10 * 1000 = 1万条数据
    for i in range(10):
        data = [get_row() for _ in range(1000)]
        sql = get_insert_sql('tb_user', data[0].keys())
        db.bulk_query(sql, data)

if __name__ == '__main__':
    main()
```

查看生成的测试数据

```sql
mysql> select count(*) from tb_user;
+----------+
| count(*) |
+----------+
|    10000 |
+----------+

select * from tb_user limit 10;
+----+-----------+-------------+---------------------------------+------+--------+---------------------+
| id | name      | phone       | profession                      | age  | status | email               |
+----+-----------+-------------+---------------------------------+------+--------+---------------------+
|  1 | 费阳      | 13777763170 | 法务经理                        |   27 |      1 | wyao@gmail.com      |
|  2 | 祁海燕    | 13400806360 | 日式厨师                        |   23 |      0 | jwan@jin.cn         |
|  3 | 姬秀英    | 18281241586 | 食品/饮料研发                   |   29 |      0 | li97@wang.cn        |
|  4 | 官桂芳    | 15625851781 | 前台接待/总机/接待生            |   20 |      1 | fpeng@chang.cn      |
|  5 | 应秀珍    | 13030388368 | 酒店前台                        |   20 |      1 | qiang48@hotmail.com |
|  6 | 亢婷      | 18207598386 | 药品市场推广主管/专员           |   28 |      1 | ping50@hotmail.com  |
|  7 | 仰俊      | 13192184011 | 机场代表                        |   24 |      0 | wcai@liang.net      |
|  8 | 匡洁      | 13622482447 | 汽车电工                        |   24 |      1 | htang@gmail.com     |
|  9 | 程建华    | 13748396030 | 市场通路经理/主管               |   28 |      1 | fangguo@yahoo.com   |
| 10 | 岳荣      | 15080695604 | 培训督导                        |   24 |      1 | fanglong@ding.com   |
+----+-----------+-------------+---------------------------------+------+--------+---------------------+
10 rows in set (0.00 sec)
```

创建索引

```sql
-- 创建普通索引
create index idx_user_name on tb_user (name);

-- 创建唯一索引
create unique index idx_user_phone on tb_user (phone);

-- 创建联合索引
create index idx_user_profession_age_status on tb_user (profession, age, status);

-- 创建普通索引
create index idx_user_email on tb_user (email);

-- 创建索引
create index idx_user_age on tb_user ( age );

-- 查看索引
show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |        9804 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |        9804 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |        9130 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |         948 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |        6232 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |        7596 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_email                 |            1 | email       | A         |        9569 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_age                   |            1 | age         | A         |          11 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
8 rows in set (0.03 sec)

```

查看执行计划

```sql
mysql> explain select * from tb_user where profession = '法务经理';
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 203     | const |   12 |   100.00 | NULL  |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

-- 创建一个单列索引
create index idx_user_profession on tb_user (profession);

-- 性能分析
explain select * from tb_user where profession = '法务经理';
+----+-------------+---------+------------+------+----------------------------------------------------+--------------------------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys                                      | key                            | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+------+----------------------------------------------------+--------------------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status,idx_user_profession | idx_user_profession_age_status | 203     | const |   12 |   100.00 | NULL  |
+----+-------------+---------+------------+------+----------------------------------------------------+--------------------------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)


-- 查看执行计划（use index）使用单列索引idx_user_profession
explain select * from tb_user use index (idx_user_profession) where profession = '法务经理';
+----+-------------+---------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys       | key                 | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession | idx_user_profession | 203     | const |   12 |   100.00 | NULL  |
+----+-------------+---------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.01 sec)

-- 查看执行计划（ignore index）,忽略单列索引idx_user_profession
explain select * from tb_user ignore index (idx_user_profession) where profession = '法务经理';
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 203     | const |   12 |   100.00 | NULL  |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.01 sec)

-- 查看执行计划（force index）强制使用单列索引idx_user_profession
explain select * from tb_user force index (idx_user_profession) where profession = '法务经理';
+----+-------------+---------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys       | key                 | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession | idx_user_profession | 203     | const |   12 |   100.00 | NULL  |
+----+-------------+---------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```



### 6.4、覆盖索引

查询使用了索引，并且需要返回的列，在该索引中已经全部能够找到

尽量使用覆盖索引，减少`select * `

extra额外信息：

- using index condition ： 查找使用了索引，但是需要回表查询数据（二级索引->聚集索引）
- using where; using index: 查找使用了索引，但是需要的数据都在索引列中能找到，所以不需要回表查询数据

![](img/cover-index.png)

示例

```sql
explain select id, profession from tb_user where profession = '法务经理' and age = 27 and status = 1;

explain select id, profession, age, status from tb_user where profession = '法务经理' and age = 27 and status = 1;

explain select id, profession, age, status, name from tb_user where profession = '法务经理' and age = 27 and status = 1;

explain select * from tb_user where profession = '法务经理' and age = 27 and status = 1;
```

测试

```sql
-- 查看索引
show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |        9804 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |        9804 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |        9130 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |         948 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |        6232 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |        7596 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_email                 |            1 | email       | A         |        9569 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_age                   |            1 | age         | A         |          11 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession            |            1 | profession  | A         |         948 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
9 rows in set (0.06 sec)

-- 删除多余的索引
drop index idx_user_age on tb_user;
drop index idx_user_profession on tb_user;
drop index idx_user_email on tb_user;


show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |        9804 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |        9804 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |        9130 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |         948 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |        6232 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |        7596 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
6 rows in set (0.00 sec)

-- 查看数据
select * from tb_user limit 10;
+----+-----------+-------------+---------------------------------+------+--------+---------------------+
| id | name      | phone       | profession                      | age  | status | email               |
+----+-----------+-------------+---------------------------------+------+--------+---------------------+
|  1 | 费阳      | 13777763170 | 法务经理                        |   27 |      1 | wyao@gmail.com      |
|  2 | 祁海燕    | 13400806360 | 日式厨师                        |   23 |      0 | jwan@jin.cn         |
|  3 | 姬秀英    | 18281241586 | 食品/饮料研发                   |   29 |      0 | li97@wang.cn        |
|  4 | 官桂芳    | 15625851781 | 前台接待/总机/接待生            |   20 |      1 | fpeng@chang.cn      |
|  5 | 应秀珍    | 13030388368 | 酒店前台                        |   20 |      1 | qiang48@hotmail.com |
|  6 | 亢婷      | 18207598386 | 药品市场推广主管/专员           |   28 |      1 | ping50@hotmail.com  |
|  7 | 仰俊      | 13192184011 | 机场代表                        |   24 |      0 | wcai@liang.net      |
|  8 | 匡洁      | 13622482447 | 汽车电工                        |   24 |      1 | htang@gmail.com     |
|  9 | 程建华    | 13748396030 | 市场通路经理/主管               |   28 |      1 | fangguo@yahoo.com   |
| 10 | 岳荣      | 15080695604 | 培训督导                        |   24 |      1 | fanglong@ding.com   |
+----+-----------+-------------+---------------------------------+------+--------+---------------------+
10 rows in set (0.00 sec)

-- 查询数据
select * from tb_user where profession = '法务经理' and age = 27 and status = 1;
+----+--------+-------------+--------------+------+--------+----------------+
| id | name   | phone       | profession   | age  | status | email          |
+----+--------+-------------+--------------+------+--------+----------------+
|  1 | 费阳   | 13777763170 | 法务经理     |   27 |      1 | wyao@gmail.com |
+----+--------+-------------+--------------+------+--------+----------------+
1 row in set (0.01 sec)

explain select * from tb_user where profession = '法务经理' and age = 27 and status = 1;
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref               | rows | filtered | Extra |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 213     | const,const,const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

-- 使用了索引字段 Using index
explain select id, profession from tb_user where profession = '法务经理' and age = 27 and status = 1;
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref               | rows | filtered | Extra       |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 213     | const,const,const |    1 |   100.00 | Using index |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

-- 使用了索引字段 Using index
explain select id, profession, age, status from tb_user where profession = '法务经理' and age = 27 and status = 1;
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref               | rows | filtered | Extra       |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 213     | const,const,const |    1 |   100.00 | Using index |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

explain select id, profession, age, status, name from tb_user where profession = '法务经理' and age = 27 and status = 1;
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref               | rows | filtered | Extra |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 213     | const,const,const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

```

### 6.5、思考

问题：

一张表，有四个字段: 

```
id, username, password, status
```

由于数据量较大，需要对以下SQL语句进行优化，该如何进行才是最优方案

```sql
select id, username, password from tb_user where username = 'Tom';
```

解答：

需要对`username, password`创建联合索引

联合索引的叶子节点存储了`id`字段，可以`避免回表查询`，从而提高查询效率

```sql
create index idx_user_username_password on tb_user (username, password);
```

### 6.6、前缀索引

当字段类型为字符串（varchar, text等）时，有时候需要索引很长的字符串，

这会让索引变得很大，查询时，浪费大量的磁盘IO，影响查询效率。

此时可以只将字符串的一部分前缀，建立索引，这样可以打打节约空间，从而提高索引效率。

1、语法

```sql
create index index_name on table_name (column(n));
```

2、前缀长度

可以根据索引的选择性来决定，而选择性是指不重复的索引值（基数）和数据表的记录总数的比值

索引选择性越高则查询效率越高

唯一索引的选择性是1，这是最好的索引选择性，性能也是最好的

```sql
-- 求取数据总条数
select count(*) from tb_user;
+----------+
| count(*) |
+----------+
|    10000 |
+----------+
1 row in set (0.07 sec)

-- 求取email不为空的数据条数
select count(email) from tb_user;
+--------------+
| count(email) |
+--------------+
|        10000 |
+--------------+
1 row in set (0.03 sec)

-- 求取email不重复的数据条数
select count(distinct email) from tb_user;
+-----------------------+
| count(distinct email) |
+-----------------------+
|                  9569 |
+-----------------------+
1 row in set (0.02 sec)

-- 计算选择性
select count(distinct email) / count(*) from tb_user;
+----------------------------------+
| count(distinct email) / count(*) |
+----------------------------------+
|                           0.9569 |
+----------------------------------+
1 row in set (0.01 sec)

-- 截取前缀计算选择性
select count(distinct substring(email, 1, 9)) / count(*) from tb_user;
+---------------------------------------------------+
| count(distinct substring(email, 1, 9)) / count(*) |
+---------------------------------------------------+
|                                            0.8633 |
+---------------------------------------------------+
1 row in set (0.02 sec)
```

建立前缀索引

```sql
-- 查看当前表中存在的索引
show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |        9804 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |        9804 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |        9130 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |         948 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |        6232 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |        7596 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
6 rows in set (0.05 sec)


-- 创建前缀索引
create index idx_email_5 on tb_user(email(5));

-- 再次查看索引（注意字段：Sub_part）
show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |        9804 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |        9804 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |        9130 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |         948 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |        6232 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |        7596 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_email_5                    |            1 | email       | A         |        3955 |        5 |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
7 rows in set (0.01 sec)
```

使用索引

```sql
-- 查询数据
select * from tb_user where email = 'wyao@gmail.com';
+----+--------+-------------+--------------+------+--------+----------------+
| id | name   | phone       | profession   | age  | status | email          |
+----+--------+-------------+--------------+------+--------+----------------+
|  1 | 费阳   | 13777763170 | 法务经理     |   27 |      1 | wyao@gmail.com |
+----+--------+-------------+--------------+------+--------+----------------+
1 row in set (0.01 sec)

-- 查看执行计划
explain select * from tb_user where email = 'wyao@gmail.com';
+----+-------------+---------+------------+------+---------------+-------------+---------+-------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key         | key_len | ref   | rows | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+-------------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_email_5   | idx_email_5 | 23      | const |    1 |   100.00 | Using where |
+----+-------------+---------+------------+------+---------------+-------------+---------+-------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```

查询流程

![](img/pre-index.png)


### 6.7、单列索引和联合索引


- 单列索引：一个索引只包含单个列

- 联合索引：一个索引包含了多个列（创建索引时，需要考虑字段的先后顺序）

业务场景中，如果存在多个查询条件，考虑针对查询字段建立索引时，建议建立联合索引，而非单列索引

![](img/union-index.png)

示例

```sql
-- 查看索引
show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |        9804 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |        9804 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |        9130 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |         948 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |        6232 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |        7596 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_email_5                    |            1 | email       | A         |        3955 |        5 |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
7 rows in set (0.07 sec)

-- 查询数据
select id, phone, name from tb_user where phone = '13777763170' and name = '费阳';
+----+-------------+--------+
| id | phone       | name   |
+----+-------------+--------+
|  1 | 13777763170 | 费阳   |
+----+-------------+--------+
1 row in set (0.00 sec)

-- 查看执行计划
explain select id, phone, name from tb_user where phone = '13777763170' and name = '费阳';
+----+-------------+---------+------------+-------+------------------------------+----------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type  | possible_keys                | key            | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+-------+------------------------------+----------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | const | idx_user_phone,idx_user_name | idx_user_phone | 47      | const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+-------+------------------------------+----------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.01 sec)

-- 创建联合索引
create unique index idx_user_phone_name on tb_user(phone, name);


-- 查看执行计划
-- 多条件联合查询时，MySQL优化器会评估哪个字段的索引效率更高，会选择该索引完成本次查询
explain select id, phone, name from tb_user where phone = '13777763170' and name = '费阳';
+----+-------------+---------+------------+-------+--------------------------------------------------+----------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type  | possible_keys                                    | key            | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+-------+--------------------------------------------------+----------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | const | idx_user_phone,idx_user_phone_name,idx_user_name | idx_user_phone | 47      | const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+-------+--------------------------------------------------+----------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)



-- 查看执行计划（指定使用联合索引）
-- Using index 用到覆盖索引，避免回表查询
explain select id, phone, name from tb_user use index(idx_user_phone_name) where phone = '13777763170' and name = '费阳';
+----+-------------+---------+------------+-------+---------------------+---------------------+---------+-------------+------+----------+-------------+
| id | select_type | table   | partitions | type  | possible_keys       | key                 | key_len | ref         | rows | filtered | Extra       |
+----+-------------+---------+------------+-------+---------------------+---------------------+---------+-------------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | const | idx_user_phone_name | idx_user_phone_name | 130     | const,const |    1 |   100.00 | Using index |
+----+-------------+---------+------------+-------+---------------------+---------------------+---------+-------------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

## 7、索引失效的场景

### 7.1、索引列运算

不要在索引列上进行运算操作，否则索引将失效

```sql
-- 查看数据
mysql> select * from tb_user;
+----+--------+-------------+------------+------+--------+-------------+
| id | name   | phone       | profession | age  | status | email       |
+----+--------+-------------+------------+------+--------+-------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com  |
|  2 | 关羽   | 17722345678 | 物理       |   24 |      1 | 3339@qq.com |
|  3 | 刘备   | 17732345678 | 数学       |   25 |      0 | 666@qq.com  |
|  4 | 孙权   | 17742345678 | 语文       |   20 |      1 | 111@qq.com  |
+----+--------+-------------+------------+------+--------+-------------+
4 rows in set (0.00 sec)

-- 查看索引
mysql> show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |           4 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_email                 |            1 | email       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
7 rows in set (0.01 sec)

-- 按照手机号查询数据
mysql> select * from tb_user where phone = '17712345678';
+----+--------+-------------+------------+------+--------+------------+
| id | name   | phone       | profession | age  | status | email      |
+----+--------+-------------+------------+------+--------+------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com |
+----+--------+-------------+------------+------+--------+------------+
1 row in set (0.00 sec)

-- 分析索引使用情况
explain select * from tb_user where phone = '17712345678';
+----+-------------+---------+------------+-------+----------------+----------------+---------+-------+------+----------+-------+
| id | select_type | table   | partitions | type  | possible_keys  | key            | key_len | ref   | rows | filtered | Extra |
+----+-------------+---------+------------+-------+----------------+----------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | tb_user | NULL       | const | idx_user_phone | idx_user_phone | 47      | const |    1 |   100.00 | NULL  |
+----+-------------+---------+------------+-------+----------------+----------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

-- 查询手机号后两位
select * from tb_user where substring(phone, 10, 2)  = '27';
+----+--------+-------------+------------+------+--------+------------+
| id | name   | phone       | profession | age  | status | email      |
+----+--------+-------------+------------+------+--------+------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com |
+----+--------+-------------+------------+------+--------+------------+
1 row in set (0.00 sec)

-- 查看执行效率
explain select * from tb_user where substring(phone, 10, 2)  = '27';
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    4 |   100.00 | Using where |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```

### 7.2、字符串不加引号

字符串类型字段使用时，不加引号，索引将失效

```sql
-- 字符串查询可以不加引号
select * from tb_user where phone = 17712345678;
+----+--------+-------------+------------+------+--------+------------+
| id | name   | phone       | profession | age  | status | email      |
+----+--------+-------------+------------+------+--------+------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com |
+----+--------+-------------+------------+------+--------+------------+
1 row in set (0.00 sec)

-- 不加引号的字符串查询没有走索引
explain select * from tb_user where phone = 17712345678;
+----+-------------+---------+------------+------+----------------+------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys  | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+------+----------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | ALL  | idx_user_phone | NULL | NULL    | NULL |    4 |    25.00 | Using where |
+----+-------------+---------+------------+------+----------------+------+---------+------+------+----------+-------------+
1 row in set, 3 warnings (0.00 sec)
```

### 7.3、模糊查询

- 如果仅仅是尾部模糊匹配，索引不会失效；
- 如果是头部模糊匹配，索引失效

```sql
-- 尾部模糊查询
select * from tb_user where profession like '美%';
+----+--------+-------------+------------+------+--------+------------+
| id | name   | phone       | profession | age  | status | email      |
+----+--------+-------------+------------+------+--------+------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com |
+----+--------+-------------+------------+------+--------+------------+
1 row in set (0.00 sec)


-- 尾部模糊匹配，索引不会失效；
explain select * from tb_user where profession like '美%';
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
| id | select_type | table   | partitions | type  | possible_keys                  | key                            | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | tb_user | NULL       | range | idx_user_profession_age_status | idx_user_profession_age_status | 43      | NULL |    1 |   100.00 | Using index condition |
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)


-- 头部模糊匹配，索引失效
explain select * from tb_user where profession like '%术';
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    4 |    25.00 | Using where |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```

### 7.4、or连接的条件

用or分割开的条件，如果or前的条件中有的列有索引，而后面的列中没有索引，那么涉及的索引都不会被用到

```sql
select * from tb_user where id = 1 or age = 23;

select * from tb_user where phone = '17742345678' or age = 23;
```

由于age没有索引，所以即使id，phone有索引，索引也会失效。age也需要建立索引

示例

```sql
-- 查看表数据
select * from tb_user;
+----+--------+-------------+------------+------+--------+-------------+
| id | name   | phone       | profession | age  | status | email       |
+----+--------+-------------+------------+------+--------+-------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com  |
|  2 | 关羽   | 17722345678 | 物理       |   24 |      1 | 3339@qq.com |
|  3 | 刘备   | 17732345678 | 数学       |   25 |      0 | 666@qq.com  |
|  4 | 孙权   | 17742345678 | 语文       |   20 |      1 | 111@qq.com  |
+----+--------+-------------+------------+------+--------+-------------+
4 rows in set (0.01 sec)

-- 查看索引
show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |           4 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_email                 |            1 | email       | A         |           4 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
7 rows in set (0.05 sec)


-- 查询数据
select * from tb_user where id = 1 or age = 23;
+----+--------+-------------+------------+------+--------+------------+
| id | name   | phone       | profession | age  | status | email      |
+----+--------+-------------+------------+------+--------+------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com |
+----+--------+-------------+------------+------+--------+------------+
1 row in set (0.00 sec)

-- 分析
explain select * from tb_user where id = 1 or age = 23;
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | ALL  | PRIMARY       | NULL | NULL    | NULL |    4 |    43.75 | Using where |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

-- 分析
explain select * from tb_user where phone = '17742345678' or age = 23;
+----+-------------+---------+------------+------+----------------+------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type | possible_keys  | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+------+----------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | ALL  | idx_user_phone | NULL | NULL    | NULL |    4 |    43.75 | Using where |
+----+-------------+---------+------------+------+----------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.15 sec)

-- 创建索引
create index idx_user_age on tb_user ( age );


-- 再次分析性能
explain select * from tb_user where id = 1 or age = 23;
+----+-------------+---------+------------+-------------+----------------------+----------------------+---------+------+------+----------+------------------------------------------------+
| id | select_type | table   | partitions | type        | possible_keys        | key                  | key_len | ref  | rows | filtered | Extra                                          |
+----+-------------+---------+------------+-------------+----------------------+----------------------+---------+------+------+----------+------------------------------------------------+
|  1 | SIMPLE      | tb_user | NULL       | index_merge | PRIMARY,idx_user_age | PRIMARY,idx_user_age | 4,5     | NULL |    2 |   100.00 | Using union(PRIMARY,idx_user_age); Using where |
+----+-------------+---------+------------+-------------+----------------------+----------------------+---------+------+------+----------+------------------------------------------------+
1 row in set, 1 warning (0.00 sec)


explain select * from tb_user where phone = '17742345678' or age = 23;
+----+-------------+---------+------------+-------------+-----------------------------+-----------------------------+---------+------+------+----------+-------------------------------------------------------+
| id | select_type | table   | partitions | type        | possible_keys               | key                         | key_len | ref  | rows | filtered | Extra                                                 |
+----+-------------+---------+------------+-------------+-----------------------------+-----------------------------+---------+------+------+----------+-------------------------------------------------------+
|  1 | SIMPLE      | tb_user | NULL       | index_merge | idx_user_phone,idx_user_age | idx_user_phone,idx_user_age | 47,5    | NULL |    2 |   100.00 | Using union(idx_user_phone,idx_user_age); Using where |
+----+-------------+---------+------------+-------------+-----------------------------+-----------------------------+---------+------+------+----------+-------------------------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

### 7.5、数据分布影响

如果MySQL性能评估使用索引比全表更慢，则不使用索引。

```sql
select * from tb_user where phone >= '17742345678';
+----+--------+-------------+------------+------+--------+------------+
| id | name   | phone       | profession | age  | status | email      |
+----+--------+-------------+------------+------+--------+------------+
|  4 | 孙权   | 17742345678 | 语文       |   20 |      1 | 111@qq.com |
+----+--------+-------------+------------+------+--------+------------+
1 row in set (0.00 sec)

explain select * from tb_user where phone >= '17742345678';
+----+-------------+---------+------------+-------+----------------+----------------+---------+------+------+----------+-----------------------+
| id | select_type | table   | partitions | type  | possible_keys  | key            | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+---------+------------+-------+----------------+----------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | tb_user | NULL       | range | idx_user_phone | idx_user_phone | 47      | NULL |    1 |   100.00 | Using index condition |
+----+-------------+---------+------------+-------+----------------+----------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)

explain select * from tb_user where phone >= '17712345670';
+----+-------------+---------+------------+-------+----------------+----------------+---------+------+------+----------+-----------------------+
| id | select_type | table   | partitions | type  | possible_keys  | key            | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+---------+------------+-------+----------------+----------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | tb_user | NULL       | range | idx_user_phone | idx_user_phone | 47      | NULL |    4 |   100.00 | Using index condition |
+----+-------------+---------+------------+-------+----------------+----------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)

```

`is null` 和 `is not null` 走不走索引，主要看表中的数据。

```sql
-- is null
explain select * from tb_user where profession is null;
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-----------------------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref   | rows | filtered | Extra                 |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-----------------------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 43      | const |    1 |   100.00 | Using index condition |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-----------------------+
1 row in set, 1 warning (0.01 sec)

-- is not null
explain select * from tb_user where profession is not null;
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
| id | select_type | table   | partitions | type  | possible_keys                  | key                            | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | tb_user | NULL       | range | idx_user_profession_age_status | idx_user_profession_age_status | 43      | NULL |    4 |   100.00 | Using index condition |
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)

-- 将数据更新为null
update tb_user set profession = null;

-- 再次查看性能
explain select * from tb_user where profession is null;
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-----------------------+
| id | select_type | table   | partitions | type | possible_keys                  | key                            | key_len | ref   | rows | filtered | Extra                 |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-----------------------+
|  1 | SIMPLE      | tb_user | NULL       | ref  | idx_user_profession_age_status | idx_user_profession_age_status | 43      | const |    4 |   100.00 | Using index condition |
+----+-------------+---------+------------+------+--------------------------------+--------------------------------+---------+-------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)

-- is not null
 explain select * from tb_user where profession is not null;
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
| id | select_type | table   | partitions | type  | possible_keys                  | key                            | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | tb_user | NULL       | range | idx_user_profession_age_status | idx_user_profession_age_status | 43      | NULL |    1 |   100.00 | Using index condition |
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)

```

### 7.6、范围查询

联合索引中，出现范围查询（>、<），范围查询右侧的列索引失效

```sql
select * from tb_user where profession = '美术' and age > 22 and status = 1;
+----+--------+-------------+------------+------+--------+------------+
| id | name   | phone       | profession | age  | status | email      |
+----+--------+-------------+------------+------+--------+------------+
|  1 | 张飞   | 17712345678 | 美术       |   23 |      1 | 123@qq.com |
+----+--------+-------------+------------+------+--------+------------+
1 row in set (0.00 sec)

-- age使用了大于号>，只有profession和age用到了索引
explain select * from tb_user where profession = '美术' and age > 22 and status = 1;
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
| id | select_type | table   | partitions | type  | possible_keys                  | key                            | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | tb_user | NULL       | range | idx_user_profession_age_status | idx_user_profession_age_status | 48      | NULL |    1 |    25.00 | Using index condition |
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.01 sec)

-- 三个字段都用到了索引
explain select * from tb_user where profession = '美术' and age >= 22 and status = 1;
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
| id | select_type | table   | partitions | type  | possible_keys                  | key                            | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | tb_user | NULL       | range | idx_user_profession_age_status | idx_user_profession_age_status | 53      | NULL |    1 |    25.00 | Using index condition |
+----+-------------+---------+------------+-------+--------------------------------+--------------------------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)
```

## 8、索引设计原则

1. 数据量较大(100W)，且查询比较频繁的表建立索引

2. 针对于常作为查询条件（where）、排序（order by）、分组（group by）操作的字段建立索引

3. 尽量选择区分度高的列作为索引，尽量建立唯一索引，区分度越高，使用索引的效率越高

4. 如果是字符串类型，字段的长度较长，可以针对字段的特点，建立前缀索引

5. 尽量使用联合索引，减少单列索引，查询时，联合索引很多时候可以覆盖索引，节省存储空间，避免回表，提高查询效率

6. 要控制索引的数量，索引并不是多多益善，索引越多，维护索引结构的代价也就越大，会影响增删改的效率

7. 如果索引列不能存储null值，请在创建表的时候使用`not null`约束它。当优化器知道每列是否包含null值时，它可以更好地确定哪个索引最有效的用于查询

## 9、总结

1. 索引概述

- 索引是高效获取数据的数据结构
- 索引是有序的数据结构

3. 索引结构

- B+Tree：
    - 所有数据都出现在叶子节点
    - 叶子节点行成双向链表

- Hash：
    - Memory存储引擎支持
    - 优点：性能较高（计算hash值，直接检索数据）
    - 缺点：只支持精确匹配，不支持范围查询，不支持索引排序

3. 索引分类

- 常规分类：
    - 主键索引 primary key
    - 唯一索引 unique
    - 常规索引 
    - 全文索引

- InnoDB: 
    - 聚集索引：叶子节点存放行数据（默认主键索引 、第一个唯一主键、自动生成隐藏的row.id）
    - 二级索引：叶子节点存放主键

4. 索引语法

```sql
-- 创建索引
create [unique] index <index_name> on <table_name>(<column_name>);
-- 查看索引
show index from <table_name>
-- 删除索引 
drop index <index_name> on <table_name>
```

5. SQL性能分析

- 执行频次：针对查询为主的sql进行优化
- 慢查询日志
- profile：每条SQL耗时情况
- explain 执行计划：评判SQL语句的性能

6. 索引使用

- 联合索引：
    - 最左前缀法则：最左边的列必须存在。最左边的列存在，中间跳过某些列，后面的列索引会失效
    - 范围查询：范围查询右侧的列会失效，优先使用(>=、<=)
- 索引失效：
    - 索引列进行函数计算
    - 隐式类型转换：字符串不加引号
    - like模糊匹配：前面加了百分号
    - or连接的索引：一侧有索引，一侧没有索引
    - 数据分布影响：全表扫描比索引还快

- SQL提示
    - 使用索引 `use index`
    - 忽略索引 `ignore index`
    - 强制使用索引 `force index`

- 覆盖索引
    - 查询返回的列在索引结构中都包含了，不用走回表查询
    - 回表查询：先走二级索引检索到行数据的id，再根据id到聚集索引查找行数据

- 前缀索引
    - 字符串较长, 大文本字段

- 单列/联合索引
    - 推荐使用联合索引，避免回表查询

7. 索引设计原则

- 表：数据量大，查询频次较高
- 字段：where/order by/group by之后的字段
- 索引 
    - 唯一索引 区分度高
    - 联合索引 优先使用
    - 前缀索引 字符串较长, 大文本字段

