# OpenGauss


https://opengauss.org/zh/

数据库管理系统-
https://www.bilibili.com/video/BV15u4y1Q71R

课程主页：https://dbgroup.cs.tsinghua.edu.cn/ligl/courses_cn.html

GaussDB查询优化
- 基于规则的查询优化（RBO）
- 基于代价的查询优化（CBO）
- 基于人工智能的查询优化（ABO）

GaussDB查询重写

```cpp
subquery-planner
preprocess_const_params     // 常数替换等式
pull_up_sublinks            // 提升子链接
reduce_orderby              // 减少order by
removeNotNullTest           // 删除NotNullTest
lazyagg_main                // Lazy agg重写
pull_up_subqueries          // 提升子查询
flatten_simple_union_all    // UNIONALL优化 
expand_inherited_tables     // 展开继承表
preprocess_expression       // 预处理表达式
处理HAVING子句
reduce_outer_joins          // 外连接消除
reduce_inequality_fulljoins // 全连接fulljoin重写
```

![](https://mouday.github.io/img/2025/06/07/qv18qdn.png)

GaussDB代价估计

总代价

```cpp
总代价=IO代价+CPU代价+通信代价
```

- 处理页面产生IO代价
- 处理元组（表达式计算）产生CPU代价
- 分布式数据库在不同节点传输数据产生通信代价

统计信息
- 统计信息描述了用户表中数据的分布特征为后续行数估算、代价估算提供数据基础。
- Table-Level表级别统计信息：tuples总元组数、page总页面数
- Column-Level列级别统计信息：Distinct值、NullRatio、MCV（Most Common Value）、直方图
- 扩展统计信息：Multi-Column Statistics多列统计信息、View-Statistics视图统计信息

