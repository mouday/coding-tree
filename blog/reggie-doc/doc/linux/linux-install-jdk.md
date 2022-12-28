# 2、安装jdk

使用二进制发布包安装方式安装jdk

下载(需要登录)

https://www.oracle.com/java/technologies/downloads/#java8-linux

```bash
# 上传到Linux，这里使用的docker环境
docker cp jdk-8u351-linux-x64.tar.gz centos:/usr/local

# 解压
tar -zxvf jdk-8u351-linux-x64.tar.gz -C /usr/local
```

配置环境变量

```bash
yum install -y vim

vim /etc/profile

# jdk
JAVA_HOME=/usr/local/jdk1.8.0_351
PATH=$JAVA_HOME/bin:$PATH
```

检查环境变量

```bash
# 使配置文件生效
$ source /etc/profile

# 检查安装是否成功
$ java -version
java version "1.8.0_351"
Java(TM) SE Runtime Environment (build 1.8.0_351-b10)
Java HotSpot(TM) 64-Bit Server VM (build 25.351-b10, mixed mode)
```
