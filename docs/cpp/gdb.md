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
// main_core.c
#include <stdio.h>

void func1()
{
    int *p = NULL;
    *p = 10;
}

void func2()
{
    func1();
}

int main()
{
    func2();
    
    return 0;
}
```

编译运行

```bash
$ gcc -g -o main_core main_core.c

# 运行报错，生成core文件
$ ./main_core
zsh: segmentation fault (core dumped)  ./main_core

$ ls /cores
core.4757
```

查看core文件（linux会在当前目录下生成）

```bash
# 进入gdb告诉你是第7行报错了
$ gdb main_core core.8623
#0  0x00000000004004fd in func1 () at main_core.c:7
7	    *p = 10;

# 通过bt查看具体报错的栈
(gdb) bt
#0  0x00000000004004fd in func1 () at main_core.c:7
#1  0x0000000000400513 in func2 () at main_core.c:12
#2  0x0000000000400523 in main () at main_core.c:17
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


## GDB设置启动参数


```bash
// 设置启动参数
set args arg1 arg1

// 设置变量的值
set var key = value;

break b 设置断点
```


```bash
// 设置启动参数
set args arg1 arg1
```

测试程序

```c
// main_args.c
#include <stdio.h>

int main(int argc, char *argv[])
{

    for (int i = 0; i < argc; i++)
    {
        printf("argv[%d] = %s\n", i, argv[i]);
    }

    return 0;
}
```

gdb示例

```bash
$ gcc -g -o main_args main_args.c

$ gdb -q main_args

# 运行程序
(gdb) r
argv[0] = /Users/workspace/main_args

# 设置启动参数
(gdb) set args arg1 arg2 arg3

# 再次运行程序
(gdb) r
argv[0] = /Users/workspace/main_args
argv[1] = arg1
argv[2] = arg2
argv[3] = arg3

# 如果包含特殊字符用双引号包裹起来
(gdb) set "hello word" arg3

(gdb) r
argv[0] = /Users/workspace/main_args
argv[1] = "hello
argv[2] = word"
argv[3] = arg3
```
## 多进程调试

```bash
# 调试父进程
set follow-fork-mode parent

# 调试子进程
set follow-fork-mode child

# 设置调试模式
set detach-on-fork on/off

# 查看进程
info inferiors

# 切换进程
inferior 进程id
```




## 多线程调试

```bash
# 查看进程
ps aux|grep 进程名

# 查看线程
ps -aL | grep 进程名

# 查看主线程和子线程关系
pstree -p 主线程id
```

```bash
# 查看线程
info threads

# 切换线程
thread 线程id

# 只运行当前线程
set scheduler-locking on

# 运行全部线程
set scheduler-locking off

# 指定某线程执行某gdb命令
thread apply 线程id cmd命令

# 全部某线程执行某gdb命令
thread apply all cmd命令
```

多线程示例

```c
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

// 线程函数1
void *pthread_func1(void *arg)
{
    while (1)
    {
        printf("线程函数1正在运行.....\n");
        sleep(2);
    }
}

// 线程函数2
void *pthread_func2(void *arg)
{
    while (1)
    {
        printf("线程函数2正在运行.....\n");
        sleep(2);
    }
}

int main(int argc, char **argv)
{

    pthread_t thread_id1;
    pthread_t thread_id2;

    /*1. 创建线程1*/
    if (pthread_create(&thread_id1, NULL, pthread_func1, NULL))
    {
        printf("线程1创建失败!\n");
        return -1;
    }

    /*2. 创建线程2*/
    if (pthread_create(&thread_id2, NULL, pthread_func2, NULL))
    {
        printf("线程2创建失败!\n");
        return -1;
    }

    /*3. 等待线程结束,释放线程的资源*/
    pthread_join(thread_id1, NULL);
    pthread_join(thread_id2, NULL);

    return 0;
}
```

## 日志调试

不方便调试，可以直接输出日志查看

## 参考资料

在Mac安装最新gdb的详细教程，含可能遇到的所有坑(网上最新教程)
https://blog.csdn.net/qq_33154343/article/details/104784641

【小神仙讲 GDB】 通俗易懂版教程 | 一小时入门GDB | Debug | c/c++程序员必备 | 佩雨小神仙
https://www.bilibili.com/video/BV1EK411g7Li

C语言gdb调试之精髓（常用命令、多进程、多线程、程序日志）
https://www.bilibili.com/video/BV1ei4y1V758