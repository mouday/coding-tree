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

查找配置文件路径

```sql
# psql -d postgres -c "SHOW config_file;"
                   config_file
-------------------------------------------------
 /Users/user/local/postgres-data/postgresql.conf
(1 row)
```

postgresql.conf

```bash

# log_min_messages = warning
log_min_messages = debug5

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

例如

```bash
call elog_node_display(16, "name", parsetree, 1);
```

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

## 调试代码

根据错误直接定位代码

```shell
postgres=# select * from tb1;
ERROR:  relation "tb1" does not exist
LINE 1: select * from tb1;
                      ^
postgres=# \errverbose
ERROR:  42P01: relation "tb1" does not exist
LINE 1: select * from tb1;
                      ^
LOCATION:  parserOpenTable, parse_relation.c:1452
```

## 查看日志

打印日志

```cpp
ereport(LOG, (errmsg("PgStartTime: %ld", PgStartTime)));
```

修改日志级别
log_min_messages = log

日志中显示行号
log_error_verbosity=verbose

通过进程号过滤日志

```shell
tail -f postgresql.log | grep '\[35004\]'
```

makefile

```shell
.PHONY: start
start:
    pg_ctl -D /Users/wang/local/postgres-data -l logfile start

.PHONY: stop
stop:
    pg_ctl -D /Users/wang/local/postgres-data -l logfile stop

.PHONY: restart
restart:
    make stop && make start

.PHONY: build
build:
    ./configure --prefix=/Users/wang/local/postgres --enable-debug --enable-cassert --enable-depend CFLAGS=-O0 && make && make install

.PHONY: rebuild
make:
    make && make install

.PHONY: reload
reload:
    make stop; make rebuild && make start
```

VSCode 配置

.vscode/launch.json

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(gdb) Launch",
            "type": "cppdbg",
            "request": "launch",
            "program": "/Users/wang/local/postgres/bin/postgres",
            "args": [
                "-D",
                "/Users/wang/local/postgres-data"
            ],
            "stopAtEntry": true,
            "cwd": "${fileDirname}",
            "environment": [],
            "externalConsole": false,
            "MIMode": "gdb",
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                },
                {
                    "description": "Set Disassembly Flavor to Intel",
                    "text": "-gdb-set disassembly-flavor intel",
                    "ignoreFailures": true
                },
                {
                    "description": "gdb setting", // 屏蔽信号输出
                    "text": "handle SIGUSR1 SIGUSR2 nostop noprint",
                    "ignoreFailures": true
                }
            ]
        },
        {
            "name": "(gdb) Attach",
            "type": "cppdbg",
            "request": "attach",
            "program": "/Users/wang/local/postgres/bin/postgres",
            "MIMode": "gdb",
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                },
                {
                    "description": "Set Disassembly Flavor to Intel",
                    "text": "-gdb-set disassembly-flavor intel",
                    "ignoreFailures": true
                },
                {
                    "description": "gdb setting", // 屏蔽信号输出
                    "text": "handle SIGUSR1 SIGUSR2 nostop noprint",
                    "ignoreFailures": true
                }
            ]
        },
        {
            "name": "(lldb) Launch",
            "type": "cppdbg",
            "request": "launch",
            "program": "/Users/wang/local/postgres/bin/postgres",
            "args": [
                "-D",
                "/Users/wang/local/postgres-data"
            ],
            "stopAtEntry": true,
            "cwd": "${fileDirname}",
            "environment": [],
            "externalConsole": false,
            "MIMode": "lldb"
        },
        {
            "name": "(lldb) Attach",
            "type": "cppdbg",
            "request": "attach",
            "program": "/Users/wang/local/postgres/bin/postgres",
            "MIMode": "lldb",
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                },
                {
                    "description": "Set Disassembly Flavor to Intel",
                    "text": "-gdb-set disassembly-flavor intel",
                    "ignoreFailures": true
                },
                {
                    "description": "gdb setting", // 屏蔽信号输出
                    "text": "handle SIGUSR1 SIGUSR2 nostop noprint",
                    "ignoreFailures": true
                }
            ]
        }
    ]
}
```

VSCode配置

Mac配合使用CodeLLDB插件

https://github.com/vadimcn/codelldb/blob/v1.11.7/MANUAL.md

```json
// .vscode/launch.json
{
    "tasks": [
        {
            "type": "cppbuild",
            "label": "build current file",
            "command": "/usr/bin/gcc",
            "args": [
                "-g",
                "${file}",
                "-o",
                "${fileDirname}/${fileBasenameNoExtension}"
            ],
            "options": {
                "cwd": "${fileDirname}"
            },
            "problemMatcher": [
                "$gcc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "Task generated by Debugger."
        }
    ],
    "version": "2.0.0"
}
```

```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "targetArchitecture": "x86_64",
    "configurations": [
        {
            "name": "(CodeLLDB) Launch",
            "type": "lldb",
            "request": "launch",
            "args": [],
            "cwd": "${fileDirname}",
            "program": "${fileDirname}/${fileBasenameNoExtension}",
            "preLaunchTask": "build current file",
        },
        {
            "name": "(CodeLLDB) Attach",
            "type": "lldb",
            "request": "attach",
            "pid": "${command:pickProcess}"
        }
    ]
}
```