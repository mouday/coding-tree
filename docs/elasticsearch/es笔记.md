
# Elastic 搜索开发实战 

需求描述：
- 智能补全提示
- 结果的高亮显示 
- 结果的聚合统计和过滤
- 相关搜索结果的推荐
- 短语纠错(fuzziness)
- 数据的实时同步与更新(logstash)
- 查得到
- 查得全
- 查得准
- 支持同义词
- 支持简繁体
- 支持拼音(pinyin)
- 支持 PPT 的搜索
- 支持自定义排序，按时间，按相关度
- 支持结果过滤，按分类、按标签、按时间范围等
- 搜索结果展示待加强，UI 设计

版本：
- Elasticsearch v6.2.4
- Kibana v6.2.4
- Logstash v6.2.4
    - [mysql-connector-java-8.0.20.tar.gz](https://downloads.mysql.com/archives/c-j/)

kibana dev tools快捷键
```
command + i 自动缩进

command + enter 提交请求
```

## 常用 API 介绍

1、增删改查
```bash
# 创建文档
POST twitter/doc/1
{
  "name": "Jack",
  "age": 30
}

# 取回文档
GET twitter/doc/1

# 完全替换
PUT twitter/doc/1
{
  "name": "Jack",
  "age": 35
}

# 部分更新
POST twitter/doc/1/_update
{
  "doc": {
    "name": "Mark"
  }
}

# 删除文档
DELETE twitter/doc/1

```

2、搜索的使用
```bash
# 创建两个索引文档
POST twitter/doc/1
{
  "name": "Jack",
  "age": 30
}

POST twitter/doc/2
{
  "name": "Mark",
  "age": 35
}

# 通过名称搜索
GET twitter/_search?q=Jack

# 通过年龄检索
GET twitter/_search?q=35

# 限定查询年龄字段
GET twitter/_search?q=age:35

# QueryDSL查询表达式
POST twitter/_search
{
  "query": {
    "match": {
      "age": 35
    }
  }
}
```

3、聚合的使用
```bash
# 再创建两个索引文档
POST twitter/doc/3
{
  "name":"john",
  "age":30
}

POST twitter/doc/4
{
  "name":"mark",
  "age":40
}

# 统计年龄的分布情况
POST twitter/_search
{
  "size": 0,
  "aggs": {
    "age_stats": {
      "terms": {
        "field": "age",
        "size": 10
      }
    }
  }
}
```
聚合查询表达式说明
- 最外层的 size 为 0 不返回搜索命中的文档，只返回聚合的统计结果，
- aggs 就是我们描述聚合查询语句根节点，
- 使用 terms 聚合类型来对 age 字段的值进行统计，并且只返回前 10 个统计值，
- 然后这些统计结果我们命名为 age_stats

4、索引的管理
```bash
# 查看索引列表
GET _cat/indices?v

# 删除索引
DELETE twitter

# 查看集群的健康状况
GET _cluster/health
```

字段名 | 说明
- | -
health |  索引健康状态，green 表示健康；yellow 表示数据完整，但是缺少副本；red 则表示有数据损坏。
status  | 索引工作状态，open 表示索引打开中，可以被使用；close 表示索引被关闭，不能使用。
index  |  索引名称。
uuid   |  索引的唯一 ID 标识。
pri | 索引的主分片个数。
rep | 索引的副本分片个数。
docs.count  | 索引内的文档个数。
docs.deleted   |  索引内已经删除的文档个数。

# 搜索示例

## 数据准备

创建表
```sql
CREATE TABLE `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `title` varchar(60) DEFAULT NULL COMMENT '标题',
  `author` varchar(60) DEFAULT NULL COMMENT '作者',
  `content` text COMMENT '内容',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4
```

获取测试数据
```python
# -*- coding: utf-8 -*-

from pprint import pprint

import requests
from parsel import Selector
from puremysql import PureMysql


def get_data(url):
    """
    获取古诗文网数据
    eg: https://www.gushiwen.cn/
    :return: list
    """
    response = requests.get(url)

    sel = Selector(text=response.text)
    rows = sel.css(".main3 .left .sons")

    lst = []
    for row in rows:

        title = row.css("b::text").extract_first()
        author = row.css(".source").xpath("string(.)").extract_first()
        content = row.css(".contson").xpath("string(.)").extract_first()

        if not title:
            continue

        item = {
            "title": title.strip(),
            "author": author.strip(),
            "content": content.replace('\n', ''),
        }

        pprint(item)
        lst.append(item)

    return lst


def insert_data(lst):
    """
    数据入库
    """
    con = PureMysql(db_url="mysql://root:123456@127.0.0.1:3306/data?charset=utf8")
    table = con.table("blog")
    ret = table.insert(lst)
    con.close()
    print("成功入库", ret)


def main():
    # url = "https://www.gushiwen.cn/"
    for page in range(1, 11):
        url = f"https://www.gushiwen.cn/default.aspx?page={page}"
        lst = get_data(url)
        insert_data(lst)


if __name__ == '__main__':
    main()

```

logstash同步数据配置

config/jdbc.conf

```ruby
input {
  jdbc {
    jdbc_driver_library => "mysql-connector-java-8.0.16.jar"
    jdbc_driver_class => "com.mysql.cj.jdbc.Driver"
    jdbc_connection_string => "jdbc:mysql://127.0.0.1:3306/data"
    jdbc_user => "root"
    jdbc_password => "123456"
    statement => "SELECT id, title, content, author, create_time, update_time FROM blog"
    jdbc_paging_enabled => "true"
    jdbc_page_size => "5000"
  }
}

filter {
}

output {
  stdout {
    codec => rubydebug
  }

  elasticsearch {
    index => "blog",
    document_id => "%{id}"
  }
}

```

同步数据
```bash
# 检查配置文件
$ ./bin/logstash -t -f config/jdbc.conf

# 执行配置文件
$ ./bin/logstash -f config/jdbc.conf
```

## 问题及处理

处理elasticsearch跨域问题
config/elasticsearch.yml
```yaml
http.cors.enabled: true
http.cors.allow-origin: "*"
```

## 搜索提示

高亮结果显示

```json
POST /blog/_search
{
  "query": {
    "match": {
      "author": "李白"
    }
  },
  "highlight": {
    "fields": {
      "author": {}
    }
  }
}
```

## 搜索模板

将查询和参数分离

```json
POST /blog/_search/template
{
  "source": {
    "query": {
      "match": {
        "{{key}}": "{{value}}"
      }
    },
    "size": "{{size}}"
  },
  "params": {
    "key": "author",
    "value": "李白",
    "size": 10
  }
}
```

其他语句
```bash
# 调试模板渲染结果： 
GET _render/template

# 取回模板定义的语法： 
GET _scripts/<templatename>

# 删除模板定义的语法： 
DELETE _scripts/<templatename>
```

创建模板
```json
POST /_scripts/blog_template_v1
{
  "script": {
    "lang": "mustache",
    "source": {
      "query": {
        "match": {
          "{{key}}": "{{value}}"
        }
      },
      "highlight": {
        "fields": {
          "{{key}}": {}
        }
      },
      "size": "{{size}}"
    }
  }
}
```
使用模板

```json
POST /blog/_search/template
{
  "id": "blog_template_v1",
  "params": {
    "key": "author",
    "value": "李白",
    "size": 10
  }
}
```

## 模糊查询
```bash
GET test/_search
{
  "query": {
    "match": {
      "doc":{
        "query": "elastix",
        "fuzziness": "AUTO"
      }
    }
  }
}
```

## 优化查询
```json
POST _scripts/blog_template_v1
{
  "script": {
    "lang": "mustache",
    "source": {
      "size": "{{size}}",
      "query": {
        "bool": {
          "should": [
            {
              "prefix": {
                "{{field}}.keyword": {
                  "value": "{{query}}",
                  "boost": 10
                }
              }
            },
            {
              "match_phrase_prefix": {
                "{{field}}": {
                  "query": "{{query}}",
                  "boost": 2
                }
              }
            },
            {
              "match": {
                "{{field}}": "{{query}}"
              }
            }
          ]
        }
      },
      "_source": [
        "title",
        "id",
        "uid",
        "views"
      ]
    }
  }
}

```

## 重建索引
```bash

# 新建索引
PUT blog_v1

# 查看原索引的mapping
GET blog/_mapping

# 设置索引的mapping
POST blog_v1/doc/_mapping
{
  "doc": {
    "properties": {
      "@timestamp": {
        "type": "date"
      },
      "@version": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "author": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
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
      "create_time": {
        "type": "date"
      },
      "id": {
        "type": "long"
      },
      "title": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "update_time": {
        "type": "date"
      }
    }
  }
}

# 索引迁移
POST _reindex
{
  "source": {"index": "blog"},
  "dest": {"index": "blog_v1"}
}

# 查询测试
POST /blog_v1/_search

```

## 索引别名
```bash
# 查看别名
GET _cat/aliases


# 添加别名
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "blog",
        "alias": "my-blog"
      }
    }
  ]
}


# 切换别名
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "blog_v1",
        "alias": "my-blog"
      }
    },
    {
      "remove": {
        "index": "blog",
        "alias": "my-blog"
      }
    }
  ]
}

#  通过别名搜索
POST my-blog/_search
```

拼音处理的插件
https://github.com/medcl/elasticsearch-analysis-pinyin/releases/tag/v6.3.2

添加拼音搜索字段
```bash
# 关闭索引
POST my-blog/_close

# 设置索引支持拼音分析器
PUT my-blog/_settings
{
  "index": {
    "analysis": {
      "analyzer": {
        "pinyin_analyzer": {
          "tokenizer": "my_pinyin"
        }
      },
      "tokenizer": {
        "my_pinyin": {
          "type": "pinyin",
          "keep_first_letter": true,
          "keep_separate_first_letter": true,
          "keep_full_pinyin": true,
          "keep_original": false,
          "limit_first_letter_length": 16,
          "lowercase": true
        }
      }
    }
  }
}

# 打开索引
POST my-blog/_open

# 获取原索引mapping
GET my-blog/_mapping

# 添加字段
PUT my-blog/doc/_mapping
{
  "doc": {
    "properties": {
      "@timestamp": {
        "type": "date"
      },
      "@version": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "author": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          },
          "pinyin": {
            "type": "text",
            "analyzer": "pinyin_analyzer"
          }
        }
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
      "create_time": {
        "type": "date"
      },
      "id": {
        "type": "long"
      },
      "title": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "update_time": {
        "type": "date"
      }
    }
  }
}

# 更新索引
POST my-blog/_update_by_query?conflicts=proceed

# 测试拼音搜索
POST my-blog/_search
{
  "query": {"match": {
    "author.pinyin": "libai"
  }}
}
```

前端显示
```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <!-- 开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <!-- 引入样式 -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"
    />
    <!-- 引入组件库 -->
    <script src="https://unpkg.com/element-ui/lib/index.js"></script>
    <!-- axios -->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

    <style>
      /* 居中显示 */
      #app {
        width: 200px;
        margin: 0 auto;
        margin-top: 300px;
      }
      /* 搜索结果高亮 */
      em {
        color: red;
      }
    </style>
  </head>

  <body>
    <div id="app">
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
      >
        <!-- 自定义显示 -->
        <template slot-scope="{ item }">
          <div v-html="item.highlight.author[0]"></div>
        </template>
      </el-autocomplete>
    </div>

    <script>
      new Vue({
        el: "#app",

        data() {
          return {
            list: [],
            state: "",
          };
        },

        methods: {
          async querySearchAsync(queryString, cb) {
            // 查询地址
            const QUERY_URL = "http://localhost:9200/blog/_search/template";

            // 查询语句
            let query = {
              id: "blog_template_v1",
              params: {
                field: "author",
                query: queryString,
                size: 10,
              },
            };

            const res = await axios.post(QUERY_URL, query);

            console.log(res.data.hits.hits);

            cb(res.data.hits.hits);
          },

          handleSelect(item) {
            console.log(item);
          },
        },
      });
    </script>
  </body>
</html>

```

2.x版本的es string字段

5.x版本的es string字段 被拆分成两种新的数据类型: 
text(分词)用于全文搜索的
keyword（不分词）用于关键词搜索

别名设置
```
#获取所有别名

GET _cat/aliases?v

#获取_index_name模式内所有指定别名为_alias_name模式的index
GET /_index_name/_alias|_aliases/_alias_name
_alias和_aliases的区别为若指定为_aliases在查询时若_index未指定满足要求的别名在返回结果中是否包含但aliasese属性为空, 使用_alias时不包含该index

# 设置别名
PUT /index_name/_alias/alias_name

# 删除别名
DELETE /index_name/_alias/alias_name
```