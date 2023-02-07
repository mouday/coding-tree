# MySQL读写分离

1. MySQL主从复制
2. 读写分离案例
3. 项目实现读写分离

- 写操作(insert update delete) Master主库
- 读操作(select) Slave从库


## 1、MySQL主从复制

### 1.1、介绍

MySQL主从复制过程

1. master将改变记录到二进制日志（binary log）
2. slave将master的binary log 拷贝到它的中继日志（relay log）
3. slave重做中继日志中的事件，将改变应用到自己的数据库中

### 1.2、配置

一、配置Master

1、修改配置

/etc/my.cnf

```bash
[mysqld]
# 启动二进制日志
log-bin=mysql-bin
# 服务器唯一id
server-id=100
```

2、重启MySQL服务

```bash
systemctl restart mysqld
```

3、创建slave用户

```sql
-- 授权，用于复制binlog
GRANT REPLICATION SLAVE ON *.* TO 'slave01'@'%' IDENTIFIED BY 'Slave@123456';
```

4、查看主库状态
```
show master status \G
```

二、配置从库

1、修改配置

/etc/my.cnf

```bash
[mysqld]
# 服务器唯一id
server-id=101
```

2、重启MySQL服务

```bash
systemctl restart mysqld
```

3、执行命令

```sql
change master to
master_host='192.168.0.1', master_user='slave01', master_password='Slave@123456', master_log_file='mysql-bin.000001', master_log_pos=439;

start slave;
```

4、查看从库状态
```sql
show slave status;
```

### 1.3、测试

## 2、读写分离案例
## 3、项目实现读写分离


