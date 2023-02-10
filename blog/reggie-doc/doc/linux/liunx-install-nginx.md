# Nginx

- Nginx概述
- Nginx命令
- Nginx配置文件
- Nginx具体应用

## Nginx概述

轻量级的Web服务器

官网：http://nginx.org

下载安装

```bash
# 启动docker容器
docker run \
--privileged \
-itd \
--name nginx \
-p 8080:80 \
-v /sys/fs/cgroup:/sys/fs/cgroup:ro \
centos:centos7 /usr/sbin/init

$ docker exec -it nginx /bin/bash

# 安装依赖
yum install -y gcc gcc-c++ zlib zlib-devel openssl openssl-devel pcre pcre-devel

# 下载稳定版 Stable version
wget http://nginx.org/download/nginx-1.22.1.tar.gz

# 解压
tar -zxvf nginx-1.22.1.tar.gz

cd nginx-1.22.1

# 安装，指定安装目录
./configure --prefix=/opt/nginx-1.22.1 \
--with-http_stub_status_module \
--with-http_ssl_module \
--with-http_gzip_static_module \
--with-pcre \
--with-http_realip_module \
--with-http_sub_module

make && make install
```

目录结构

```bash
# yum install -y tree
$ tree
.
|-- conf
|   |-- nginx.conf   # 配置文件
|-- html             # 静态文件目录（html、css、js）
|-- logs             # 日志目录
|-- sbin
    |-- nginx        # 二进制文件，启动、停止Nginx服务
```

## Nginx命令

进入 nginx/sbin目录

```bash
# 查看版本
$ nginx -v
nginx version: nginx/1.22.1

# 检查配置文件正确性
nginx -t

# 启动
nginx

ps -ef | grep nginx

# 关闭防火墙
systemctl stop firewalld

# 停止
nginx -s stop

# 重新加载配置文件
nginx -s reload
```

## Nginx配置文件
## Nginx具体应用