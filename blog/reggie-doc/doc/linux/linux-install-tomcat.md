# 3、安装tomcat

开源地址：[https://github.com/apache/tomcat](https://github.com/apache/tomcat)

## 下载

下载地址

- [https://tomcat.apache.org/](https://tomcat.apache.org/)
- [阿里云镜像站](https://mirrors.aliyun.com/apache/tomcat/)
- [中国互联网络信息中心](https://mirrors.cnnic.cn/apache/tomcat/)
- [清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/apache/tomcat/)


```bash
yum -y install wget

wget https://mirrors.aliyun.com/apache/tomcat/tomcat-8/v8.5.84/bin/apache-tomcat-8.5.84.tar.gz
```

## 解压

```bash
tar -zxvf apache-tomcat-8.5.84.tar.gz -C /usr/local/
cd /usr/local/
```

## 启动tomcat

```bash
cd apache-tomcat-8.5.84
bash ./bin/startup.sh
```

验证启动是否成功

方式一：查看启动日志

```bash
more ./logs/catalina.out

# 或者只查看最后几行日志
tail -f ./logs/catalina.out
```

方式二：查看进程

```bash
ps -ef | grep tomcat
```

注意：

- `-ps` 查看当前运行的所有进程的详细信息
- `|` 管道符，前一个命令的输出作为后一个命令的输入

## 停止tomcat

方式一：

```bash
# 切换到 tomcat目录
bash ./bin/shutdown.sh
```

方式二：

```bash
# 获取进程id
ps -ef |grep tomcat

# 结束进程
kill -9 <pid>
```

注意：

- `kill -9`表示强制结束进程

