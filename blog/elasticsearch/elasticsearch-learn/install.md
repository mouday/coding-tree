# 环境安装

课程中使用的版本 7.10.0(本例使用7.14.0)

- 安装Java环境
- 安装ElasticSearch
- 安装Kibana
- 安装ElasticSearch-Head插件

> 技巧：MacOS下，拖拽文件或者文件夹到终端，会生成文件路径

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

- 华为云镜像elasticsearch：[https://repo.huaweicloud.com/elasticsearch/](https://repo.huaweicloud.com/elasticsearch/)

- 华为云镜像kibana: [https://repo.huaweicloud.com/kibana/](https://repo.huaweicloud.com/kibana/)

### 2.2、下载解压

```bash
# elasticsearch
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.14.0-linux-x86_64.tar.gz

# 国内镜像 MacOS
wget http://dl.elasticsearch.cn/elasticsearch/elasticsearch-7.14.0-darwin-x86_64.tar.gz

# 国内镜像 Linux
wget http://dl.elasticsearch.cn/elasticsearch/elasticsearch-7.14.0-linux-x86_64.tar.gz

# 解压
tar -xvf elasticsearch-7.14.0-linux-x86_64.tar.gz
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
# start.command
open node1/bin/elasticsearch
open node2/bin/elasticsearch
open node3/bin/elasticsearch
```

windows
```bash
# start.bat
start D:\node1\bin\elasticsearch.bat
start D:\node2\bin\elasticsearch.bat
start D:\node3\bin\elasticsearch.bat
```

## 3、安装Kibana

### 3.1、下载

```bash
# kibana
wget https://artifacts.elastic.co/downloads/kibana/kibana-7.14.0-linux-x86_64.tar.gz

# 国内镜像 MacOS
wget http://dl.elasticsearch.cn/kibana/kibana-7.14.0-darwin-x86_64.tar.gz

# 国内镜像 Linux
wget http://dl.elasticsearch.cn/kibana/kibana-7.14.0-linux-x86_64.tar.gz

```

### 3.2、解压启动

```bash
# 解压
tar -xvf kibana-7.14.0-darwin-x86_64.tar.gz

# 进入执行文件目录
cd kibana-7.14.0-darwin-x86_64/bin

# 启动
./kibana
```

需要提前开启 elasticsearch

验证地址：http://localhost:5601

### 3.3、关闭kibana

```bash
# 查找进程id 3种方式
ps -ef| grep 5601

ps -ef| grep kibana

lsof -i:5601

# 关闭进程
kill -9 <pid>
```

### 3.4、修改配置 

config/kibana.yml

```bash
# 默认页面修改为：开发工具
# The default application to load.
#kibana.defaultAppId: "home"
kibana.defaultAppId: "dev_tools"

# 显示语言改为：中文
# Specifies locale to be used for all localizable strings, dates and number formats.
# Supported languages are the following: English - en , by default , Chinese - zh-CN .
#i18n.locale: "en"
i18n.locale: "zh-CN"
```

### 3.5、快捷键

| 快捷键 | 功能
| - | -
| 提交请求| Ctrl/Cmd + Enter  
| 自动缩进 | Ctrl/Cmd + I 


### 3.6、问题

Kibana server is not ready yet

| 原因 | 解决办法
| - | -
| Kibana和ElasticSearch的版本不兼容 | 保持版本一致
| Kibana中配置的elasticSearch.hosts与ElasticSearch的服务地址不同 | 修改kibana.yml中的配置
| ElasticSearch中禁止跨域访问 | elasticSearch.yml配置允许跨域
| 服务器中开启了防火墙 | 关闭防火墙或修改服务器的安全策略
| ElasticSearch所在磁盘剩余空间不足90% | 清理磁盘空间，配置监控的报警

## 4、安装ElasticSearch-Head插件

### 4.1、安装Node.js

下载地址：[https://nodejs.org/zh-cn/download/](https://nodejs.org/zh-cn/download/)

推荐使用: [nvm](https://github.com/nvm-sh/nvm) 来管理node.js版本

```bash
# 查看版本
node -v
v16.14.0
```

### 4.2、下载 elasticsearch-head

- [http://mobz.github.io/elasticsearch-head/](http://mobz.github.io/elasticsearch-head/)

- [https://github.com/mobz/elasticsearch-head](https://github.com/mobz/elasticsearch-head)



clone 代码
```bash
git clone git://github.com/mobz/elasticsearch-head.git

cd elasticsearch-head
```

或者下载elasticsearch-head-master.zip 压缩包

```bash
wget https://github.com/mobz/elasticsearch-head/archive/refs/heads/master.zip -O elasticsearch-head-master.zip

# 解压
unzip elasticsearch-head-master.zip

cd elasticsearch-head-master
```


修改配置（可以略过）

```js
// Gruntfile.js
module.exports = function(grunt) {
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    // 添加配置项，可以外网访问
                    hostname: '*',
                    
                    port: 9100,
                    base: '.',
                    keepalive: true
                }
            }
        }
    });
};

```

```bash
# 安装依赖
pnpm i

# 启动服务, 需要提前启动 elasticsearch
npm run start
```

查看地址：http://localhost:9100/

### 4.3、问题：

如果无法发现ES节点，尝试修改ES配置文件，允许跨域

```yaml
# config/elasticsearch.yml
# 允许跨域
http.cors.enabled: true
http.cors.allow-origin: "*"
```

### 4.4、从Chrome应用商店安装

- ElasticSearch Head 0.1.4: [elasticsearch-head-chrome](https://github.com/TravisTX/elasticsearch-head-chrome)

- ElasticSearch Head v0.1.5: [https://crxdl.com/](https://crxdl.com/) 搜索：ffmkiejjmecolpfloofpjologoblkegm

备用地址：[https://github.com/mouday/ElasticSearch-Head.crx](https://github.com/mouday/ElasticSearch-Head.crx)

## 集群健康检查

- green 集群健康
- yellow 至少一个数据可用
- red 数据不完整，集群不可用

查看健康值
```bash
# 返回简要
GET _cat/health

# 返回带有标题的数据
GET _cat/health?v

# 返回json数据
GET _cluster/health
```

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
https://www.bilibili.com/video/BV1LY4y167n5?p=5&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da