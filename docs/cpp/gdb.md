# gdb

https://sourceware.org/gdb/


https://sourceware.org/gdb/download/onlinedocs/gdb.pdf

安装
```
brew install gdb

yum install gdb
```

基本命令


```bash
# 查看源码
(gdb)layout src
```

常用指令

```bash
next n
step s
print p
continue c
break b
info i
quit q
```


run r 运行
quit q 退出
list l 查看源码
break b 打断点 
	- `b mian` 在函数打断点
	- `b 12` 在第6行打断点
info i 查看信息
	- `i b` 查看断点
print p 打印变量
step s 进入函数
shell 运行shell
	- `shell ls`

GDB小技巧

# 输出日志到gdb.txt
set logging on

print &i;

watch *0x00230083

info watchpoints

watch *0x7ff7bfeff81c
Hardware watchpoint 2: *0x7ff7bfeff81c
(gdb) n

Thread 2 hit Hardware watchpoint 2: *0x7ff7bfeff81c

Old value = 0
New value = 1

gcc -g 
-g Generate source-level debug information

遇到的问题

```
Unable to find Mach task port for process-id 3246: (os/kern) failure (0x5).
 (please check gdb is codesigned - see taskgated(8))
```

解决办法：gdb前面加sudo


在Mac安装最新gdb的详细教程，含可能遇到的所有坑(网上最新教程)
https://blog.csdn.net/qq_33154343/article/details/104784641

【小神仙讲 GDB】 通俗易懂版教程 | 一小时入门GDB | Debug | c/c++程序员必备 | 佩雨小神仙
https://www.bilibili.com/video/BV1EK411g7Li