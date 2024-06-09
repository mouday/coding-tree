# Zookeeper Docker

## Docker启动单节点

准备工作

```bash
# 拉取镜像
docker pull zookeeper

# 查看当前镜像
docker images

# 查看容器启动情况
docker ps -a

# 创建data目录，用于挂载容器中的数据目录：
mkdir data
```

启动zookeeper

```bash
# 部署命令
docker run -d \
-e TZ="Asia/Shanghai" \
-p 2181:2181 \
-v $PWD/data:/data \
--name zookeeper \
--restart always \
zookeeper
```

命令详细说明

```bash
-e TZ="Asia/Shanghai" # 指定上海时区 
-d # 表示在一直在后台运行容器
-p 2181:2181 # 对端口进行映射，将本地2181端口映射到容器内部的2181端口
--name # 设置创建的容器名称
-v # 将本地目录(文件)挂载到容器指定目录；
--restart always #始终重新启动zookeeper
```

使用zk命令行客户端连接zk
```bash
docker run -it --rm --link zookeeper:zookeeper zookeeper zkCli.sh -server zookeeper
```

其它命令

```bash
# 查看zookeeper容器实例进程信息
docker top zookeeper

# 停止zookeeper实例进程
docker stop zookeeper

# 启动zookeeper实例进程
docker start zookeeper

# 重启zookeeper实例进程
docker restart zookeeper

# 查看zookeeper进程日志
docker logs -f zookeeper

# 杀死zookeeper实例进程
docker kill -s KILL zookeeper

# 移除zookeeper实例
docker rm -f -v zookeeper  
```

## Docker启动集群

集群方式选择使用docker-compose来完成。

配置文件 docker-compose.yml

```yaml
version: '2'
services:
    zoo1:
        image: zookeeper
        restart: always
        container_name: zoo1
        ports:
            - "2181:2181"
        environment:
            ZOO_MY_ID: 1
            ZOO_SERVERS: server.1=zoo1:2888:3888;2181 server.2=zoo2:2888:3888;2181 server.3=zoo3:2888:3888;2181

    zoo2:
        image: zookeeper
        restart: always
        container_name: zoo2
        ports:
            - "2182:2181"
        environment:
            ZOO_MY_ID: 2
            ZOO_SERVERS: server.1=zoo1:2888:3888;2181 server.2=zoo2:2888:3888;2181 server.3=zoo3:2888:3888;2181

    zoo3:
        image: zookeeper
        restart: always
        container_name: zoo3
        ports:
            - "2183:2181"
        environment:
            ZOO_MY_ID: 3
            ZOO_SERVERS: server.1=zoo1:2888:3888;2181 server.2=zoo2:2888:3888;2181 server.3=zoo3:2888:3888;2181
```

此配置文件表示，Docker需要启动三个zookeeper实例，并将2181，2182，2183三个端口号映射到容器内的2181这个端口上。

- ZOO_MY_ID：表示zk服务的ID, 取值为1-255之间的整数，且必须唯一
- ZOO_SERVERS：表示zk集群的主机列表

启动zookeeper集群

```bash
docker-compose up -d
```

查看zookeeper集群实例

```bash
docker ps

# 或者

docker-compose ps 
```

其他命令

```bash
# 停止docker-compose服务
docker-compose stop

# 启动docker-compose服务
docker-compose start

# 重启docker-compose服务
docker-compose restart
```

查看zookeeper集群节点主从关系

```bash
$ docker exec -it zoo1 /bin/bash
bash-4.4# ./bin/zkServer.sh status
```

## 问题

1、查看状态出现如下提示

```
Client port not found in the server configs
Client port not found. Looking for secureClientPort in the static config.
Unable to find either secure or unsecure client port in any configs. Terminating
```

解决办法

(1)3.5.*的配置（用分号拼接客户端端口号）
```
server.1=1.15.227.199:2888:3888;2181
```

(2)3.4.*及以前的配置

```
server.1=1.15.227.199:2888:3888:2181
```

参考
- [https://www.cnblogs.com/caoweixiong/p/12325410.html](https://www.cnblogs.com/caoweixiong/p/12325410.html)
- [Zookeeper启动：Client port not found in static config file. Looking in dynamic config file. grep: : 没有那个文件或目录](https://www.cnblogs.com/BigBender/p/15064957.html)