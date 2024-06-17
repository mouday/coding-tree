# ElasticSearch搜索基础

## 一、搜索请求结果
```
GET taobao/product/_search?q=name:Pig

{
  "took": 42,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 0.80259144,
    "hits": [
      {
        "_index": "taobao",
        "_type": "product",
        "_id": "4",
        "_score": 0.80259144,
        "_source": {
          "name": "Pig",
          "price": 36
        }
      }
    ]
  }
}

```

took 整个搜索请求花费了多少毫秒
shards.total 处理请求的shards
shards.faild 失败数量，primary 和replica全部挂掉，不影响其他 shard
  默认情况下，一个搜索请求，会打到一个index的所有primary shard，
  也可能到primary shard的其中一个replica shard

hits.total 本次搜索，返回几条结果
hits.max_score 本次搜索所有结果中，最大相关度
  每个document对于search的相关度，越相关score分数越大，排位越靠前

hits.hits  默认前10条完成数据

timeout 默认无timeout，latency平衡completeness，
部分应用会有时间限制，需要快速返回数据
指定每个shard，就只能在timeout时间范围内，将搜索到的部分数据直接返回给客户端

1ms（毫秒） 1s（秒） 1m(分钟)
```
GET _search?timeout=10
```

## 二、multi-index 和 multi-type搜索模式
（1）multi-index
```
/_search   # 所有索引，所有type下的所有数据
/index/_search 指定索引，搜索其下的所有type数据
/index1,index2/_search 同时搜索两个索引下的数据
/*1,*2/_search  按照通配符去匹配多个索引
```

（2）multi-type
```
/index/type/_search 搜索指定索引下指定type数据
/index/type1,type2/_search  一个索引下多个type数据
/index1,index2/type1,type2/_search  多个索引下多个type数据
/_all/type1,type2/_search   所有索引下多个type数据

```

client 发送一个搜索请求，会把请求打到所有的primary shard上执行
因为每个shard都包含部分数据，所以每个shard上都可能会包含搜索请求的结果
但是，如果primary shard有replica shard，那么请求也可以打到replicashard执行


## 三、分页搜索语法 和 deep paging性能问题
（1）分页搜索语法

```
GET /_search?size=10
GET /_search?size=10&from=0
GET /_search?size=10&from=20
```
```
      from size
第一页：0     3
第二页：3     3
```

（2）deep paging 深度分页
举例：
如果一共有60000条数，一共3个shard，每个shard20000条数据
搜索第1001页（1000，10）每个shard都会排序后返回1009条数据
coordinate node排序后在输出

影响：
[1] 传输耗费带宽
[2] 数据耗费内存
[3] 排序耗费CUP

## 四、query string search语法和all metadata
（1）query string search语法
```
GET /index/type/_search?q=key:value
GET /index/type/_search?q=+key:value  # 包含
GET /index/type/_search?q=-key:value  # 不包含
```

(2)all metadata
```
GET /index/type/_search?q=value
```
搜索任意包含value的结果
`_all`元数据
在建立索引的时候，我们插入一条document，里边包含的所有字段，会串联起来变成一个长的字符创
作为`_all field` 的值，同时建立索引
搜索时没有指定字段field，就默认搜索`_all field`

注意：生产环境中不使用

## 五、mapping到底是什么

数据准备
```
put /website/article/1
{
  "title": "this is a title one",
  "content": "this is a content one",
  "post_date": "2019-05-02",
  "author_id": 9527
}


put /website/article/2
{
  "title": "this is a title two",
  "content": "this is a content two",
  "post_date": "2019-05-03",
  "author_id": 9527
}

put /website/article/3
{
  "title": "this is a title three",
  "content": "this is a content three",
  "post_date": "2019-05-02",
  "author_id": 9525
}

```
搜索测试
```
GET /website/article/_search?q=2019  # 3

GET /website/article/_search?q=2019-05-02  # 3

GET /website/article/_search?q=post_date:2019-05-02  # 1

GET /website/article/_search?q=post_date:2019  # 0

```

自动或手动为index中的type建立一种数据结构和相关配置，简称为mapping
dynamic mapping 会自动创建index，创建type，以及type对应的mapping
mapping包含了每个field对应的数据类型，以及如何分词等设置

```
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
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "post_date": {
            "type": "date"
          },
          "title": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    }
  }
}
```

## 六、精确匹配与全文搜索
1、exact value 精确搜索
例如：
2017-01-01 搜索的时候必须输入 2017-01-01，才能搜索出来

2、full text 全文检索
（1）缩写 vs，全称：cn vs. chian
（2）格式转化：like liked likes
（3）大小写： Tom vs tom
（4）同义词：like vs love

例如：
2017-01-01 搜索 2017 01 都可以搜出来

全文检索，分词搜索，缩写，时态，大小写，同义词


## 七、倒排索引核心原理
举例：
1、两个文档
I like my dog
I think you like my dog

2、分词，初步建立倒排索引
```
word  doc1  doc2  normalization
I      *     *
like   *     *      -> like
my     *     *
dog    *     *      -> dogs
think  *     -
you    *     -
```

3、搜索搜不到任何结果
mother love little cat

4、normalization 
时态，单复数，同义词转换
建立倒排索引的时候，会对拆分出来的各个单词进行相应的处理
以提升后面搜索的时候能够搜到的相关联文档的概率

5、搜索串分词后搜索：
```
mother
love
little
cat
```

## 八、分词器的内部组成
1、分词器
切分词语，normalization

提升recall召回率（查全率）：
搜索的时候，增加能够搜到结果的数量

character filter 字符预处理 <h1>hello</h1> -> hello
tokenizer   分词  hello you and me -> hello, you, and , me
token filter  lowercase stop word   Tom -> tom  small -> little

分词器很重要，将一段文本进行各种处理，最后处理好的结果才会拿去建立倒排索引

2、内置分词器

standard analyzer （默认）
simple analyzer
whitespace analyzer
language analyzer（特定语言分词器）

## 九、query string的分词

query string 必须以和index建立时相同的analyzer进行分词
query string 对exact value和full text的区别

知识点：
不同类型的field，有的是full text， 有的是exact value
date： exact value  eg: date
`_all`: full text, 分词， normalization


测试分词器
```
GET /_analyze
{
  "analyzer": "standard",
  "text": "this is a good man"
}
```

## 十、透彻理解mapping
1、往es直接插入数据，es会自动建立索引，建立type 以及对应的mapping
2、mapping自动定义每个field的数据类型
3、不同的数据类型，有exact value  和 full text
4、exact value 建立倒排索引的时候，不会分词，将整个值作为一个关键字建立到倒排索引中
5、full text 会经历各种处理，分词，normalization（时态，同义词，大小写），才会建立到索引中
6、一个搜索过来，对搜索文本的处理也一样
7、可以使用dynamic mapping 自动建立mapping，也可以手动设置
8、mapping就是index的type的元数据，每个type都有自己的mapping，
  决定了数据类型，建立倒排索引的行为，还有进行搜索的行为

## 十一、dynamic mapping
1、核心数据类型
string
byte short integer long
float double
boolean
date

2、dynamic mapping
true or false -> boolean
123           -> long
123.45        -> double
2017-01-01    -> date
"hello"       -> string/text

3、查看mapping
```
GET /index/_mapping/type
```

## 十二、手动建立和修改mapping
1、建立索引
analyzed
not_analyzed
no

2、修改mapping
只能创建index时手动建立mapping，或新增field mapping
不能update field mapping

```
# 建立mapping
PUT /website
{
  "mappings": {
    "article": {
      "properties": {
        "title": {
          "type": "text"
        },
        "content": {
          "type": "text",
          "analyzer": "english"
        },
        "id": {
          "type": "long"
        },
        "post_date": {
          "type": "date"
        }
      }
    }
  }
}

# 添加字段不分词
PUT website/_mapping/article
{
  "properties": {
    "publisher":{
      "type": "string",
      "index": "not_analyzed"
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
          "content": {
            "type": "text",
            "analyzer": "english"
          },
          "id": {
            "type": "long"
          },
          "post_date": {
            "type": "date"
          },
          "publisher": {
            "type": "keyword"
          },
          "title": {
            "type": "text"
          }
        }
      }
    }
  }
}
```

分词测试
```
# publisher字段不支持分词，会报错
GET website/_analyze
{
  "field": "publisher",
  "text": "this is a good man"
}


# 标准分词
GET website/_analyze
{
  "field": "title",
  "text": "this is a good man"
}
{
  "tokens": [
    {
      "token": "this",
      "start_offset": 0,
      "end_offset": 4,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "is",
      "start_offset": 5,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "a",
      "start_offset": 8,
      "end_offset": 9,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "good",
      "start_offset": 10,
      "end_offset": 14,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "man",
      "start_offset": 15,
      "end_offset": 18,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}

# english分词
GET website/_analyze
{
  "field": "content",
  "text": "this is a good man"
}

{
  "tokens": [
    {
      "token": "good",
      "start_offset": 10,
      "end_offset": 14,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "man",
      "start_offset": 15,
      "end_offset": 18,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}

```


## 十三、mapping复杂数据类型
1、multivale field
```
{"tags": ["red", "blue"]}
```

2、empty field
```
null, [], [null]
```

3、object类型数据底层结构
```
{
  "info"
  {
    "address": "beijing"
  }
  "name": "Tom"
}
```

数据类型存储
```
info.address: beijing
name: Tom
```

