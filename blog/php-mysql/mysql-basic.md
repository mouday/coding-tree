## SQL简介

结构性查询语言 Structured Query Language

|分类 | 英文 | 作用 | 代表指令
|- | - | - | -
数据查询语言 | DQL Data Query Language | 查数据 | select
数据操作语言 | DML Data Manipulation Language | 写数据 | insert、update、delete
事务处理语言 | TPL Transaction Process Language | 事务安全处理 | trasaction、commit、rollback
数据控制语言 | DCL | 权限管理 | grant、revoke
数据定义语言 | DDL | 结构管理 | create、drop、alter

## MySQL简介

关系型数据库管理系统 RDBMS Relational Database Management System

## MySQL服务端启动和停止

MySQL是C/S结构

1、服务端 mysqld

1. 命令行方式cmd

```bash
# 启动
net start mysql

# 停止
net stop mysql
```

2. 系统服务方式

```
services.msc
```

2、客户端 mysql

1. 登录

```bash
mysql -h127.0.0.1 \
-P3306 \
-uroot \
-p123456

# 简写，使用默认值
$ mysql -uroot -p
$ 123456
```

参数

```
-h host 服务器地址
-P port 服务器端口
-u username 用户名
-p password 密码
```

密码可以不写，单独输入

2. 退出

```
exit;
\q
quit;
```

## MySQL服务端架构

1. 数据库管理系统 DBMS 管理服务端所有内容
2. 数据库 DB 数据仓库
3. 数据表 Table 存储数据实体
4. 字段 Field 实际存储单元

数据库中常用的关键字

- row 行
- column 列field
