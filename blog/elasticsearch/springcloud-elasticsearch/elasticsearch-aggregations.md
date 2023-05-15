[返回目录](/blog/elasticsearch/springcloud-elasticsearch/index)

# 数据聚合aggregations

[聚合-aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html) 可以让我们极其方便的实现对数据的统计、分析、运算。例如：

- 什么品牌的手机最受欢迎？
- 这些手机的平均价格、最高价格、最低价格？
- 这些手机每月的销售情况如何？

实现这些统计功能的比数据库的sql要方便的多，而且查询速度非常快，可以实现近实时搜索效果。

## 1、聚合的种类

聚合常见的有三类：

- **桶（Bucket）**聚合：用来对文档做分组
  - TermAggregation：按照文档字段值分组，例如按照品牌值分组、按照国家分组
  - Date Histogram：按照日期阶梯分组，例如一周为一组，或者一月为一组

- **度量（Metric）**聚合：用以计算一些值，比如：最大值、最小值、平均值等
  - Avg：求平均值
  - Max：求最大值
  - Min：求最小值
  - Stats：同时求max、min、avg、sum等
- **管道（pipeline）**聚合：其它聚合的结果为基础做聚合

> **注意：**参加聚合的字段必须是keyword、日期、数值、布尔类型

## 2、DSL实现Bucket聚合

现在，我们要统计所有数据中的酒店品牌有几种，其实就是按照品牌对数据分组。此时可以根据酒店品牌的名称做聚合，也就是Bucket聚合。

### 2.1、Bucket聚合语法

语法如下：

```json
GET /hotel/_search
{
  "size": 0,               // 设置size为0，结果中不包含文档，只包含聚合结果
  "aggs": {                // 定义聚合
    "brandAgg": {          //给聚合起个名字
      "terms": {           // 聚合的类型，按照品牌值聚合，所以选择term
        "field": "brand",  // 参与聚合的字段
        "size": 20         // 希望获取的聚合结果数量
      }
    }
  }
}
```

结果如下：

```json
{
  "took" : 5,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 201,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "brandAgg" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "7天酒店",
          "doc_count" : 30
        },
        {
          "key" : "如家",
          "doc_count" : 30
        },
        {
          "key" : "皇冠假日",
          "doc_count" : 17
        },
        {
          "key" : "速8",
          "doc_count" : 15
        },
        {
          "key" : "万怡",
          "doc_count" : 13
        }
      ]
    }
  }
}
```

### 2.2、聚合结果排序

默认情况下，Bucket聚合会统计Bucket内的文档数量，记为_count，并且按照_count降序排序。

我们可以指定order属性，自定义聚合的排序方式：

```json
GET /hotel/_search
{
  "size": 0, 
  "aggs": {
    "brandAgg": {
      "terms": {
        "field": "brand",
        "order": {
          "_count": "asc" // 按照_count升序排列
        },
        "size": 20
      }
    }
  }
}
```

查询结果

```json
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 201,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "brandAgg" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "万丽",
          "doc_count" : 2
        },
        {
          "key" : "丽笙",
          "doc_count" : 2
        },
        {
          "key" : "君悦",
          "doc_count" : 4
        },
        {
          "key" : "豪生",
          "doc_count" : 6
        },
        {
          "key" : "维也纳",
          "doc_count" : 7
        }
      ]
    }
  }
}

```


### 2.3、限定聚合范围

默认情况下，Bucket聚合是对索引库的所有文档做聚合，但真实场景下，用户会输入搜索条件，因此聚合必须是对搜索结果聚合。那么聚合必须添加限定条件。

我们可以限定要聚合的文档范围，只要添加query条件即可：

```json
GET /hotel/_search
{
  "query": {
    "range": {
      "price": {
        "lte": 200 // 只对200元以下的文档聚合
      }
    }
  }, 
  "size": 0, 
  "aggs": {
    "brandAgg": {
      "terms": {
        "field": "brand",
        "size": 20
      }
    }
  }
}
```

这次，聚合得到的品牌明显变少了：

查询结果

```json
{
  "took" : 4,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 17,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "brandAgg" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "7天酒店",
          "doc_count" : 1
        },
        {
          "key" : "汉庭",
          "doc_count" : 1
        },
        {
          "key" : "速8",
          "doc_count" : 2
        },
        {
          "key" : "如家",
          "doc_count" : 13
        }
      ]
    }
  }
}

```

### 2.4、总结

aggs代表聚合，与query同级，此时query的作用是？

- 限定聚合的的文档范围

聚合三要素：

- 聚合名称
- 聚合类型
- 聚合字段

聚合可配置的属性

- size 指定聚合结果数量，默认10
- order 指定聚合结果排序方式，默认desc
- field  指定聚合字段

## 3、DSL实现Metric聚合

上节课，我们对酒店按照品牌分组，形成了一个个桶。现在我们需要对桶内的酒店做运算，获取每个品牌的用户评分的min、max、avg等值。

这就要用到Metric聚合了，例如stat聚合：就可以获取min、max、avg等结果。

### 3.1、Metric聚合语法

语法如下：

```json
GET /hotel/_search
{
  "size": 0, 
  "aggs": {
    "brandAgg": { 
      "terms": { 
        "field": "brand", 
        "size": 20
      },
      "aggs": { // 是brands聚合的子聚合，也就是分组后对每组分别计算
        "score_stats": { // 聚合名称
          "stats": { // 聚合类型，这里stats可以计算min、max、avg等
            "field": "score" // 聚合字段，这里是score
          }
        }
      }
    }
  }
}
```

这次的score_stats聚合是在brandAgg的聚合内部嵌套的子聚合。因为我们需要在每个桶分别计算。

```json
{
  "took" : 8,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 201,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "brandAgg" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "7天酒店",
          "doc_count" : 30,
          "scoreAgg" : {
            "count" : 30,
            "min" : 35.0,
            "max" : 43.0,
            "avg" : 37.86666666666667,
            "sum" : 1136.0
          }
        },
        {
          "key" : "如家",
          "doc_count" : 30,
          "scoreAgg" : {
            "count" : 30,
            "min" : 43.0,
            "max" : 47.0,
            "avg" : 44.833333333333336,
            "sum" : 1345.0
          }
        },
        {
          "key" : "皇冠假日",
          "doc_count" : 17,
          "scoreAgg" : {
            "count" : 17,
            "min" : 44.0,
            "max" : 48.0,
            "avg" : 46.0,
            "sum" : 782.0
          }
        }
      ]
    }
  }
}

```

### 3.2、Metric聚合排序


另外，我们还可以给聚合结果做个排序，例如按照每个桶的酒店平均分做排序：

```json
GET /hotel/_search
{
  "size": 0,
  "aggs": {
    "brandAgg": {
      "terms": {
        "field": "brand",
        "size": 20,
        "order": {
          "scoreAgg.avg": "desc"
        }
      },
      "aggs": {
        "scoreAgg": {
          "stats": {
            "field": "score"
          }
        }
      }
    }
  }
}
```

查询结果
```json
{
  "took" : 15,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 201,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "brandAgg" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "万丽",
          "doc_count" : 2,
          "scoreAgg" : {
            "count" : 2,
            "min" : 46.0,
            "max" : 47.0,
            "avg" : 46.5,
            "sum" : 93.0
          }
        },
        {
          "key" : "凯悦",
          "doc_count" : 8,
          "scoreAgg" : {
            "count" : 8,
            "min" : 45.0,
            "max" : 47.0,
            "avg" : 46.25,
            "sum" : 370.0
          }
        },
        {
          "key" : "和颐",
          "doc_count" : 12,
          "scoreAgg" : {
            "count" : 12,
            "min" : 44.0,
            "max" : 47.0,
            "avg" : 46.083333333333336,
            "sum" : 553.0
          }
        }
      ]
    }
  }
}

```




