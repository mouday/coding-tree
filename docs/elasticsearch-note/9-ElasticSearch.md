# ElasticSearch深度探秘搜索技术3

## 前缀搜索、通配符搜索、正则搜索等技术
1、前缀搜索

C3D0-KD345
C3K5-DFG65
C4I8-UI365

C3 --> 上面这两个都搜索出来 --> 根据字符串的前缀去搜索

不用帖子的案例背景，因为比较简单，直接用自己手动建的新索引，给大家演示一下就可以了
```
PUT my_index
{
  "mappings": {
    "my_type": {
      "properties": {
        "title": {
          "type": "keyword"
        }
      }
    }
  }
}

GET my_index/my_type/_search
{
  "query": {
    "prefix": {
      "title": {
        "value": "C3"
      }
    }
  }
}
```

2、前缀搜索的原理

prefix query不计算relevance score，与prefix filter唯一的区别就是，filter会cache bitset

扫描整个倒排索引，举例说明

前缀越短，要处理的doc越多，性能越差，尽可能用长前缀搜索

前缀搜索，它是怎么执行的？性能为什么差呢？

match

C3-D0-KD345
C3-K5-DFG65
C4-I8-UI365

全文检索

每个字符串都需要被分词

c3          doc1,doc2
d0
kd345
k5
dfg65
c4
i8
ui365

c3 --> 扫描倒排索引 --> 一旦扫描到c3，就可以停了，因为带c3的就2个doc，已经找到了 
--> 没有必要继续去搜索其他的term了

match性能往往是很高的

不分词

C3-D0-KD345
C3-K5-DFG65
C4-I8-UI365

c3 --> 先扫描到了C3-D0-KD345，很棒，找到了一个前缀带c3的字符串 
--> 还是要继续搜索的，因为后面还有一个C3-K5-DFG65，也许还有其他很多的前缀带c3的字符串 
--> 你扫描到了一个前缀匹配的term，不能停，必须继续搜索 
--> 直到扫描完整个的倒排索引，才能结束

因为实际场景中，可能有些场景是全文检索解决不了的

C3D0-KD345
C3K5-DFG65
C4I8-UI365

c3d0
kd345

c3 --> match --> 扫描整个倒排索引，能找到吗

c3 --> 只能用prefix

prefix性能很差

3、通配符搜索

跟前缀搜索类似，功能更加强大

C3D0-KD345
C3K5-DFG65
C4I8-UI365

5字符-D任意个字符5
```
5?-*5：通配符去表达更加复杂的模糊搜索的语义

GET my_index/my_type/_search
{
  "query": {
    "wildcard": {
      "title": {
        "value": "C?K*5"
      }
    }
  }
}

?：任意字符
*：0个或任意多个字符
```

性能一样差，必须扫描整个倒排索引，才ok

4、正则搜索
```
GET /my_index/my_type/_search 
{
  "query": {
    "regexp": {
      "title": "C[0-9].+"
    }
  }
}

C[0-9].+

[0-9]：指定范围内的数字
[a-z]：指定范围内的字母
.：一个字符
+：前面的正则表达式可以出现一次或多次
```
wildcard和regexp，与prefix原理一致，都会扫描整个索引，性能很差

主要是给大家介绍一些高级的搜索语法。在实际应用中，能不用尽量别用。性能太差了。

