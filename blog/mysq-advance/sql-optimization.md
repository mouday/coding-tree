# SQL优化

1. 插入数据
2. 主键优化
3. order by 优化
4. group by 优化
5. limit 优化
6. count 优化
7. update 优化

## 1、插入数据

逐条插入数据，性能较低，耗时较长

```sql
insert into tb_user (name, age) values ('Tom', 23);
insert into tb_user (name, age) values ('Jack', 24);
insert into tb_user (name, age) values ('Steve', 25);
insert into tb_user (name, age) values ('Alice', 23);
...
```

### 1.1、批量插入 

将多条insert语句合并为一条insert语句，批量提交数据

每次插入数据量建议：500-1000

```sql
insert into tb_user (name, age) values 
('Tom', 23), ('Jack', 24), ('Steve', 25) ('Alice', 23);
```

### 1.2、手动事务提交

减少事务开启关闭的次数

```sql
start transaction;
insert into tb_user (name, age) values ('Tom', 23), ('Jack', 24);
insert into tb_user (name, age) values ('Steve', 25) ('Alice', 23);
commit;
```

### 1.3、主键顺序插入

主键顺序插入的性能高于乱序插入

```
主键乱序插入 8 1 9 21 88 2 4 15 89 5 7 3
主键顺序插入 1 2 3 4 5 6 7 8 9 10 88 99
```

### 1.4、大批量插入数据

如果一次性需要插入大批量数据，使用insert语句插入性能较低

可以使用MySQL数据库提供的`load` 指令进行数据插入


```sql
# 客户端连接服务端时，加上参数 `--local-infile`
mysql --local-infile -uroot -p

# 设置全局参数local_infile，开启从本地加载文件导入数据的关
set global local_infile = 1;

# 执行load指令将准备好的数据，加载到表结构中
load data local infile '/root/data.csv' 
into table `tb_user` 
fields terminated by ',' 
lines terminated by '\n';
```

示例

利用Python脚本生成测试数据
```python
# Python >= 3.7.0
# 安装依赖 pip install faker pandas
from faker import Faker
import pandas as pd

# 简体中文：zh_CN
faker = Faker(locale="zh_CN")
# 指定随机种子，确保每次生成的数据都是一致的
faker.seed(1)


def get_row(index=0):
    return {
        'id': index + 1,
        'username': faker.phone_number(),
        'passowrd': faker.password(),
        'name': faker.name(),
        'birthday': faker.date_time().strftime("%Y-%m-%d"),
        'sex': faker.random_int(0, 2),
    }


def main():
    # 100万条数据
    data = [ get_row(i) for i in range(100 * 10000)]
    
    # 将数据导出为csv文件, 不需要表头和序号
    df = pd.DataFrame(data)
    df.to_csv('./data_user.csv',
              header=False,
              index=False)


if __name__ == '__main__':
    main()

```

查看数据

```bash
# 查看要导入的测试数据
$ wc -l data_user.csv 
 1000000 data_user.csv

$ head data_user.csv
1,13891417776,$h!PMHaS1#,魏玉珍,2021-12-20,1
2,18883533740,BP3UqgUd&8,正红梅,2020-08-11,1
3,18225851781,#$mMRcl98H,殳桂芝,1988-04-28,2
4,13190682883,ywDqePXl&0,仰俊,2007-06-25,2
5,13918401107,2!WP4H8it9,农琳,1993-05-13,1
6,13334148396,3%8AqgmG!j,宗涛,2020-03-08,1
7,13830411442,@&%9yI9r%e,荣建平,1977-02-08,2
8,15948705964,y2VGFM0k!W,齐英,1981-07-19,0
9,18983459845,I^5w1D^e)j,安凤英,2008-07-07,0
10,15154981741,@!4A^CIt82,乜峰,2007-06-11,1

```

创建测试表

```sql
# 开启外部数据加载
$ mysql --local-infile -uroot -p

> select @@local_infile;

> set global local_infile = 1;

# 创建一个新的数据库和新的表来存放数据
> show databases;

> create database data_temp;

> user data_temp;

> create table tb_user(
    id int primary key auto_increment,
    username varchar(50) not null,
    passowrd varchar(50) not null,
    name varchar(20) not null,
    birthday date default null,
    sex tinyint default 0,
    unique key uk_user_username (`username`)
) engine=innodb default charset=utf8;
```

导入数据

```sql
> load data local infile '/data/data_user.csv' 
into table `tb_user` 
fields terminated by ',' 
lines terminated by '\n';

Query OK, 999830 rows affected, 170 warnings (17.68 sec)
Records: 1000000  Deleted: 0  Skipped: 170  Warnings: 170
```

查看导入的数据

```sql
mysql> select * from tb_user limit 10;
+----+-------------+------------+-----------+------------+------+
| id | username    | passowrd   | name      | birthday   | sex  |
+----+-------------+------------+-----------+------------+------+
|  1 | 13891417776 | $h!PMHaS1# | 魏玉珍    | 2021-12-20 | 1    |
|  2 | 18883533740 | BP3UqgUd&8 | 正红梅    | 2020-08-11 | 1    |
|  3 | 18225851781 | #$mMRcl98H | 殳桂芝    | 1988-04-28 | 2    |
|  4 | 13190682883 | ywDqePXl&0 | 仰俊      | 2007-06-25 | 2    |
|  5 | 13918401107 | 2!WP4H8it9 | 农琳      | 1993-05-13 | 1    |
|  6 | 13334148396 | 3%8AqgmG!j | 宗涛      | 2020-03-08 | 1    |
|  7 | 13830411442 | @&%9yI9r%e | 荣建平    | 1977-02-08 | 2    |
|  8 | 15948705964 | y2VGFM0k!W | 齐英      | 1981-07-19 | 0    |
|  9 | 18983459845 | I^5w1D^e)j | 安凤英    | 2008-07-07 | 0    |
| 10 | 15154981741 | @!4A^CIt82 | 乜峰      | 2007-06-11 | 1    |
+----+-------------+------------+-----------+------------+------+
10 rows in set (0.00 sec)

mysql> select count(*) from tb_user;
+----------+
| count(*) |
+----------+
|   999830 |
+----------+
1 row in set (0.14 sec)

```

## 2、主键优化

### 2.1、数据组织方式

在InnoDB存储引擎中，表数据都是根据主键顺序组织存放的，

这种存储方式的表称为`索引组织表`（index organized table IOT）

![](img/mysql-b+tree.png)

![](img/innodb-store.png)


### 2.2、页分裂

页可以为空，也可以填充一半，也可以填充100%。

每个页包含了2-N行数据（如果一行数据太大，会行溢出），根据主键排列

如果插入的数据主键不是顺序的，有可能发生页分裂

![](img/page-split-1.png)

![](img/page-split-2.png)

### 2.3、页合并

当删除一行记录的时候，实际上记录并没有被物理删除，只是记录被标记（flaged）为删除。

并且它的空间变得允许被其他记录声明使用。

当页中删除的记录达到 MERGE_THRESHOLD (默认为页的50%)，

InnoDB会开始寻找最靠近的页（前或后）看看是否可以将两个页合并优化空间使用。

MERGE_THRESHOLD ： 合并也的阈值，可以自己设置，在创建表或者创建索引时指定

![](img/page-merge-1.png)

![](img/page-merge-2.png)

### 2.4、主键设计原则

1. 满足业务需求的情况下，尽量降低主键的长度（二级索引叶子节点存放主键，主键过长会占用大量磁盘空间）

2. 插入数据时，尽量选择顺序插入，选择使用 `auto_increment` 自增主键（不是顺序插入，会造成页分裂）

3. 尽量不要使用UUID做主键或者是其他自然主键，如身份证号（长度较长，耗费磁盘io）

4. 业务操作时，避免对主键的修改






















## 3、order by 优化

- using filesort：通过表的索引或全表扫描，读取满足条件的数据行，然后在`排序缓冲区sort buffer`中完成排序操作，所有不是通过索引直接返回排序结果的排序都叫FileSort排序

- using index: 通过有序索引顺序扫描直接返回有序数据，这种情况即为using index,不需要额外排序，操作效率高


测试数据

```sql
-- 查看表数据
mysql> select * from tb_user limit 3;
+----+-----------+-------------+---------------------+------+--------+----------------+
| id | name      | phone       | profession          | age  | status | email          |
+----+-----------+-------------+---------------------+------+--------+----------------+
|  1 | 费阳      | 13777763170 | 法务经理            |   27 |      1 | wyao@gmail.com |
|  2 | 祁海燕    | 13400806360 | 日式厨师            |   23 |      0 | jwan@jin.cn    |
|  3 | 姬秀英    | 18281241586 | 食品/饮料研发       |   29 |      0 | li97@wang.cn   |
+----+-----------+-------------+---------------------+------+--------+----------------+
3 rows in set (0.01 sec)

-- 查看索引
mysql> show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |        9804 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone                 |            1 | phone       | A         |        9804 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone_name            |            1 | phone       | A         |        9804 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          0 | idx_user_phone_name            |            2 | name        | A         |        9804 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_name                  |            1 | name        | A         |        9130 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |         948 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |        6232 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |        7596 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_email_5                    |            1 | email       | A         |        3955 |        5 |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
9 rows in set (0.03 sec)

-- 删除索引
drop index idx_user_phone on tb_user;

drop index idx_user_phone_name on tb_user;

drop index idx_user_name on tb_user;

show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |        9804 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |         948 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |        6232 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |        7596 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_email_5                    |            1 | email       | A         |        3955 |        5 |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
5 rows in set (0.00 sec)
```

索引测试

```sql
-- 没有创建索引时，根据age, phone进行排序 Using filesort 
mysql> explain select id, age, phone from tb_user order by age, phone;
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+----------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra          |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+----------------+
|  1 | SIMPLE      | tb_user | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 9804 |   100.00 | Using filesort |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+----------------+
1 row in set, 1 warning (0.00 sec)

-- 创建索引
create index idx_user_age_phone on tb_user(age, phone);

-- 创建索引后，根据age进行升序排序
mysql> explain select id, age, phone from tb_user order by age;
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type  | possible_keys | key                | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | index | NULL          | idx_user_age_phone | 52      | NULL | 9804 |   100.00 | Using index |
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

-- 创建索引后，根据age, phone进行升序排序
mysql> explain select id, age, phone from tb_user order by age, phone;
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type  | possible_keys | key                | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | index | NULL          | idx_user_age_phone | 52      | NULL | 9804 |   100.00 | Using index |
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)

-- 创建索引后，根据age, phone进行降序排序
mysql> explain select id, age, phone from tb_user order by age desc, phone desc;
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+----------------------------------+
| id | select_type | table   | partitions | type  | possible_keys | key                | key_len | ref  | rows | filtered | Extra                            |
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+----------------------------------+
|  1 | SIMPLE      | tb_user | NULL       | index | NULL          | idx_user_age_phone | 52      | NULL | 9804 |   100.00 | Backward index scan; Using index |
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+----------------------------------+
1 row in set, 1 warning (0.00 sec)

-- 交换age，phone的先后位置 出现Using filesort
mysql> explain select id, age, phone from tb_user order by phone, age;
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-----------------------------+
| id | select_type | table   | partitions | type  | possible_keys | key                | key_len | ref  | rows | filtered | Extra                       |
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-----------------------------+
|  1 | SIMPLE      | tb_user | NULL       | index | NULL          | idx_user_age_phone | 52      | NULL | 9804 |   100.00 | Using index; Using filesort |
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-----------------------------+
1 row in set, 1 warning (0.01 sec)

-- age升序排列，phone降序排列，出现Using filesort
mysql> explain select id, age, phone from tb_user order by age asc, phone desc;
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-----------------------------+
| id | select_type | table   | partitions | type  | possible_keys | key                | key_len | ref  | rows | filtered | Extra                       |
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-----------------------------+
|  1 | SIMPLE      | tb_user | NULL       | index | NULL          | idx_user_age_phone | 52      | NULL | 9804 |   100.00 | Using index; Using filesort |
+----+-------------+---------+------------+-------+---------------+--------------------+---------+------+------+----------+-----------------------------+
1 row in set, 1 warning (0.00 sec)

-- 创建age升序，phone降序的索引
create index idx_user_age_phone_ad on tb_user(age asc, phone desc);

-- 查看索引 （Collation： A=asc, D=desc）
mysql> show index from tb_user;
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name                       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| tb_user |          0 | PRIMARY                        |            1 | id          | A         |        9804 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            1 | profession  | A         |         948 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            2 | age         | A         |        6232 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_profession_age_status |            3 | status      | A         |        7596 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_email_5                    |            1 | email       | A         |        3955 |        5 |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_age_phone             |            1 | age         | A         |          11 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_age_phone             |            2 | phone       | A         |        9804 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_age_phone_ad          |            1 | age         | A         |          11 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| tb_user |          1 | idx_user_age_phone_ad          |            2 | phone       | D         |        9804 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+---------+------------+--------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
9 rows in set (0.02 sec)

-- 创建索引后，age升序排列，phone降序排列
mysql> explain select id, age, phone from tb_user order by age asc, phone desc;
+----+-------------+---------+------------+-------+---------------+-----------------------+---------+------+------+----------+-------------+
| id | select_type | table   | partitions | type  | possible_keys | key                   | key_len | ref  | rows | filtered | Extra       |
+----+-------------+---------+------------+-------+---------------+-----------------------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | tb_user | NULL       | index | NULL          | idx_user_age_phone_ad | 52      | NULL | 9804 |   100.00 | Using index |
+----+-------------+---------+------------+-------+---------------+-----------------------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)


-- 如果没有用到覆盖索引，会出现：Using filesort
mysql> explain select * from tb_user order by age asc, phone desc;
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+----------------+
| id | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra          |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+----------------+
|  1 | SIMPLE      | tb_user | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 9804 |   100.00 | Using filesort |
+----+-------------+---------+------------+------+---------------+------+---------+------+------+----------+----------------+
1 row in set, 1 warning (0.00 sec)
```

### 3.1、优化原则

1. 根据排序字段建立合适的索引，多字段排序时，也遵循最左前缀法则

2. 尽量使用覆盖索引

3. 多字段排序，一个升序一个降序，此时需要注意联合索引在创建时的规则（asc/desc）

4. 如果不可避免的出现filesort, 大数据量排序时，可以适当增大排序缓冲区的大小 sort_buffer_size(默认值256k)

```sql
mysql> show variables like 'sort_buffer_size';
+------------------+--------+
| Variable_name    | Value  |
+------------------+--------+
| sort_buffer_size | 262144 |
+------------------+--------+
1 row in set (0.03 sec)
```
