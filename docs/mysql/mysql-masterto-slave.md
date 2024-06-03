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

Sharding-JDBC

实现数据库读写分离

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.2</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>sharding-jdbc-spring-boot-starter</artifactId>
    <version>4.0.0</version>
</dependency>
```

配置 application.yml

```yml
server:
  port: 8080

spring:
  application:
    #应用的名称，可选
    name: reggie_take_out

#  datasource:
#    druid:
#      driver-class-name: com.mysql.cj.jdbc.Driver
#      url: jdbc:mysql://localhost:3306/reggie?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&useSSL=false&allowPublicKeyRetrieval=true
#      username: root
#      password: 123456
  shardingsphere:
    sharding:
      default-data-source-name: master
    props:
      sql:
        # 开启sql显示，默认false
        show: true
    datasource:
      names: master,slave
      # 主库
      master:
#        type: com.alibaba.druid.pool.DruiDataSource
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://localhost:3306/reggie?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&useSSL=false&allowPublicKeyRetrieval=true
        username: root
        password: 123456
      # 从库
      slave:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://localhost:3306/reggie?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&useSSL=false&allowPublicKeyRetrieval=true
        username: root
        password: 123456

    # 读写分离配置
    masterslave:
      # 从库负载均衡策略：轮询
      load-balance-algorithm-type: round_robin
      # 最终的数据源名称
      name: dataSource
      # 主库数据源名称
      master-data-source-name: master
      # 从库数据源名称，多个逗号分隔
      slave-data-source-names: slave

  # redis相关配置
  redis:
    host: "localhost"
    port: 6379
    # password: "123456"
    # 操作0号数据库
    database: 0

  cache:
    redis:
      # 缓存过期时间30min
      time-to-live: 1800000
  main:
    allow-bean-definition-overriding: true

mybatis-plus:
  configuration:
    #在映射实体或者属性时，将数据库中表名和字段名中的下划线去掉，按照驼峰命名法映射
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: ASSIGN_ID
```


## 3、项目实现读写分离


