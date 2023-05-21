[返回目录](/blog/elasticsearch/springcloud-elasticsearch/index)

# 自动补全

当用户在搜索框输入字符时，我们应该提示出与该字符有关的搜索项

这种根据用户输入的字母，提示完整词条的功能，就是自动补全了。

因为需要根据拼音字母来推断，因此要用到拼音分词功能。



## 2.3.自动补全查询

elasticsearch提供了[Completion Suggester](https://www.elastic.co/guide/en/elasticsearch/reference/7.6/search-suggesters.html)查询来实现自动补全功能。这个查询会匹配以用户输入内容开头的词条并返回。为了提高补全查询的效率，对于文档中字段的类型有一些约束：

- 参与补全查询的字段必须是completion类型。

- 字段的内容一般是用来补全的多个词条形成的数组。

比如，一个这样的索引库：

```json
// 创建索引库
PUT /test
{
 "mappings": {
  "properties": {
   "title":{
    "type": "completion"
   }
  }
 }
}
```

然后插入下面的数据：

```json
// 示例数据
POST test/_doc
{
 "title": ["Sony", "WH-1000XM3"]
}
POST test/_doc
{
 "title": ["SK-II", "PITERA"]
}
POST test/_doc
{
 "title": ["Nintendo", "switch"]
}
```



查询的DSL语句如下：

```json
// 自动补全查询
GET /test/_search
{
 "suggest": {
  "title_suggest": {
   "text": "s", // 关键字
   "completion": {
    "field": "title", // 补全查询的字段
    "skip_duplicates": true, // 跳过重复的
    "size": 10 // 获取前10条结果
   }
  }
 }
}
```



## 2.4.实现酒店搜索框自动补全

现在，我们的hotel索引库还没有设置拼音分词器，需要修改索引库中的配置。但是我们知道索引库是无法修改的，只能删除然后重新创建。

另外，我们需要添加一个字段，用来做自动补全，将brand、suggestion、city等都放进去，作为自动补全的提示。



因此，总结一下，我们需要做的事情包括：

1. 修改hotel索引库结构，设置自定义拼音分词器

2. 修改索引库的name、all字段，使用自定义分词器

3. 索引库添加一个新字段suggestion，类型为completion类型，使用自定义的分词器

4. 给HotelDoc类添加suggestion字段，内容包含brand、business

5. 重新导入数据到hotel库



### 2.4.1.修改酒店映射结构

代码如下：

```json
// 酒店数据索引库
PUT /hotel
{
  "settings": {
    "analysis": {
      "analyzer": {
        "text_anlyzer": {
          "tokenizer": "ik_max_word",
          "filter": "py"
        },
        "completion_analyzer": {
          "tokenizer": "keyword",
          "filter": "py"
        }
      },
      "filter": {
        "py": {
          "type": "pinyin",
          "keep_full_pinyin": false,
          "keep_joined_full_pinyin": true,
          "keep_original": true,
          "limit_first_letter_length": 16,
          "remove_duplicated_term": true,
          "none_chinese_pinyin_tokenize": false
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "id":{
        "type": "keyword"
      },
      "name":{
        "type": "text",
        "analyzer": "text_anlyzer",
        "search_analyzer": "ik_smart",
        "copy_to": "all"
      },
      "address":{
        "type": "keyword",
        "index": false
      },
      "price":{
        "type": "integer"
      },
      "score":{
        "type": "integer"
      },
      "brand":{
        "type": "keyword",
        "copy_to": "all"
      },
      "city":{
        "type": "keyword"
      },
      "starName":{
        "type": "keyword"
      },
      "business":{
        "type": "keyword",
        "copy_to": "all"
      },
      "location":{
        "type": "geo_point"
      },
      "pic":{
        "type": "keyword",
        "index": false
      },
      "all":{
        "type": "text",
        "analyzer": "text_anlyzer",
        "search_analyzer": "ik_smart"
      },
      "suggestion":{
          "type": "completion",
          "analyzer": "completion_analyzer"
      }
    }
  }
}
```



### 2.4.2.修改HotelDoc实体

HotelDoc中要添加一个字段，用来做自动补全，内容可以是酒店品牌、城市、商圈等信息。按照自动补全字段的要求，最好是这些字段的数组。

因此我们在HotelDoc中添加一个suggestion字段，类型为`List<String>`，然后将brand、city、business等信息放到里面。

代码如下：

```java
package cn.itcast.hotel.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
public class HotelDoc {
    private Long id;
    private String name;
    private String address;
    private Integer price;
    private Integer score;
    private String brand;
    private String city;
    private String starName;
    private String business;
    private String location;
    private String pic;
    private Object distance;
    private Boolean isAD;
    private List<String> suggestion;

    public HotelDoc(Hotel hotel) {
        this.id = hotel.getId();
        this.name = hotel.getName();
        this.address = hotel.getAddress();
        this.price = hotel.getPrice();
        this.score = hotel.getScore();
        this.brand = hotel.getBrand();
        this.city = hotel.getCity();
        this.starName = hotel.getStarName();
        this.business = hotel.getBusiness();
        this.location = hotel.getLatitude() + ", " + hotel.getLongitude();
        this.pic = hotel.getPic();
        // 组装suggestion
        if(this.business.contains("/")){
            // business有多个值，需要切割
            String[] arr = this.business.split("/");
            // 添加元素
            this.suggestion = new ArrayList<>();
            this.suggestion.add(this.brand);
            Collections.addAll(this.suggestion, arr);
        }else {
            this.suggestion = Arrays.asList(this.brand, this.business);
        }
    }
}
```

### 2.4.3.重新导入

重新执行之前编写的导入数据功能，可以看到新的酒店数据中包含了suggestion：

```json
GET /hotel/_search
{
  "query": {
    "match_all": {}
  }
}
```

查询结果

```json
{
  "took" : 818,
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
          "starName" : "二钻",
          "suggestion" : [
            "7天酒店",
            "四川北路商业区"
          ]
        }
      }
    ]
  }
}

```

搜索测试

```json
GET /hotel/_search
{
  "suggest": {
    "suggestion_suggest": {
      "text": "h",
      "completion": {
        "field": "suggestion",
        "skip_duplicates": true,
        "size": 10
      }
    }
  }
}
```

搜索结果

```json
{
  "took" : 35,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "suggest" : {
    "suggestion_suggest" : [
      {
        "text" : "h",
        "offset" : 0,
        "length" : 1,
        "options" : [
          {
            "text" : "华美达",
            "_index" : "hotel",
            "_type" : "_doc",
            "_id" : "47066",
            "_score" : 1.0,
            "_source" : {
              "address" : "施新路958号",
              "brand" : "华美达",
              "business" : "浦东机场核心区",
              "city" : "上海",
              "id" : 47066,
              "location" : "31.147989, 121.759199",
              "name" : "上海浦东东站华美达酒店",
              "pic" : "https://m.tuniucdn.com/fb3/s1/2n9c/2pNujAVaQbXACzkHp8bQMm6zqwhp_w200_h200_c1_t0.jpg",
              "price" : 408,
              "score" : 46,
              "starName" : "四钻",
              "suggestion" : [
                "华美达",
                "浦东机场核心区"
              ]
            }
          }
        ]
      }
    ]
  }
}

```


### 2.4.4.自动补全查询的JavaAPI

之前我们学习了自动补全查询的DSL，而没有学习对应的JavaAPI，这里给出一个示例：

```json
GET /hotel/_search
{
  "suggest": {
    "suggestion_suggest": {
      "text": "h",              // 关键字
      "completion": {
        "field": "suggestion",  // 查询字段
        "skip_duplicates": true,
        "size": 10
      }
    }
  }
}
```

```java
// 准备请求
SearchRequest request = new SearchRequest("hotel");

// 请求参数
request.source().suggest(new SuggestBuilder()
                .addSuggestion(
                        "suggestion_suggest",
                        SuggestBuilders
                                .completionSuggestion("suggestion")
                                .prefix("h")
                                .skipDuplicates(true)
                                .size(10)

                ));

// 发送请求
this.restHighLevelClient.search(request, RequestOptions.DEFAULT);
```

而自动补全的结果也比较特殊，解析的代码如下：

```json
{
  "took" : 35,
  "timed_out" : false,
  "_shards" : {},
  "hits" : {},
  "suggest" : {
    "suggestion_suggest" : [
      {
        "text" : "h",
        "offset" : 0,
        "length" : 1,
        "options" : [
          {
            "text" : "华美达"
          },
          {
            "text" : "后海"
          },
          {
            "text" : "和颐" 
          }
        ]
      }
    ]
  }
}

```

java代码

```java
Suggest suggest = response.getSuggest();
CompletionSuggestion suggestionSuggest = suggest.getSuggestion("suggestion_suggest");

for (CompletionSuggestion.Entry.Option option : suggestionSuggest.getOptions()) {
    String text = option.getText().string();
    System.out.println(text);
}
```

### 2.4.5.实现搜索框自动补全

查看前端页面，可以发现当我们在输入框键入时，前端会发起ajax请求：

```
GET http://localhost:8089/hotel/suggestion?key=x
```

返回值是补全词条的集合，类型为`List<String>`



1）在`cn.itcast.hotel.web`包下的`HotelController`中添加新接口，接收新的请求：

```java
@GetMapping("suggestion")
public List<String> getSuggestions(@RequestParam("key") String prefix) {
    return hotelService.getSuggestions(prefix);
}
```



2）在`cn.itcast.hotel.service`包下的`IhotelService`中添加方法：

```java
List<String> getSuggestions(String prefix);
```



3）在`cn.itcast.hotel.service.impl.HotelService`中实现该方法：

```java
@Override
public List<String> getSuggestions(String prefix) {
    try {
        // 1.准备Request
        SearchRequest request = new SearchRequest("hotel");
        // 2.准备DSL
        request.source().suggest(new SuggestBuilder().addSuggestion(
            "suggestions",
            SuggestBuilders.completionSuggestion("suggestion")
            .prefix(prefix)
            .skipDuplicates(true)
            .size(10)
        ));
        // 3.发起请求
        SearchResponse response = client.search(request, RequestOptions.DEFAULT);
        // 4.解析结果
        Suggest suggest = response.getSuggest();
        // 4.1.根据补全查询名称，获取补全结果
        CompletionSuggestion suggestions = suggest.getSuggestion("suggestions");
        // 4.2.获取options
        List<CompletionSuggestion.Entry.Option> options = suggestions.getOptions();
        // 4.3.遍历
        List<String> list = new ArrayList<>(options.size());
        for (CompletionSuggestion.Entry.Option option : options) {
            String text = option.getText().toString();
            list.add(text);
        }
        return list;
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}
```
