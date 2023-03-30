[返回目录](/blog/elasticsearch/springcloud-elasticsearch/index)

# 操作索引库mapping

索引库就类似数据库表，mapping 映射就类似表的结构。

## 1、mapping 映射属性

mapping 是对索引库中文档的约束，常见的 mapping 属性包括：

- type：数据类型，常见的简单类型有：
  - 字符串：
    - text（可分词的文本）、
    - keyword（精确值，例如：品牌、国家、ip 地址）
  - 数值：long、integer、short、byte、double、float、
  - 布尔：boolean
  - 日期：date
  - 对象：object
- index：是否索引，默认为 true
- analyzer：分词器
- properties：子字段

例如下面的 json 文档：

```json
{
  "age": 21,
  "weight": 52.1,
  "isMarried": false,
  "info": "黑马程序员Java讲师",
  "email": "zy@itcast.cn",
  "score": [99.1, 99.5, 98.9],
  "name": {
    "firstName": "云",
    "lastName": "赵"
  }
}
```

对应的每个字段映射（mapping）：

- age：类型为 integer；参与搜索，因此需要 index 为 true；无需分词器
- weight：类型为 float；参与搜索，因此需要 index 为 true；无需分词器
- isMarried：类型为 boolean；参与搜索，因此需要 index 为 true；无需分词器
- info：类型为字符串，需要分词，因此是 text；参与搜索，因此需要 index 为 true；分词器可以用 ik_smart
- email：类型为字符串，但是不需要分词，因此是 keyword；不参与搜索，因此需要 index 为 false；无需分词器
- score：虽然是数组，但是我们只看元素的类型，类型为 float；参与搜索，因此需要 index 为 true；无需分词器
- name：类型为 object，需要定义多个子属性
  - name.firstName；类型为字符串，但是不需要分词，因此是 keyword；参与搜索，因此需要 index 为 true；无需分词器
  - name.lastName；类型为字符串，但是不需要分词，因此是 keyword；参与搜索，因此需要 index 为 true；无需分词器

## 2、创建索引库和映射

### 2.1、基本语法

- 请求方式：PUT
- 请求路径：/索引库名
- 请求参数：mapping 映射

格式：

```json
PUT /索引库名称
{
  "mappings": {
    "properties": {
      "字段名": {
        "type": "text",
        "analyzer": "ik_smart"
      },
      "字段名2": {
        "type": "keyword",
        "index": "false"
      },
      "字段名3": {
        "properties": {
          "子字段": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
```

### 2.2、示例

创建索引

```json
PUT /blog
{
  "mappings": {
    "properties": {
      "info": {
        "type": "text",
        "analyzer": "ik_smart"
      },
      "email": {
        "type": "keyword",
        "index": false
      },
      "name": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "keyword"
          },
          "lastName": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
```

响应结果

```json
{
  "acknowledged": true,
  "shards_acknowledged": true,
  "index": "blog"
}
```

## 3、查询索引库

### 3.1、基本语法

- 请求方式：GET

- 请求路径：/索引库名

- 请求参数：无

格式

```json
GET /索引库名
```

### 3.2、示例

查询

```json
GET /blog
```

响应结果

```json
{
  "blog" : {
    "aliases" : { },
    "mappings" : {
      "properties" : {
        "email" : {
          "type" : "keyword",
          "index" : false
        },
        "info" : {
          "type" : "text",
          "analyzer" : "ik_smart"
        },
        "name" : {
          "properties" : {
            "firstName" : {
              "type" : "keyword"
            },
            "lastName" : {
              "type" : "keyword"
            }
          }
        }
      }
    },
    "settings" : {
      "index" : {
        "routing" : {
          "allocation" : {
            "include" : {
              "_tier_preference" : "data_content"
            }
          }
        },
        "number_of_shards" : "1",
        "provided_name" : "blog",
        "creation_date" : "1680014311538",
        "number_of_replicas" : "1",
        "uuid" : "I40eBmFxSTqoH1EuIWykYQ",
        "version" : {
          "created" : "7120199"
        }
      }
    }
  }
}

```

## 4、修改索引库

倒排索引结构虽然不复杂，但是一旦数据结构改变（比如改变了分词器），就需要重新创建倒排索引，这简直是灾难。因此索引库**一旦创建，无法修改mapping**。



虽然无法修改mapping中已有的字段，但是却 `允许添加新的字段` 到mapping中，因为不会对倒排索引产生影响。

### 4.1、语法说明

```json
PUT /索引库名/_mapping
{
  "properties": {
    "新字段名":{
      "type": "integer"
    }
  }
}
```

### 4.2、示例

添加新字段`age`

```json
PUT /blog/_mapping
{
  "properties": {
    "age": {
      "type": "integer"
    }
  }
}
```

响应结果
```json
{
  "acknowledged" : true
}
```