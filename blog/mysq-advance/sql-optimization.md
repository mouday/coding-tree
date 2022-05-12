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

