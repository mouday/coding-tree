[返回目录](/blog/elasticsearch/springcloud-elasticsearch/index)

# RestClient查询文档

文档的查询同样适用昨天学习的 RestHighLevelClient对象，基本步骤包括：

- 1）准备Request对象
- 2）准备请求参数
- 3）发起请求
- 4）解析响应



## 1、快速入门

我们以match_all查询为例

### 1.1、发起查询请求

代码解读：

- 第一步，创建`SearchRequest`对象，指定索引库名

- 第二步，利用`request.source()`构建DSL，DSL中可以包含查询、分页、排序、高亮等
  - `query()`：代表查询条件，利用`QueryBuilders.matchAllQuery()`构建一个match_all查询的DSL
- 第三步，利用client.search()发送请求，得到响应

json查询

```json
GET /hotel/_search
{
  "query": {
    "match_all": {}
  }
}
```

代码实现

```java
// 1、准备Request对象
SearchRequest request = new SearchRequest("hotel");

// 2、构建DSL
request.source().query(QueryBuilders.matchAllQuery());

// 3、发送请求
SearchResponse response = this.client.search(request, RequestOptions.DEFAULT);

```


这里关键的API有两个，一个是`request.source()`，其中包含了查询、排序、分页、高亮等所有功能：


另一个是`QueryBuilders`，其中包含match、term、function_score、bool等各种查询：


### 1.2、解析响应

响应结果的解析：

```json
{
  "took" : 7,
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
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "hotel",
        "_type" : "_doc",
        "_id" : "36934",
        "_score" : 1.0,
        "_source" : {
          "address" : "静安交通路40号",
          "brand" : "7天酒店",
          "business" : "四川北路商业区",
          "city" : "上海",
          "id" : 36934,
          "location" : "31.251433, 121.47522",
          "name" : "7天连锁酒店(上海宝山路地铁站店)",
          "pic" : "https://m.tuniucdn.com/fb2/t1/G1/M00/3E/40/Cii9EVkyLrKIXo1vAAHgrxo_pUcAALcKQLD688AAeDH564_w200_h200_c1_t0.jpg",
          "price" : 336,
          "score" : 37,
          "starName" : "二钻"
        }
      }
    ]
  }
}
```

elasticsearch返回的结果是一个JSON字符串，结构包含：

- `hits`：命中的结果
  - `total`：总条数，其中的value是具体的总条数值
  - `max_score`：所有结果中得分最高的文档的相关性算分
  - `hits`：搜索结果的文档数组，其中的每个文档都是一个json对象
    - `_source`：文档中的原始数据，也是json对象

因此，我们解析响应结果，就是逐层解析JSON字符串，流程如下：

- `SearchHits`：通过response.getHits()获取，就是JSON中的最外层的hits，代表命中的结果
  - `SearchHits#getTotalHits().value`：获取总条数信息
  - `SearchHits#getHits()`：获取SearchHit数组，也就是文档数组
    - `SearchHit#getSourceAsString()`：获取文档结果中的_source，也就是原始的json文档数据

解析响应
```java
// 4、解析响应
SearchHits hits = response.getHits();

// 总条数
long total = hits.getTotalHits().value;
System.out.println("total:" + total);

// 遍历文档
for (SearchHit hit : hits.getHits()) {
    String source = hit.getSourceAsString();
    HotelDoc hotelDoc = JSON.parseObject(source, HotelDoc.class);
    System.out.println(hotelDoc);
}
```

### 1.3、完整代码

完整代码如下：

```java
@Test
void testMatchAll() throws IOException {
    // 1.准备Request
    SearchRequest request = new SearchRequest("hotel");
    // 2.准备DSL
    request.source()
        .query(QueryBuilders.matchAllQuery());
    // 3.发送请求
    SearchResponse response = client.search(request, RequestOptions.DEFAULT);

    // 4.解析响应
    handleResponse(response);
}

private void handleResponse(SearchResponse response) {
    // 4.解析响应
    SearchHits searchHits = response.getHits();
    // 4.1.获取总条数
    long total = searchHits.getTotalHits().value;
    System.out.println("共搜索到" + total + "条数据");
    // 4.2.文档数组
    SearchHit[] hits = searchHits.getHits();
    // 4.3.遍历
    for (SearchHit hit : hits) {
        // 获取文档source
        String json = hit.getSourceAsString();
        // 反序列化
        HotelDoc hotelDoc = JSON.parseObject(json, HotelDoc.class);
        System.out.println("hotelDoc = " + hotelDoc);
    }
}
```



### 1.4、小结

查询的基本步骤是：

1. 创建SearchRequest对象

2. 准备Request.source()，也就是DSL。

   ① QueryBuilders来构建查询条件

   ② 传入Request.source() 的 query() 方法

3. 发送请求，得到结果

4. 解析结果（参考JSON结果，从外到内，逐层解析）


## 2、match查询

全文检索的match和multi_match查询与match_all的API基本一致。差别是查询条件，也就是query的部分。

```json
GET /hotel/_search
{
  "query": {
    "match": {
      "all": "如家"
    }
  }
}

GET /hotel/_search
{
  "query": {
    "multi_match": {
      "query": "如家",
      "fields": ["brand", "name"]
    }
  }
}
```


因此，Java代码上的差异主要是request.source().query()中的参数了。同样是利用QueryBuilders提供的方法：

```java
// 单字段查询
QueryBuilders.matchQuery("all", "如家");

// 多字段查询
QueryBuilders.multiMatchQuery("如家", "brand", "name");
```

而结果解析代码则完全一致，可以抽取并共享。

完整代码如下：

```java
@Test
void testMatch() throws IOException {
    // 1.准备Request
    SearchRequest request = new SearchRequest("hotel");
    // 2.准备DSL
    request.source()
        .query(QueryBuilders.matchQuery("all", "如家"));
    // 3.发送请求
    SearchResponse response = client.search(request, RequestOptions.DEFAULT);
    // 4.解析响应
    handleResponse(response);

}

private void handleResponse(SearchResponse response) {
    // 4、解析响应
    SearchHits hits = response.getHits();

    // 总条数
    long total = hits.getTotalHits().value;
    System.out.println("total:" + total);

    // 遍历文档
    for (SearchHit hit : hits.getHits()) {
        String source = hit.getSourceAsString();
        HotelDoc hotelDoc = JSON.parseObject(source, HotelDoc.class);
        System.out.println(hotelDoc);
    }
}
```





## 3、精确查询

精确查询主要是两者：

- term：词条精确匹配
- range：范围查询

与之前的查询相比，差异同样在查询条件，其它都一样。

查询条件构造的API如下：

```json
GET /hotel/_search
{
  "query": {
    "term": {
      "brand": {
        "value": "如家"
      }
    }
  }
}

GET /hotel/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 100,
        "lte": 150
      }
    }
  }
}
```

```java
// 词条查询
QueryBuilders.termQuery("如家", "brand")

// 范围查询
QueryBuilders.rangeQuery("price").gte(100).lte(150)
```

## 4、布尔查询

布尔查询是用must、must_not、filter等方式组合其它查询，代码示例如下：

```json
GET /hotel/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "city": {
              "value": "深圳"
            }
          }
        }
      ],
      "filter": [
        {
          "range": {
            "price": {
              "gte": 100,
              "lte": 200
            }
          }
        }
      ]
    }
  }
}
```

java代码
```java
// 创建bool查询
BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();

// 创建must条件
queryBuilder.must(QueryBuilders.termQuery("city", "深圳"));

// 创建filter条件
queryBuilder.filter(QueryBuilders.rangeQuery("price").gte(100).lte(200));

```

可以看到，API与其它查询的差别同样是在查询条件的构建，QueryBuilders，结果解析等其他代码完全不变。

完整代码如下：

```java
@Test
void testBool() throws IOException {
    // 1.准备Request
    SearchRequest request = new SearchRequest("hotel");
    // 2.准备DSL
    // 2.1.准备BooleanQuery
    BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
    // 2.2.添加term
    boolQuery.must(QueryBuilders.termQuery("city", "杭州"));
    // 2.3.添加range
    boolQuery.filter(QueryBuilders.rangeQuery("price").lte(250));

    request.source().query(boolQuery);
    // 3.发送请求
    SearchResponse response = client.search(request, RequestOptions.DEFAULT);
    // 4.解析响应
    handleResponse(response);

}
```

