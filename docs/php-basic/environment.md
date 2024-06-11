## 安装PHP

demo.php

```php
<?php

echo "Hello World";

```

解释执行php脚本

```bash
$ php demo.php
Hello World
```

## apache

- httpd 服务器进程
- ab压力测试工具

使用

```bash
# 启动服务
$ httpd

# 查看使用的模块
$ httpd -M

# 检查配置文件
$ httpd -t
```

配置文件 config/httpd.config

```bash
# 网站根路径
DocumentRoot "/www"

# 别名
#ServerName www.example.com:80
ServerName localhost

# 端口
Listen 80
```

Apache 解析PHP代码

```bash
# config/httpd.config

# 加载PHP
LoadModule php5_module 'php5aphache2_2.dll'

# 加载PHP配置文件
PHPIniDir php.ini

# 指定扩展名的解析工作分配给PHP
AddType application/x-httpd-php .php
```

注意: 修改配置文件后需要重启Apache才生效


## 配置本地DNS

修改hosts文件配置本地DNS
```
127.0.0.1       localhost
```

## 安装MySQL

本地测试环境默认账号密码
root 123456

- mysqld 服务
- mysql 客户端
- mysqldump 备份软件客户端


软件设计结构

- C/S Client客户端/Server服务端
- B/S Browser浏览器/Server服务端


连接MySQL服务端

```bash
# 登录
mysql -h主机地址 -P端口(大写) -u用户名 -p密码

eg:
mysql -hlocalhost -P3306 -uroot -p123456

# 退出
\q
```

PHP连接MySQL数据库

PHP加载MySQL扩展 php.ini

# Nginx、PHP-FPM、PHP环境配置

1、Nginx

启动 Nginx

```
$ nginx
```

配置文件 www.mysite.com.conf （注意文件后缀）

```bash
server {
    listen       80;
    server_name  www.mysite.com;

    root /www/www.mysite.com;

    location / {
        index  index.html index.php;
    }

    location ~ \.php$ {
      fastcgi_pass   127.0.0.1:9000;
      fastcgi_index  index.php;
      fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
      include        fastcgi_params;
    }
}

```

2、启动 php-fpm

```
$ php-fpm
$ ps -A | grep php-fpm
$ lsof -i:9000
```

3、修改 hosts

```
# sudo vim /etc/hosts

127.0.0.1       www.mysite.com
```

4、编辑文件 /www/www.phpsite.com/index.php

```php
<?php

echo 'Hello';
```

浏览器访问： http://www.mysite.com/index.php

```php
// 查看PHP环境
phpinfo();
```

时区设置

```bash
[Date]
date.timezone = "Asia/Shanghai"
```
