[返回目录](/blog/elasticsearch/springcloud-elasticsearch/index)

# 安装IK分词器

https://github.com/medcl/elasticsearch-analysis-ik

## 1、在线安装ik插件（较慢）

```bash
# 进入容器内部
docker exec -it elasticsearch /bin/bash

# 在线下载并安装
./bin/elasticsearch-plugin  install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.12.1/elasticsearch-analysis-ik-7.12.1.zip

#退出
exit
#重启容器
docker restart elasticsearch
```

## 2、离线安装ik插件（推荐）

### 2.1、查看数据卷目录

安装插件需要知道elasticsearch的plugins目录位置，而我们用了数据卷挂载，因此需要查看elasticsearch的数据卷目录，通过下面命令查看:

```bash
docker volume inspect es-plugins
```

显示结果：

```json
[
    {
        "CreatedAt": "2022-05-06T10:06:34+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/es-plugins/_data",
        "Name": "es-plugins",
        "Options": null,
        "Scope": "local"
    }
]
```

说明plugins目录被挂载到了：`/var/lib/docker/volumes/es-plugins/_data `这个目录中。

> mac可以采用挂载本地目录的方式

### 2.2、解压缩分词器安装包

将提前下载好的ik分词器解压缩，重命名为ik

### 2.3、上传到es容器的插件数据卷中

也就是`/var/lib/docker/volumes/es-plugins/_data `：


## 3、重启容器

```bash
# 4、重启容器
docker restart es
```

```bash
# 查看es日志
docker logs -f es
```

## 4、分词测试：

IK分词器包含两种模式：

* `ik_smart`：最少切分

* `ik_max_word`：最细切分

### 4.1、标准分词

```json
GET /_analyze
{
  "text": "今天天气真好啊！",
  "analyzer": "standard"
  
}
```

分词结果

```json
{
  "tokens" : [
    {
      "token" : "今",
      "start_offset" : 0,
      "end_offset" : 1,
      "type" : "<IDEOGRAPHIC>",
      "position" : 0
    },
    {
      "token" : "天",
      "start_offset" : 1,
      "end_offset" : 2,
      "type" : "<IDEOGRAPHIC>",
      "position" : 1
    },
    {
      "token" : "天",
      "start_offset" : 2,
      "end_offset" : 3,
      "type" : "<IDEOGRAPHIC>",
      "position" : 2
    },
    {
      "token" : "气",
      "start_offset" : 3,
      "end_offset" : 4,
      "type" : "<IDEOGRAPHIC>",
      "position" : 3
    },
    {
      "token" : "真",
      "start_offset" : 4,
      "end_offset" : 5,
      "type" : "<IDEOGRAPHIC>",
      "position" : 4
    },
    {
      "token" : "好",
      "start_offset" : 5,
      "end_offset" : 6,
      "type" : "<IDEOGRAPHIC>",
      "position" : 5
    },
    {
      "token" : "啊",
      "start_offset" : 6,
      "end_offset" : 7,
      "type" : "<IDEOGRAPHIC>",
      "position" : 6
    }
  ]
}

```

### 4.2、ik_smart

```json
GET /_analyze
{
  "text": "今天天气真好啊！",
  "analyzer": "ik_smart"
}
```

分词结果

```json
{
  "tokens" : [
    {
      "token" : "今天天气",
      "start_offset" : 0,
      "end_offset" : 4,
      "type" : "CN_WORD",
      "position" : 0
    },
    {
      "token" : "真",
      "start_offset" : 4,
      "end_offset" : 5,
      "type" : "CN_CHAR",
      "position" : 1
    },
    {
      "token" : "好啊",
      "start_offset" : 5,
      "end_offset" : 7,
      "type" : "CN_WORD",
      "position" : 2
    }
  ]
}

```

### 4.3、ik_max_word

```json
GET /_analyze
{
  "text": "今天天气真好啊！",
  "analyzer": "ik_max_word"
  
}
```
分词结果

```json
{
  "tokens" : [
    {
      "token" : "今天天气",
      "start_offset" : 0,
      "end_offset" : 4,
      "type" : "CN_WORD",
      "position" : 0
    },
    {
      "token" : "今天",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "CN_WORD",
      "position" : 1
    },
    {
      "token" : "天天",
      "start_offset" : 1,
      "end_offset" : 3,
      "type" : "CN_WORD",
      "position" : 2
    },
    {
      "token" : "天气",
      "start_offset" : 2,
      "end_offset" : 4,
      "type" : "CN_WORD",
      "position" : 3
    },
    {
      "token" : "真好",
      "start_offset" : 4,
      "end_offset" : 6,
      "type" : "CN_WORD",
      "position" : 4
    },
    {
      "token" : "好啊",
      "start_offset" : 5,
      "end_offset" : 7,
      "type" : "CN_WORD",
      "position" : 5
    }
  ]
}

```

## 3.3 扩展词词典

IK分词器提供了扩展词汇的功能。

配置文件config/IKAnalyzer.cfg.xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
        <comment>IK Analyzer 扩展配置</comment>
        <!--用户可以在这里配置自己的扩展字典 *** 添加扩展词典-->
        <entry key="ext_dict">ext.dic</entry>
</properties>
```

config目录下新建一个文件 ext.dic

```
真好
奥利给
今天
天气
```

4）重启elasticsearch 

```sh
docker restart es

# 查看 日志
docker logs -f elasticsearch
```

日志中已经成功加载ext.dic配置文件

5）测试效果：

```json
GET /_analyze
{
  "analyzer": "ik_max_word",
  "text": "今天的天气真好，奥力给！"
}
```

## 3.4 停用词词典

IK分词器也提供了强大的停用词功能，让我们在索引时就直接忽略当前的停用词汇表中的内容。

1）config/IKAnalyzer.cfg.xml配置文件内容添加：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
    <comment>IK Analyzer 扩展配置</comment>
    <!--用户可以在这里配置自己的扩展字典-->
    <entry key="ext_dict">ext.dic</entry>
      <!--用户可以在这里配置自己的扩展停止词字典  *** 添加停用词词典-->
    <entry key="ext_stopwords">stopword.dic</entry>
</properties>
```

3）在 stopword.dic 添加停用词

```
的
啊
```

4）重启elasticsearch 

```sh
# 重启服务
docker restart elasticsearch
docker restart kibana

# 查看 日志
docker logs -f elasticsearch
```

日志中已经成功加载stopword.dic配置文件

5）测试效果：

```json
GET /_analyze
{
  "analyzer": "ik_max_word",
  "text": "今天的天气真好，奥力给！"
}
```


配置扩展词和停用词后进行分词测试
```json
GET /_analyze
{
  "text": "今天天气真好啊！奥利给",
  "analyzer": "ik_smart"
  
}
```

分词测试结果

```
默认：今天天气/真/好啊/奥/利/给
增加扩展词语：今天天气/真/好啊/奥利给
```

## 小结

分词器的作用是什么？
- 创建倒排索引时对文档分词
- 用户搜索时，对输入的内容分词

IK分词器有几种模式？
- ik_smart：智能切分，粗粒度
- ik_max_word：最细切分，细粒度

IK分词器如何拓展词条？如何停用词条？
- 利用config目录的IkAnalyzer.cfg.xml文件添加拓展词典和停用词典
- 在词典中添加拓展词条或者停用词条
