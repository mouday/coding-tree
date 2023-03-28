[返回目录](/blog/elasticsearch/springcloud-elasticsearch/index)

# 操作索引库

索引库就类似数据库表，mapping 映射就类似表的结构。

## 2.1、mapping 映射属性

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

## 2.2、创建索引库和映射

### 基本语法：

- 请求方式：PUT
- 请求路径：/索引库名，可以自定义
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

### 示例：

```json
# 创建索引
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
