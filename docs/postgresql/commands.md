# PostgreSQL命令

initdb 创建数据库目录

例如：

```shell
initdb -D /data
```

createuser 创建用户

```shell
# 等价SQL: create user pguser;
createuser pguser
```

dropuser 删除用户

```shell
# 等价SQL: drop user pguser;
dropuser pguser
```

createdb 创建数据库

```shell
# 等价SQL: create database db_test;
createdb db_test
```

dropdb 删除数据库

```shell
# 等价SQL: drop database db_test;
dropdb db_test
```

pg_dump 备份数据库

```shell
pg_dump db_test > db_test.sql

# 备份为tar压缩包
pg_dump db_test -F tar -f db_test.tar
```

pg_dumpall 备份全部数据库

```shell
pg_dumpall -f data.sql
```

pg_restore 恢复数据

```shell
pg_restore -d db_test1 db_test.tar
```

vacuumdb 清理数据库

```shell
vacuumdb -d db_test1
```

pg_ctl 启动、停止、重启数据库

```shell
pg_ctl start -D /data

pg_ctl stop -D /data

pg_ctl restart -D /data
```

postgres 单用户模式数据库服务

postmaster 多用户模式数据库服务

psql 客户端

```shell
psql db_test
```

| 元命令 | 功能说明
| - | -
| \? | 查看所有元命令
| \o | 将查询结果保存到文件
| \l | 查看所有数据库
| \q | 退出
| \c | 连接数据库
| \d | 显示数据库对象模式
| \dt | 列出所有表
| \di | 列出所有索引
| \i | 执行文件中的命令



