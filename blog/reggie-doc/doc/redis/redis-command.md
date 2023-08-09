# Redis常用命令

## 字符串 string

常用命令

```bash
# 设置key的值
set key vlaue

# 获取key的值
get key

# 设置key的值，并设置过期时间，单位：秒
setex key seconds value

# 只有在key不存在时，设置key的值，实现分布式锁
setnx key vlaue
```

示例
```bash
> set name tom
OK
> get name
"tom"
```

## 哈希 hash

常用于存储对象

```bash
# 设置字段值
hset key field value

# 获取字段值
hget key field

# 删除字段
hdel key field

# 获取所有字段名
hkeys key

# 获取所有字段值
hvals key

# 获取所有字段名和字段值
hgetall key
```

示例

```bash
# 设置字段值
> hset id-001 name Tom
(integer) 1
> hset id-001 age 20
(integer) 1

# 获取字段值
> hget id-001 name
"Tom"
> hget id-001 age
"20"

# 获取所有字段名
> hkeys id-001
1) "name"
2) "age"

# 获取所有字段值
> hvals id-001
1) "Tom"
2) "20"

# 获取所有字段名和字段值
> hgetall id-001
1) "name"
2) "Tom"
3) "age"
4) "20"
```

## 列表 list

常用于任务队里

```bash
# 列表头部插入值
lpush key value

# 获取指定范围内元素
lrange key start stop

# 移除并获取列表最后一个元素
rpop key

# 获取列表长度
llen key

# 移出并获取列表最后一个元素
# 如果没有元素会阻塞列表知道等待超时，或发现可弹出元素为止
brpop key timeout
```

示例

```bash
# 左侧插入
> lpush fruits apple
(integer) 1
> lpush fruits orange
(integer) 2
> lpush fruits banana
(integer) 3

# 队列长度
> llen fruits
(integer) 3

# 所有元素
> lrange fruits 0 -1
1) "banana"
2) "orange"
3) "apple"

# 右侧弹出
> rpop fruits
"apple"

> lrange fruits 0 -1
1) "banana"
2) "orange"
```

## 集合 set

无序集合，集合中不能出现重复的元素

```bash
# 向集合中添加成员
sadd key member1 [member2]

# 返回集合中所有成员
smembers key

# 获取集合成员数
scard key

# 移除集合中成员
srem key member1 [member2]

# 返回给定所有集合的交集
sinter key1 [key2]

# 返回给定所有集合的并集
sunion key1 [key2]

# 返回给定所有集合的差集
sdiff key1 [key2]
```

示例

```bash
# 添加集合成员
> sadd name1 a b c d
(integer) 4

# 查看集合成员
> smembers name1
1) "d"
2) "c"
3) "b"
4) "a"

# 查看集合成员数量
> scard name1
(integer) 4

# 移除集合成员
> srem name1 a
(integer) 1
> smembers name1
1) "d"
2) "c"
3) "b"
```

## 有序集合 sorted set

通过分数来排序，成员唯一，分数可以重复

排序方式：从小到大

```bash
# 向有序集合添加成员，如果存在就更新成员
zadd key score1 member1 [score1 member1]

# 返回有序集合成员
zrange key start stop [withscores]

# 增加集合中成员分数
zincrby key increment member

# 移除有序集合成员
zrem key member1 [member2]
```

示例
```bash
# 向有序集合添加成员
> zadd sorted_set 1.0 tom
(integer) 1
> zadd sorted_set 5.0 jack
(integer) 1
> zadd sorted_set 3.0 steve
(integer) 1

# 返回有序集合成员,分数值从小到大排序
> zrange sorted_set 0 -1
1) "tom"
2) "steve"
3) "jack"

# 返回有序集合成员和分数值
> zrange sorted_set 0 -1 withscores
1) "tom"
2) "1"
3) "steve"
4) "3"
5) "jack"
6) "5"

# 增加集合中成员分数
> zincrby sorted_set 3 steve
"6"

> zrange sorted_set 0 -1
1) "tom"
2) "jack"
3) "steve"

# 移除有序集合成员
> zrem sorted_set steve
(integer) 1

> zrange sorted_set 0 -1
1) "tom"
2) "jack"
```

## 通用命令

常用命令

```bash
# 查找所有符合模式的key
keys pattern

# 检查key是否存在
exists key

# 返回key所存储的值的类型
type key

# 返回key剩余生存时间（TTL, time to live），单位：秒
ttl key

# 删除key
del key

# 切换数据库, 0-15, 默认使用0号数据库
select num

# 清空整个 Redis 服务器的数据
flushall 

# 清空当前库中的所有 key
flushdb 
```

示例

```bash
> set name tom
OK
> lpush fruits apple
(integer) 3

# 查找所有key
> keys *
1) "name"
2) "fruits"

# 检查key是否存在，存在返回1，不存在返回0
> exists name
(integer) 1
> exists age
(integer) 0

# 返回key所存储的值的类型
> type name
string
> type fruits
list

# 返回key剩余生存时间，
# 永不过期，返回-1
> ttl name
(integer) -1

> setex age 90 20
OK

# 没有过期，返回正整数
> ttl age
(integer) 86

# 过期之后，返回-2
> ttl age
(integer) -2
```