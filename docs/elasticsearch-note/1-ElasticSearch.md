# ElasticSearch简介

##  一、学习路径：
1、核心知识
2、高手进阶

3、大型集群运维优化
4、大型项目架构
5、ELK深入浅出

##  二、ElasticSearch简介
分布式，高可用，高性能，可伸缩的搜索和分析系统

1、应用
互联网：电商，新闻，招聘...
IT系统：OA软件，办公自动化软件，会议管理，日程管理，项目管理，员工管理...

2、数据库做搜索
效果不佳，速度较慢

3、全文检索，倒排索引
Lucene：jar包，提供了建立倒排索引，搜索的功能

4、ElasticSearch：
(1)、基于Lucene
(2)、自动维护多个节点索引建立
(3)、搜索分布到多个节点执行
(4)、自动维护数据的冗余副本

##  三、ElasticSearch功能
1、分布式搜索引擎和数据分析引擎
​    分布式，搜索，数据分析
2、全文检索，结构化检索，数据分析
3、对海量数据进行近实时处理

ES分布式存储海量数据 - Lucene单机应用
近实时（秒级） - 离线批处理

##  四、ElasticSearch适用场景
1、维基百科
2、新闻网站，用户行为日志（点击，浏览，收藏，评论）
3、Stack Overflow问题搜索
4、github代码搜索
5、电商搜索
6、日志数据分析
7、商品价格监控网站
8、BI系统，商业智能
9、站内搜索（电商，招聘，门户...）
10、IT系统（OA，CRM，ERP...）
11、数据分析（热门）

##  五、ElasticSearch特点
1、分布式，也可以单机
2、ES = 全文检索 + 数据分析 + 分布式技术
3、开箱即用，简单
4、数据库（事务）ES作为补充

##  六、ElasticSearch核心概念
Lucene:
最先进，功能强大的搜索库，api复杂

ES:
分布式，
文档存储，
搜索引擎，
分析引擎，
PB级数据

核心概念
1、Near Realtime NRT 近实时（延迟1s）
2、Cluster 集群，包含多个节点
3、Node 节点 
4、Document 文档 es中的最小数据单元 json结构，包含多个field字段
5、Index 索引
6、Type 类型 index中的一个逻辑分类
7、Shard(primary shard) 分片 一个index会被分成多片，存放到台态服务器
​    (1）横向扩展
​    (2）并行分布式执行，提升吞吐量和性能
​    (3) 默认5个，建立时设置，不能修改
8、Replica(replica shard) 副本
​    (1)高可用，一个shard宕机，服务可用
​    (2)提升搜索请求吞吐量
​    (3)默认1个，随时修改
​    5个shard 对应 5个副本，最小高可用配置2台服务器

和mysql对比：
es        -     mysql
index     -     database
type      -     table
document  -     row

##  七、ElasticSearch安装
安装
Java -version >= 1.8

1、下载解压
官网：
https://www.elastic.co/

注意版本要匹配version 5.2.0

搜索下载es 和 kibana
https://www.elastic.co/cn/downloads/past-releases

或者直接下载
elasticsearch 5.2.0 32.0 MB: 
https://www.elastic.co/cn/downloads/past-releases/elasticsearch-5-2-0
https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.2.0.tar.gz

kibana 5.2.0 35.2 MB: 
https://www.elastic.co/cn/downloads/past-releases/kibana-5-2-0

https://artifacts.elastic.co/downloads/kibana/kibana-5.2.0-windows-x86.zip
https://artifacts.elastic.co/downloads/kibana/kibana-5.2.0-darwin-x86_64.tar.gz
https://artifacts.elastic.co/downloads/kibana/kibana-5.2.0-linux-x86_64.tar.gz

2、启动es

```
./bin/elasticsearch
```

查看启动情况
http://127.0.0.1:9200/?pretty

```
##  节点名称
name: "node-1",

##  集群名称
cluster_name: "elasticsearch",
```
修改配置文件
config/elasticsearch.yml

3、启动kibana
```
./bin/kibana
```

访问 
http://127.0.0.1:5601

进入Dev Tools
查看健康状态

```
GET _cluster/health

```

##  八、文档CRUD
面向文档的搜索分析引擎

Document文档格式 json格式

1、简单的集群管理
cat api

参数
```
?v 显示标题
?pretty
```

（1）检查集群健康状况
```
GET _cat/health

```
status | primary shard  | replica shard 
-|-|-
green| active | active
yellow | active | 部分不可用
red | 部分有数据丢失 | -

启动了一个es进程，只有一个node，当前只有一个index，
默认配置一个index分配5个primary shard和 5 个replica shard 
而且 primary shard 和 replica shard不能在同一台机器上（为了容错）

kibana自己建立的index是一个primary shard 和 1个replica shard
当前就一个node，只分配了primary shard 没有第二台机器分配replica shard

只要再启动一个es，就会变成green


（2）查看集群中索引
```
GET _cat/indices

```

（3）创建索引
```
PUT /<index_name>
```

（4）删除索引
```
DELETE /<index_name>
```

2、文档操作(增删改查)
（1）新增文档
```
PUT /index/type/id
{
    <data>
}
```
es会自动建立index和type，不需要提前创建
而且默认会对document的每个field都建立倒排索引，以便搜索

eg:
```
PUT /web/product/1
{
    "name": "bat baidu",
    "price": 30,
    "tags": ["tieba", "baike"]
}

PUT /web/product/2
{
    "name": "bat tencent",
    "price": 40,
    "tags": ["qq", "weixin"]
}

PUT /web/product/3
{
    "name": "bat alibaba",
    "price": 60,
    "tags": ["taobao", "tianmao"]
}
```

（2）查找文档
```
GET /web/product/1
```

（3）替换文档
```
PUT /web/product/1
{
    "name": "baidu",
    "price": 35,
    "tags": ["tieba", "baike"]
}
```
替换方式必须带上所有信息才能进行修改，会整个文档替换

（4）更新文档
```
POST /web/product/1/_update
{
  "doc": {
    "price": 306
  }
}
```
只会更新部分字段，不会全部替换

（5）删除文档
```
DELETE /web/product/1
```

##  九、多种搜索方式
1、query string search
（1）查询所有
```
GET /web/product/_search
```
返回参数
```
took 耗费时间毫秒
time_out 是否超时
_shard 几个shard处理了搜索请求
hits.total 查询结果数量
hits.max_score 相关度匹配分数，越大越相关 (0-1]
hits.hits 搜索匹配的详细数据

```
（2）查询name包含'bat' 按照price降序排列
```
GET /web/product/_search?q=name:bat&sort=price:desc
```

几乎很少用query string search,难以构建复杂查询


2、query DSL
DSL：Domain Specified Language 特定领域的语言
http request body请求，用json构建查询

（1）查询所有
```
GET /web/product/_search
{
  "query":{
    "match_all": {}
  }
}
```

（2）排序查询
查询name包含 'bat' 按照price降序排列
```
GET /web/product/_search
{
  "query": {
    "match": {
      "name": "bat"
    }
  },
  "sort": [
    {
      "price": "desc"
    }
  ]
}
```

（3）分页查询
第1个开始，取1条数据，实际取出第2条数据（form从0开始计数）
```
GET /web/product/_search
{
  "query": {
    "match_all": {}
  }, 
  "from": 1,
  "size": 1
}
```

（4）指定字段
只取部分字段
```
GET /web/product/_search
{
  "query": {
    "match_all": {}
  },
  "_source": ["name", "price"]
}
```

3、query filter 数据过滤
（1）查询name中包含“bat”，price>25
```
GET /web/product/_search
{
    "query":{
        "bool":{
            "must":{
                "match":{
                    "name":"bat"
                }
            },
            "filter":{
                "range":{
                    "price":{
                        "gt":35
                    }
                }
            }
        }
    }
}
```

4、full-text search 全文检索
name字段会被拆解，建立倒排索引

关键字 | id
- | -
bat | 1,2,3
baidu |1
tencent |2
alibaba |3

搜索时会将搜索串拆解开，去倒排索引一一匹配，只要`匹配任意一个`就会作为结果返回
命中越多，分数值越高
```
GET /web/product/_search
{
  "query":{
    "match":{
      "name": "bat baidu"
    }
  }
}
```

5、phrase search 短语搜索
输入搜索串必须`完全匹配`，才能作为结果返回
```
GET /web/product/_search
{
  "query":{
    "match_phrase":{
      "name": "bat baidu"
    }
  }
}
```

6、highlight search 高亮搜索结果
将name字段匹配的内容做上高亮标志
```
GET /web/product/_search
{
  "query":{
    "match":{
      "name": "bat baidu"
    }
  },
  "highlight": {
    "fields": {
      "name":{}
    }
  }
}

```

##  十、聚合操作 aggregations

聚合示例使用的文档数据
```
PUT /taobao/product/1
{
  "name": "red dog",
  "age": 2,
  "tags": [
    "red", "dog"
    ]
}

PUT /taobao/product/2
{
  "name": "green dog",
  "age": 3,
  "tags": [
    "green", "dog"
    ]
}

PUT /taobao/product/3
{
  "name": "yellow dog",
  "age": 5,
  "tags": [
    "yellow", "dog"
    ]
}

```

1、简单聚合
（1）设置feild的fielddata属性为true
```
PUT /taobao/_mapping/product
{
  "properties": {
    "tags":{
      "type": "text",
      "fielddata": true
    }
  }
}

```

（2）通过标签分组计算数量
```
GET /taobao/product/_search
{
  "aggs":{
    "group_by_tag":{
      "terms":{
        "field": "tags"
      }
    }
  }
}
```

（3）设置 "size": 0不显示查询结果
```
GET /taobao/product/_search
{
  "size": 0,   
  "aggs":{
    "group_by_tag":{
      "terms":{
        "field": "tags"
      }
    }
  }
}
```

2、先搜索再聚合
```
GET /taobao/product/_search
{
  "size": 0,
  "query": {
    "match": {
      "name": "red"
    }
  },
  "aggs": {
    "group_by_tag": {
      "terms": {
        "field": "tags"
      }
    }
  }
}
```

3、先分组，再平均
```
GET /taobao/product/_search
{
  "size": 0,
  "aggs": {
    "group_by_tag": {
      "terms": {
        "field": "tags"
      },
      "aggs": {
        "avg_age": {
          "avg": {"field": "age"}
        }
      }
    }
  }
}
```

4、先分组，再平均，再降序排序
```
GET /taobao/product/_search
{
  "size": 0,
  "aggs": {
    "group_by_tag": {
      "terms": {
        "field": "tags",
        "order": {
          "avg_age": "desc"
        }
      },
      "aggs": {
        "avg_age": {
          "avg": {
            "field": "age"
          }
        }
      }
    }
  }
}
```

5、指定年龄范围分组，再按照组内标签分组，最后计算每组平均价格
```
GET /taobao/product/_search
{
  "size": 0,
  "aggs": {
    "group_by_age": {
      "range": {
        "field": "age",
        "ranges": [
          {
            "from": 0,
            "to": 3
          },
          {
            "from": 1,
            "to": 5
          }
        ]
      },
      "aggs": {
        "group_by_tag": {
          "terms": {
            "field": "tags"
          },
          "aggs": {
            "avg_age": {
              "avg": {
                "field": "age"
              }
            }
          }
        }
      }
    }
  }
}
```
