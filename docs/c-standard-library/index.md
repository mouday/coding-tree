# C 标准库

C 标准库（C Standard Library）

|头文件 | 功能简介
|-|-
| [stdio.h](stdio.h.md) | 标准输入输出库，包含 printf、scanf、fgets、fputs 等函数。
| [stdlib.h](stdlib.h.md) | 标准库函数，包含内存分配、程序控制、转换函数等，如 malloc、free、exit、atoi、rand 等。
| [string.h](string.h.md) | 字符串操作函数，如 strlen、strcpy、strcat、strcmp 等。
| [math.h](math.h.md) | 数学函数库，包含各种数学运算函数，如 sin、cos、tan、exp、log、sqrt 等。
| [time.h](time.h.md) | 时间和日期函数，如 time、clock、difftime、strftime 等。
| [ctype.h](ctype.h.md) | 字符处理函数，如 isalpha、isdigit、isspace、toupper、tolower 等。
| [limits.h](limits.h.md) | 定义各种类型的限制值，如 INT_MAX、CHAR_MIN、LONG_MAX 等。
| [float.h](float.h.md) | 定义浮点类型的限制值，如 FLT_MAX、DBL_MIN 等。
| [assert.h](assert.h.md) | 包含宏 assert，用于在调试时进行断言检查。
| [errno.h](errno.h.md) | 定义了错误码变量 errno 及相关宏，用于表示和处理错误。
| [stddef.h](stddef.h.md) | 定义了一些通用类型和宏，如 size_t、ptrdiff_t、NULL 等。
| [signal.h](signal.h.md) | 定义了处理信号的函数和宏，如 signal、raise 等。
| [setjmp.h](setjmp.h.md) | 提供非本地跳转功能的宏和函数，如 setjmp、longjmp 等。
| [locale.h](locale.h.md) | 定义了与地域化相关的函数和宏，如 setlocale、localeconv 等。
| [stdarg.h](stdarg.h.md) | 提供处理可变参数函数的宏，如 va_start、va_arg、va_end 等。
| [stdbool.h](stdbool.h.md) | 定义布尔类型和值 true 和 false。
| [stdint.h](stdint.h.md) | 定义了精确宽度的整数类型，如 int8_t、uint16_t 等。
| [inttypes.h](inttypes.h) | 提供与整数类型相关的格式化输出宏和函数。
| [complex.h](complex.h.md) | 提供复数运算的函数和宏，如 cabs、carg 等。
| [tgmath.h](tgmath.h.md) | 为泛型数学函数提供宏，以简化对不同类型数据的数学运算。
| [fenv.h](fenv.h.md) | 提供对浮点环境的控制，如舍入模式和异常状态
| [pthread.h](pthread.h.md) | 多线程
| [unistd.h](unistd.h.md) | 

## 进程通信

| 进程方式 | 适用场景 | 数据特点  | 同步要求
|-|-|-|-
[管道（Pipe）](unistd.h.md#pipe)|父子进程|字节流|阻塞读写
FIFO | 任意进程|字节流|可非阻塞
[共享内存](sys_shm.h.md) | 高性能数据共享 | 直接内存访问 | 需同步
信号  |  进程控制 | 无数据 | 异步
[信号量](sys_sem.h.md)  |  进程控制 | |
[消息队列](sys_msg.h.md) | 任意进程 | 结构化消息 | 异步


开启 Mac Coredump

```shell
# 开启 Mac Coredump
sudo sysctl kern.coredump=1

# 设置 core 文件大小
ulimit -c unlimited

# 调试 core 文件
lldb -c /cores/core.37676
```

## C 语言标准

查看当前支持的 C 语言标准

```shell
$ gcc -E -dM - </dev/null | grep "STDC_VERSION"
#define __STDC_VERSION__ 201710L
```

| 结果 | 默认支持标准
|-|-
`#define __STDC_VERSION__ 199901L` | C99 标准
`#define __STDC_VERSION__ 201112L` | C11 标准
`#define __STDC_VERSION__ 201710L` |  C17 标准
| `-` | C89 标准

指定 C 语言标准编译

```shell
 -std=c11        # Conform to the ISO 2011 C standard
 -std=c89        # Conform to the ISO 1990 C standard
 -std=c90        # Conform to the ISO 1990 C standard
 -std=c99        # Conform to the ISO 1999 C standard
 ​
 -std=gnu11      # Conform to the ISO 2011 C standard with GNU extensions（默认）
 -std=gnu89      # Conform to the ISO 1990 C standard with GNU extensions
 -std=gnu90      # Conform to the ISO 1990 C standard with GNU extensions
 -std=gnu99      # Conform to the ISO 1999 C standard with GNU extensions
```

示例

```shell
$ gcc main.c -o test -std=c99
```

参考

Linux GCC 如何查看及指定 C 语言标准
https://zhuanlan.zhihu.com/p/626785086