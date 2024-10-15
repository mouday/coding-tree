# gdb

## 相关资料

https://sourceware.org/gdb/

https://sourceware.org/gdb/download/onlinedocs/gdb.pdf

## 安装

```bash
# macos
brew install gdb

# linux
yum install gdb
```

## 基本命令

常用指令

```bash
run r 运行
next n 单步
step s 进入函数
continue c 继续
quit q 退出
list l 查看源码
break b 打断点 
	- `b mian` 在函数打断点
	- `b 12` 在第6行打断点
info i 查看信息
	- `i b` 查看断点
print p 打印变量
shell 运行shell
	- `shell ls`
```

## GDB小技巧

```bash
# 查看源码
(gdb)layout src

# 输出日志到gdb.txt
set logging on

# 打印变量
print &i;
```

监控变量
```bash
(gdb)print &i;

# 监控变量
(gdb)watch *0x00230083

(gdb)info watchpoints
watch *0x7ff7bfeff81c
Hardware watchpoint 2: *0x7ff7bfeff81c

(gdb) n
Thread 2 hit Hardware watchpoint 2: *0x7ff7bfeff81c

Old value = 0
New value = 1
```

## 调试程序

### 调试启动程序
语法

```bash
$ gdb 可执行程序
```

main.c

```cpp
#include<stdio.h>

void print_arrary(){
    int arr[4] = {1, 2, 3, 4};

	for(int i = 0; i < 4; i++) {
		printf("arr[%d] = %d\n", i, i);
	}
}

int main(){
    print_arrary();

	return 0;
}
```


编译程序，需要加`-g`参数

```bash
# -g Generate source-level debug information
gcc -g main.c
```

进入调试
```bash
gdb ./a.out
```

### 挂掉的程序core文件

语法

```bash
$ gdb 可执行程序 core文件
```

检查生成core文件的参数

```bash
$ ulimit -a

-t: cpu time (seconds)              unlimited
-f: file size (blocks)              unlimited
-d: data seg size (kbytes)          unlimited
-s: stack size (kbytes)             8192
-c: core file size (blocks)         0
-v: address space (kbytes)          unlimited
-l: locked-in-memory size (kbytes)  unlimited
-u: processes                       2784
-n: file descriptors                256
```

修改ulimit限制，生成core文件

```bash
$ ulimit -c
0

$ ulimit -c unlimited

$ ulimit -c
unlimited
```

main.c

```cpp
#include<stdio.h>


int main(){
    int* p = NULL;
    *p = 10;
	return 0;
}
```

编译运行

```bash
$ gcc -g main.c

# 运行报错，生成core文件
$ ./a.out   
zsh: segmentation fault (core dumped)  ./a.out

$ ls /cores
core.4757
```

查看core文件

```bash
$ gdb ./a.out /cores/core.4757
```

### 正在运行的程序

语法

```bash
gdb -p 进程ID
```

main.c

```cpp
#include<stdio.h>

int main(){
    int i = 0;

    while(1){
        i++;
    }

	return 0;
}
```

查看运行中的程序，并使用gdb调试

```bash
$ ps -ef| grep a.out
# 或者
$ ps aux|grep a.out
5015 ./a.out

$ gdb -p 5015
```

## 遇到的问题

1、遇到的问题1

```bash
Core file format not supported
```

2、遇到的问题2

```bash
Unable to find Mach task port for process-id 3246: (os/kern) failure (0x5).
 (please check gdb is codesigned - see taskgated(8))
```

解决办法：gdb前面加sudo

## 参考资料

在Mac安装最新gdb的详细教程，含可能遇到的所有坑(网上最新教程)
https://blog.csdn.net/qq_33154343/article/details/104784641

【小神仙讲 GDB】 通俗易懂版教程 | 一小时入门GDB | Debug | c/c++程序员必备 | 佩雨小神仙
https://www.bilibili.com/video/BV1EK411g7Li