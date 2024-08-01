# 安装Nginx

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
```

```bash
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

一键安装

```bash
yum install -y gcc gcc-c++ zlib zlib-devel openssl openssl-devel pcre pcre-devel \
&& wget http://nginx.org/download/nginx-1.22.1.tar.gz \
&& tar -zxvf nginx-1.22.1.tar.gz \
&& cd nginx-1.22.1 \
&& ./configure --prefix=/usr/local/nginx/v1.22.1 \
--with-http_stub_status_module \
--with-http_ssl_module \
--with-http_gzip_static_module \
--with-pcre \
--with-http_realip_module \
--with-http_sub_module \
&& make && make install \
&& /usr/local/nginx/v1.22.1/sbin/nginx -v
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

## 开机自启

vi /etc/systemd/system/nginx.service

```bash
# /etc/systemd/system/nginx.service
[Unit]
Description=nginx
After=network.target
 
[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true
 
[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable nginx

systemctl is-enabled nginx

systemctl start nginx
```

## 常用配置示例

### default_server
```bash
server {
    listen 80 default_server;
    listen 443 ssl default_server;

    ssl_certificate cert.pem;
    ssl_certificate_key cert.key;

    server_name _;
    # 403 forbidden
    return 403;
}

```

```bash
server {
    listen       80;
    listen 443 ssl;
    ssl_certificate_key /usr/local/nginx/conf/ssl/domain.cn.key;
    ssl_certificate /usr/local/nginx/conf/ssl/domain.cn.pem;

    server_name  www.domain.cn;
    return       301 https://domain.com$request_uri;
}

server
{
    listen 80;
    listen 443 ssl;
    server_name domain.cn;

    ssl_certificate_key /usr/local/nginx/conf/ssl/domain.cn.key;
    ssl_certificate /usr/local/nginx/conf/ssl/domain.cn.pem;

    if ($ssl_protocol = "") { return 301 https://$host$request_uri; }

    location / {
     root /data/wwwroot/domain-www;
     index  index.html index.htm;
    }
    

    location /admin {
      try_files $uri $uri/ /index.html;
    }

 location /api/ {
  add_header Access-Control-Allow-Origin '*';
  add_header Access-Control-Max-Age 86400;
  add_header Access-Control-Allow-Credentials "true";
  add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
  add_header Access-Control-Allow-Headers  'X-Token,Content-Type,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,XRequested-With';

  if ($request_method = 'OPTIONS') {
     return 204;
  }

    proxy_pass http://localhost:8080/api/;
    proxy_set_header Host $host:$server_port;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location ~ .*\.(html)$ {
   add_header Cache-Control no-cache;
   add_header Pragma no-cache;
  }

   location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico)$ {
    expires 30d;
    access_log off;
  }

  location ~ .*\.(js|css)?$ {
    expires 7d;
    access_log off;
  }

  location ~ /\.ht {
    deny all;
  }

  location /.well-known/acme-challenge/ {
      alias /var/www/challenges/;
      try_files $uri = 404;
  }
}
```
