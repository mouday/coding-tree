# 项目部署

- 创建 SpringBoot 项目
- 手工部署项目
- 通过 shell 脚本自动部署项目
- 为用户授权
- supervisor来管理进程

@[TOC](目录)

## 1、创建 SpringBoot 项目

通过 [https://start.spring.io/](https://start.spring.io/) 创建一个 SpringBoot 项目

项目结构

```
$ tree -I target
.
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── example
    │   │           └── demo
    │   │               ├── Application.java
    │   │               └── controller
    │   │                   └── IndexController.java
    │   └── resources
    │       ├── application.properties
    │       ├── static
    │       └── templates
    └── test
        └── java
            └── com
                └── example
                    └── demo
                        └── ApplicationTests.java
```

完整依赖 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.7</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

```

项目启动类 Application.java

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}

```

控制器 IndexController.java

```java
package com.example.demo.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class IndexController {
    @GetMapping("/")
    public String index() {
        log.info("IndexController");
        return "Hello";
    }
}

```

## 2、手工部署项目

```bash
# 打包
$ mvn package

# 上传，此处上传至docker
$ docker cp target/demo-0.0.1-SNAPSHOT.jar centos7:/usr/local

# 运行
java -jar /usr/local/demo-0.0.1-SNAPSHOT.jar
```

查看容器端口号映射

```bash
$ docker port centos7
3306/tcp -> 0.0.0.0:8086
8080/tcp -> 0.0.0.0:8082
```

所以我们通过 8082 端口就可以访问到容器中的 SpringBoot 项目

[http://localhost:8082/](http://localhost:8082/)

如果在 Linux 环境，需要检查防火墙是否开放 8080 端口

```bash
firewall-cmd --zone=public --list-ports
```

## 3、部署优化

- 后台运行
- 日志输出到文件

`nohup` 不挂断运行

英文全称：no hang up

语法

```bash
nohup command [args...] [&]
```

参数说明

- command 要执行的命令
- args 参数
- & 让命令后台运行

举例

```bash
# 后台运行java -jar命令，并将日志输出到文件hello.log
nohup java -jar demo-0.0.1-SNAPSHOT.jar &> hello.log &

# 查看日志
tail -f hello.log
```

停止 SpringBoot 程序

```bash
# 查找进程
ps -ef | grep 'java -jar'

# 结束进程
kill -9 <pid>
```

## 4、通过 shell 脚本自动部署项目

自动部署步骤

1. 在 Linux 中安装 Git
2. 在 Linux 中安装 maven
3. 编写 shell 脚本（拉取代码、编译、打包、启动）
4. 为用户授予执行 shell 脚本的权限
5. 执行 shell 脚本

代码操作过程

```
本地开发环境
    -- push -->
Git仓库
    -- pull -->
Linux服务器
```

### 4.1、在 Linux 安装 Git

通过yum安装git

```bash
# 搜索git
yum list git

# 安装git
yum install -y git
```

克隆代码

```bash
cd /usr/local

git clone https://gitee.com/mouday/helloworld.git
```

### 4.2、在 Linux 安装 Maven

下载地址
[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

安装步骤

```bash
# 1、下载解压
wget https://dlcdn.apache.org/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz

tar -zxvf apache-maven-3.8.6-bin.tar.gz

# 2、添加环境变量
vim /etc/profile.d/env.sh

# maven
export MAVEN_HOME=/usr/local/apache-maven-3.8.6
export PATH=$PATH:$MAVEN_HOME/bin

# 3、执行生效
source /etc/profile.d/env.sh

# 4、查看版本号
mvn -version
Apache Maven 3.8.6 (84538c9988a25aec085021c365c560670ad80f63)
Maven home: /usr/local/apache-maven-3.8.6
Java version: 1.8.0_351, vendor: Oracle Corporation, runtime: /usr/local/jdk1.8.0_351/jre
Default locale: en_US, platform encoding: ANSI_X3.4-1968
OS name: "linux", version: "4.19.76-linuxkit", arch: "amd64", family: "unix"

# 5、修改配置
vim /usr/local/apache-maven-3.8.6/conf/settings.xml

<localRepository>/usr/local/repo</localRepository>
```

### 4.3、为用户授权

chmod 全称：change mode 控制用户对文件权限

- 权限：读 r、写 w、执行 x
- 调用权限：文件所有者(owner)、用户组 group、其他用户 other users
- 只有文件的所有者和超级用户可以修改文件或目录的权限

```bash
- rwx rwx rwx

文件类型 -/d
owner 拥有者
group 同组用户
other users 其他用户
```

rwx分别对应数值421

| 数值 | 权限 | rwx
| - | - | -
| 7 | 读 + 写 + 执行 | rwx
| 6 | 读 + 写  | rw-
| 5 | 读 + 执行  | rw-
| 4 | 只读  | r--
| 3 |  写 + 执行 | -wx
| 2 |  只写 | -w-
| 1 |  只执行 | --x
| 0 |  无 | ---

举例

```bash
# 为用户授予读 + 写 + 执行权限
chmod 777 bootstart.sh

# 为用户授予读 + 写 + 执行权限
# 为用户组授予读 + 执行权限
# 为其他用户授予读 + 执行权限
chmod 755 bootstart.sh

# 为用户授予写权限
# 为用户组授执行权限
# 为其他用户没有任何权限
chmod 210 bootstart.sh
```

### 4.4、执行 shell 脚本

bootstart.sh

```bash
#!/usr/bin/bash

# 项目名
APP_NAME=demo-0.0.1-SNAPSHOT.jar

# 1、停止运行中的项目
tpid=`ps -ef | grep ${APP_NAME} | grep -v grep | grep -v 'kill' | awk '{print $2}'`

if [[ ${tpid} ]]; then
    kill -15 ${tpid}
fi

sleep 2

tpid=`ps -ef | grep ${APP_NAME} | grep -v grep | grep -v 'kill' | awk '{print $2}'`

if [[ ${tpid} ]]; then
    kill -9 ${tpid}
fi

# 2、拉取代码
cd /usr/local/helloworld
git pull

# 3、打包
output=`mvn clean package -Dmaven.test.skip=true`

# 4、启动
nohup java -jar target/${APP_NAME} &> hello.log &

echo "启动/重启完成"
```

## 5、supervisor来管理进程

管理SpringBoot进程的方式

- 通过nohup启动后台进程
- 通过service/systemctl系统服务管理进程
- 通过Python包supervisor管理进程
- 通过Node.js包pm2管理进程

使用shell脚本的方式，不能很好的管理进程，如果进程挂掉也不会自动重启

可以采用 systemctl + supervisor的方式管理进程

- systemctl 管理 supervisor
- supervisor管理用户进程（SpringBoot）


一般情况下，系统都会自带Python2.7，所以我们采用Python包supervisor管理SpringBoot进程

### 5.1、检查Python环境

supervisor同时支持Python2.7和Python3

```bash
python -V
Python 2.7.5
```

### 5.2、检查pip

```bash
pip -V
pip 20.3.4 from /usr/lib/python2.7/site-packages/pip (python 2.7)

# 如果不存在就安装
# Python2.7
wget https://bootstrap.pypa.io/pip/2.7/get-pip.py

# 安装
python get-pip.py
```

### 5.3、安装supervisor

文档
- [http://supervisord.org/index.html](http://supervisord.org/index.html)

```bash
pip install supervisor
```

生成配置文件

```bash
# 生成配置文件目录
mkdir -p /etc/supervisor/conf.d

# 初始化配置文件
echo_supervisord_conf > /etc/supervisor/supervisord.conf
```

修改配置

```bash
vim /etc/supervisor/supervisord.conf
```

下面几项是必须修改的

```bash
[unix_http_server]
;file=/tmp/supervisor.sock   ; (the path to the socket file)
file=/var/run/supervisor.sock ; 修改为 /var/run 目录，避免被系统删除

[supervisord]
;logfile=/tmp/supervisord.log ; (main log file;default $CWD/supervisord.log)
logfile=/var/log/supervisor.log ; 修改为 /var/log 目录，避免被系统删除

;pidfile=/tmp/supervisord.pid ; supervisord pidfile; default supervisord.pid
pidfile=/var/run/supervisord.pid ; 修改为 /var/run 目录，避免被系统删除

[supervisorctl]
; 必须和'unix_http_server'里面的设定匹配
;serverurl=unix:///tmp/supervisor.sock ; use a unix:// URL  for a unix socket
serverurl=unix:///var/run/supervisor.sock ; 修改为 /var/run 目录，避免被系统删除

[include]
;指定应用程序配置文件目录
;files = relative/directory/*.ini
files = conf.d/*.ini
```

管理命令

```bash
# 查看supervisor监管的进程状态
supervisorctl status

# 启动XXX进程
supervisorctl start 进程名

# 停止XXX进程
supervisorctl stop 进程名

# 停止全部进程，注：start、restart、stop都不会载入最新的配置文件。
supervisorctl stop all

# 根据最新的配置文件，启动新配置或有改动的进程，配置没有改动的进程不会受影响而重启
supervisorctl update

# 查看日志
supervisorctl tail -f spring-boot
```


### 5.4、开机启动

新建文件 supervisord.service

```bash
# supervisord.service

[Unit] 
Description=Supervisor daemon

[Service] 
Type=forking 
ExecStart=/usr/bin/supervisord -c /etc/supervisor/supervisord.conf
ExecStop=/usr/bin/supervisorctl shutdown 
ExecReload=/usr/bin/supervisorctl reload 
KillMode=process
Restart=on-failure
RestartSec=42s

[Install] 
WantedBy=multi-user.target
```

启动服务

```bash
cp supervisord.service /usr/lib/systemd/system/

# 开机启动服务
systemctl enable supervisord      

# 验证一下是否为开机启动
systemctl is-enabled supervisord  

# 启动服务
systemctl start supervisord

systemctl status supervisord

systemctl stop supervisord
```

### 5.5、添加www用户组和用户

一般不能以root用户来运行程序，需要单独的一个用户来运行线上程序

```bash
# 添加用户组
$ groupadd www

# 添加用户
$ useradd -g www -s /sbin/nologin www

# 查看用户
$ id www
uid=1000(www) gid=1000(www) groups=1000(www)

# 或者
$ cat /etc/group
$ cat /etc/passwd

# 赋予权限
chown -R www:www helloworld

# 查看文件属性
ls -lh
drwxr-xr-x  5 www  www   4.0K Dec 30 03:34 helloworld
```

### 5.6、项目启动配置

supervisor.conf

```bash
[program:spring-boot]
;应用启动目录
directory=/usr/local/helloworld
;使用绝对路径
command=/usr/local/jdk1.8.0_351/bin/java -jar target/demo-0.0.1-SNAPSHOT.jar
;运行用户
user=www
```

启动进程

```bash
# 生成软链
ln -s /usr/local/helloworld/supervisor.conf /etc/supervisor/conf.d/spring-boot.conf

# 更新配置文件
supervisorctl update

# status查看进程
supervisorctl status
spring-boot                      RUNNING   pid 238, uptime 0:21:31

# ps查看进程
ps -ef|grep java
www        238    87 57 05:33 ?        00:00:10 /usr/local/jdk1.8.0_351/bin/java -jar target/demo-0.0.1-SNAPSHOT.jar
```

> 参考 [Python编程：supervisor模块管理进程实例](https://pengshiyu.blog.csdn.net/article/details/80813264)

## 6、通过Makefile整合命令

上面涉及到了很多命令，如果都记住有点困难

使用Makefile文件或者shell都可以整合命令

安装make

```bash
yum install -y make
```

Makefile 文件

```bash
# 操作命令

# 拉取代码
.PHONY: pull
pull:
	git pull

# maven打包
.PHONY: build
build:
	mvn clean package -Dmaven.test.skip=true

# 重启进程
.PHONY: restart
restart:
	supervisorctl restart spring-boot

# 启动进程
.PHONY: start
start:
	supervisorctl start spring-boot

# 停止进程
.PHONY: stop
stop:
	supervisorctl stop spring-boot

# 日志
.PHONY: log
log:
	supervisorctl tail -f spring-boot

# 部署
.PHONY: deploy
deploy:
	make pull
	make build
	make restart
```

重新部署项目
```bash
make deploy
```

> 已发布 https://mp.csdn.net/mp_blog/creation/success/128494747