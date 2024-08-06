# Redis

Redis 的数据类型?

Redis 支持五种数据类型:
- string(字符串)
- hash(哈希)
- list(列表)
- set(集合)
- zset sorted set:有序集合)

## 使用 Redis 有哪些好处?

- 速度快，因为数据存在内存中，类似于 HashMap，HashMap 的优势就是查找和操作的时间复杂度都是 O1) 
- 支持丰富数据类型，支持 string，list，set，Zset，hash 等 
- 支持事务，操作都是原子性，所谓的原子性就是对数据的更改要么全部执行，要么全部不执行 
- 丰富的特性:可用于缓存，消息，按 key 设置过期时间，过期后将会自动删除


## Redis 相比 Memcached 有哪些优势?

- Memcached 所有的值均是简单的字符串，redis 作为其替代者，支持更为丰富的数据类 
- Redis 的速度比 Memcached 快很
- Redis 可以持久化其数据

## Redis 是单进程单线程的?

Redis 是单进程单线程的，redis 利用队列技术将并发访问变为串行访问，消除了传统数据库串行控制的开销。

## Redis 过期键的删除策略?

1)定时删除:在设置键的过期时间的同时，创建一个定时器 timer).让定时器在键的过期时间来临时，立即执 行对键的删除操作。 

2)惰性删除:放任键过期不管，但是每次从键空间中获取键时，都检查取得的键是否过期，如果过期的话，就 删除该键;如果没有过期，就返回该键。 

3)定期删除:每隔一段时间程序就对数据库进行一次检查，删除里面的过期键。至于要删除多少过期键，以及 要检查多少个数据库，则由算法决定。


## Redis 的回收策略(淘汰策略)?
- volatile-lru:从已设置过期时间的数据集(server.db[i].expires)中挑选最近最少使用的数据淘汰 
- volatile-ttl:从已设置过期时间的数据集(server.db[i].expires)中挑选将要过期的数据淘汰 
- volatile-random:从已设置过期时间的数据集(server.db[i].expires)中任意选择数据淘汰 
- allkeys-lru:从数据集(server.db[i].dict)中挑选最近最少使用的数据淘汰 
- allkeys-random:从数据集(server.db[i].dict)中任意选择数据淘汰 
- no-enviction(驱逐):禁止驱逐数据

## 为什么 Redis 需要把所有数据放到内存中?

Redis 为了达到最快的读写速度将数据都读到内存中，并通过异步的方式将数据写入磁盘。所以 redis 具有快速和 数据持久化的特征。如果不将数据放在内存中，磁盘 I/O 速度为严重影响 redis 的性能。在内存越来越便宜的今 天， redis 将会越来越受欢迎。如果设置了最大使用的内存，则数据已有记录数达到内存限值后不能继续插入新 值。

## Redis 的同步机制了解么?

Redis 可以使用主从同步，从从同步。第一次同步时，主节点做一次 bgsave，并同时将后续修改操作记录到内存 buffer，待完成后将 rdb 文件全量同步到复制节点，复制节点接受完成后将 rdb 镜像加载到内存。加载完成后，再 通知主节点将期间修改的操作记录同步到复制节点进行重放就完成了同步过程。

## Redis 支持的 Java 客户端都有哪些?官方推荐用哪个?

Redisson、Jedis、lettuce 等等，官方推荐使用 Redisson。

## Jedis 与 Redisson 对比有什么优缺点?

Jedis 是 Redis 的 Java 实现的客户端，其 API 提供了比较全面的 Redis 命令的支持;Redisson 实现了分布式和可 扩展的 Java 数据结构，和 Jedis 相比，功能较为简单，不支持字符串操作，不支持排序、事务、管道、分区等 Redis 特性。
Redisson 的宗旨是促进使用者对 Redis 的关注分离，从而让使用者能够将精力更集中地放在处理业务逻辑上。


## Redis 最适合的场景? 

会话缓存(Session Cache)

最常用的一种使用 Redis 的情景是会话缓存(session cache)。用 Redis 缓存会话比其他存储(如 Memcached)的优势在于:Redis 提供持久化。当维护一个不是严格要求一致性的缓存时，如果用户的购物⻋信 息全部丢失，大部分人都会不高兴的，现在，他们还会这样吗?幸运的是，随着 Redis 这些年的改进，很容易找到 怎么恰当的使用 Redis 来缓存会话的文档。甚至广为人知的商业平台 Magento 也提供 Redis 的插件。

全⻚缓存(FPC)

除基本的会话 token 之外，Redis 还提供很简便的 FPC 平台。回到一致性问题，即使重启了 Redis 实例，因为有磁 盘的持久化，用户也不会看到⻚面加载速度的下降，这是一个极大改进，类似 PHP 本地 FPC。再次以 Magento 为 例，Magento 提供一个插件来使用 Redis 作为全⻚缓存后端。此外，对 WordPress 的用户来说，Pantheon 有一 个非常好的插件 wp-redis，这个插件能帮助你以最快速度加载你曾浏览过的⻚面。

队列

Reids 在内存存储引擎领域的一大优点是提供 list 和 set 操作，这使得 Redis 能作为一个很好的消息队列平台来使 用。Redis 作为队列使用的操作，就类似于本地程序语言(如 Python)对 list 的 push/pop 操作。如果你快速的在 Google 中搜索“Redis queues”，你⻢上就能找到大量的开源项目，这些项目的目的就是利用 Redis 创建非常好的 后端工具，以满足各种队列需求。例如，Celery 有一个后台就是使用 Redis 作为 broker，你可以从这里去查看。

排行榜/计数器

Redis 在内存中对数字进行递增或递减的操作实现的非常好。集合(Set)和有序集合(Sorted Set)也使得我们在 执行这些操作的时候变的非常简单，Redis 只是正好提供了这两种数据结构。所以，我们要从排序集合中获取到排 名最靠前的10 个用户–我们称之为“user_scores”，我们只需要像下面一样执行即可:当然，这是假定你是根据你用 户的分数做递增的排序。如果你想返回用户及用户的分数，你需要这样执行: ZRANGE user_scores 0 10 WITHSCORES Agora Games 就是一个很好的例子，用 Ruby 实现的，它的排行榜就是使用 Redis 来存储数据的， 你可以在这里看到。

发布/订阅

最后(但肯定不是最不重要的)是 Redis 的发布/订阅功能。发布/订阅的使用场景确实非常多。我已看⻅人们在社 交网络连接中使用，还可作为基于发布/订阅的脚本触发器，甚至用 Redis 的发布/订阅功能来建立聊天系统!

## 用缓存可能出现的问题

- 数据不一致
- 缓存雪崩
- 缓存穿透
- 缓存并发竞争
