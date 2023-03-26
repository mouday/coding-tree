[返回目录](/blog/elasticsearch/springcloud-elasticsearch/index)

# Elasticsearch安装

## 部署单点ES

### 创建网络

```bash
docker network create es-net
```

### 运行elasticsearch

```bash
docker run -d \
    --name es \
    -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
    -e "discovery.type=single-node" \
    -v es-data:/usr/share/elasticsearch/data \
    -v es-plugins:/usr/share/elasticsearch/plugins \
    --privileged \
    --network es-net \
    -p 9200:9200 \
    -p 9300:9300 \
elasticsearch:7.12.1
```

命令解释：

- `-e "cluster.name=es-docker-cluster"`：设置集群名称
- `-e "http.host=0.0.0.0"`：监听的地址，可以外网访问
- `-e "ES_JAVA_OPTS=-Xms512m -Xmx512m"`：内存大小
- `-e "discovery.type=single-node"`：非集群模式
- `-v es-data:/usr/share/elasticsearch/data`：挂载逻辑卷，绑定es的数据目录
- `-v es-logs:/usr/share/elasticsearch/logs`：挂载逻辑卷，绑定es的日志目录
- `-v es-plugins:/usr/share/elasticsearch/plugins`：挂载逻辑卷，绑定es的插件目录
- `--privileged`：授予逻辑卷访问权
- `--network es-net` ：加入一个名为es-net的网络中
- `-p 9200:9200`：端口映射配置


在浏览器中输入：http://127.0.0.1:9200 即可看到elasticsearch的响应结果：
```json
{
    "name": "90a69a0a8682",
    "cluster_name": "docker-cluster",
    "cluster_uuid": "z6oxeB4KQqSfjrekyccT9w",
    "version": {
        "number": "7.12.1",
        "build_flavor": "default",
        "build_type": "docker",
        "build_hash": "3186837139b9c6b6d23c3200870651f10d3343b7",
        "build_date": "2021-04-20T20:56:39.040728659Z",
        "build_snapshot": false,
        "lucene_version": "8.8.0",
        "minimum_wire_compatibility_version": "6.8.0",
        "minimum_index_compatibility_version": "6.0.0-beta1"
    },
    "tagline": "You Know, for Search"
}
```


### 部署kibana

kibana可以给我们提供一个elasticsearch的可视化界面，便于我们学习。


运行docker命令，部署kibana

```bash
docker run -d \
    --name kibana \
    -e ELASTICSEARCH_HOSTS=http://es:9200 \
    --network=es-net \
    -p 5601:5601  \
    kibana:7.12.1
```

- `--network es-net` ：加入一个名为es-net的网络中，与elasticsearch在同一个网络中
- `-e ELASTICSEARCH_HOSTS=http://es:9200"`：设置elasticsearch的地址，因为kibana已经与elasticsearch在一个网络，因此可以用容器名直接访问elasticsearch
- `-p 5601:5601`：端口映射配置

kibana启动一般比较慢，需要多等待一会，可以通过命令：

```sh
docker logs -f kibana
```

此时，在浏览器输入地址访问：http://127.0.0.1:5601

选择 `Explore on my own` -> `Dev tools`

发送请求

```bash
GET /
```

返回结果
```json
{
  "name" : "90a69a0a8682",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "z6oxeB4KQqSfjrekyccT9w",
  "version" : {
    "number" : "7.12.1",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "3186837139b9c6b6d23c3200870651f10d3343b7",
    "build_date" : "2021-04-20T20:56:39.040728659Z",
    "build_snapshot" : false,
    "lucene_version" : "8.8.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}

```