# Zookeeper安装

## 1.1 下载安装

下载地址：https://zookeeper.apache.org/releases.html

归档地址：https://archive.apache.org/dist/zookeeper/

**1、环境准备**

ZooKeeper服务器是用Java创建的，它运行在JVM之上。需要安装JDK 7或更高版本。

**2、下载**

将下载的ZooKeeper放到/opt/ZooKeeper目录下

```shell
# 打开 opt目录
cd /opt

# 下载
wget https://archive.apache.org/dist/zookeeper/zookeeper-3.5.6/apache-zookeeper-3.5.6-bin.tar.gz

#创建zooKeeper目录
mkdir zooKeeper

#将zookeeper安装包移动到 /opt/zooKeeper
mv apache-zookeeper-3.5.6-bin.tar.gz /opt/zookeeper/
```

**3、解压**

将tar包解压到/opt/zookeeper目录下

```shell
tar -zxvf apache-ZooKeeper-3.5.6-bin.tar.gz 
```

## 1.2 配置启动

**1、配置zoo.cfg**

进入到conf目录拷贝一个zoo_sample.cfg并完成配置

```shell
#进入到conf目录
cd /opt/zooKeeper/apache-zooKeeper-3.5.6-bin/conf/
#拷贝
cp  zoo_sample.cfg  zoo.cfg
```



修改zoo.cfg

```shell
#打开目录
cd /opt/zooKeeper/
#创建zooKeeper存储目录
mkdir  zkdata
#修改zoo.cfg
vim /opt/zooKeeper/apache-zooKeeper-3.5.6-bin/conf/zoo.cfg
```

修改存储目录

```bash
# dataDir=/tmp/zookeeper
dataDir=/opt/zookeeper/zkdata
```

**2、启动ZooKeeper**

```shell
cd /opt/zooKeeper/apache-zooKeeper-3.5.6-bin/bin/
#启动
 ./zkServer.sh  start
```

输出

```bash
ZooKeeper JMX enabled by default
Using config: /opt/zooKeeper/apache-zooKeeper-3.5.6-bin/conf/zoo.cfg
Starting zookeeper ... STARTED
```

看到上图表示ZooKeeper成功启动

**3、查看ZooKeeper状态**

```shell
./zkServer.sh status
```

zookeeper启动成功。standalone代表zk没有搭建集群，现在是单节点

```
ZooKeeper JMX enabled by default
Using config: /opt/zooKeeper/apache-zooKeeper-3.5.6-bin/conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: standalone
```


**4、停止ZooKeeper**

zookeeper没有启动

```bash
# 停止
$ ./zkServer.sh stop

ZooKeeper JMX enabled by default
Using config: /opt/zooKeeper/apache-zooKeeper-3.5.6-bin/conf/zoo.cfg
Stopping zookeeper ... STOPPED

# 查看停止状态
$ ./zkServer.sh status

ZooKeeper JMX enabled by default
Using config: /opt/zooKeeper/apache-zooKeeper-3.5.6-bin/conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Error contacting service. It is probably not running.
```
