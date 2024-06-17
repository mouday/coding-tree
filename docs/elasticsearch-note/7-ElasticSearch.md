# ElasticSearch深度探秘搜索技术1

## 手动控制全文检索结果的精准度

1、为帖子数据增加标题字段
```
POST /forum/article/_bulk
{ "update": { "_id": "1"} }
{ "doc" : {"title" : "this is java and elasticsearch blog"} }
{ "update": { "_id": "2"} }
{ "doc" : {"title" : "this is java blog"} }
{ "update": { "_id": "3"} }
{ "doc" : {"title" : "this is elasticsearch blog"} }
{ "update": { "_id": "4"} }
{ "doc" : {"title" : "this is java, elasticsearch, hadoop blog"} }
{ "update": { "_id": "5"} }
{ "doc" : {"title" : "this is spark blog"} }
```

2、搜索标题中包含java或elasticsearch的blog

这个，就跟之前的那个term query，不一样了。不是搜索exact value，是进行full text全文检索。
match query，是负责进行全文检索的。
当然，如果要检索的field，是not_analyzed类型的，那么match query也相当于term query。

```
GET /forum/article/_search
{
    "query": {
        "match": {
            "title": "java elasticsearch"
        }
    }
}
```

3、搜索标题中包含java和elasticsearch的blog

搜索结果精准控制的第一步：
灵活使用and关键字，如果你是希望所有的搜索关键字都要匹配的，
那么就用and，可以实现单纯match query无法实现的效果

```
GET /forum/article/_search
{
  "query": {
      "match": {
          "title": {
            "query": "java elasticsearch",
            "operator": "and"
          }
      }
  }
}
```

4、搜索包含java，elasticsearch，spark，hadoop，4个关键字中，至少3个的blog

控制搜索结果的精准度的第二步：
指定一些关键字中，必须至少匹配其中的多少个关键字，才能作为结果返回

```
GET /forum/article/_search
{
  "query": {
    "match": {
      "title": {
        "query": "java elasticsearch spark hadoop",
        "minimum_should_match": "75%"
      }
    }
  }
}
```

5、用bool组合多个搜索条件，来搜索title
```
GET /forum/article/_search
{
  "query": {
    "bool": {
      "must":     { "match": { "title": "java" }},
      "must_not": { "match": { "title": "spark"  }},
      "should": [
        { "match": { "title": "hadoop" }},
        { "match": { "title": "elasticsearch"   }}
      ]
    }
  }
}
```
6、bool组合多个搜索条件，如何计算relevance score

must和should搜索对应的分数，加起来，除以must和should的总数

排名第一：java，同时包含should中所有的关键字，hadoop，elasticsearch
排名第二：java，同时包含should中的elasticsearch
排名第三：java，不包含should中的任何关键字

should是可以影响相关度分数的

must是确保说，谁必须有这个关键字，同时会根据这个must的条件去计算出document对这个搜索条件的relevance score
在满足must的基础之上，should中的条件，不匹配也可以，但是如果匹配的更多，
那么document的relevance score就会更高


7、搜索java，hadoop，spark，elasticsearch，至少包含其中3个关键字

默认情况下，should是可以不匹配任何一个的，
比如上面的搜索中，this is java blog，就不匹配任何一个should条件
但是有个例外的情况，如果没有must的话，那么should中必须至少匹配一个才可以
比如下面的搜索，should中有4个条件，默认情况下，只要满足其中一个条件，就可以匹配作为结果返回

但是可以精准控制，should的4个条件中，至少匹配几个才能作为结果返回
```
GET /forum/article/_search
{
  "query": {
    "bool": {
      "should": [
        {"match": { "title": "java" }},
        {"match": { "title": "elasticsearch"}},
        {"match": { "title": "hadoop"}},
        {"match": { "title": "spark"}}
      ],
      "minimum_should_match": 3
    }
  }
}
```

梳理一下学到的知识点

1、全文检索的时候，进行多个值的检索，有两种做法，match query；should
2、控制搜索结果精准度：and operator，minimum_should_match

## 基于term+bool实现的multiword搜索底层原理剖析

1、普通match如何转换为term+should
```
{
    "match": { "title": "java elasticsearch"}
}
```

使用诸如上面的match query进行多值搜索的时候，es会在底层自动将这个match query转换为bool的语法
bool should，指定多个搜索词，同时使用term query
```
{
  "bool": {
    "should": [
      { "term": { "title": "java" }},
      { "term": { "title": "elasticsearch"}}
    ]
  }
}
```

2、and match如何转换为term+must
```
{
    "match": {
        "title": {
            "query":    "java elasticsearch",
            "operator": "and"
        }
    }
}

{
  "bool": {
    "must": [
      { "term": { "title": "java" }},
      { "term": { "title": "elasticsearch"   }}
    ]
  }
}
```

3、minimum_should_match如何转换
```
{
    "match": {
        "title": {
            "query": "java elasticsearch hadoop spark",
            "minimum_should_match": "75%"
        }
    }
}

{
  "bool": {
    "should": [
      { "term": { "title": "java" }},
      { "term": { "title": "elasticsearch"   }},
      { "term": { "title": "hadoop" }},
      { "term": { "title": "spark" }}
    ],
    "minimum_should_match": 3 
  }
}
```

转换过程：
match query --> bool + term

## 基于boost的细粒度搜索条件权重控制

需求：
搜索标题中包含java的帖子，
同时呢，如果标题中包含hadoop或elasticsearch就优先搜索出来，
同时呢，如果一个帖子包含java hadoop，
一个帖子包含java elasticsearch，包含hadoop的帖子要比elasticsearch优先搜索出来

知识点，搜索条件的权重，boost，可以将某个搜索条件的权重加大，
此时当匹配这个搜索条件和匹配另一个搜索条件的document，计算relevance score时，
匹配权重更大的搜索条件的document，relevance score会更高，当然也就会优先被返回回来

默认情况下，搜索条件的权重都是一样的，都是1
```
GET /forum/article/_search 
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "title": "blog"
          }
        }
      ],
      "should": [
        {
          "match": {
            "title": {
              "query": "java"
            }
          }
        },
        {
          "match": {
            "title": {
              "query": "hadoop"
            }
          }
        },
        {
          "match": {
            "title": {
              "query": "elasticsearch"
            }
          }
        },
        {
          "match": {
            "title": {
              "query": "spark",
              "boost": 5
            }
          }
        }
      ]
    }
  }
}
```

## 多shard场景下relevance score不准确问题大揭秘

1、多shard场景下relevance score不准确问题大揭秘

如果你的一个index有多个shard的话，可能搜索结果会不准确


2、如何解决该问题？

（1）生产环境下，数据量大，尽可能实现均匀分配

数据量很大的话，其实一般情况下，在概率学的背景下，es都是在多个shard中均匀路由数据的，
路由的时候根据_id，负载均衡
比如说有10个document，title都包含java，一共有5个shard，那么在概率学的背景下，
如果负载均衡的话，其实每个shard都应该有2个doc，title包含java
如果说数据分布均匀的话，其实就没有刚才说的那个问题了

（2）测试环境下，将索引的primary shard设置为1个，number_of_shards=1，index settings

如果说只有一个shard，那么当然，所有的document都在这个shard里面，就没有这个问题了

（3）测试环境下，搜索附带search_type=dfs_query_then_fetch参数，会将local IDF取出来计算global IDF

计算一个doc的相关度分数的时候，就会将所有shard对的local IDF计算一下，获取出来，
在本地进行global IDF分数的计算，会将所有shard的doc作为上下文来进行计算，也能确保准确性。
但是production生产环境下，不推荐这个参数，因为性能很差。


## 基于dis_max实现best fields策略进行多字段搜索

1、为帖子数据增加content字段
```
POST /forum/article/_bulk
{ "index": { "_id": "1"} }
{"title" : "this is java and elasticsearch blog"}
{ "index": { "_id": "2"} }
{"title" : "this is java blog"}
{ "index": { "_id": "3"} }
{"title" : "this is elasticsearch blog"}
{ "index": { "_id": "4"} }
{"title" : "this is java, elasticsearch, hadoop blog"}
{ "index": { "_id": "5"} }
{"title" : "this is spark blog"}

POST /forum/article/_bulk
{ "update": { "_id": "1"} }
{ "doc" : {"content" : "i like to write best elasticsearch article"} }
{ "update": { "_id": "2"} }
{ "doc" : {"content" : "i think java is the best programming language"} }
{ "update": { "_id": "3"} }
{ "doc" : {"content" : "i am only an elasticsearch beginner"} }
{ "update": { "_id": "4"} }
{ "doc" : {"content" : "elasticsearch and hadoop are all very good solution, i am a beginner"} }
{ "update": { "_id": "5"} }
{ "doc" : {"content" : "spark is best big data solution based on scala ,an programming language similar to java"} }
```

2、搜索title或content中包含java或solution的帖子

下面这个就是multi-field搜索，多字段搜索
```
GET /forum/article/_search
{
    "query": {
        "bool": {
            "should": [
                { "match": { "title": "java solution" }},
                { "match": { "content":  "java solution" }}
            ]
        }
    }
}
```

3、结果分析

期望的是doc5，结果是doc2,doc4排在了前面

计算每个document的relevance score：每个query的分数，乘以matched query数量，除以总query数量

算一下doc4的分数

{ "match": { "title": "java solution" }}，针对doc4，是有一个分数的
{ "match": { "content":  "java solution" }}，针对doc4，也是有一个分数的

所以是两个分数加起来，比如说，1.1 + 1.2 = 2.3
matched query数量 = 2
总query数量 = 2

2.3 * 2 / 2 = 2.3

算一下doc5的分数

{ "match": { "title": "java solution" }}，针对doc5，是没有分数的
{ "match": { "content":  "java solution" }}，针对doc5，是有一个分数的

所以说，只有一个query是有分数的，比如2.3
matched query数量 = 1
总query数量 = 2

2.3 * 1 / 2 = 1.15

doc5的分数 = 1.15 < doc4的分数 = 2.3

4、best fields策略，dis_max

best fields策略，就是说，搜索到的结果，应该是某一个field中匹配到了尽可能多的关键词，被排在前面；而不是尽可能多的field匹配到了少数的关键词，排在了前面

dis_max语法，直接取多个query中，分数最高的那一个query的分数即可

{ "match": { "title": "java solution" }}，针对doc4，是有一个分数的，1.1
{ "match": { "content":  "java solution" }}，针对doc4，也是有一个分数的，1.2
取最大分数，1.2

{ "match": { "title": "java solution" }}，针对doc5，是没有分数的
{ "match": { "content":  "java solution" }}，针对doc5，是有一个分数的，2.3
取最大分数，2.3

然后doc4的分数 = 1.2 < doc5的分数 = 2.3，所以doc5就可以排在更前面的地方，符合我们的需要
```
GET /forum/article/_search
{
  "query": {
    "dis_max": {
      "queries": [
        {"match": {"title": "java solution"}},
        {"match": {"content": "java solution"}}
      ]
    }
  }
}
```


## 基于tie_breaker参数优化dis_max搜索效果

1、搜索title或content中包含java beginner的帖子
```
GET /forum/article/_search
{
    "query": {
        "dis_max": {
            "queries": [
                { "match": { "title": "java beginner" }},
                { "match": { "body":  "java beginner" }}
            ]
        }
    }
}
```

有些场景不是太好复现的，因为是这样，你需要尝试去构造不同的文本，然后去构造一些搜索出来，去达到你要的一个效果

可能在实际场景中出现的一个情况是这样的：

（1）某个帖子，doc1，title中包含java，content不包含java beginner任何一个关键词
（2）某个帖子，doc2，content中包含beginner，title中不包含任何一个关键词
（3）某个帖子，doc3，title中包含java，content中包含beginner
（4）最终搜索，可能出来的结果是，doc1和doc2排在doc3的前面，而不是我们期望的doc3排在最前面

dis_max，只是取分数最高的那个query的分数而已。

2、dis_max只取某一个query最大的分数，完全不考虑其他query的分数

3、使用tie_breaker将其他query的分数也考虑进去

tie_breaker参数的意义，在于说，将其他query的分数，乘以tie_breaker，然后综合与最高分数的那个query的分数，综合在一起进行计算
除了取最高分以外，还会考虑其他的query的分数
tie_breaker的值，在0~1之间，是个小数，就ok

```
GET /forum/article/_search
{
    "query": {
        "dis_max": {
            "queries": [
                { "match": { "title": "java beginner" }},
                { "match": { "body":  "java beginner" }}
            ],
            "tie_breaker": 0.3
        }
    }
}
```

## 基于multi_match语法实现dis_max+tie_breaker

```

GET /forum/article/_search
{
  "query": {
    "multi_match": {
        "query":                "java solution",
        "type":                 "best_fields", 
        "fields":               ["title^2", "content"],
        "tie_breaker":          0.3,
        "minimum_should_match": "50%" 
    }
  } 
}

GET /forum/article/_search
{
  "query": {
    "dis_max": {
      "queries":  [
        {
          "match": {
            "title": {
              "query": "java beginner",
              "minimum_should_match": "50%",
              "boost": 2
            }
          }
        },
        {
          "match": {
            "body": {
              "query": "java beginner",
              "minimum_should_match": "30%"
            }
          }
        }
      ],
      "tie_breaker": 0.3
    }
  } 
}

```
minimum_should_match，主要是用来干嘛的？
去长尾，long tail
长尾，比如你搜索5个关键词，但是很多结果是只匹配1个关键词的，其实跟你想要的结果相差甚远，这些结果就是长尾
minimum_should_match，控制搜索结果的精准度，只有匹配一定数量的关键词的数据，才能返回



## 基于multi_match+most fiels策略进行multi-field搜索

从best-fields换成most-fields策略
best-fields策略，主要是说将某一个field匹配尽可能多的关键词的doc优先返回回来
most-fields策略，主要是说尽可能返回更多field匹配到某个关键词的doc，优先返回回来
```
POST /forum/_mapping/article
{
  "properties": {
      "sub_title": { 
          "type":     "string",
          "analyzer": "english",
          "fields": {
              "std":   { 
                  "type":     "string",
                  "analyzer": "standard"
              }
          }
      }
  }
}
```
```
POST /forum/article/_bulk
{ "update": { "_id": "1"} }
{ "doc" : {"sub_title" : "learning more courses"} }
{ "update": { "_id": "2"} }
{ "doc" : {"sub_title" : "learned a lot of course"} }
{ "update": { "_id": "3"} }
{ "doc" : {"sub_title" : "we have a lot of fun"} }
{ "update": { "_id": "4"} }
{ "doc" : {"sub_title" : "both of them are good"} }
{ "update": { "_id": "5"} }
{ "doc" : {"sub_title" : "haha, hello world"} }
```
```
GET /forum/article/_search
{
  "query": {
    "match": {
      "sub_title": "learning courses"
    }
  }
}
```


sub_title用的是enligsh analyzer，所以还原了单词

为什么，因为如果我们用的是类似于english analyzer这种分词器的话，就会将单词还原为其最基本的形态，stemmer
learning --> learn
learned --> learn
courses --> course

sub_titile: learning coureses --> learn course

{ "doc" : {"sub_title" : "learned a lot of course"} }，
就排在了{ "doc" : {"sub_title" : "learning more courses"} }的前面

```
GET /forum/article/_search
{
   "query": {
        "multi_match": {
            "query":  "learning courses",
            "type":   "most_fields", 
            "fields": [ "sub_title", "sub_title.std" ]
        }
    }
}
```

不只是TF/IDF算法。因为不同的query，不同的语法，都有不同的计算score的细节。

与best_fields的区别

（1）best_fields，是对多个field进行搜索，挑选某个field匹配度最高的那个分数，
同时在多个query最高分相同的情况下，在一定程度上考虑其他query的分数。
简单来说，你对多个field进行搜索，就想搜索到某一个field尽可能包含更多关键字的数据

优点：通过best_fields策略，以及综合考虑其他field，还有minimum_should_match支持，
可以尽可能精准地将匹配的结果推送到最前面
缺点：除了那些精准匹配的结果，其他差不多大的结果，排序结果不是太均匀，没有什么区分度了

实际的例子：百度之类的搜索引擎，最匹配的到最前面，但是其他的就没什么区分度了

（2）most_fields，综合多个field一起进行搜索，尽可能多地让所有field的query参与到总分数的计算中来，
此时就会是个大杂烩，出现类似best_fields案例最开始的那个结果，结果不一定精准，
某一个document的一个field包含更多的关键字，但是因为其他document有更多field匹配到了，
所以排在了前面；所以需要建立类似sub_title.std这样的field，尽可能让某一个field精准匹配query string，
贡献更高的分数，将更精准匹配的数据排到前面

优点：将尽可能匹配更多field的结果推送到最前面，整个排序结果是比较均匀的
缺点：可能那些精准匹配的结果，无法推送到最前面

实际的例子：wiki，明显的most_fields策略，搜索结果比较均匀，但是的确要翻好几页才能找到最匹配的结果


## 使用most_fields策略进行cross-fields search弊端大揭秘

cross-fields搜索，一个唯一标识，跨了多个field。比如一个人，标识，是姓名；
一个建筑，它的标识是地址。姓名可以散落在多个field中，
比如first_name和last_name中，地址可以散落在country，province，city中。

跨多个field搜索一个标识，比如搜索一个人名，或者一个地址，就是cross-fields搜索

初步来说，如果要实现，可能用most_fields比较合适。
因为best_fields是优先搜索单个field最匹配的结果，cross-fields本身就不是一个field的问题了。
```
POST /forum/article/_bulk
{ "update": { "_id": "1"} }
{ "doc" : {"author_first_name" : "Peter", "author_last_name" : "Smith"} }
{ "update": { "_id": "2"} }
{ "doc" : {"author_first_name" : "Smith", "author_last_name" : "Williams"} }
{ "update": { "_id": "3"} }
{ "doc" : {"author_first_name" : "Jack", "author_last_name" : "Ma"} }
{ "update": { "_id": "4"} }
{ "doc" : {"author_first_name" : "Robbin", "author_last_name" : "Li"} }
{ "update": { "_id": "5"} }
{ "doc" : {"author_first_name" : "Tonny", "author_last_name" : "Peter Smith"} }
```
```
GET /forum/article/_search
{
  "query": {
    "multi_match": {
      "query":       "Peter Smith",
      "type":        "most_fields",
      "fields":      [ "author_first_name", "author_last_name" ]
    }
  }
}
```

Peter Smith，匹配author_first_name，匹配到了Smith，这时候它的分数很高，为什么啊？？？
因为IDF分数高，IDF分数要高，那么这个匹配到的term（Smith），在所有doc中的出现频率要低，author_first_name field中，Smith就出现过1次
Peter Smith这个人，doc 1，Smith在author_last_name中，但是author_last_name出现了两次Smith，所以导致doc 1的IDF分数较低

问题1：只是找到尽可能多的field匹配的doc，而不是某个field完全匹配的doc

问题2：most_fields，没办法用minimum_should_match去掉长尾数据，就是匹配的特别少的结果

问题3：TF/IDF算法，比如Peter Smith和Smith Williams，搜索Peter Smith的时候，由于first_name中很少有Smith的，所以query在所有document中的频率很低，得到的分数很高，可能Smith Williams反而会排在Peter Smith前面



## 使用copy_to定制组合field解决cross-fields搜索弊端

用most_fields策略，去实现cross-fields搜索，有3大弊端，而且搜索结果也显示出了这3大弊端

第一个办法：用copy_to，将多个field组合成一个field

问题其实就出在有多个field，有多个field以后，就很尴尬，我们只要想办法将一个标识跨在多个field的情况，
合并成一个field即可。比如说，一个人名，本来是first_name，last_name，现在合并成一个full_name，不就ok了吗。。。。。
```
PUT /forum/_mapping/article
{
  "properties": {
      "new_author_first_name": {
          "type":     "string",
          "copy_to":  "new_author_full_name" 
      },
      "new_author_last_name": {
          "type":     "string",
          "copy_to":  "new_author_full_name" 
      },
      "new_author_full_name": {
          "type":     "string"
      }
  }
}
```
用了这个copy_to语法之后，就可以将多个字段的值拷贝到一个字段中，并建立倒排索引

```
POST /forum/article/_bulk
{ "update": { "_id": "1"} }
{ "doc" : {"new_author_first_name" : "Peter", "new_author_last_name" : "Smith"} }   --> Peter Smith
{ "update": { "_id": "2"} } 
{ "doc" : {"new_author_first_name" : "Smith", "new_author_last_name" : "Williams"} }    --> Smith Williams
{ "update": { "_id": "3"} }
{ "doc" : {"new_author_first_name" : "Jack", "new_author_last_name" : "Ma"} }     --> Jack Ma
{ "update": { "_id": "4"} }
{ "doc" : {"new_author_first_name" : "Robbin", "new_author_last_name" : "Li"} }     --> Robbin Li
{ "update": { "_id": "5"} }
{ "doc" : {"new_author_first_name" : "Tonny", "new_author_last_name" : "Peter Smith"} }   --> Tonny Peter Smith


GET /forum/article/_search
{
  "query": {
    "match": {
      "new_author_full_name": "Peter Smith"
    }
  }
}
```

比如官网也会给一些例子，说用什么什么文本，怎么怎么搜索，是怎么怎么样的效果。
es版本在不断迭代，这个打分的算法也在不断的迭代。
所以我们其实很难说，对类似这几讲讲解的best_fields，most_fields，cross_fields，完全复现出来应有的场景和效果。

更多的把原理和知识点给大家讲解清楚，带着大家演练一遍怎么操作的，做一下实验

期望的是说，比如大家自己在开发搜索应用的时候，碰到需要best_fields的场景，
知道怎么做，知道best_fields的原理，可以达到什么效果；
碰到most_fields的场景，知道怎么做，以及原理；
碰到搜搜cross_fields标识的场景，知道怎么做，知道原理是什么，效果是什么。。。。



问题1：只是找到尽可能多的field匹配的doc，而不是某个field完全匹配的doc 
--> 解决，最匹配的document被最先返回

问题2：most_fields，没办法用minimum_should_match去掉长尾数据，就是匹配的特别少的结果 
--> 解决，可以使用minimum_should_match去掉长尾数据

问题3：TF/IDF算法，比如Peter Smith和Smith Williams，
搜索Peter Smith的时候，由于first_name中很少有Smith的，
所以query在所有document中的频率很低，得到的分数很高，
可能Smith Williams反而会排在Peter Smith前面 
--> 解决，Smith和Peter在一个field了，所以在所有document中出现的次数是均匀的，不会有极端的偏差


## 使用原生cross-fiels技术解决搜索弊端


课程大纲
```
GET /forum/article/_search
{
  "query": {
    "multi_match": {
      "query": "Peter Smith",
      "type": "cross_fields", 
      "operator": "and",
      "fields": ["author_first_name", "author_last_name"]
    }
  }
}
```

问题1：只是找到尽可能多的field匹配的doc，而不是某个field完全匹配的doc 
--> 解决，要求每个term都必须在任何一个field中出现

Peter，Smith

要求Peter必须在author_first_name或author_last_name中出现
要求Smith必须在author_first_name或author_last_name中出现

Peter Smith可能是横跨在多个field中的，所以必须要求每个term都在某个field中出现，
组合起来才能组成我们想要的标识，完整的人名

原来most_fiels，可能像Smith Williams也可能会出现，
因为most_fields要求只是任何一个field匹配了就可以，匹配的field越多，分数越高

问题2：most_fields，没办法用minimum_should_match去掉长尾数据，就是匹配的特别少的结果
--> 解决，既然每个term都要求出现，长尾肯定被去除掉了

java hadoop spark --> 这3个term都必须在任何一个field出现了

比如有的document，只有一个field中包含一个java，那就被干掉了，作为长尾就没了

问题3：TF/IDF算法，比如Peter Smith和Smith Williams，
搜索Peter Smith的时候，由于first_name中很少有Smith的，
所以query在所有document中的频率很低，得到的分数很高，
可能Smith Williams反而会排在Peter Smith前面 
--> 计算IDF的时候，将每个query在每个field中的IDF都取出来，取最小值，就不会出现极端情况下的极大值了

Peter Smith

Peter
Smith

Smith，在author_first_name这个field中，在所有doc的这个Field中，出现的频率很低，导致IDF分数很高；
Smith在所有doc的author_last_name field中的频率算出一个IDF分数，
因为一般来说last_name中的Smith频率都较高，所以IDF分数是正常的，不会太高；
然后对于Smith来说，会取两个IDF分数中，较小的那个分数。就不会出现IDF分过高的情况。




