
# 在Linux上安装MySQL

## 1、查看系统版本号

```bash
cat /proc/version
Linux version 3.10.0-1062.18.1.el7.x86_64
(mockbuild@kbuilder.bsys.centos.org) 
(gcc version 4.8.5 20150623 (Red Hat 4.8.5-39) (GCC) ) 
#1 SMP Tue Mar 17 23:49:17 UTC 2020
```

## 2、下载MySQL

MySQL Community Server 下载地址：

[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)


选项
```bash
# 选择红帽企业版
Operating System: Red Hat Enterprise Linux / Oracle Linux

# 系统版本是7，所以选择7版本
OS Version: Red Hat Enterprise Linux 7 / Oracle Linux 7 (x86, 64-bit)
```

下载：RPM Bundle

```bash
wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.29-1.el7.x86_64.rpm-bundle.tar
```

## 3、创建目录并解压

```bash
$ mkdir mysql-8.0.29

$ tar -xvf mysql-8.0.29-1.el7.x86_64.rpm-bundle.tar -C mysql-8.0.29
```

## 4、安装MySQL

```bash
cd mysql-8.0.29

# 查看解压后的内容
$ ls
mysql-community-client-8.0.29-1.el7.x86_64.rpm
mysql-community-client-plugins-8.0.29-1.el7.x86_64.rpm
mysql-community-common-8.0.29-1.el7.x86_64.rpm
mysql-community-debuginfo-8.0.29-1.el7.x86_64.rpm
mysql-community-devel-8.0.29-1.el7.x86_64.rpm
mysql-community-embedded-compat-8.0.29-1.el7.x86_64.rpm
mysql-community-icu-data-files-8.0.29-1.el7.x86_64.rpm
mysql-community-libs-8.0.29-1.el7.x86_64.rpm
mysql-community-libs-compat-8.0.29-1.el7.x86_64.rpm
mysql-community-server-8.0.29-1.el7.x86_64.rpm
mysql-community-server-debug-8.0.29-1.el7.x86_64.rpm
mysql-community-test-8.0.29-1.el7.x86_64.rpm

# 按照顺序进行逐个安装
rpm -ivh mysql-community-common-8.0.29-1.el7.x86_64.rpm

rpm -ivh mysql-community-client-plugins-8.0.29-1.el7.x86_64.rpm

# 依赖检测失败：mariadb-libs 被 mysql-community-libs-8.0.29-1.el7.x86_64 取代
# yum -y remove mariadb-libs
rpm -ivh mysql-community-libs-8.0.29-1.el7.x86_64.rpm

rpm -ivh mysql-community-libs-compat-8.0.29-1.el7.x86_64.rpm

# 依赖检测失败：pkgconfig(openssl) 被 mysql-community-devel-8.0.29-1.el7.x86_64 需要
# yum -y install openssl-devel
rpm -ivh mysql-community-devel-8.0.29-1.el7.x86_64.rpm

rpm -ivh mysql-community-client-8.0.29-1.el7.x86_64.rpm

rpm -ivh mysql-community-icu-data-files-8.0.29-1.el7.x86_64.rpm

# 依赖检测失败：libaio.so.1()(64bit) 被 mysql-community-server-8.0.29-1.el7.x86_64 需要
# yum -y install libaio
rpm -ivh mysql-community-server-8.0.29-1.el7.x86_64.rpm
```

## 5、启动MySQL服务

```bash
systemctl start mysqld

systemctl restart mysqld

systemctl stop mysqld

systemctl status mysqld
```

## 6、查看默认密码

MySQL会自动生成默认的root密码

```
grep 'temporary password' /var/log/mysqld.log
```

## 7、修改root密码

登录MySQL客户端

Windows终端连接工具：Finalshell

```bash
mysql -u root -p
```

修改root密码
```sql
-- 先设置一个符合要求的随机的密码
SET PASSWORD FOR 'root'@'localhost' TO RANDOM;

-- 查看密码校验参数
show variables like 'validate_password%';
+--------------------------------------+--------+
| Variable_name                        | Value  |
+--------------------------------------+--------+
| validate_password.check_user_name    | ON     |
| validate_password.dictionary_file    |        |
| validate_password.length             | 8      |
| validate_password.mixed_case_count   | 1      |
| validate_password.number_count       | 1      |
| validate_password.policy             | MEDIUM |
| validate_password.special_char_count | 1      |
+--------------------------------------+--------+
7 rows in set (0.01 sec)

-- 修改密码复杂度限制参数
set global validate_password.policy = 0;
set global validate_password.length = 6;

-- 修改密码
alter user 'root'@'localhost' identified by '123456';

-- 退出
exit
```

再次使用自定义密码登录

## 8、创建用户

默认只能在localhost访问，使用`%`可以所有主机远程访问

```sql
create user 'root'@'%' identified with mysql_native_password by '123456';

-- 创建用户，并设置随机密码
create user 'user'@'%' IDENTIFIED BY RANDOM PASSWORD;

-- 修改用户密码
ALTER USER 'user'@'%' IDENTIFIED BY RANDOM PASSWORD;


```

## 9、分配权限

```sql
-- 分配所有权限
grant all on *.* to 'root'@'%';
```
