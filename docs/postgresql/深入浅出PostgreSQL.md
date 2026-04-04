# 深入浅出PostgreSQL

## PostgreSQL基本概念

- 域（Field）= 字段（Field）= 列（Column）
- 元组（Tuple）= 行（Row）= 记录（Record）
- 关系（Relation）= 表（Table）+ 索引Index
- 数据库（Database）
- 数据库簇（Database Cluster）

他们之间的关系：

- 多个域（Field）构成一个元组（Tuple）
- 多个元组（Tuple）构成一个关系（Relation）
- 多个关系（Relation）构成一个数据库
- 所有的数据库集合在一起构成了一个数据库簇
