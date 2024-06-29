# SQL优化实战

## 环境配置

数据库版本

```sql
select version();

8.0.29
```

## 前期准备

建表

```sql
-- 移除表
-- DROP TABLE IF EXISTS `t_orders`;

-- 建表
CREATE TABLE `t_orders`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',

  `order_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '订单编码',

  `product_num` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '产品编码',
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '产品名称',

  `customer_num` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '客户编码',
  `customer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '客户名称',

  `amount` decimal(10, 2) NOT NULL COMMENT '订单金额',
  `status` tinyint NOT NULL COMMENT '订单状态码，0：待付款；1：已付款，待发货；2：已发货；3：已完成；4：已取消',

  `create_time` datetime NOT NULL COMMENT '创建日期',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',

  PRIMARY KEY (`id`) USING BTREE,

  INDEX `idx_custnum_status_createtime`(`customer_num` ASC, `status` ASC, `create_time` ASC) USING BTREE,
  INDEX `idx_order_id`(`order_id` ASC) USING BTREE

) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单表' ROW_FORMAT = DYNAMIC;

```

初始数据

```sql
INSERT INTO `t_orders` VALUES (1, '10000000000001', 'PDT2024060101', '智能运动手环', 'CUST202401', '张伟', 299.99, 1, '2024-06-22 15:49:11', '2024-06-22 15:49:11');
INSERT INTO `t_orders` VALUES (2, '10000000000002', 'PDT2024060102', '儿童玩具车', 'CUST202402', '王芳', 159.99, 2, '2024-06-22 15:49:11', '2024-06-22 15:49:11');
INSERT INTO `t_orders` VALUES (3, '10000000000003', 'PDT2024060103', '多功能电钻', 'CUST202403', '李娜', 399.99, 3, '2024-06-22 15:49:11', '2024-06-22 15:49:11');
INSERT INTO `t_orders` VALUES (4, '10000000000004', 'PDT2024060104', '女士时尚太阳镜', 'CUST202404', '刘强', 199.99, 0, '2024-06-22 15:49:11', '2024-06-22 15:49:11');
INSERT INTO `t_orders` VALUES (5, '10000000000005', 'PDT2024060105', '男士运动鞋', 'CUST202405', '陈敏', 249.99, 1, '2024-06-22 15:49:11', '2024-06-22 15:49:11');
INSERT INTO `t_orders` VALUES (6, '10000000000006', 'PDT2024060106', '婴儿奶粉', 'CUST202406', '赵静', 129.99, 2, '2024-06-22 15:49:11', '2024-06-22 15:49:11');
INSERT INTO `t_orders` VALUES (7, '10000000000007', 'PDT2024060107', '智能手表', 'CUST202407', '黄丽', 499.99, 3, '2024-06-22 15:49:11', '2024-06-22 15:49:11');
INSERT INTO `t_orders` VALUES (8, '10000000000008', 'PDT2024060108', '女士连衣裙', 'CUST202408', '周杰', 99.99, 0, '2024-06-22 15:49:11', '2024-06-22 15:49:11');
INSERT INTO `t_orders` VALUES (9, '10000000000009', 'PDT2024060109', '无线蓝牙耳机', 'CUST202409', '吴鑫', 299.99, 4, '2024-06-22 15:49:11', '2024-06-22 15:49:11');
INSERT INTO `t_orders` VALUES (10, '10000000000010', 'PDT2024060110', '男士休闲裤', 'CUST2024010', '朱燕', 150.99, 1, '2024-06-22 15:49:11', '2024-06-22 15:49:11');

```

建表大数据量表

```sql
-- 移除表
-- DROP TABLE IF EXISTS `t_orders_bigdata`;

-- 建表
CREATE TABLE `t_orders_bigdata`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',

  `order_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '订单编码',

  `product_num` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '产品编码',
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '产品名称',

  `customer_num` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '客户编码',
  `customer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '客户名称',

  `amount` decimal(10, 2) NOT NULL COMMENT '订单金额',
  `status` tinyint NOT NULL COMMENT '订单状态码，0：待付款；1：已付款，待发货；2：已发货；3：已完成；4：已取消',

  `create_time` datetime NOT NULL COMMENT '创建日期',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',

  PRIMARY KEY (`id`) USING BTREE,

  INDEX `idx_custnum_status_createtime`(`customer_num` ASC, `status` ASC, `create_time` ASC) USING BTREE,
  INDEX `idx_order_id`(`order_id` ASC) USING BTREE

) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单表' ROW_FORMAT = DYNAMIC;

```

大数据量模拟（存储过程模拟：千万级）

```sql
-- 删除存储过程
-- DROP PROCEDURE IF EXISTS batchInsertBigData;

-- 创建存储过程

DELIMITER $$

CREATE PROCEDURE batchInsertBigData(IN args INT)
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE order_id BIGINT DEFAULT 0;

  -- 开启事务
  START TRANSACTION;
  
  WHILE i <= args DO
    -- 生成唯一的订单编码，这里简单地使用当前时间戳和自增变量的组合
    SET order_id = (UNIX_TIMESTAMP() * 1000) + i;

    -- 插入数据
    INSERT INTO t_orders_bigdata (
      `order_id`, 
      `product_num`, 
      `product_name`, 
      `customer_num`, 
      `customer_name`, 
      `amount`, 
      `status`, 
      `create_time`, 
      `update_time`
    ) VALUES (
      order_id, -- 使用生成的订单编码
      CONCAT('PDT', LPAD(i, 6, '0')), -- 产品编号，左填充为6位数字
      CONCAT('Product-', i), -- 产品名称
      CONCAT('CUST', LPAD((i % 1000) + 1, 6, '0')), -- 假设有1000个客户编号循环使用
      CONCAT('Customer-', (i % 1000) + 1), -- 客户名称
      ROUND((RAND() * 100) + 100, 2), -- 随机生成100到200的订单金额
      CASE WHEN i % 5 = 0 THEN 0 WHEN i % 3 = 0 THEN 1 ELSE 2 END, -- 随机分配几种状态
      NOW(), -- 创建时间
      NOW() -- 更新时间
    );
    SET i = i + 1;
  END WHILE;
  
  COMMIT;
END$$

DELIMITER ;


-- 调用存储过程

CALL  batchInsertBigData(10000000);

```

执行后要等好一会才行 40分钟

```
completed in 39 m 58 s 193 ms
```

## MySQL 命令储备

```sql
-- 查看数据库里正在执行的sql语句
show processlist; 

-- 登陆数据库现场抓(显示完整的进程列表)
show full processlist; 

-- 查看数据库的配置参数信息，例如：my.cnf里参数的生效情况
show variables;

-- MySQL服务器运行各种状态值，查询MySQL服务器配置信息语句
show variables like '%log_bin%';

-- 查看当前会话的数据库状态信息
show session status;

-- 查看整个数据库运行状态信息，分析并做好监控
show global status;

-- 显示innodb 引擎的性能状态
show engine innodb status;

-- explain语句检查索引执行情况，将上边抓到的慢语句，进行一个索引检查
explain select * from test_table where ***
```

## 性能分析

1、什么是慢查询？

慢查询日志，就是查询花费大量时间的日志，是指mysql记录所有执行超过long_query_time参数设定的时间阈值的SQL语句的日志。默认情况下，慢查询日志是关闭的，要使用慢查询日志功能，首先要开启慢查询日志功能。

2、如何定位慢SQL？

- 性能监控
- 开启慢查询日志
- 分析慢查询日志


### 性能监控

1、简单版：show profile;

注意：通常在开发和问题诊断期间使用，而不是在生产环境中持续启用。

```sql
-- 启用性能监控
mysql> set profiling=1;
Query OK, 0 rows affected, 1 warning (0.00 sec)

-- 执行SQL
mysql> select * from data.t_orders limit 10;

-- 性能分析
mysql> show profiles;
+----------+------------+--------------------------------------+
| Query_ID | Duration   | Query                                |
+----------+------------+--------------------------------------+
|        1 | 0.00365300 | select * from data.t_orders limit 10 |
+----------+------------+--------------------------------------+
1 rows in set, 1 warning (0.00 sec)
```

2、详细版本：performance_schema

performance_schema 用于监控和分析数据库服务器的性能

```sql
--查看performance_schema的属性
mysql> SHOW VARIABLES LIKE 'performance_schema';
+--------------------+-------+
| Variable_name      | Value |
+--------------------+-------+
| performance_schema | ON    |
+--------------------+-------+
1 row in set (0.01 sec)

--在配置文件中修改performance_schema的属性值，on表示开启，off表示关闭
[mysqld]
performance_schema=ON

--切换数据库
mysql> use performance_schema;

--查看当前数据库下的所有表,会看到有很多表存储着相关的信息
mysql> show tables;

```

默认情况下，performance_schema是启用的。如果需要禁用，可以在启动MySQL服务器时使用`--skip-perf-schema` 选项。


3、查看SQL运行列表


```sql
mysql> show processlist;
```

请注意，频繁地运行 SHOW PROCESSLIST 尤其是在高负载的系统中，可能会对性能产生一定影响，因为它需要遍历当前所有活动线程的信息。谨慎使用。

### 开启慢查询日志

1、查看是否开启慢查询日志？

```sql
-- 默认关闭 OFF
mysql> show variables like '%slow_query_log%';
+---------------------+----------------------------------------------------+
| Variable_name       | Value                                              |
+---------------------+----------------------------------------------------+
| slow_query_log      | OFF                                                |
| slow_query_log_file | /usr/local/mysql/mysql-8.0/data/localhost-slow.log |
+---------------------+----------------------------------------------------+
2 rows in set (0.00 sec)
```


2、如何开启慢查询日志？

注意：不同版本，这些配置稍有差异。出现设置错误时，可查官网获得正确的规则。这里

```sql
-- 持久性，通过配置文件设置
[mysqld]
log_output=FILE,TABLE
slow_query_log=ON
long_query_time=0.001
slow_query_log_file = /usr/local/mysql/mysql-8.0/logs/slow_query.log

#一次性的，通过命令设置, long_query_time 是时间阈值。为方便测试，此处认为超过0.001s的就属于慢查询
mysql> SET GLOBAL log_output = 'FILE,TABLE';
mysql> set GLOBAL slow_query_log=ON;
mysql> SET GLOBAL long_query_time = 0.001;
mysql> SET GLOBAL slow_query_log_file = '/usr/local/mysql/mysql-8.0/logs/slow_query.log';

```

3、如何分析慢查询日志？

3.1 查MySQL自带的数据库表进行分析

```
mysql> SELECT * from mysql.slow_log ;
```

3.2 慢查询日志文件分析

```sql
-- 查看慢日志位置
mysql> SHOW VARIABLES LIKE '%slow_query_log_file%';
+---------------------+------------------------------------------------+
| Variable_name       | Value                                          |
+---------------------+------------------------------------------------+
| slow_query_log_file | /usr/local/mysql/mysql-8.0/logs/slow_query.log |
+---------------------+------------------------------------------------+
1 row in set (0.00 sec)

-- 使用./mysqldumpslow 查看慢SQL日志
$ ./mysqldumpslow /usr/local/mysql/mysql-8.0/logs/slow_query.log

```

慢日志结果：

```
Count: 1  Time=0.00s (0s)  Lock=0.00s (0s)  Rows=10.0 (10), root[root]@localhost
  select * from data.t_orders_bigdata limit N

```

可以查看具体的慢SQL列表和耗时等信息。

### 小结

综上，我们知道如何定位慢SQL。接下来通过各种实践案例尝试优化SQL性能。

## SQL调优实战

### explain + sql 执行计划

EXPLAIN 是一个用于获取 SQL 语句执行计划的命令，用于帮助理解查询的执行过程以及如何优化。这里主要是索引优化 ，关于索引原理暂不做详细介绍。本章主要以实操为主。

基本用法：

```sql
explain select ...
```

参数说明：

- id: 选择查询中执行的顺序，从1开始递增。
- select_type: 查询类型，如 SIMPLE、PRIMARY、SUBQUERY 等。
- table: 涉及的表名。
- partitions: 表分区信息。
- type: 连接类型，如 ALL、index、range、ref、eq 等。
- possible_keys: 可能用于查找的索引。
- key: 实际使用的索引。
- key_len: 使用的索引的长度。
- ref: 与索引比较的列或常量。
- rows: 估计需要检查的行数。
- filtered: 根据 WHERE 子句过滤后剩余的行的比例。
- Extra: 额外的信息，如是否使用临时表、是否排序等。

性能分析:

```
-- type 级别
system > const > eq_ref > ref > range > index > ALL
```

- system: 表仅有一行，如 PRIMARY KEY 或 UNIQUE INDEX 约束下的唯一索引。
- const: 针对主键或唯一索引的查找，通常因为条件完全匹配索引列。
- eq_ref: 对于非唯一索引，当查找条件涉及多表的连接，并且使用主键或唯一索引列进行等值匹配。
- ref: 使用非唯一索引进行查找，适用于非主键或唯一索引的列。
- range: 索引范围扫描，适用于 BETWEEN, IN, WHERE 子句中的范围查询。
- index: 索引全表扫描，比全表扫描 (ALL) 快，因为索引通常更紧凑。
- ALL 全表扫描

> 备注：一般要求至少达到range 级别，最好达到ref

有了上述了解，我们进行案例实操。。。

### 案例实操

1、select * 查询不需要的列

例如：查看特定客户编号的所有订单详情，但只关心订单编号和金额。

如果查询所有字段，


```sql
mysql> select * from t_orders t where t.customer_num = 'CUST202401';
1 row in set (0.03 sec)
```

由于其它字段会带来额外的开销，尤其是使用二级索引，

使用`select *` 的方式会导致`回表`，导致性能低下。因此应当只获取需要的字段。

```sql
mysql> SELECT order_id, amount from t_orders t where t.customer_num = 'CUST202401';
1 row in set (0.00 sec)
```

因此，一些DBA是严格禁止`SELECT *` 的写法的。

2、limit a,b 分页优化

例如，查询返回 t_orders_bigdata 表中的第 100001~100010 行数据。


```sql
mysql> SELECT * FROM t_orders_bigdata LIMIT 1000000, 10;
10 rows in set (3.22 sec)
```

MySQL会查询出全部的结果集，客户端的应用程序会接收全部的结果集数据，然后抛弃其中大部分数据。在某些情况下，如果数据页不是顺序存储的，这可能会导致全表扫描。

优化后

```sql
mysql> SELECT * from t_orders_bigdata t ORDER BY id LIMIT 1000000, 10;
10 rows in set (0.65 sec)
```

如果 id 是索引列（主键通常是索引），MySQL 可以使用索引来快速定位到第 100001 行数据，而不需要扫描前面所有的行。


3、索引列上操作（使用函数、计算等）导致索引失效


例如，为了获取 2024 年的所有订单数据，可能会执行以下 SQL 查询：

```sql
SELECT * FROM t_orders WHERE YEAR(create_time) = 2024;
```

我们看到在 create_time 字段上有索引，

```sql
mysql> show index from t_orders;
+----------+------------+-------------------------------+--------------+--------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table    | Non_unique | Key_name                      | Seq_in_index | Column_name  | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+----------+------------+-------------------------------+--------------+--------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| t_orders |          0 | PRIMARY                       |            1 | id           | A         |          10 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| t_orders |          1 | idx_custnum_status_createtime |            1 | customer_num | A         |          10 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| t_orders |          1 | idx_custnum_status_createtime |            2 | status       | A         |          10 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| t_orders |          1 | idx_custnum_status_createtime |            3 | create_time  | A         |          10 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| t_orders |          1 | idx_order_id                  |            1 | order_id     | A         |          10 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+----------+------------+-------------------------------+--------------+--------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
5 rows in set (0.17 sec)
```

查看执行计划

```sql

-- type = ALL，显然是全表扫描，查询未走索引。
mysql> explain SELECT * FROM t_orders WHERE YEAR(create_time) = 2024;
+----+-------------+----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table    | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | t_orders | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 164571 |   100.00 | Using where |
+----+-------------+----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

```

优化：

```sql
-- 1、使用索引列的日期范围，type= range ,走索引
mysql> explain SELECT * FROM t_orders WHERE create_time >= '2024-01-01 00:00:00' AND create_time < '2025-01-01 00:00:00';
+----+-------------+----------+------------+-------+-----------------+-----------------+---------+------+------+----------+-----------------------+
| id | select_type | table    | partitions | type  | possible_keys   | key             | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+----------+------------+-------+-----------------+-----------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | t_orders | NULL       | range | idx_create_time | idx_create_time | 5       | NULL |   10 |   100.00 | Using index condition |
+----+-------------+----------+------------+-------+-----------------+-----------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)
```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```





```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```





```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```


```sql

```

```sql

```

```sql

```

```sql

```

参考文章 

1. [SQL优化实战](https://mp.weixin.qq.com/s/09KxTjOtQZNWtVQMwIWPSQ)
