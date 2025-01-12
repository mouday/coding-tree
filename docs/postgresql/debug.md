# Debug Postgresql


查询客户端连接上的服务进程id

```sql
postgres=# select pg_backend_pid();
 pg_backend_pid
----------------
          34255
(1 row)

postgres=# select 1;
```

## 开启debug日志

postgresql.conf

```bash
#debug_print_parse = off
debug_print_parse = on

#debug_print_rewritten = off
debug_print_rewritten = on

#debug_print_plan = off
debug_print_plan = on

#debug_pretty_print = on
debug_pretty_print = on
```

```cpp
pg_rewrite_query()
{

    // debug_print_parse = on
	if (Debug_print_parse)
		elog_node_display(LOG, "parse tree", query,
						  Debug_pretty_print);

    // debug_print_rewritten = on
    if (Debug_print_rewritten)
		elog_node_display(LOG, "rewritten parse tree", querytree_list,
						  Debug_pretty_print);

}

pg_plan_query(){
    // debug_print_plan = on
	if (Debug_print_plan)
		elog_node_display(LOG, "plan", plan, Debug_pretty_print);
}
```

## GDB

```bash
(gdb) call elog_node_display(17, "what ever", Node * var, 0 or 1)
```
- 17代表INFO，详见elog.h，比如希望打印在日志里，将17替换为16，
- 0或1取决于debug_pretty_print为on还是off

## pgNodeGraph

将打印信息图形化工具：

https://github.com/shenyuflying/pgNodeGraph

https://github.com/japinli/pg_node2graph

依赖 graphviz

```bash
brew install graphviz
```

例如：
```sql
select 1;
```

说明：
- 第一个图基于pgNodeGraph
- 第二个图基于pg_node2graph

parsetree_list

![](https://mouday.github.io/img/2025/01/12/v6u46im.png)

![](https://mouday.github.io/img/2025/01/12/e3fj2rj.png)

1、parse tree

![](https://mouday.github.io/img/2025/01/11/u3bjsdc.png)

![](https://mouday.github.io/img/2025/01/12/h4okokv.png)

2、rewritten

![](https://mouday.github.io/img/2025/01/11/t5mgqfp.png)

![](https://mouday.github.io/img/2025/01/12/xoaygs2.png)
3、plan

![](https://mouday.github.io/img/2025/01/11/le0w9zc.png)

![](https://mouday.github.io/img/2025/01/12/ky20gf7.png)
ref

PostgreSQL数据库查询——exec_simple_query函数分析 

https://www.cnblogs.com/feishujun/p/PostgreSQLSourceAnalysis_query001.html