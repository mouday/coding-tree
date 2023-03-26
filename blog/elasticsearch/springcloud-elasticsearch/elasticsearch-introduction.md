[返回目录](/blog/elasticsearch/springcloud-elasticsearch/index)

# Elasticsearch简介

elasticsearch是一款开源的分布式搜索引擎，可以用来实现搜索、日志统计、分析、系统监控等功能

## ELK技术栈

elasticsearch结合kibana、Logstash、Beats，也就是elastic stack（ELK）。被广泛应用在日志数据分析、实时监控等领域：

![](img/elk.png)


## elasticsearch和lucene

elasticsearch底层是基于**lucene**来实现的。

**Lucene**是一个Java语言的搜索引擎类库，是Apache公司的顶级项目，由DougCutting于1999年研发。官网地址：https://lucene.apache.org/ 。


## 正向索引 和 倒排索引

- **正向索引**是最传统的，根据id索引的方式。但根据词条查询时，必须先逐条获取每个文档，然后判断文档中是否包含所需要的词条，是**根据文档找词条的过程**。

- 而**倒排索引**则相反，是先找到用户要搜索的词条，根据词条得到保护词条的文档的id，然后根据id获取文档。是**根据词条找文档的过程**。


![](img/index.png)

## 文档和词条

- 文档（`Document`）：用来搜索的数据，其中的每一条数据就是一个文档。例如一个网页、一个商品信息
- 词条（`Term`）：对文档数据或用户搜索数据，利用某种算法分词，得到的具备含义的词语就是词条。
    - 例如：我是中国人，就可以分为：我、是、中国人、中国、国人这样的几个词条


两者方式的优缺:

| 方式 | 优点 | 缺点|
| - | - | -|
| 正向索引 | 1、可以给多个字段创建索引；2、根据索引字段搜索、排序速度非常快 | 根据非索引字段，或者索引字段中的部分词条查找时，只能全表扫描。|
| 倒排索引 | 根据词条搜索、模糊搜索时，速度非常快 | 1、只能给词条创建索引，而不是字段；2、无法根据字段做排序|


## elasticsearch与mysql


| **MySQL** | **Elasticsearch** | **说明**                                                     |
| --------- | ----------------- | ------------------------------------------------------------ |
| Table     | Index             | 索引(index)，就是文档的集合，类似数据库的表(table)           |
| Row       | Document          | 文档（Document），就是一条条的数据，类似数据库中的行（Row），文档都是JSON格式 |
| Column    | Field             | 字段（Field），就是JSON文档中的字段，类似数据库中的列（Column） |
| Schema    | Mapping           | Mapping（映射）是索引中文档的约束，例如字段类型约束。类似数据库的表结构（Schema） |
| SQL       | DSL               | DSL是elasticsearch提供的JSON风格的请求语句，用来操作elasticsearch，实现CRUD |

- Mysql：擅长事务类型操作，可以确保数据的安全和一致性

- Elasticsearch：擅长海量数据的搜索、分析、计算




因此在企业中，往往是两者结合使用：

- 对安全性要求较高的写操作，使用mysql实现
- 对查询性能要求较高的搜索需求，使用elasticsearch实现
- 两者再基于某种方式，实现数据的同步，保证一致性

![](img/mysql-and-es.png)