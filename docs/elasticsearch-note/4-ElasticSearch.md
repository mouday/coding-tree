# ElasticSearch搜索API

## 一、search api的基础语法介绍
1、search api
```
GET _search
GET index1,index2/type1,type2/_search?q=value&from=0&size=10
```

2、GET中携带reques body
http协议中，一般不允许GET请求写到request body，为了更好描述数据查询操作，还是可以使用

如果遇到不支持的场景，可以使用POST


## 二、Query DSL搜索语法
1、小实例
```
GET /_search
{
  "query":{
    "match_all": {}
  }
}
```

2、Query DSL基本语法
```
{
  query_name: {
    argument: value,
    argument: value,
    ...
  }
}

{
  query_name: {
    field_name: {
      argument: value,
      argument: value,
    }
  }
}

```
示例
```
GET /index/type/_search
{
  "query": {
    "match":{
      "field": "value"
    }
  }
}
```

3、组合多个搜索条件
```
GET /index/type/_search
{
  "query": {
    "bool": {
      "must": {"match": {"name": "Tom"}},
      "should": [
        "match": {"age": 23},
        {
          "bool": {
            "must": {"match": {"address": "beijing"}},
            "must_not": {"match": {"rude": true}}
          }
        }
      ],
      "minimum_should_match": 1
    }
  }
}
```
示例
```
# 准备3条数据
PUT /website/article/1
{
  "title": "elasticsearch title",
  "content": "this is a elasticsearch content",
  "author": "Peng Shiyu"
}

PUT /website/article/2
{
  "title": "hadoop title",
  "content": "this is a hadoop content",
  "author": "Peng Shiyu"
}

PUT /website/article/3
{
  "title": "hbase title",
  "content": "this is a hbase content",
  "author": "mouday"
}

GET /website/article/_search

# 搜索条件，author包含peng，title可以包含elasticsearch
GET /website/article/_search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "author": "peng"
        }
      },
      "should": {
        "match": {
          "title": "elasticsearch"
        }
      }
    }
  }
}

```


## 三、filter与query深入对比解密：相关度，性能

1、filter示例
```
GET /website/article/_search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "author": "peng"
        }
      },
    "filter": {
      "match": {
        "title": "hadoop"
      }
    }
    }
  }
}
```
2、filter 和 query比对
filter 仅仅按照搜索条件过滤出需要的数据，不计算相关度
query 会计算每个document相对搜索条件的相关度，并按照相关度排序

3、filter和 query性能
filter 可以使用内置自动cache
query 要计算相关度分数，无法使用cache

## 四、常用的各种query搜索语法
1、match_all
```
GET /index/type/_search
{
  "query": {
    "match_all": {}
  }
}
```

2、match
```
GET /index/type/_search
{
  "query": {
    "match": {
      "field": "value"
    }
  }
}
```

3、multi match
```
GET /index/type/_search
{
  "query": {
    "multi_match": {
      "query": "text",
      "fields": ["title", "content"]
    }
  }
}
```

4、range query
```
GET /index/type/_search
{
  "query": {
    "range": {
      "age": {
        "gte": 20,
        "lt": 30
      }
    }
  }
}
```

5、term query 整串查询，不分词
```
GET /index/type/_search
{
  "query": {
    "term": {
      "field": "value"
    }
  }
}
```

6、terms query
```
GET /index/type/_search
{
  "query": {
    "terms": {
      "field": ["value1", "value2"]
    }
  }
}
```

7、exist query 查询字段不能为空（2.x版本）
```
GET /index/type/_search
{
  "query": {
    "exists": {
      "field": "value1"
    }
  }
}
```

## 五、多搜索条件组合查询
bool
  -query
    -should
    -must
    -must_not
  -filter

只过滤，不排序示例
```
"query": {
  "constant_score": {
    "filter": {
      "range": {
        "age": {
          "gte": 30
        }
      }
    }
  }
}
```
组合分数计算：
先计算每个document针对他的相关度分数，然后bool综合所有分数，合并为一个分数
filter 不计算分数

## 六、定位不合法的搜索以及其原因
```
GET /index/type/_validate/query?explain
{
  "query": {
    "match": {
      "feild": "value"
    }
  }
}
```

一般用在特别复杂的搜索语句检查，验证搜索语句是否合法

## 七、定制搜索结果的排序规则
定制排序规则
```
PUT /alibaba/taobao/1
{
  "name": "dog",
  "price": 20
}

PUT /alibaba/taobao/2
{
  "name": "cat",
  "price": 25
}

PUT /alibaba/taobao/3
{
  "name": "pig",
  "price": 23
}

# 按照价格大到小排序
GET /alibaba/taobao/_search
{
  "sort": {
    "price": {
      "order": "desc"
    }
  }
}
```

## 八、将一个field索引两次来解决字符串排序问题
如果对一个string field进行排序，结果往往不准确，
因为分词后是多个单词，再排序就不是我们想要的结果了

通常的解决方案是：
将一个string field建立两次索引，一个分词，用于搜索；一个不分词，用来排序
```
PUT /website
{
  "mappings": {
    "article": {
      "properties": {
        "title": {
          "type": "text",
          "fields": {
            "raw": {
              "type": "string",
              "index": "not_analyzed"
            }
          },
          "fielddata": true
        },
        "content": {
          "type": "text"
        },
        "post_date": {
          "type": "date"
        },
        "author_id": {
          "type": "long"
        }
      }
    }
  }
}

# 查看mapping
GET /website/_mapping/article
{
  "website": {
    "mappings": {
      "article": {
        "properties": {
          "author_id": {
            "type": "long"
          },
          "content": {
            "type": "text"
          },
          "post_date": {
            "type": "date"
          },
          "title": {
            "type": "text",
            "fields": {
              "raw": {
                "type": "keyword"
              }
            },
            "fielddata": true
          }
        }
      }
    }
  }
}
```
填充数据
```
PUT /website/article/1
{
  "title": "title 1",
  "content": "content 1",
  "post_date": "2019-04-30",
  "author_id": 1001
}

PUT /website/article/2
{
  "title": "title 2",
  "content": "content 2",
  "post_date": "2019-05-30",
  "author_id": 1002
}

PUT /website/article/3
{
  "title": "title 3",
  "content": "content 3",
  "post_date": "2019-04-28",
  "author_id": 1001
}
```

分词后的排序结果
```
GET /website/article/_search
{
  "sort": [
    {
      "title": {
        "order": "desc"
      }
    }
  ]
}


{
  "took": 26,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 3,
    "max_score": null,
    "hits": [
      {
        "_index": "website",
        "_type": "article",
        "_id": "2",
        "_score": null,
        "_source": {
          "title": "title 2",
          "content": "content 2",
          "post_date": "2019-05-30",
          "author_id": 1002
        },
        "sort": [
          "title"
        ]
      },
      {
        "_index": "website",
        "_type": "article",
        "_id": "1",
        "_score": null,
        "_source": {
          "title": "title 1",
          "content": "content 1",
          "post_date": "2019-04-30",
          "author_id": 1001
        },
        "sort": [
          "title"
        ]
      },
      {
        "_index": "website",
        "_type": "article",
        "_id": "3",
        "_score": null,
        "_source": {
          "title": "title 3",
          "content": "content 3",
          "post_date": "2019-04-28",
          "author_id": 1001
        },
        "sort": [
          "title"
        ]
      }
    ]
  }
}
```

使用排序属性排序结果
```
GET /website/article/_search
{
  "sort": [
    {
      "title.raw": {
        "order": "desc"
      }
    }
  ]
}

{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 3,
    "max_score": null,
    "hits": [
      {
        "_index": "website",
        "_type": "article",
        "_id": "3",
        "_score": null,
        "_source": {
          "title": "title 3",
          "content": "content 3",
          "post_date": "2019-04-28",
          "author_id": 1001
        },
        "sort": [
          "title 3"
        ]
      },
      {
        "_index": "website",
        "_type": "article",
        "_id": "2",
        "_score": null,
        "_source": {
          "title": "title 2",
          "content": "content 2",
          "post_date": "2019-05-30",
          "author_id": 1002
        },
        "sort": [
          "title 2"
        ]
      },
      {
        "_index": "website",
        "_type": "article",
        "_id": "1",
        "_score": null,
        "_source": {
          "title": "title 1",
          "content": "content 1",
          "post_date": "2019-04-30",
          "author_id": 1001
        },
        "sort": [
          "title 1"
        ]
      }
    ]
  }
}
```

## 九、相关度评分TF&IDF算法独
1、relevance score算法
计算索引文本与搜索文本的关联匹配度

ElasticSearch使用TF/IDF算法
term frequency/ inverse document frequency算法 
TF:  搜索文本中的各个词条在field文本中出现次数，出现次数越多，就越相关
IDF: 搜索文本中各个词条在整个索引的所有文档中出现的次数，出现次数越多，就越不相关
field length norm : field长度越长，相关度越弱

举例：
doc1: hello, you and world is very good
doc2: hello, how are you

2、score计算
```
GET /website/article/_search?explain
{
  "query": {
    "match": {
      "title": "title"
    }
  }
}

```

3、分析一个document是如何被匹配上的
```
GET /website/article/1/_explain
{
  "query": {
    "match": {
      "title": "title"
    }
  }
}
```


## 十、内核级知识点之doc value
搜索的时候，主要依靠倒排索引；
排序的时候，需要依靠正排索引，看到每个document的每个field
然后进行排序，所谓的正排索引，其实就是doc values

在建立索引的时候，一方面会建立倒排索引，以供搜索使用
一方面会建立正排索引，也就是doc values，以供排序、聚合、过滤等操作使用
doc values是被保存在磁盘上的，此时，如果内存足够，os会自动将其缓存到内存中，性能还是会很高
如果内存不足够，os会将其写入磁盘上

## 十一、内核解密之query phase
1、query phase
（1）搜索请求发送到某一个coordinate node，构建一个priority queue，长度以paging操作from和size为准，默认为0
（2）coordinate node将请求转发到所有的shard，每个shard本地搜索，并构建一个本地的priority queue
（3）各个shard将自己的priority queue（doc id）返回给coordinate node，并构建一个全局的priority queue

2、replica shard提升搜索吞吐量
一次请求要打到所有的shard的一个replica/primary上，如果每个shard都有多个replica，
那么同时并发过来的搜索请求可以同时打到其他的replica上去

## 十二、内核解密之fetch phase
1、工作流程
（1）coordinate node构建完priority queue之后，就发送mget请求去所有的shard上获取对应的document
（2）各个shard将document返回给coordinate node
（3）coodinate node将合并后的document结果返回给client客户端

2、如果不加from 和size，默认from=0 size=10, 按照socre排序

## 十三、搜索相关参数梳理
1、preference
决定了哪些shard会被用来执行搜索操作
```
_primary, _primary_first, _local, 
_only_node:xyz, _prefer_node:xyz,
_shard:2,3
```

2、bouncing results问题
两个document 排序，field值相同，不同的shard商，可能排序不同;
每次请求轮询打到不同的shard上，每次页面上看到的搜索结果的排序都不一样
这就是bouncing result，也就是跳跃的结果

解决方案
将preference设置为一个随机的字符串，比如说user_id，
让每个user每次搜索的时候都是用同一个shard上执行，就不会看到bouncing result

timeout 将查到的数据直接返回，避免查询耗时过长
routing document文档路由，routing=user_id, 这就可以让同一个user对应的数据到一个shard上去
search_type
dfs_query_then_fetch 可以提升revelance sort精准度


## 十四、基于scroll技术滚动搜索大量数据

使用scroll滚动搜索
先搜索一批数据，然后下次在搜索一批，以此类推，知道搜索出全部的数据来
scroll搜索会在第一次搜索的时候，保存一个当前的视图快照，之后会基于该就的视图快照提供数据搜索，如果这个期间数据变更，是不会让用户看到的
采用基于_doc 进行排序的方式，性能较高哦
每次发送scroll请求，还需要指定一个scroll参数，指定一个时间窗口，每次搜索请求只要在这个时间窗口内完成就可以

size 会发送给每个shard， 因此每次最多会返回size * primary shard条数据
scroll 看起来挺像分页的，但是其实使用场景不一样，分页主要是用来一页一页搜索，给用户的，
scroll主要是用来一批一批检索数据，让系统进行处理的

```
# 第一次请求
GET /website/article/_search?scroll=1m
{
  "query": {
    "match_all": {}
  },
  "sort": ["_doc"],
  "size": 2
}

# 第二次请求
GET /_search/scroll
{
  "scroll": "1m",
  "scroll_id": "DnF1ZXJ5VGhlbkZldGNoBQAAAAAAADp0FkVUUFF3UUUyUmxhV1JTdWtPRkdpd2cAAAAAAAA6dRZFVFBRd1FFMlJsYVdSU3VrT0ZHaXdnAAAAAAAAOnYWRVRQUXdRRTJSbGFXUlN1a09GR2l3ZwAAAAAAADp3FkVUUFF3UUUyUmxhV1JTdWtPRkdpd2cAAAAAAAA6eBZFVFBRd1FFMlJsYVdSU3VrT0ZHaXdn"
}

```

