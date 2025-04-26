
# exec_simple_query

简要介绍一下 PostgreSQL 的执行流程。首先，我们需要明确 PostgreSQL 是基于多进程开发的，每当一个连接请求过来，PostgreSQL 都将创建一个新的 postgres 进程用于处理用户请求，在用户将需要执行的 SQL 语句发送到后端之后，postgres 进程将从 `exec_simple_query()` 函数开始进行处理，其主要的流程如下：

1. 调用 pg_parse_query() 函数进行词法、语法分析，即我们上面介绍的内容；
2. 循环遍历解析树链表对每个语句进行处理，如果没有查询语句转步骤 7；
3. 调用 pg_analyze_and_rewrite() 函数对解析树分析并重写并生成查询计划；
4. 调用 pg_plan_queries() 对查询树进行优化并选择一条最优路径生成执行计划；
5. 创建 Portal 对象并调用 PortalRun() 函数执行查询计划。
6. 执行 Portal 的清理工作并转步骤 2；
7. 退出。

需要注意的是 DDL 在步骤 3 和步骤 4 时不会被重写或优化，而只是简单的在原始解析树外面包装对应的结构而已，只有到了步骤 5 时才会执行转换并生成查询计划。

```sql
CREATE TABLE test (id int, info text);
```

parse tree

![](https://mouday.github.io/img/2025/04/06/r0s1tha.png)

rewritten parse tree
