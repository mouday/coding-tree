# 用户权限管理

在不同的项目中，给不同的角色（开发者）不同的操作权限，保证数据库数据的安全

## 1、用户管理

mysql的用户信息保存在了mysql.user中

```sql
select * from mysql.user\G

*************************** 5. row ***************************
                    Host: localhost
                    User: root
             Select_priv: Y
             Insert_priv: Y
             Update_priv: Y
             Delete_priv: Y
             Create_priv: Y
               Drop_priv: Y
             Reload_priv: Y
           Shutdown_priv: Y
            Process_priv: Y
               File_priv: Y
              Grant_priv: Y
         References_priv: Y
              Index_priv: Y
              Alter_priv: Y
            Show_db_priv: Y
              Super_priv: Y
   Create_tmp_table_priv: Y
        Lock_tables_priv: Y
            Execute_priv: Y
         Repl_slave_priv: Y
        Repl_client_priv: Y
        Create_view_priv: Y
          Show_view_priv: Y
     Create_routine_priv: Y
      Alter_routine_priv: Y
        Create_user_priv: Y
              Event_priv: Y
            Trigger_priv: Y
  Create_tablespace_priv: Y
                ssl_type:
              ssl_cipher:
             x509_issuer:
            x509_subject:
           max_questions: 0
             max_updates: 0
         max_connections: 0
    max_user_connections: 0
                  plugin: mysql_native_password
   authentication_string: *6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9
        password_expired: N
   password_last_changed: 2020-02-05 22:46:27
       password_lifetime: NULL
          account_locked: N
        Create_role_priv: Y
          Drop_role_priv: Y
  Password_reuse_history: NULL
     Password_reuse_time: NULL
Password_require_current: NULL
         User_attributes: NULL
```

主要字段

```
主机名和用户名共同组成复合主键
Host 主机名,允许访问的客户端，*代表所有客户端都可以访问
User 用户名
```

### 1.1、创建用户

方式一：直接使用root用户在mysql.user中插入记录（不推荐）

方式二：使用创建用户的SQL指令


基本语法

```sql

create user 用户 identified by 明文密码

-- 用户 用户名@主机地址
-- 主机地址： '' 或者 %
```

示例
```sql
create user 'user1'@'%' identified by '123456';

-- 查看mysql.user表中是否存在新用户
select user, host from mysql.user where user = 'user1';
+-------+------+
| user  | host |
+-------+------+
| user1 | %    |
+-------+------+
```

简化版创建用户，谁都可以访问，不需要密码，不安全
```sql
create user user2;
```

### 1.2、删除用户

user和host具有唯一性

基本语法
```sql
drop user 用户名@host;
```

示例

```sql
mysql> drop user 'user1'@'%';
Query OK, 0 rows affected (0.01 sec)

mysql> select user, host from mysql.user where user = 'user1';
Empty set (0.00 sec)
```

### 1.3、修改用户密码

需要使用函数对密码进行加密`password()`

方式一：使用专门的修改密码指令

基本语法
```sql
set password for 用户 = password(明文密码);

set password for 'user1'@'%' = password(654321);

-- mysql5.7后续版本，8.0可用
alter user 'user1'@'%' identified by '654321';
```

方式二：使用更新语法

基本语法

```sql
update mysql.user set password = password(明文密码) where user = '' and host = '';

update mysql.user set password = password('123456') where user = 'user1' and host = '%';

-- 8.0报错
update mysql.user set authentication_string = password('123456') where user = 'user1' and host = '%';
```



## 2、权限管理

分为三类：

- 数据权限：增删改查 select update delete insert
- 结构权限：结构操作（表操作） create drop
- 管理权限：权限管理 create user、grant、revoke， 管理员

### 2.1、授予权限 grant

将权限分配给指定用户

基本语法
```sql
grant 权限列表 on 数据库/*.表名/* to 用户
```

- 权限列表 使用逗号间隔，all privileges 代表全部权限
- 所有数据库 `*.*`
- 某个数据库：`数据库.*`
- 单表：`数据库.表名`

```sql
-- 分配权限 不需要刷新，马上生效
grant select on mydatabase.my_student to 'user1'@'%';
```

### 2.2、取消权限 revoke

基本语法

```sql
revoke 权限列表 /all privileges on 数据库/*.表/* from 用户
```

```sql
-- 回收权限，不需要刷新，马上生效
revoke all privileges on mydatabase.my_student from 'user1'@'%';
```

### 2.3、刷新权限 flush
将操作的具体内容同步到对应的表中

基本语法
```sql
flush privileges;
```

## 3、密码丢失的解决方案

如果忘记root用户的密码

```bash
# 停止服务
mysql.server stop;

# 停止不了可以直接杀死进程
ps aux|grep mysql
kill <pid>

# 重新启动服务,跳过权限
mysqld --skip-grant-tables

# 直接无用户名登录
mysql
```

非常危险，任何客户端不需要任何用户信息都可以直接登录，而且是root权限

修改root密码
```sql
alter user 'root'@'localhost' identified by '123456'; 
```

修改完后，关闭mysql服务器，重启
