# 环境安装

课程中使用的版本 7.10(本例使用7.14)

- 安装Java环境
- 安装ElasticSearch
- 安装Kibana
- 安装ElasticSearch-Head插件

## 1、安装Java环境

兼容性查看
[https://www.elastic.co/cn/support/matrix](https://www.elastic.co/cn/support/matrix)

- JDK兼容性：JDK 1.8
- 操作系统兼容性：CentOS7
- Elastic技术栈兼容性


### 1.1、Linux安装JDK

```bash
# 搜索jdk
yum search jdk

# 安装
yum install -y java-1.8.0-openjdk.x86_64

# 验证
java -version
openjdk version "1.8.0_332"
OpenJDK Runtime Environment (build 1.8.0_332-b09)
OpenJDK 64-Bit Server VM (build 25.332-b09, mixed mode)
```

### 1.2、MacOS安装JDK

```bash
$ java -version
java version "1.8.0_251"
Java(TM) SE Runtime Environment (build 1.8.0_251-b08)
Java HotSpot(TM) 64-Bit Server VM (build 25.251-b08, mixed mode)
```

## 2、安装ElasticSearch

### 2.1、下载地址

- 官网下载：[https://www.elastic.co/cn/downloads/past-releases#elasticsearch](https://www.elastic.co/cn/downloads/past-releases#elasticsearch)

- elasticsearch中文社区：[https://elasticsearch.cn/download/](https://elasticsearch.cn/download/)

- 华为云镜像：[https://repo.huaweicloud.com/elasticsearch/](https://repo.huaweicloud.com/elasticsearch/)

### 2.2、下载解压

```bash
# elasticsearch
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.17.4-linux-x86_64.tar.gz

# kibana
wget https://artifacts.elastic.co/downloads/kibana/kibana-7.17.4-linux-x86_64.tar.gz

# 解压
tar -xvf elasticsearch-7.17.4-linux-x86_64.tar.gz
```

### 2.3、目录结构

|目录名称  | 描述
|- | -
| bin |  可执行脚本文件
| config | 配置文件
|lib | 依赖库
| data | 默认的数据存放目录，`生产环境必须修改`
|logs| 默认的日志文件存放目录，`生产环境必须修改`
| modules | 包含所有模块
| plugins| 插件目录
| jdk/jdk.app | version > 7.0,自带的java环境

### 2.4、启动单节点服务

```bash
# 进入到命令所在目录
cd elasticsearch-7.14.0\bin

# 启动
./elasticsearch

# 后台启动
./elasticsearch -d
```

| - | windows | Linux | MacOS
| - | - | - | - | 
| 命令行 | ./elasticsearch.bash | ./elasticsearch | ./elasticsearch
| 图形界面 | 双击 elasticsearch.bash | - | 双击 elasticsearch 
| shell | start elasticsearch.bash | - | open elasticsearch

启动验证：http://localhost:9200

### 2.5、启动多个节点

1、本机单个项目启动多个节点

```bash
# 启动第一个节点 http://localhost:9200/
./elasticsearch -E path.data=data1 -E path.logs=log1 -E node.name=node1 -E cluster.name=mycluster

# 启动第二个节点 http://127.0.0.1:9201/
./elasticsearch -E path.data=data2 -E path.logs=log2 -E node.name=node2 -E cluster.name=mycluster
```

2、本机多个项目启动多个节点

MacOS
```bash
open node1/bin/elasticsearch
open node2/bin/elasticsearch
open node3/bin/elasticsearch
```

windows
```bash
start D:\node1\bin\elasticsearch.bat
start D:\node2\bin\elasticsearch.bat
start D:\node3\bin\elasticsearch.bat
```

## 3、安装Kibana
## 4、安装ElasticSearch-Head插件

## 5、不同编程语言的客户端

https://www.elastic.co/guide/en/elasticsearch/client/index.html

```bash
# php > 7.1
composer require "elasticsearch/elasticsearch" "~7.0"
```

文档：
https://www.elastic.co/guide/en/elasticsearch/client/php-api/7.17/index.html


## 配置Nginx代理转发

```bash
# kibana.conf
server {
    listen 8002;
    server_name localhost;

    location / {
         # 设置 auth
       auth_basic "login auth";
       auth_basic_user_file /usr/local/nginx/.htpasswd;

        proxy_pass http://127.0.0.1:5601;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}

```

```bash
# elasticsearch.conf
server {
    listen 8001;
    server_name localhost;

    location / {
        # 设置 auth
       auth_basic "login auth";
       auth_basic_user_file /usr/local/nginx/.htpasswd;

        proxy_pass http://127.0.0.1:9200;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

https://www.bilibili.com/video/BV1LY4y167n5?p=3&spm_id_from=pageDriver

