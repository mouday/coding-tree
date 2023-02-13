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

## Nginx配置文件结构

nginx.conf

```bash
全局块                  # Nginx运行配置
events块               # 网络连接相关配置
http块                 # 代理、缓存、日志记录、虚拟主机配置
    http全局块
    server块(多个)
        server全局块
        location块(多个)
```

## Nginx具体应用

- 部署静态资源
- 反向代理
- 负载均衡

### 部署静态资源

静态资源：css、js、html、图片、视频

```bash
ps -ef |grep nginx
```

示例

```bash
server { 
    listen 80;               # 监听端口
    server_name localhost;   # 服务名称
    location / {             # 匹配客户端请求url
        root html;           # 指定静态资源根目录
        index index.html     # 指定默认首页
    }
}
```

### 反向代理

正向代理 

```
客户端 -> 【客户端】代理服务器 -> 服务端（www.google.com）
```

反向代理

```
客户端 -> 【服务端】代理服务器 -> 服务端
```

示例：配置反向代理

```bash
server {
    listen 82;
    server_name localhost;

    location / {
        # 配置反向代理，将请求转发到指定服务器
        proxy_pass http://192.168.0.101:8080
    }
}
```

### 负载均衡

- 应用集群：将同一个应用部署到多台机器上，组成应用集群
- 负载均衡器：将用户请求根据对应的负载均衡算法分发到应用集群中的一台服务器进行处理

```
                   -> web服务器1 
客户端 -> 负载均衡器  -> web服务器2
                   -> web服务器3
```

配置负载均衡

```bash
# 定义一组服务器，默认使用轮询算法
upstream targetserver {
    server 192.168.0.101:8080;
    server 192.168.0.102:8080;
}

server {
    listen 8080;
    server_name localhost;
    location / {
        proxy_pass http://targetserver
    }
}
```

负载均衡策略

| 策略名称 | 说明 |
| - | -  |
| 轮询 | 默认方式 |
| weight | 权重方式 |
| ip_hash | 依据ip分配方式 |
| least_conn | 依据最少连接方式 |
| url_hash | 依据url分配方式 |
| fair | 依据响应时间方式 |


示例：依据权重分发

```bash
# 权重越大，分发的机会越高
upstream targetserver {
    server 192.168.0.101:8080 weight=10;
    server 192.168.0.102:8080 weight=5;
}
```
