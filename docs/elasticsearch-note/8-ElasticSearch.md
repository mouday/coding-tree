# ElasticSearch深度探秘搜索技术2

## 在案例实战中掌握phrase matching搜索技术
近似匹配

1、什么是近似匹配

两个句子

java is my favourite programming language, and I also think spark is a very good big data system.
java spark are very related, because scala is spark's programming language and scala is also based on jvm like java.

match query，搜索java spark

{
    "match": {
        "content": "java spark"
    }
}

match query，只能搜索到包含java和spark的document，但是不知道java和spark是不是离的很近

包含java或包含spark，或包含java和spark的doc，都会被返回回来。我们其实并不知道哪个doc，java和spark距离的比较近。如果我们就是希望搜索java spark，中间不能插入任何其他的字符，那这个时候match去做全文检索，能搞定我们的需求吗？答案是，搞不定。

如果我们要尽量让java和spark离的很近的document优先返回，要给它一个更高的relevance score，这就涉及到了proximity match，近似匹配

如果说，要实现两个需求：

1、java spark，就靠在一起，中间不能插入任何其他字符，就要搜索出来这种doc
2、java spark，但是要求，java和spark两个单词靠的越近，doc的分数越高，排名越靠前

要实现上述两个需求，用match做全文检索，是搞不定的，必须得用proximity match，近似匹配

phrase match，proximity match：短语匹配，近似匹配

这一讲，要学习的是phrase match，就是仅仅搜索出java和spark靠在一起的那些doc，比如有个doc，是java use'd spark，不行。必须是比如java spark are very good friends，是可以搜索出来的。

phrase match，就是要去将多个term作为一个短语，一起去搜索，只有包含这个短语的doc才会作为结果返回。不像是match，java spark，java的doc也会返回，spark的doc也会返回。

2、match_phrase
```
GET /forum/article/_search
{
  "query": {
    "match": {
      "content": "java spark"
    }
  }
}
```
单单包含java的doc也返回了，不是我们想要的结果
```
POST /forum/article/5/_update
{
  "doc": {
    "content": "spark is best big data solution based on scala ,an programming language similar to java spark"
  }
}
```
将一个doc的content设置为恰巧包含java spark这个短语

match_phrase语法
```
GET /forum/article/_search
{
    "query": {
        "match_phrase": {
            "content": "java spark"
        }
    }
}
```
成功了，只有包含java spark这个短语的doc才返回了，只包含java的doc不会返回

3、term position

hello world, java spark     doc1
hi, spark java              doc2

hello       doc1(0)     
wolrd       doc1(1)
java        doc1(2) doc2(2)
spark       doc1(3) doc2(1)

了解什么是分词后的position
```
GET _analyze
{
  "text": "hello world, java spark",
  "analyzer": "standard"
}
```
4、match_phrase的基本原理

索引中的position，match_phrase

hello world, java spark     doc1
hi, spark java              doc2

hello       doc1(0)     
wolrd       doc1(1)
java        doc1(2) doc2(2)
spark       doc1(3) doc2(1)

java spark --> match phrase

java spark --> java和spark

java --> doc1(2) doc2(2)
spark --> doc1(3) doc2(1)

要找到每个term都在的一个共有的那些doc，就是要求一个doc，必须包含每个term，才能拿出来继续计算

doc1 --> java和spark --> spark position恰巧比java大1 --> java的position是2，spark的position是3，恰好满足条件

doc1符合条件

doc2 --> java和spark --> java position是2，spark position是1，spark position比java position小1，而不是大1 --> 光是position就不满足，那么doc2不匹配

必须理解这块原理！！！！

因为后面的proximity match就是原理跟这个一模一样！！！


## 基于slop参数实现近似匹配以及原理剖析和相关实验
```
GET /forum/article/_search
{
    "query": {
        "match_phrase": {
            "title": {
                "query": "java spark",
                "slop":  1
            }
        }
    }
}
```

slop的含义是什么？

query string，搜索文本，中的几个term，要经过几次移动才能与一个document匹配，这个移动的次数，就是slop

实际举例，一个query string经过几次移动之后可以匹配到一个document，然后设置slop

hello world, java is very good, spark is also very good.

java spark，match phrase，搜不到

如果我们指定了slop，那么就允许java spark进行移动，来尝试与doc进行匹配
```
java        is      very        good        spark       is

java        spark
java        -->     spark
java                -->         spark
java                            -->         spark
```

这里的slop，就是3，因为java spark这个短语，spark移动了3次，就可以跟一个doc匹配上了

slop的含义，不仅仅是说一个query string terms移动几次，跟一个doc匹配上。一个query string terms，最多可以移动几次去尝试跟一个doc匹配上

slop，设置的是3，那么就ok
```
GET /forum/article/_search
{
    "query": {
        "match_phrase": {
            "title": {
                "query": "java spark",
                "slop":  3
            }
        }
    }
}
```

就可以把刚才那个doc匹配上，那个doc会作为结果返回

但是如果slop设置的是2，那么java spark，spark最多只能移动2次，此时跟doc是匹配不上的，那个doc是不会作为结果返回的

做实验，验证slop的含义
```
GET /forum/article/_search
{
  "query": {
    "match_phrase": {
      "content": {
        "query": "spark data",
        "slop": 3
      }
    }
  }
}

spark is best big data solution based on scala ,an programming language similar to java spark

spark data
      --> data
          --> data
spark         --> data

GET /forum/article/_search
{
  "query": {
    "match_phrase": {
      "content": {
        "query": "data spark",
        "slop": 5
      }
    }
  }
}

spark       is              best        big         data

data        spark
-->         data/spark
spark       <--data
spark       -->             data
spark                       -->         data
spark                                   -->         data
```
slop搜索下，关键词离的越近，relevance score就会越高，做实验说明。。。
```
GET /forum/article/_search
{
  "query": {
    "match_phrase": {
      "content": {
        "query": "java best",
        "slop": 15
      }
    }
  }
}
```
其实，加了slop的phrase match，就是proximity match，近似匹配

1、java spark，短语，doc，phrase match
2、java spark，可以有一定的距离，但是靠的越近，越先搜索出来，proximity match

## 混合使用match和近似匹配实现召回率与精准度的平衡

召回率

比如你搜索一个java spark，总共有100个doc，能返回多少个doc作为结果，就是召回率，recall

精准度

比如你搜索一个java spark，能不能尽可能让包含java spark，或者是java和spark离的很近的doc，排在最前面，precision

直接用match_phrase短语搜索，会导致必须所有term都在doc field中出现，而且距离在slop限定范围内，才能匹配上

match phrase，proximity match，要求doc必须包含所有的term，才能作为结果返回；
如果某一个doc可能就是有某个term没有包含，那么就无法作为结果返回

java spark --> hello world java --> 就不能返回了
java spark --> hello world, java spark --> 才可以返回

近似匹配的时候，召回率比较低，精准度太高了

但是有时可能我们希望的是匹配到几个term中的部分，就可以作为结果出来，这样可以提高召回率。
同时我们也希望用上match_phrase根据距离提升分数的功能，让几个term距离越近分数就越高，优先返回

就是优先满足召回率，意思，java spark，包含java的也返回，包含spark的也返回，包含java和spark的也返回；
同时兼顾精准度，就是包含java和spark，同时java和spark离的越近的doc排在最前面

此时可以用bool组合match query和match_phrase query一起，来实现上述效果

```
GET /forum/article/_search
{
  "query": {
    "bool": {
      "must": {
        "match": { 
          "title": {
            "query":                "java spark" --> java或spark或java spark，java和spark靠前，但是没法区分java和spark的距离，也许java和spark靠的很近，但是没法排在最前面
          }
        }
      },
      "should": {
        "match_phrase": { --> 在slop以内，如果java spark能匹配上一个doc，那么就会对doc贡献自己的relevance score，如果java和spark靠的越近，那么就分数越高
          "title": {
            "query": "java spark",
            "slop":  50
          }
        }
      }
    }
  }
}
```

```
POST /forum/article/_bulk
{"index": {"_id": 1}}
{"content": "i think java is the best programming language"}
{"index": {"_id": 2}}
{"content": "spark is best big data solution based on scala ,an programming language similar to java spark"}

# 召回率
GET /forum/article/_search 
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "content": "java spark"
          }
        }
      ]
    }
  }
}


# 精准度，提升相关度分数relevance score
GET /forum/article/_search 
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "content": "java spark"
          }
        }
      ],
      "should": [
        {
          "match_phrase": {
            "content": {
              "query": "java spark",
              "slop": 50
            }
          }
        }
      ]
    }
  }
}
```

## 使用rescoring机制优化近似匹配搜索的性能
match和phrase match(proximity match)区别

match --> 只要简单的匹配到了一个term，就可以理解将term对应的doc作为结果返回，扫描倒排索引，扫描到了就ok

phrase match --> 首先扫描到所有term的doc list; 找到包含所有term的doc list; 
然后对每个doc都计算每个term的position，是否符合指定的范围; 
slop，需要进行复杂的运算，来判断能否通过slop移动，匹配一个doc

match query的性能比phrase match和proximity match（有slop）要高很多。
因为后两者都要计算position的距离。
match query比phrase match的性能要高10倍，比proximity match的性能要高20倍。

但是别太担心，因为es的性能一般都在毫秒级别，match query一般就在几毫秒，或者几十毫秒，
而phrase match和proximity match的性能在几十毫秒到几百毫秒之间，所以也是可以接受的。

优化proximity match的性能，一般就是减少要进行proximity match搜索的document数量。
主要思路就是，用match query先过滤出需要的数据，然后再用proximity match来根据term距离提高doc的分数，
同时proximity match只针对每个shard的分数排名前n个doc起作用，来重新调整它们的分数，
这个过程称之为rescoring，重计分。
因为一般用户会分页查询，只会看到前几页的数据，所以不需要对所有结果进行proximity match操作。

用我们刚才的说法，match + proximity match同时实现召回率和精准度

默认情况下，match也许匹配了1000个doc，proximity match全都需要对每个doc进行一遍运算，
判断能否slop移动匹配上，然后去贡献自己的分数
但是很多情况下，match出来也许1000个doc，其实用户大部分情况下是分页查询的，
所以可能最多只会看前几页，比如一页是10条，最多也许就看5页，就是50条
proximity match只要对前50个doc进行slop移动去匹配，去贡献自己的分数即可，
不需要对全部1000个doc都去进行计算和贡献分数

rescore：重打分

match：1000个doc，其实这时候每个doc都有一个分数了; 
proximity match，前50个doc，进行rescore，重打分，即可; 让前50个doc，term举例越近的，排在越前面
```
GET /forum/article/_search 
{
  "query": {
    "match": {
      "content": "java spark"
    }
  },
  "rescore": {
    "window_size": 50,
    "query": {
      "rescore_query": {
        "match_phrase": {
          "content": {
            "query": "java spark",
            "slop": 50
          }
        }
      }
    }
  }
}
```


