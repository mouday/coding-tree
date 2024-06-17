# Springboot + ElasticSearch 构建博客检索系统

资料：

[Elastic中文社区](https://elasticsearch.cn/)

[全文搜索引擎 Elasticsearch 入门教程](http://www.ruanyifeng.com/blog/2017/08/elasticsearch.html)

[下载地址](https://www.elastic.co/cn/downloads/past-releases)

项目工具
- SpringBoot
- ElasticSearch
- Kibana
- PostMan
- Vue

## ElasticSearch

- 分布式
- 全文检索
- 实时快速
- Restful

Mysql | ES
 - | -
Database | Index
Table | Type
Row | Document
Column | Field
Scheme | Mapping

```sql
MySQL: 
select * from user.user_info where name = "张三"

ES: 
GET /user/user_info/_search?q=name:张三
```

## 下载安装

下载版本
- [ElasticSearch  6.3.2](https://www.elastic.co/cn/downloads/past-releases/elasticsearch-6-3-2)
- [Kibana  6.3.2](https://www.elastic.co/cn/downloads/past-releases/kibana-6-3-2)

国内镜像
- [ElasticSearch  6.3.2](https://mirrors.huaweicloud.com/elasticsearch/6.3.2/)
- [Kibana  6.3.2](https://mirrors.huaweicloud.com/kibana/6.3.2/)

启动
```bash
# 启动 elasticsearch
cd elasticsearch-6.3.2
bash ./bin/elasticsearch

# 启动 kibana
cd kibana-6.3.2-darwin-x86_64
bash ./bin/kibana
```

查看：

- elasticsearch: [http://127.0.0.1:9200/](http://127.0.0.1:9200/)
- kibana: [http://localhost:5601/](http://localhost:5601/)

交互操作
```bash
# 查看所有索引
GET /_all

# 创建索引
PUT /person

# 添加数据
PUT /person/_doc/1
{
  "name": "Tom",
  "pets": ["pig", "cat"]
}

# 添加数据
PUT /person/_doc/2
{
  "name": "Jack",
  "pets": ["dog", "cat"]
}

# 获取数据
GET /person/_doc/1

# 搜索数据
GET /person/_doc/_search?q=name:Tom

# 复杂查询，可以省略_doc
POST /person/_search
{
  "query": {
    "bool": {
      "should": {
        "match": {
          "name": "Tom"
        }
      }
    }
  }
}

# or查询
POST /person/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "name": "Tom"
          }
        },
        {
          "match": {
            "name": "Jack"
          }
        }
      ]
    }
  }
}


# and查询
POST /person/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "name": "Tom"
          }
        },
        {
          "match": {
            "name": "Jack"
          }
        }
      ]
    }
  }
}

# 删除索引
DELETE  /person


```

## 基于MySQL实现

```sql
create table blog(
  id int(11) not null primary key auto_increment,
  title varchar(60) default null,
  content text,
  create_time datetime default null,
  update_time datetime default null
)

select * from blog where title like "%spring%" or content like "%pring%";
```

## 基于ES实现


## MySQL->ES数据同步
全量同步
增量同步

开源中间件

binlog订阅:
- alibaba/canel
- siddontang/go-mysql-elasticsearch(开发阶段)
- logstash(id/time)

## logstash全量、增量同步

国内镜像下载 [logstash 6.3.2](https://mirrors.huaweicloud.com/logstash/6.3.2/)

下载MySQL驱动 [mysql-connector-java.jar](https://mvnrepository.com/artifact/mysql/mysql-connector-java)

同步示例


```sql
create table user(
  id int(11) not null primary key auto_increment,
  name varchar(60) default null,
  age int(11),
  create_time datetime default CURRENT_TIMESTAMP,
  update_time datetime default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

同步配置 mysql.conf

```php
input {
  jdbc {
    # jdbc驱动包位置
    jdbc_driver_library => "./mysql-connector-java-8.0.16.jar"
    # 驱动类
    jdbc_driver_class => "com.mysql.cj.jdbc.Driver"
    # 数据库连接信息, 8.0以上版本：一定要把serverTimezone=UTC天加上
    jdbc_connection_string => "jdbc:mysql://127.0.0.1:3306/data?characterEncoding=utf8&useSSL=false&serverTimezone=UTC&rewriteBatchedStatements=true"
    # 用户
    jdbc_user => "root"
    # 密码
    jdbc_password => "123456"
    # 定时任务，默认一分钟
    schedule => "* * * * * *"
    # 全量同步，清空上次sql_last_value记录
    # clean_run => true
    # 执行的语句
    statement => "SELECT * FROM user WHERE update_time >= :sql_last_value"
    # 分页
    jdbc_paging_enabled => "true"
    jdbc_page_size => "5000"
    # 使用递增列的值
    use_column_value => true
    # 递增字段的类型
    tracking_column_type => "timestamp"
    # 递增字段的名称
    tracking_column => "update_time"
    # 同步点文件
    last_run_metadata_path => "user_syncpoint.txt"
  }
}
output {
    elasticsearch {
        # ES的IP地址及端口
        hosts => ["http://127.0.0.1:9200"]
        # 索引名称 可自定义
        index => "user"
        # 需要关联的数据库中有有一个id字段，对应类型中的id
        document_id => "%{id}"
    }
    stdout {
        # JSON格式输出
        codec => json_lines
    }
}
```

启动同步
```bash
$ ./bin/logstash -f ./config/mysql.conf
```

配置 pipelines.yml
```yaml
- pipeline.id: table-user
  path.config: "./config/mysql.conf"
```

启动同步
```bash
$ ./bin/logstash
```

向user表中插入测试数据
```python
# -*- coding: utf-8 -*-

from puremysql import PureMysql
from faker import Faker
import random

con = PureMysql(db_url="mysql://root:123456@127.0.0.1:3306/data?charset=utf8")
user_table = con.table("user")

# 生成模拟数据 100 * 5000 = 50W条
faker = Faker(locale="zh_CN")
for i in range(0, 100):
    lst = []
    for j in range(0, 5000):
        lst.append({
            "name": faker.name(),
            "age": random.randint(1, 100)
        })

    count = user_table.insert(lst)
    print(count)

con.close()

```

Jdbc input plugin 配置选项

Setting | Input type  | Required | Default
- | - | - | -
clean_run | boolean | No | false
columns_charset | hash | No  | {}
connection_retry_attempts | number | No  |  1
connection_retry_attempts_wait_time | number | No | 
jdbc_connection_string | string  | Yes  | -
jdbc_default_timezone | string |  No | -|
jdbc_driver_class | string | Yes | -
jdbc_driver_library | string | No  | -
jdbc_fetch_size | number | No  | - 
jdbc_page_size | number | No  | 100000
jdbc_paging_enabled | boolean | No  | false|
jdbc_password | password | No  | -|
jdbc_password_filepath | a valid filesystem path | No  |-|
jdbc_pool_timeout | number | No  | 5|
jdbc_user | string | Yes  | -|
jdbc_validate_connection  |boolean  |No   | false|
jdbc_validation_timeout | number | No  | 3600|
last_run_metadata_path |  string | No  | "$HOME/.logstash_jdbc_last_run"|
lowercase_column_names | boolean | No  | true|
parameters | hash|  No  | {}|
plugin_timezone | string, one of ["local", "utc"] | No | "utc" |
prepared_statement_bind_values  |array | No  | []|
prepared_statement_name  |string  |No  | ""|
record_last_run | boolean | No  | true|
schedule | string|  No  | -|
sequel_opts | hash|  No  | {}|
sql_log_level | string, one of ["fatal", "error", "warn", "info", "debug"]  |No  | "info"|
statement  |string | No  | -|
statement_filepath | a valid filesystem path | No  | -|
tracking_column | string|  No  | -|
tracking_column_type | string, one of ["numeric", "timestamp"] | No  | "numeric"|
use_column_value  |boolean | No  | false|
use_prepared_statements | boolean  |No | false|

配置参考：https://www.elastic.co/guide/en/logstash/current/plugins-inputs-jdbc.html

## 分词器

standard 中文单字拆分
simple 
whitespace 不支持中文
language 不支持中文

```bash
POST _analyze
{
  "analyzer": "standard",
  "text": "hello world"
}

# hello world

POST _analyze
{
  "analyzer": "standard",
  "text": "中国人"
}
# 中 国 人
```

ik分词器

[elasticsearch-analysis-ik](https://github.com/medcl/elasticsearch-analysis-ik/releases)

下载解压后放ES的plugins文件夹下，重启ES生效

分词语句：我是中国人
```
ik_smart：我/是/中国人
ik_max_word 我/是/中国人/中国/国人
```

自定义分词

添加自定义词语到文件 

elasticsearch-analysis-ik-6.3.2/config/main.dic

再次分词
```
ik_smart：我是/中国人
ik_max_word 我是/中国人/中国/国人
```

## SpringBoot集成ES

```bash
POST blog/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match_phrase": {
            "title": "杏花"
          }
        },
        {
          "match_phrase": {
            "content": "杏花"
          }
        }
      ]
    }
  }
}
```

