# 事务安全 transaction

事务 transaction 访问可能更新数据库中各种数据项的一个程序执行单元unit

事务由事务开始（begin transaction）和事务结束(end transaction)之间执行的全体操作组成

## 事务基本原理

MySQL允许将事务统一进行管理（存储引擎innodb），将用户所做的操作，暂时保存起来，不直接放到数据表（更新），等到用户确认结果之后再进行操作

事务通常是自动提交，也可以手动提交

## 自动事务

当客户端发送一条SQL指令（写操作，增删改）给服务器的时候，服务器在执行后，不用等待用户反馈结果，会自动将结果同步到数据表

两个客户端，一个客户端执行SQL指令，另一个客户端查看执行结果

通过变量控制自动事务

```sql
mysql> show variables like 'autocommit';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| autocommit    | ON    |
+---------------+-------+

-- 关闭自动事务
set autocommit = off;

mysql> show variables like 'autocommit';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| autocommit    | OFF   |
+---------------+-------+
```

关闭自动事务之后，一个客户端修改数据，另个一客户端看不到修改的结果

一旦关闭自动事务，就需要用户提供是否同步的命令

- commit 提交 （同步到数据表，事务会被清空）
- rollback 回滚 （清空之前的操作，不要了）

```sql
-- 客户端A关闭自动事务后操作数据
mysql> select * from my_class;
+----+--------+
| id | name   |
+----+--------+
|  1 | 一班   |
|  3 | 三班   |
+----+--------+
2 rows in set (0.01 sec)

mysql> insert into my_class (name) values('四班');
Query OK, 1 row affected (0.00 sec)

mysql> select * from my_class;
+----+--------+
| id | name   |
+----+--------+
|  1 | 一班   |
|  3 | 三班   |
|  5 | 四班   |
+----+--------+
3 rows in set (0.00 sec)


-- 客户端B看不到新增的 四班数据, 
mysql> select * from my_class;
+----+--------+
| id | name   |
+----+--------+
|  1 | 一班   |
|  3 | 三班   |
+----+--------+
2 rows in set (0.00 sec)
```

客户端A执行commit 提交事务之后，客户端B就可以看到新增的数据了

通常不需要关闭自动事务，需要使用事务的时候，使用手动事务


## 手动事务

开始、过程、结束,都要用户手动发送事务操作指令来实现

手动事务指令
```sql
-- 1、开启事务，从这条语句开始，后面所有的语句都不会直接写入到数据表，保存在事务日志中
start transaction 

-- 2、事务处理，多个指令构成

-- 3、事务提交，结束事务
commit / rollback 

```

## 事务的使用

```sql
mysql> select * from my_class;
+----+--------+
| id | name   |
+----+--------+
|  1 | 一班   |
|  3 | 三班   |
|  5 | 四班   |
+----+--------+
3 rows in set (0.04 sec)

mysql> select * from my_student;
+----+--------+----------+------+--------+
| id | name   | class_id | age  | gender |
+----+--------+----------+------+--------+
|  1 | 刘备   |        1 |   18 |      2 |
|  2 | 李四   |        1 |   19 |      1 |
|  3 | 王五   |     NULL |   20 |      2 |
|  4 | 张飞   |     NULL |   21 |      1 |
|  5 | 关羽   |     NULL |   22 |      2 |
|  6 | 曹操   |        1 |   20 |   NULL |
+----+--------+----------+------+--------+
6 rows in set (0.00 sec)


-- 开启事务
start transaction;

-- 执行事务操作，多个修改操作
insert into my_class (name)values ('六班');
insert into my_student (name, class_id, age, gender)values ('司马懿', 6, 26, 1);

-- 提交事务
commit;

-- 或者回滚操作，所有数据无效清空
rollback;
```

## 回滚点

当有一系列事务操作是，而其中的步骤如果成功了，没有必要重新来过，可以在某个点，设置一个记号（回滚点），然后如果后面有失败，那么可以回到这个记号的位置

```sql
-- 增加回滚点
savepoint 回滚点名字;

-- 回到回滚点 清空之后所有操作
rollback to 回滚点名字;
```

一个事务处理过程中，如果有很多步骤，可以设置多个回滚点


## 事务的特点

ACID：
- 原子性 automicity 一个事务是不可分割的工作单元，要么都做，要么都不做
- 一致性 consistency 事务必须是使数据库从一个一致性状态变到另一个一致性状态
- 隔离性 isolation 一个事务的执行，不能被其他事务干扰，操作数据的时候会锁住该条数据
- 持久性 durability 一个事务一旦提交，他对数据库中的数据改变就是永久的

如果条件中使用了索引，会隔离一条记录；反之，通过全表检索，会锁定整个表


