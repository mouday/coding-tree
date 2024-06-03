# Redis下载与安装

## 下载安装

下载地址

- Windows: [https://github.com/microsoftarchive/redis/releases](https://github.com/microsoftarchive/redis/releases)
- Linux：[https://download.redis.io/releases/](https://download.redis.io/releases/)


下载安装

```bash
# 下载
wget https://download.redis.io/releases/redis-4.0.0.tar.gz

# 解压
tar -zxvf redis-4.0.0.tar.gz -C /usr/local
cd redis-4.0.0

# 安装依赖gcc
yum install -y gcc-c++

# 编译安装
make
```

启动服务

```bash
# src目录出现编译结果
cd src

# 启动服务，默认端口6379
redis-server

# 客户端连接
redis-cli
```

## 开机自启

新建文件 redis.service

```bash
# redis.service

[Unit]
Description=Redis Server Manager
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/redis-4.0.0/src/redis-server /usr/local/redis-4.0.0/redis.conf
ExecReload=/bin/kill -USR2 $MAINPID
ExecStop=/bin/kill -SIGINT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

```bash
cp redis.service /usr/lib/systemd/system/redis.service
```

修改配置 redis.conf

```bash
# 技巧：输入 [/关键字] 进行搜索
# 改为后台运行
# daemonize no
daemonize yes

# 修改密码，默认不需要密码
# requirepass foobared
requirepass 123456

# 打开远程连接
bind 127.0.0.1
# bind 127.0.0.1
```

systemctl 管理redis进程

```bash
# 开机自启
systemctl enable redis
systemctl is-enabled redis

# 管理redis服务
systemctl status redis
systemctl start redis
systemctl stop redis
systemctl restart redis
```

配置环境变量

```bash
# 编辑配置文件
$ vim /etc/profile.d/env.sh

# redis
export REDIS_HOME=/usr/local/redis-4.0.0
export PATH=$REDIS_HOME/src:$PATH

# 执行生效
$ source /etc/profile.d/env.sh
```

## 连接redis服务

```bash
$ redis-cli

127.0.0.1:6379> ping
PONG

# 退出
127.0.0.1:6379> exit
```

参数说明

```bash
-h <hostname>      Server hostname (default: 127.0.0.1).
-p <port>          Server port (default: 6379).
-a <password>      Password to use when connecting to the server.
```

先登录后认证

```bash
# 指定主机地址和端口号，此时已设置需要密码
$ redis-cli -h localhost -p 6379
localhost:6379> keys *
(error) NOAUTH Authentication required.

# 输入密码认证
localhost:6379> auth 123456
OK
localhost:6379> keys *
(empty list or set)
```

登录同时认证

```bash
$ redis-cli -h localhost -p 6379 -a 123456

localhost:6379> keys *
(empty list or set)
```

> 参考 [https://blog.csdn.net/jwx90312/article/details/104225549](https://blog.csdn.net/jwx90312/article/details/104225549)
