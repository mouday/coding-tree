
elasticsearch下载地址

- 官网下载：[https://www.elastic.co/cn/downloads/past-releases#elasticsearch](https://www.elastic.co/cn/downloads/past-releases#elasticsearch)

- elasticsearch中文社区：[https://elasticsearch.cn/download/](https://elasticsearch.cn/download/)

- 华为云镜像：[https://repo.huaweicloud.com/elasticsearch/](https://repo.huaweicloud.com/elasticsearch/)

下载解压安装

```bash
# elasticsearch
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.17.4-linux-x86_64.tar.gz

# kibana
wget https://artifacts.elastic.co/downloads/kibana/kibana-7.17.4-linux-x86_64.tar.gz

# 解压
tar -xvf elasticsearch-7.17.4-linux-x86_64.tar.gz

# 运行
cd elasticsearch-7.17.4/bin
./elasticsearch
```

安装JDK
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

不同编程语言的客户端
https://www.elastic.co/guide/en/elasticsearch/client/index.html

```bash
# php > 7.1
composer require "elasticsearch/elasticsearch" "~7.0"
```

文档：
https://www.elastic.co/guide/en/elasticsearch/client/php-api/7.17/index.html


配置Nginx代理转发

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

Elasticsearch7.6中文文档

- https://www.kancloud.cn/yiyanan/elasticsearch_7_6/1668540
- https://learnku.com/docs/elasticsearch73/7.3