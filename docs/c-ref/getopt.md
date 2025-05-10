# 命令行解析函数：getopt和getopt_long

## getopt

getopt用于解析短选项

### 定义

```cpp
#include <unistd.h>

/**
 * argc      参数数量
 * argv      参数数组
 * optstring 选项字符串
 */
int getopt(int argc, char * const argv[ ], const char * optstring);
```

### 重要参数

```cpp
// 当前选项参数字串
extern char* optarg = NULL;

// 当前索引值
extern int optind = 1;

// 将错误信息输出到stderr，为0时表示不输出
extern int opterr = 1;

// 无效选项字符
extern int optopt = 0;
```

### 参数解析

例如：选项字符串 "a:b:c::"

- 冒号表示参数，一个冒号就表示这个选项后面`必须`带有参数，比如`-a123` 和`-a 123`
- 两个冒号的就表示这个选项的参数是`可选`的，即可以有参数，也可以没有参数，注意有参数时，参数与选项之间不能有空格

参数格式

| 字符格式 | 说明 | 示例
|-|-|-
单个字符a       |  表示选项a没有参数     |  `-a`即可，不加参数
单字符加冒号b:   |  表示选项b有且必须加参数  |  `-b 100`或`-b100`,但-b=100错
单字符加2冒号c::  |  表示选项c是可选参数 | `-c200`，其它格式错误

### 示例

示例1

```cpp
// main.c
#include <stdio.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    char *optstring = "ab:c::";
    char ch;

    while ((ch = getopt(argc, argv, optstring)) != -1) {
        switch (ch) {
            case 'a':
                printf("option -a\n");
                break;
            case 'b':
                printf("option -b %s\n", optarg);
                break;
            case 'c':
                printf("option -c %s\n", optarg);
                break;
            default:
                printf("Unknown option '%c'\n", optopt);
                break;
        }
    }
    return 0;
}
```

编译执行

```shell
gcc main.c && ./a.out -a -b 2 -c3 -d
option -a
option -b 2
option -c 3
./a.out: illegal option -- d
Unknown option 'd'
```

## 出错信息

出错信息输出行为：

1. 在调用getopt()之前，将opterr设置为0，这样就可以在getopt()函数发现错误的时候强制它不输出任何消息。
2. 如果optstring参数的第一个字符是冒号，那么getopt()函数就会保持沉默，并根据错误情况返回不同字符，如下：
- “无效选项” —— getopt()返回'?'，并且optopt包含了无效选项字符（这是正常的行为）。
- “缺少选项参数” —— getopt()返回':'，如果optstring的第一个字符不是冒号，那么getopt()返回'?'，这会使得这种情况不能与无效选项的情况区分开。

示例2

```cpp
// main.c
#include <stdio.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    char *optstring = ":ab:c::d:";
    char ch;

    while ((ch = getopt(argc, argv, optstring)) != -1) {
        switch (ch) {
            case 'a':
                printf("option -a\n");
                break;
            case 'b':
                printf("option -b %s\n", optarg);
                break;
            case 'c':
                printf("option -c %s\n", optarg);
                break;
            case '?':
                printf("illegal option: %c\n", optopt);
                break;
            case ':':
                printf("option requires an argument: %c\n", optopt);
                break;
        }
    }
    return 0;
}

```

编译执行

```shell
gcc main.c && ./a.out -a -b 2 -cxx -e -d
```

输出

```shell
option -a
option -b 2
option -c xx
illegal option: e
option requires an argument: d
```

## getopt_long

getopt_long解析长选项

### 定义

```cpp
#include <getopt.h>

int getopt_long(int argc, char * const argv[], const char *optstring, const struct option *longopts, int *longindex);

int getopt_long_only(int argc, char * const argv[],const char *optstring, const struct option *longopts, int *longindex);
```

### 数据结构

```cpp
#define no_argument        0
#define required_argument  1
#define optional_argument  2

struct option {
	/* name of long option */
	const char *name;
	/*
	 * one of no_argument, required_argument, and optional_argument:
	 * whether option takes an argument
	 */
	int has_arg;
	/* if not NULL, set *flag to val when option found */
	int *flag;
	/* if flag not NULL, value to set *flag to; else return value */
	int val;
};
```

### 参数格式

| has_arg | 说明 | 示例
|-|-|-
no_argument        | 表明长选项不带参数 | 如：--name, --help
required_argument | 表明长选项必须带参数 | 如：--prefix /root或 --prefix=/root
optional_argument  |表明长选项的参数是可选的 | 如：--help或 –prefix=/root，其它都是错误

### 示例

```cpp
#include <stdio.h>
#include <getopt.h>

struct option longopts[] = {
    {"house", no_argument, NULL, 'h'},
    {"name", required_argument, NULL, 'n'},
    {"age", optional_argument, NULL, 'a'},
    { 0, 0, 0, 0 }
};

int main(int argc, char *argv[]) {
    char *optstring = ":hn:a:";
    char ch;

    while ((ch = getopt_long(argc, argv, optstring, longopts, NULL)) != -1) {
        switch (ch) {
            case 'n':
                printf("option name %s\n", optarg);
                break;
            case 'a':
                printf("option age %s\n", optarg);
                break;
            case 'h':
                printf("option house\n");
                break;
            default:
                printf("Unknown option '%c'\n", optopt);
                break;
        }
    }
    return 0;
}

```

使用1

```shell
gcc main.c && ./a.out -n tom -a18 -h
option name tom
option age 18
option house
```

使用2

```shell
gcc main.c && ./a.out --name tom --age=18 --house
option name tom
option age 18
option house
```

## 参考

原来命令行参数处理可以这么写-getopt？
https://blog.csdn.net/huangxiaohu_coder/article/details/7475156

命令行选项解析函数(C语言)：getopt()和getopt_long() 
https://www.cnblogs.com/chenliyang/p/6633739.html