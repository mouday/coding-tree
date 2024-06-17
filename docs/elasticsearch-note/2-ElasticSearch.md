# ElasticSearch原理

### 一、基础分布式架构
1、ElasticSearch对复杂分布式机制的透明隐藏特性
分布式为了应对大量数据
（1）隐藏了分片机制
（2）cluster discovery 集群发现机制
（3）shard负载均衡
（4）shard副本
（5）请求路由
（6）集群扩容
（7）shard重分配

2、ElasticSearch的垂直扩容与水平扩容
（1）垂直扩容 替换服务器
（2）水平扩容 增加服务器（常用）

3、增减节点时数据rebalance
保持负载均衡

4、mastar节点
（1）管理es集群的元数据，索引创建和删除，维护索引元数据
（2）默认情况下，自动选举出mastar

5、节点平等的分布式架构
（1）节点对等，每个节点都能接收所有请求
（2）自动路由请求
（3）响应效率

### 二、 shard & replica机制
1、一个index包含一个或多个shard
2、每个shard是最小的工作单元，承载部分数据，
  Lucene实例，完整的创建索引和处理请求的能力
3、增减节点时，shard会自动在nodes中负载均衡
4、primary shard和replica shard，每个document肯定只存在于某一个primary shard
  以及对应的replica shard中，不可能存在于多个primary shard中
5、replica shard 是primary shard 的副本，负责容错，以及承担读请求负载
6、primary shard数量在创建索引的时候就固定了，replica shard的数量可以随时更改
7、primary shard默认数量5，replica shard默认是1，默认有10个shard
  5 primary shard 5 replica shard
8、primary shard 不能和自己的replica shard放在同一个节点上，否则节点宕机，primary shard 和replica shard 都丢失，起不到容错作用，但是，可以和其他primary shard的replica shard 放在同一个节点上

### 三、 单台node环境下创建index
1、单台node，创建index，有3个primary shard 3 个replica shard
```
PUT /tianmao
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1
  }
}

GET /tianmao
```

2、集群status是yellow
3、这时候，只会将3个primary shard分配到仅有的一个node上，另外3个replica shard无法分配
4、集群可以正常工作，当是一旦出现节点宕机，数据全部丢失，而且集群不可用，无法承接任何请求

### 四、 2台node环境下创建index
1、有3个primary shard 3 个replica shard
2、primary shard 同步 replica shard
3、primary shard replica shard 都可以处理读请求

### 五、横向扩容
1、primary & replica自动负载均衡 
  6 个shard = 3 primary + 3 replica
2、每个node有更少的shard，IO/CPU/Memory资源给每个shard分配的更多，每个shard性能更好
3、扩容的极限，6个shard（3 primary + 3 replica），最多扩容到6台机器，
  每个shard可以占用的单台服务器的所有资源，性能最好
4、超出扩容极限，动态修改replica数量，9个shard（3 primary + 6 replica），
  扩容到9台机器，比3台机器拥有3倍的读吞吐量，最多容纳2台机器宕机
5、3台机器下，9个shard（3 primary + 6 replica）资源更少，但是容错性更好，
  6个shard 容忍1台宕机
6、服务器宕机，保证数据不丢失

### 六、Elasticsearch容错机制
9 shard 3 node

Node1 | Node2 | Node3
-| -| -
P0 |R1 |R2
P1 |R2 |R0
P2 |R0 |R1

1、master宕机，自动master选举
2、replica容错，提升为primary，status=yellow
3、重启node，数据恢复，使用原有shard，同步发生修改的部分 status=green

## 分布式文档系统
### 一、document的核心元数据
1、index元数据
（1）代表document 存放在那个index
（2）类似的数据放在一个索引，field字段大致相同
（3）index中包含很多类似的document
（4）索引名称必须是小写，不能用下划线开头，不能包含逗号

2、type元数据
（1）代表document属于index中的类别type
（2）一个索引通常划分为多个type，逻辑上对index中对些许不同的数据进行分类
（3）type名可以是大写，小写，但是不能用下划线开头，不能包含逗号

3、id元数据
（1）代表document的唯一标识，与index和type一起，唯一定位一个document
（2）可以手动指定，也可以不指定，由es自动生成

### 二、document id生成两种方式解析
1、手动指定
```
PUT /index/type/id
{
  "key": "value"
}
```
从其他数据库导入可以使用原有id

2、自动生成
```
POST /index/type
{
  "key": "value"
}
```
自动生成的id 长度为20个字符，url安全，base64编码
GUID，分布式系统并行生成是不会冲突

### 三、source元数据
1、source元数据，默认情况下会原封不动返回

2、自定义返回字段
```
PUT /shop/goods/1
{
  "name": "iphone",
  "price": 6000
}

# 返回全部字段
GET /shop/goods/1

# 返回部分字段，多个字段逗号隔开
GET /shop/goods/1?_source=name

```

### 四、document操作
1、document全量替换
（1）语法格式与创建文档一样，如果不存在则创建，否则全量替换
（2）document是不可变的，如果要修改document内容，其中一种方式就是全量替换，
  直接对document重建索引，替换所有内容
（3）es会将旧的document标记为deleted，新增我们的document，
当我们创建越来越多的document时，es会自动删除标记为deleted的document

2、document强制创建
（1）创建文档语法与全量替换一样,只想新建文档，不想替换文档时使用
（2）创建语法
```
PUT /index/type/id?op_type=create

or

PUT /index/type/id/_create
```

3、document删除
（1）语法
```
DELETE /index/type/id
```
（2）不会物理删除，只会将其标记为deleted，当数据越来越多的时候，后台自动删除（lazy delete机制）


### 五、Elasticsearch并发冲突问题
1、并发冲突会导致数据不准确

2、悲观锁并发控制方案
（1）常见于mysql
（2）只有一个线程能读数据，写回去之后再释放所锁，期间其他线程不能读取数据
（3）行级锁，表级锁，读锁，写锁
（4）优点：方便，直接加锁
（5）缺点：并发能力低

3、乐观锁并发控制方案（es方案）
（1）乐观锁不加锁，每个线程都可以操作
（2）写入之前比对version，如果不同，重新读取数据操作后再写入
（3）优点：并发能力高
（4）缺点：操作麻烦，每次都要比对版本号

4、es基于version进行乐观锁并发控制
（1）version版本号元数据
（2）第一次创建document，版本号是1，修改或删除都自加1
（3）document删除之后，不会物理删除，再次写入会在原先版本号之上自增1
（4）primary和replica之间同步是多线程异步，基于version版本号并发控制
（5）高版本先到，低版本后到，后到达的低版本会被丢弃，新数据不会被旧的数据覆盖

5、es基于version进行乐观锁并发控制示例

两个线程对同一条商品信息进行更新操作过程
```
# 1、查询数据
GET /shop/goods/1
{
  "_version": 1,
  "_source": {
    "name": "iphone",
  }
}

# 2、先进行更新 成功
POST /shop/goods/1?version=1
{
  "name":"xiaomi"
}

# 3、后更新 失败
POST /shop/goods/1?version=1
{
  "name":"huawei"
}

# 4、查询最新版本号
GET /shop/goods/1
{
  "_version": 2,
  "_source": {
    "name": "xiaomi",
  }
}

# 5、用最新的版本号再次更新 成功
POST /shop/goods/1?version=2
{
  "name":"huawei"
}

```

6、基于external version进行乐观锁并发控制

es提供的version 一致 时进行修改，不一样报错
```
?version=1 
```
当external提供的版本号比es中的版本号 大 时才进行修改
```
?version=1&version_type=external
```

例如：
```
# 1、添加一条数据
PUT /shop/goods/1
{
  "name": "iphone"
}

# 2、查看数据版本号，此时verison=1
GET /shop/goods/1

# 3、用外部版本号为2的数据去更新 成功
PUT /shop/goods/1?version=2&version_type=external
{
  "name": "xiaomi"
}

# 4、再次用外部版本号为2的数据去更新 失败
PUT /shop/goods/1?version=2&version_type=external
{
  "name": "huawei"
}

# 5、查看版本号，此时版本号version=2，使用外部版本号verison=4的数据去更新 成功
PUT /shop/goods/1?version=4&version_type=external
{
  "name": "huawei"
}

# 并且最后的版本号显示为version=4
```

### 六、update实现原理
1、update 全量更新
创建 & 替换文档一样的语法
```
PUT /index/type/id
```
一般应用程序执行流程
（1）应用程序发起GET请求，获取document，展示到前台
（2）用户前台修改的数据，发送到后台
（3）后台代码将用户修改的数据在内存中执行，然后封装好修改后的数据
（4）后台发起PUT请求，到es中，进行全量更新
（5）es将旧的document标记为deleted，然后重新创建一个新的document

2、partial update 局部更新
```
PUT /index/type/id/_update
{
  data
}
```

3、es内部执行流程
（1）先获取document
（2）将新的字段值更新到document中
（3）将旧的document标记为deleted
（4）将修改的document创建出来

4、局部更新优点
（1）所有查询、修改操作发生在es的shard内部，避免网络开销，提升效率
（2）减少并发冲突

5、局部更新数据示例
```
# 写入数据
PUT /shop/goods/1
{
  "name": "iphone"
}

# 局部更新
POST /shop/goods/1/_update
{
  "doc": {
    "price": 36
  }
}

# 查看数据
GET /shop/goods/1
```

6、基于groovy脚本进行partial update
(1)内置脚本
```
# 准备数据
PUT /shop/goods/1
{
  "name": "iphone",
  "price": 10
}

# 脚本更新数据
POST /shop/goods/1/_update
{
  "script": "ctx._source.price+=1"
}

# 查看更新结果
GET /shop/goods/1
{
  "_source": {
    "name": "iphone",
    "price": 11
  }
}
```
（2）外部脚本

es安装目录下新建脚本文件
elasticsearch-5.2.0/config/scripts/add-shop-goods-price.groovy
```
ctx._source.price+=1
```

执行更新
```
POST /shop/goods/1/_update
{
  "script": {
    "lang": "groovy", 
    "file":"add-shop-goods-price"
  }
}

# 查看更新结果
GET /shop/goods/1
{
  "_source": {
    "name": "iphone",
    "price": 12
  }
}
```

（3）通过外部脚本删除文档
新建脚本文件
elasticsearch-5.2.0/config/scripts/delete-document.groovy
```
ctx.op = ctx._source.price == price ? 'delete' : 'none'
```

```
POST /shop/goods/1/_update
{
  "script": {
    "lang": "groovy",
    "file": "delete-document",
    "params": {
      "price": 12
    }
  }
}

# 查看删除结果
GET /shop/goods/1
{
  "_index": "shop",
  "_type": "goods",
  "_id": "1",
  "found": false
}

```
（4）upsert 操作
如果document存在则执行更新操作，不存在则执行upsert操作

```
# 1、新建数据
PUT /shop/goods/1
{
  "name": "iphone",
  "price": 10
}

# 2、查看数据
GET /shop/goods/1
{
  "_version": 1,
  "_source": {
    "name": "iphone",
    "price": 10
  }
}

# 3、更新数据
POST /shop/goods/1/_update
{
  "doc": {
    "name": "huawei"
  }, 
  "upsert": {
    "name": "xiaomi"
  }
}

# 4、查看更新的数据version=2，name=huawei
GET /shop/goods/1
{
  "_version": 2,
  "_source": {
    "name": "huawei",
    "price": 10
  }
}

# 5、删除数据
DELETE  /shop/goods/1

# 6、再次更新数据
POST /shop/goods/1/_update
{
 "doc": {
    "name": "huawei"
    }, 
  "upsert": {
    "name": "xiaomi"
  }
}

# 7、查看数据，vesion=4，name=xiaomi
GET /shop/goods/1
{
  "_version": 4,
  "_source": {
    "name": "xiaomi"
  }
}

```


7、partial update内置乐观锁并发控制
可以设置重试次数
```
POST  taobao/product/1/_update?version=1&retry_on_conflict=5
{
  "doc": {
    "name": "red cat"
  }
}
```


## 七、批量查询
1、批量查询的好处
如果一条一条的查询，查询100条就要发送100次网络请求，开销较大
如果批量查询，查询100条数据，只用发送1次网络请求，减少网络开销

2、单条查询
```
GET tianmao/product/1
```

3、mget 语法
```
GET  /_mget
{
  "docs": [{
    "_index": "taobao",
    "_type": "product",
    "_id": 1
  },
  {
    "_index": "tianmao",
    "_type": "product",
    "_id": 1
  }
  ]
}

```

4、查询同一个index下不同type数据
```
GET  taobao/_mget
{
  "docs": [
    {
    "_type": "product",
    "_id": 1
  },
  {
    "_type": "product",
    "_id": 2
  }
  ]
}

```

5、查询同一个index下，同type数据
```
GET  taobao/product/_mget
{
  "ids": [1, 2]
}

```

6、mget很重要
如果一次查询多条数据，那么久使用mget，减少网络开销

## 七、批量操作
1、bulk语法

每次操作有两个json串，放在bulk里
```
POST /_bulk
{"action": {"metadata"}}
{"data"}
```

例如
创建一个文档
```
{"index": {"_index": "taobao", "_type": "product", "_id": "1"}}
{"name": "Dog", "price": 25}

```

2、可以执行bulk操作的类型
（1）delete 删除文档
（2）create 强制创建 `PUT /index/type/id/_create`
（3）index 普通PUT，创建文档，也可是全量替换文档
（4）update 执行的partial update操作

注意：
单个json串不能换行，json串之间必须换行
任意一个操作失败，不会影响其他操作，会在结果中显示

示例
```
POST _bulk
{"create": {"_index": "taobao", "_type": "product", "_id": 4}}
{"name": "Pig", "price": 36}
{"delete": {"_index": "taobao", "_type": "product", "_id": 1}}
{"index": {"_index": "taobao", "_type": "product", "_id": 5}}
{"name": "Pig", "price": 45}
{"update": {"_index": "taobao", "_type": "product", "_id": 5}}
{"doc": {"price": 54}}
```

3、指定index
```
POST taobao/_bulk
{"create": {"_type": "product", "_id": 4}}
{"name": "Pig", "price": 36}
```

4、指定index 和type
```
POST taobao/product/_bulk
{"create": {"_id": 4}}
{"name": "Pig", "price": 36}
```

5、bulk性能
bulk request会加载到内存中，如果太大反而会降低性能，因此需要反复尝试一个最佳的bulk size
一般从1000~5000条数据开始，尝试增加
如果看大小，最好在5~15MB之间


## 八、阶段总结
1、阶段性总结
1-8 快速入门，基本原理，基本操作
9-13 ES分布式的基本原理，
14-27 document讲解

ElasticSearch 最核心功能
分布式文档的数据存储系统

分布式 distributed document store
文档数据 可以存储json格式的文档，核心数据结构
存储系统 对数据进行存储，查询，创建，更新，删除

一个NoSQL存储系统 操作document 

可以开发的应用程序
（1）数据量较大，快速进行扩容，承载大量数据
（2）数据结构灵活操作，不用去处理传统数据库中的表
（3）对数据操作较为简单，基本的增删改查
（4）NoSQL数据库，也适用以上场景


## 九、document数据路由原理
1、document路由，数据路由
一个index会被分成多片，每片都在一个shard中，
一个document，只能存在一个shard中
客户端创建document的时候，es就会决定document存放在哪个shard上

2、路由算法
```
shard = hash(routing) % number_of_primary_shards
```

举例：
一个index 有3个primary shard P0, P1, P2
（1）增删改查document时候，会有一个routing number 默认 routing = id
（2）传入hash函数产生routing的hash值 hash(routing) = 21
（3）hash值 对index 的primary shard数量取余 21 % 3 =0
（4）就决定了这个document 放在 P0之上

决定document 在哪个shard上，最重要的值是routing，默认是id，也可以手动指定
相同的routing值，每次求hash再求余，结果也一样
结果一定在 0 ~ number_of_primary_shards - 1之间

默认的routing是id，也可以手动指定
以便后续进行应用级别的负载均衡，以及提升批量读取的性能也很有帮助

```
PUT /index/type/id?routing=<user_id>

```

基于document路由算法，primary shard建立之后就不能修改，但是replica shard可以修改


## 十、document增删改内部原理
1、客户端选择一个node发送请求过去，这个node就是coordinating node(协调节点)
2、coordinating node 对document进行路由，将请求转发给对应的node（有primary shard）
3、实际的node上primary shard处理请求，然后将数据同步到replica shard
4、coordinating node 如果发现primary node 和所属 replica node都搞定之后，就放回响应结果给客户端

例如
3个节点，3个primary shard replica=1， replica shard=3
总共6个shard

client 要创建一个document
docuemnt可以发送任意一个node

增删改操作只能由primary shard操作，会自动同步到replica sahrd

## 十一、分布式文档系统
1、consistency

发送增删改操作的时候，可以带上一个consistency参数，指明我们想要的写一致性
```
PUT /index/type/id?consistency=quorum
```
one(primary shard): 写操作，只要primary shard是active就可以执行
all(all shard): 写操作，必须所有priamry shard和replica shard都是active才执行
quorum(default): 默认值，要求所有的shard，大部分shar都是活跃的才可以执行写操作

2、quorum机制
写之前必须确保大多数shard都可用，当number_of_replica > 1时才生效

计算公式
```
quorum = int((primary + number_of_replica)/2) + 1
```

举例：
primary_shard=3， number_of_replica=1, 总shard=6
quorum = int((3 + 1)/2) + 1 = 3

所以6个shard，至少3个shard处于active，才可以执行写操作

3、如果节点数量少于quorum数量，可能导致quorum不齐全，导致无法执行写操作
primary 和replica 必须在不同节点上，如果两个机器，有可能出现3个shard分配不齐全，
此时可能回出现写操作无法执行

例如：
node=2， primay=1 replica=3
quorum = int((primay + replica)/2) + 1 =  3
node1 -> primary
node2 -> replica1
所以active=2 < quorum=3, 不满足quorum机制

提供了一个特殊场景，就是number_of_replica>1才生效
如果不做处理，单节点就无法工作

4、quorum不齐全时，wait，默认1分钟，timeout
写操作可以设置timeout参数,单位 毫秒
```
PUT /index/type/id?timeout=30 
```

## 十二、document查询内部原理
1、客户端发送请求到任意一个node

2、coordinating node接收到document读请求后，进行路由，转发给对应的node，
随机轮询算法在primary shard 和 replica shard中随机选一个shard，使得负载均衡

3、接收请求的node返回document给coordination node

4、coordinating node返回document给客户端

5、特殊情况，document如果还在建立索引过程中，可能只有primary shard有数据，replica shard没数据，
可能导致无法读取到document，但是document完成索引建立之后，primary shard和replica shard就都有数据了

对于读请求，不一定将请求转发到primary shard也可以转发到replica shard
replica shard也可以处理所有的读请求

使用round-robin 随机轮询算法
比如说：
coordinating node接收到一个document的4次查询，就会使用算法
将2次查询请求转发给P1，将2次查询请求转发给R1
尽量让primary shard 和所有的replica shard均匀服务读请求，使得负载均衡

## 十三、bulk api json格式与底层性能
bulk api Json格式
```
{"action": "meta"}
{"data"}
```

1、bulk中的每个操作都可能要转发到不同node的shard去执行

2、如果采用比较良好的json数组格式
（1）将json数组解析为JSONArray对象  文本->JsonArray对象
（2）对每个请求中的document进行路由
（3）为路由到同一个shard上的多个请求，创建一个请求数组
（4）将序列化后的数据发送到对应的节点上去

3、耗费更多内存，更多的jvm开销
bulk size 最佳大小，如果单次传输数据过多，内存占用过多，性能下降，垃圾回收耗费时间

4、现在的方式
（1）直接按照换行符切割json
（2）对每两个一组的json，读取mete，进行document路由
（3）直接将对应的json发送到node上去

5、最大的优势在于，不需要将json数组解析为一个JSONArray对象，
形成一份大数据拷贝，避免了内存空间的浪费

