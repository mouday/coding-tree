[返回目录](/blog/elasticsearch/springcloud-elasticsearch/index)

# 文档操作doc

## 1、新增文档

语法

```json
POST /索引库名/_doc/文档id
{
  "字段1": "值1",
  "字段2": "值2",
  "字段3": {
    "子属性1": "值3",
    "子属性2": "值4"
  },
    // ...
}
```

示例

```json
POST /blog/_doc/1
{
  "info": "黑马程序员Java讲师",
  "email": "zy@itcast.cn",
  "name": {
    "firstName": "云",
    "lastName": "赵"
  }
}
```

响应

```json
{
  "_index" : "blog",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}

```


## 2、查询文档

根据rest风格，新增是post，查询应该是get，不过查询一般都需要条件，这里我们把文档id带上。

语法

```bash
GET /{索引库名称}/_doc/{id}
```

示例

```js
GET /blog/_doc/1
```

结果

```json
{
  "_index" : "blog",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "_seq_no" : 0,
  "_primary_term" : 1,
  "found" : true,
  "_source" : {
    "info" : "黑马程序员Java讲师",
    "email" : "zy@itcast.cn",
    "name" : {
      "firstName" : "云",
      "lastName" : "赵"
    }
  }
}
```

## 3、删除文档

删除使用DELETE请求，同样，需要根据id进行删除：

语法

```js
DELETE /{索引库名}/_doc/id值
```

示例

```bash
# 根据id删除数据
DELETE /blog/_doc/1
```

结果

```json
{
  "_index" : "blog",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 2,
  "result" : "deleted",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 1,
  "_primary_term" : 1
}
```


## 4、修改文档

修改有两种方式：

- 全量修改：直接覆盖原来的文档
- 增量修改：修改文档中的部分字段


### 4.1、全量修改

全量修改是覆盖原来的文档，其本质是：

- 根据指定的id删除文档
- 新增一个相同id的文档

**注意**

如果根据id删除时，id不存在，第二步的新增也会执行，也就从修改变成了新增操作了。



语法

```json
PUT /{索引库名}/_doc/文档id
{
  "字段1": "值1",
  "字段2": "值2",
    // ... 略
}

```



示例

```json
PUT /blog/_doc/1
{
  "info": "黑马程序员高级Java讲师",
  "email": "ZhaoYu@itcast.cn",
  "name": {
    "firstName": "云",
    "lastName": "赵"
  }
}
```

### 4.2、增量修改

增量修改是只修改指定id匹配的文档中的部分字段。

语法

```json
POST /{索引库名}/_update/文档id
{
  "doc": {
     "字段名": "新的值",
    }
}
```

示例

```json
POST /blog/_update/1
{
  "doc": {
    "email": "ZhaoYunEmail@itcast.cn"
  }
}
```

## 5、总结

文档操作有哪些？

- 创建文档：POST /{索引库名}/_doc/文档id   `{ json文档 }`
- 查询文档：GET /{索引库名}/_doc/文档id
- 删除文档：DELETE /{索引库名}/_doc/文档id
- 修改文档：
  - 全量修改：PUT /{索引库名}/_doc/文档id `{ json文档 }`
  - 增量修改：POST /{索引库名}/_update/文档id `{ "doc": {字段}}`
