# 4、安装mysql

## 4.1、通过RPM安装mysql

rpm Red-Hat package manager 管理和安装软件的工具

```bash
# 查询当前系统中安装的所有软件
rpm -qa 

# 按照名称查询安装的软件
rpm -qa | grep mysql
rpm -qa | grep mariadb

# 卸载软件
# rpm -e --nodeps [软件名称]
rpm -e --nodeps mariadb
```

说明：如果centos自带了mariadb，需要卸载之后再安装mysql

下载  MySQL Community Server

- 官网 [https://downloads.mysql.com/archives/community/](https://downloads.mysql.com/archives/community/)
- 阿里云镜像 [https://mirrors.aliyun.com/mysql/](https://mirrors.aliyun.com/mysql/)

查看系统版本

```bash
# 红帽 7版本
$ cat /etc/redhat-release
CentOS Linux release 7.9.2009 (Core)
```

选项：

```
Product Version: 8.0.30
Operating System: Red Hat Enterprise Linux / Oracle Linux
OS Version: Red Hat Enterprise Linux 7 / Oracle Linux 7 (x86, 64-bit)
```

下载
```
RPM Bundle (mysql-8.0.30-1.el7.x86_64.rpm-bundle.tar)
```

```bash
# mysql-5.7
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-5.7.39-1.el7.x86_64.rpm-bundle.tar

# 拷贝到docker
$ docker cp  mysql-5.7.39-1.el7.x86_64.rpm-bundle.tar centos7.2:/usr/local

# mysql-8.0
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-8.0.30-1.el7.x86_64.rpm-bundle.tar

$ docker cp mysql-8.0.30-1.el7.x86_64.rpm-bundle.tar centos7.3:/usr/local/
```

解压

```bash
mkdir /usr/local/mysql-8.0.30
tar -xvf mysql-8.0.30-1.el7.x86_64.rpm-bundle.tar -C /usr/local/mysql-8.0.30
```

mysql-5.7.39 解压后文件

```bash
mysql-community-client-5.7.39-1.el7.x86_64.rpm
mysql-community-common-5.7.39-1.el7.x86_64.rpm
mysql-community-devel-5.7.39-1.el7.x86_64.rpm
mysql-community-embedded-5.7.39-1.el7.x86_64.rpm
mysql-community-embedded-compat-5.7.39-1.el7.x86_64.rpm
mysql-community-embedded-devel-5.7.39-1.el7.x86_64.rpm
mysql-community-libs-5.7.39-1.el7.x86_64.rpm
mysql-community-libs-compat-5.7.39-1.el7.x86_64.rpm
mysql-community-server-5.7.39-1.el7.x86_64.rpm
mysql-community-test-5.7.39-1.el7.x86_64.rpm
```

mysql-8.0.31 解压后文件

```bash
mysql-community-client-8.0.31-1.el8.x86_64.rpm
mysql-community-client-debuginfo-8.0.31-1.el8.x86_64.rpm
mysql-community-client-plugins-8.0.31-1.el8.x86_64.rpm
mysql-community-client-plugins-debuginfo-8.0.31-1.el8.x86_64.rpm
mysql-community-common-8.0.31-1.el8.x86_64.rpm
mysql-community-debuginfo-8.0.31-1.el8.x86_64.rpm
mysql-community-debugsource-8.0.31-1.el8.x86_64.rpm
mysql-community-devel-8.0.31-1.el8.x86_64.rpm
mysql-community-icu-data-files-8.0.31-1.el8.x86_64.rpm
mysql-community-libs-8.0.31-1.el8.x86_64.rpm
mysql-community-libs-debuginfo-8.0.31-1.el8.x86_64.rpm
mysql-community-server-8.0.31-1.el8.x86_64.rpm
mysql-community-server-debug-8.0.31-1.el8.x86_64.rpm
mysql-community-server-debug-debuginfo-8.0.31-1.el8.x86_64.rpm
mysql-community-server-debuginfo-8.0.31-1.el8.x86_64.rpm
mysql-community-test-8.0.31-1.el8.x86_64.rpm
mysql-community-test-debuginfo-8.0.31-1.el8.x86_64.rpm
```


### yum自动安装rpm包

文档：[https://dev.mysql.com/doc/refman/5.7/en/linux-installation-rpm.html](https://dev.mysql.com/doc/refman/5.7/en/linux-installation-rpm.html)

```bash
# 5.7安装
yum install -y mysql-community-{server,client,common,libs}-*

# 查看所有文件
rpm -qpl mysql-community-server-5.7.39-1.el7.x86_64.rpm

# 8.0安装
yum install -y mysql-community-{server,client,common,libs,icu-data-files}-*

```

### 手动安装rpm

mysql-5.7安装顺序

```bash
rpm -ivh mysql-community-common-5.7.39-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-5.7.39-1.el7.x86_64.rpm
rpm -ivh mysql-community-devel-5.7.39-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-compat-5.7.39-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-5.7.39-1.el7.x86_64.rpm

# yum install net-tools
rpm -ivh mysql-community-server-5.7.39-1.el7.x86_64.rpm
```


mysql-8.0 安装顺序: 

[在Linux上安装MySQL](/blog/mysq-advance/install)

## 4.2、通过Yum安装mysql

文档

- [https://dev.mysql.com/doc/refman/8.0/en/linux-installation-yum-repo.html](https://dev.mysql.com/doc/refman/8.0/en/linux-installation-yum-repo.html)

MySQL Yum Repository下载地址

[https://dev.mysql.com/downloads/repo/yum/](https://dev.mysql.com/downloads/repo/yum/)

安装步骤

```bash
# 下载MySQL Yum repository 
wget https://dev.mysql.com/get/mysql80-community-release-el7-7.noarch.rpm

# Adding the MySQL Yum Repository
yum install mysql80-community-release-el7-7.noarch.rpm

# 
ls /etc/yum.repos.d/

# check that the MySQL Yum repository
yum repolist enabled | grep "mysql.*-community.*"

# (EL8 systems only) Disabling the Default MySQL Module
yum module disable mysql

# Installing MySQL
yum install mysql-community-server
```

## 4.3、启动MySQL

通过systemctl管理mysql服务

```bash
# 启动
systemctl start mysqld

# 查看状态
systemctl status mysqld

# 关闭
systemctl stop mysqld

# 检查是否开机启动
systemctl is-enabled mysqld

# 开机启动
systemctl enable mysqld
```

## 4.4、重置密码

```bash
# 查看初始密码
grep 'temporary password' /var/log/mysqld.log

# 或者
cat /var/log/mysqld.log | grep 'temporary password'

# 登录
mysql -uroot -p

# 重置密码
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.00 sec)
```

密码要求

- one uppercase letter 一个大写字母
- one lowercase letter 一个小写字母
- one digit 一个数字
- and one special character 一个特殊字符
- and that the total password length is at least 8 characters 总长度至少8个字符

查看mysql进程

```bash
# 查看已启动的服务 net-tools
netstat -tunlp

netstat -tunlp |grep mysql

# 查看进程
ps -ef | grep mysql
```

设置密码和访问权限

```sql
-- 查看密码校验参数
show variables like 'validate_password%';

-- 修改密码复杂度限制参数
set global validate_password_policy = LOW;
set global validate_password_length = 6;

-- 设置root密码
set password = password('123456');

-- 开启访问权限
grant all on *.* to 'root'@'%' identified by '123456';
flush privileges;
```

创建数据库和用户

```sql
-- 创建数据库
create database db_data;

-- 创建用户
create user 'user'@'%' IDENTIFIED BY '123456';

-- 授权访问
grant all on user.* to 'db_data'@'%';
```
