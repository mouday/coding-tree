# ElasticSearch索引管理

## 一、创建、修改以及删除索引
1、创建索引
```
PUT /alibaba
{
  "settings": {
    "number_of_replicas": 0,
    "number_of_shards": 1
  },
  "mappings": {
    "tianmao": {
      "properties": {
        "name": {
          "type": "text"
        }
      }
    }
  }
}
```

2、修改索引
```
PUT /alibaba/_settings
{
  "number_of_replicas": 1
}

```

3、删除索引
```
DELETE /index
DELETE /index1,index2
DELETE /index*
DELETE /_all
```

禁用all参数，避免删除所有索引
elasticsearch.yml
action.destructive_requires_name: true

## 二、修改分词器以及定制自己的分词器
1、默认的分词器
standard
standard tokenizer 以单词边界进行切分
shandard token filter 什么都不做
lowercase token filter 将所有字母转换为小写
stop token filter （默认被禁用）移除停用词，比如 a， the it等等

2、修改分词器设置
```
PUT /index
{
    "settings": {
        "analysis": {
            "analyzer": {
                "es_std": {
                    "type": "standard",
                    "stopwords": "_english_"
                }
            }
        }
    }
}
```

3、分词测试
```
GET /index/_analyze
{
  "analyzer": "es_std",
  "text": "nihao es"
}
```

4、自定义分词器
```
PUT /index
{
    "settings": {
        "analysis": {
            "char_filter": {
                "&_to_and": {
                    "type": "mapping",
                    "mappings": ["&=>and"]
                }
            },
            "filter": {
                "my_stopwords": {
                    "type": "stop",
                    "stopwords": ["the", "a"]
                }
            },
            "analyzer": {
                "my_analyzer": {
                    "type": "custome",
                    "char_filter": ["html_strip", "&_to_and"],
                    "tokenizer": "standard",
                    "filter": ["lowercase", "my_stopwords"]
                }
            }
        }
    }
}
```

分词器测试
```
GET /alibaba/_analyze
{
  "analyzer": "my_analyzer",
  "text": "nihao es & haha shit <a>"
}

{
  "tokens": [
    {
      "token": "nihao",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "es",
      "start_offset": 6,
      "end_offset": 8,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "and",
      "start_offset": 9,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "haha",
      "start_offset": 11,
      "end_offset": 15,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "shit",
      "start_offset": 16,
      "end_offset": 20,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}

```

使用自定义分词器
```
PUT /alibaba/_mapping/fruit
{
  "properties": {
    "name": {
      "type": "text",
      "analyzer": "my_analyzer"
    }
  }
}
```

## 三、type底层数据结构
type 是一index中用来区分类似的数据的，当可能有不同的fields，
而且有不同的属性来控制索引建立，分词器field的value，
在底层的lucene中建立索引的时候，全部是opaque bytes类型，不区分类型的
lucene是没有type的概念的，在document中，实际上将type作为一个document的field来存储，即type
es通过_type来进行type的过滤和筛选，一个index的多个type，实际上是放在一起存储的，
因此一个index下，不能有多个type重名，而且类型或者其他设置不同的，因为那样是无法处理的


存储结构
```
{
    "_type": "animal",
    "name": "dog"
}

{
    "_type": "fruit",
    "name": "apple"
}
```

最佳实践
将类似结构的type放在一个index下，这些type应该有多个field是相同的
假如说，你讲两个type的field完全不同，放在一个index下，
那么就每条数据都至少有一半field在底层的lucene中是空值，会有严重的性能问题

## 四、mapping root object深入剖析
1、root object
就是某个type对应的mapping json，包括了
properties(type类型, index设置是否分词, analyzer分词器)，
metadata（`_id, _source, _type`）
settings（analyzer）
其他settings（比如include_in_all）

2、properties
```
PUT /alibaba/_mapping/fruit
{
  "properties": {
    "age": {
      "type": "long"
    }
  }
}
```

3、source
（1）查询的时候，可以直接拿到完整的document，不需要先拿document id，再发送一次请求拿document
（2）partial update基于_source 实现
（3）reindex 时，直接基于_source 实现，不需要查询数据再修改
（4）可以基于_source 定制返回field
（5）debug query更容易，可以直接看到_source
禁用source
```
PUT /alibaba/_mapping/fruit2
{
  "_source": {
    "enabled": false
  }
}
```

4、all
将所有的field打包在一起，作为一个_all field，建立索引
没有指定任何field进行搜索时，就是使用_all field在搜索
```
PUT /alibaba/_mapping/fruit3
{
  "_all": {
    "enabled": false
  }
}
```

也可以在field级别设置include_in_all field ,设置是否将field的值包含在_all field中
```
PUT /alibaba/_mapping/fruit
{
  "properties": {
   "title": {
     "type": "text",
     "include_in_all": false
   }
  }
}
```

5、标示性metadata
```
_index
_type
_id
```

## 五、定制化自己的dynamic mapping策略
1、定制dynalic 策略

true 遇到陌生字段，就进行dynamic mapping
flase 遇到陌生字段，就忽略
strict 遇到陌生字段，就报错
```
PUT /alibaba
{
  "mappings": {
    "taobao": {
      "dynamic": "strict",
      "properties": {
        "title": {
          "type": "text"
        },
        "address": {
          "type": "text"
          
        }
      }
    }
  }
}

PUT /alibaba/baotao/1
{
  "title": "dog",
  "address": "beijing"
}

PUT /alibaba/baotao/2
{
  "title": "dog",
  "address": "beijing",
  "price": 26
}

GET /alibaba/_mapping/taobao
```

2、定制dynamic mapping策略
（1）date_detection
默认会按照一定格式识别date，比如yyyy-MM-dd,
如果某个field先过来一个2019-05-02，就会被自动dynamic mapping成date
后面如果再过来一个“hello world”就被报错
可以手动关闭某个type的date_detection 如果需要，自己手动执行某个field为date类型
```
PUT /my_index/_mapping/my_type
{
    "date_detecion": false
}
```

(2)定制自己的dynamic mapping template(type level)
```
PUT /my_index
{
  "mappings": {
    "my_type": {
      "dynamic_templates": [{
        "en": {
          "match": "*_en",
          "match_mapping_type": "string",
          "mapping": {
            "type": "string",
            "analyzer": "english"
          }
        }
      }]
    }
  }
}
```

分词效果测试
```
# 标准分词器（this is a good man）
GET /my_index/_analyze
{
  "analyzer": "standard",
  "text": "this is a good man"
}


# english分词器 （good man）
GET /my_index/_analyze
{
  "analyzer": "english",
  "text": "this is a good man"
}
```

检测动态分词模板效果
```
# 添加数据
PUT /my_index/my_type/1
{
  "name": "this is a good man",
  "name_en": "this is a good man"
}

# 使用english分词器字段搜索（失败）
GET /my_index/my_type/_search
{
  "query": {
    "match": {
      "name_en": "is"
    }
  }
}

# 使用standard 分词器字段搜索（成功）
GET /my_index/my_type/_search
{
  "query": {
    "match": {
      "name": "is"
    }
  }
}
```
默认standard 分词器不会过滤停用词，is等词不进行索引
english分词器会过滤停用词

(3)定制自己的dynamic mapping template(index level)
```
PUT /my_index
{
    "mappings": {
        "_default": {
            "_all": {
                "enabled": false
            }
        },
        "blog": {
            "_all": {
                "enabled": false
            }
        }
    }
}
```

## 六、基于scoll+bulk+索引别名实现零停机重建索引
1、重建索引
一个field的设置是不能被修改的，
如果要修改一个field，那么应该重新按照新的mapping，建立一个index
然后，将数据批量查询出来，重新用bulk api写入index中，
批量查询的时候，建议才有scroll api，并采用多线程并发的方式来reindex数据，
每次scroll就查询指定日期的一段数据，交给一个线程即可

（1）dymanic mapping将字符串识别为了日期类型
```
PUT /my_index/my_type/1
{
  "title": "2019-05-03"
}
```
（2）当后期向索引中键入string类型的数据就报错
```
# 插入数据报错
PUT /my_index/my_type/2
{
  "title": "this is a title"
}

# 查看索引mapping， 发现title是date类型
GET /my_index/_mapping/my_type
{
  "my_index": {
    "mappings": {
      "my_type": {
        "properties": {
          "title": {
            "type": "date"
          }
        }
      }
    }
  }
}


```
（3）此时不能修改title类型
```
# 直接修改已存在索引字段会报错
PUT /my_index/_mapping/my_type
{
  "properties": {
    "title": {
      "type": "text"
    }
  }
}
```
（4）唯一的办法就是reindex，重建索引，将旧的索引数据查询出来，再导入新索引
（5）如果旧的索引已经在使用，修改为新的索引名称之后，应用程序不知道
如果要java程序进行修改，那么需要停机重启，降低可用性

（6）先给java应用一个别名用着，goods_index 指向旧索引my_index
```
PUT /my_index/_alias/goods_index

# 两个索引名称都能查询到数据
GET /my_index/my_type/_search

GET /goods_index/my_type/_search

```

（7）新建一个index，调整其title的类型为string
```
PUT /my_index_new
{
  "mappings": {
    "my_type": {
      "properties": {
        "title": {
          "type": "string"
        }
      }
    }
  }
}
```

（8）使用scroll api将数据批量查询出来
```
GET /my_index/my_type/_search?scroll=1m
{
  "query": {
    "match_all": {}
  },
  "sort": ["_doc"],
  "size": 1
    
}

GET /_search/scroll
{
  "scroll_id": "DnF1ZXJ5VGhlbkZldGNoBQAAAAAAAEzPFkVUUFF3UUUyUmxhV1JTdWtPRkdpd2cAAAAAAABM0BZFVFBRd1FFMlJsYVdSU3VrT0ZHaXdnAAAAAAAATNEWRVRQUXdRRTJSbGFXUlN1a09GR2l3ZwAAAAAAAEzSFkVUUFF3UUUyUmxhV1JTdWtPRkdpd2cAAAAAAABM0xZFVFBRd1FFMlJsYVdSU3VrT0ZHaXdn",
  "scroll": "1m"  
}
```
（9）采用bulk api将数据批量写入新索引
```
POST /my_index_new/my_type/_bulk
{"index": {"_id": 1}}
{"text": "2019-05-03"}
```

（10）循环8~9,将数据全部写入新索引
（11）将旧索引，alias 切换到新索引，应用零停机切换
```
POST /_aliases
{
  "actions": [
    {
      "remove": {
        "index": "my_index",
        "alias": "goods_index"
      }
    },
    {
      "add": {
        "index": "my_index_new",
        "alias": "goods_index"
      }
    }
  ]
}

# 查看索引别名切换结果
GET /my_index

GET /my_index_new
```
（12）直接通过goods_index别名查询
```
GET /goods_index/my_type/_search
```


2、基于alias 对client透明切换index
```
PUT /my_index_v1/_alias/my_index

```
client 对my_index进行操作
reindex操作完成之后，切换v1到v2
```
POST /_aliases
{
  "actions": [
    {
      "remove": {
        "index": "my_index",
        "alias": "goods_index"
      }
    },
    {
      "add": {
        "index": "my_index_new",
        "alias": "goods_index"
      }
    }
  ]
}
```

## 七、倒排索引组成结构以及其索引不可变原因
1、倒排索引
倒排索引，适合用于搜索

倒排索引结构
（1）包含这个关键词的document list
（2）包含这个关键词的document的数量 IDF
（3）这个关键词在每个document中出现的次数 TF
（4）这个关键词在这个document中的次序
（5）每个document的长度 length norm
（6）包含这个关键词的所有document的平均长度

2、索引不可变
不可变的好处
（1）不需要锁，提升并发能力，避免锁的问题
（2）数据不变，一直保存在os cache中，只要cache内存足够
（3）filter cache一直驻留在内存，因为数据不变
（4）可以压缩，节省cpu和io开销

不可变的坏处
每次都要重新构建整个索引

## 八、深度图解剖析document写入原理（buffer，segment，commit）
1、数据写入
（1）数据写入buffer
（2）commit point
（3）buffer 中的数据写入新的index segment（lucene）
（4）等待在os cache 中的index segment被fsync强制刷到磁盘上
（5）新的index segment被打开，供search使用
（6）buffer被清空

2、数据删除
每次commit point时，会有一个.del文件，
标记了哪些segment中的哪些document被标记delete了
搜索的时候，会一次查询所有的segment，从旧的到新的，
比如被修改过的document，在旧的segment中，会标记为deleted，
在新的segment中会有新的数据

3、数据修改
相当于将旧的数据标记为deleted，新写一份数据到es

## 九、优化写入流程实现NRT近实时（filesystem cache，refresh）
基于上面的流程，每次必须等待fsync将segment刷入磁盘，才能将segment打开供search使用
这样一来，从写入document到可以搜索，可能会超过1分钟
主要瓶颈在于fsync实际发生磁盘IO写数据进磁盘，很耗时

写入流程改进：
（1）数据写入buffer
（2）buffer满之后，buffer中的数据被写入segment文件，但是先写入os cache
（3）只要segment写入os cache，那就直接打开供search使用，不立即执行commit

数据写入os cache，并打开供搜索的过程，叫做refresh，默认是每隔1秒一次
所以es是近实时的，写入到可以被搜索，默认是1秒

手动refresh, 一般不用手动执行，es自己处理就行
```
POST /my_index/_refresh

```

设置refresh时间， 如果失效要求较低，可以设置长一些
```
PUT /my_index
{
    "settings": {
        "refresh_interval": "30s"
    }
}
```

## 十、优化写入流程实现durability可靠存储（translog，flush）

（1）数据写入buffer缓冲区和translog日志文件
（2）每隔1秒钟，buffer中的数据被写入新的segment file，并进入os cache，
此时segment被打开供search使用
（3）buffer被清空
（4）重复1~3 新的segment不断添加，buffer不断不清空，而translog中的数据不断累加
（5）当translog长度达到一定程度的时候，commit操作发生
    （5-1）buffer中的所有数据写入一个新的segment，并写入os cache，打开供search使用
    （5-2）buffer被清空
    （5-3）一个commit point 被写入磁盘，标明了所有的index segment
    （5-4）file system cache中的所有index segment file 缓存数据，被fsync强制刷到磁盘上
    （5-5）现有的translog被清空，创建一个新的translog

基于translog 和commit point进行数据恢复

fsync + 清空translog就是flush，默认每隔30分钟flush一次，
或者当translog过大的时候，也会flush,自动执行就行

```
POST /my_index/_flush

```
translog，每隔5 秒被fsync一次到磁盘上，在一次增删改操作之后，
当fsync 在primary shard 和 replica shard都成功之后，那次增删改操作才会成功

但是，这种在一次增删改时强行fsync translog 可能会导致部分操作比较耗时，也可以允许部分数据丢失
设置异步fsync translog
```
POST /my_index/_settings
{
    "index.translog.durability": "async",
    "index.translog.sync_interval": "5s",
}
```

## 十一、写入流程实现海量磁盘文件合并（segment merge，optimize）
每秒1个segment file，文件过多，而且每次search都要搜索所有的segment，很耗时

默认会在后台执行segment merge 操作，在merge的时候，被标记为deleted的document也会被彻底物理删除

每次merge 操作的流程
（1）选择一些有相似大小的segment，merge成一个大的segment
（2）将新的segment flush到磁盘上
（3）写一个新的commit point，包括了新的segment，并且排除旧的哪些segment
（4）将新的segment打开供搜索
（5）将旧的segment删除


```
POST /my_index/_optimize?max_num_segments=1
```
