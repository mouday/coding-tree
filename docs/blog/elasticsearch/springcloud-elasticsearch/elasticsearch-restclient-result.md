[返回目录](/blog/elasticsearch/springcloud-elasticsearch/index)

# RestClient搜索结果处理

## 1、排序、分页

搜索结果的排序和分页是与query同级的参数，因此同样是使用request.source()来设置。

对应的API如下：

```json
GET /hotel/_search
{
  "query": {
    "match_all": {}
  },
  "from": 10,
  "size": 5,
  "sort": [
    {
      "price": {
        "order": "desc"
      }
    }
  ]
}
```

Java代码

```java
// 查询
request.source().query(QueryBuilders.matchAllQuery());

// 分页
request.source().from(10).size(5);

// 排序
request.source().sort("price", SortOrder.DESC);

```

完整代码示例：

```java
@Test
void testPageAndSort() throws IOException {
    // 页码，每页大小
    int page = 1, size = 5;

    // 1.准备Request
    SearchRequest request = new SearchRequest("hotel");
    // 2.准备DSL
    // 2.1.query
    request.source().query(QueryBuilders.matchAllQuery());
    // 2.2.排序 sort
    request.source().sort("price", SortOrder.ASC);
    // 2.3.分页 from、size
    request.source().from((page - 1) * size).size(5);
    // 3.发送请求
    SearchResponse response = client.search(request, RequestOptions.DEFAULT);
    // 4.解析响应
    handleResponse(response);

}
```

## 2、高亮

高亮的代码与之前代码差异较大，有两点：

- 查询的DSL：其中除了查询条件，还需要添加高亮条件，同样是与query同级。
- 结果解析：结果除了要解析_source文档数据，还要解析高亮结果

高亮请求的构建API如下：

```json
GET /hotel/_search
{
  "query": {
    "match": {
      "all": "如家"
    }
  },
  "highlight": {
    "fields": {
      "name": {
        "require_field_match": "false"
      }
    }
  }
}
```

Java代码

```java
request.source().query(QueryBuilders.matchQuery("all", "如家"));
request.source().highlighter(new HighlightBuilder()
        .field("name")
        .requireFieldMatch(false));

```

上述代码省略了查询条件部分，但是大家不要忘了：高亮查询必须使用全文检索查询，并且要有搜索关键字，将来才可以对关键字高亮。

完整代码如下：

```java
@Test
void testHighlight() throws IOException {
    // 1.准备Request
    SearchRequest request = new SearchRequest("hotel");
    // 2.准备DSL
    // 2.1.query
    request.source().query(QueryBuilders.matchQuery("all", "如家"));
    // 2.2.高亮
    request.source().highlighter(new HighlightBuilder().field("name").requireFieldMatch(false));
    // 3.发送请求
    SearchResponse response = client.search(request, RequestOptions.DEFAULT);
    // 4.解析响应
    handleResponse(response);

}
```

## 3、高亮结果解析

高亮的结果与查询的文档结果默认是分离的，并不在一起。

因此解析高亮的代码需要额外处理：

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

    // 处理高亮结果
    Map<String, HighlightField> highlightFields = hit.getHighlightFields();
    if(!CollectionUtils.isEmpty(highlightFields)){
        HighlightField highlightField = highlightFields.get("name");
        if(highlightField != null){
            if(highlightField.getFragments() != null && highlightField.getFragments().length > 0){
                String name = highlightField.getFragments()[0].string();
                hotelDoc.setName(name);
            }
        }
    }

    System.out.println(hotelDoc);
}
```
代码解读：

- 第一步：从结果中获取source。hit.getSourceAsString()，这部分是非高亮结果，json字符串。还需要反序列为HotelDoc对象
- 第二步：获取高亮结果。hit.getHighlightFields()，返回值是一个Map，key是高亮字段名称，值是HighlightField对象，代表高亮值
- 第三步：从map中根据高亮字段名称，获取高亮字段值对象HighlightField
- 第四步：从HighlightField中获取Fragments，并且转为字符串。这部分就是真正的高亮字符串了
- 第五步：用高亮的结果替换HotelDoc中的非高亮结果



完整代码如下：

```java
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
        // 获取高亮结果
        Map<String, HighlightField> highlightFields = hit.getHighlightFields();
        if (!CollectionUtils.isEmpty(highlightFields)) {
            // 根据字段名获取高亮结果
            HighlightField highlightField = highlightFields.get("name");
            if (highlightField != null) {
                // 获取高亮值
                String name = highlightField.getFragments()[0].string();
                // 覆盖非高亮结果
                hotelDoc.setName(name);
            }
        }
        System.out.println("hotelDoc = " + hotelDoc);
    }
}
```
