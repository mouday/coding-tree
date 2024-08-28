# C语言零基础入门教程

课程：尚硅谷C语言零基础入门教程-宋红康

课程地址：https://www.bilibili.com/video/BV1Bh4y1q7Nt/

# 第一章 C语言入门

## 1、初识计算机语言

1、什么是计算机语言

```
语言 = 语法 + 逻辑
```

2、计算机语言简史

- 第一代 机器语言
- 第二代 汇编语言
- 第三代 高级语言

## 2、初识C语言

1、C语言的由来

C语言之父-丹尼斯·里奇

2、为什么要学习C语言

应用最广


3、计算机语言排行

TIOBE https://www.tiobe.com/tiobe-index/

4、C语言的版本

1. K&R C 
2. ANSI或者c89 c90
3. C99
4. C11
5. C17
6. C23

## 第一个C程序

1、hello.c

```c
#include <stdio.h>

int main(){
	printf("hello world\n");
	return 0;
}
```

编译工具

- Linux/Mac gcc
- Windows: MinGW

环境检查

```bash
gcc -v
Apple clang version 15.0.0 (clang-1500.3.9.4)
Target: x86_64-apple-darwin23.5.0
Thread model: posix
InstalledDir: /Library/Developer/CommandLineTools/usr/bin
```

编译代码

```bash
# 默认生成 a.ext/a.out
$ gcc hello.c

# 执行
$ ./a.out 
hello world
```

参数：`-o` output 指定输出文件名

```bash
$ gcc -o hello hello.c

$ ./hello 
hello world
```

参数：`-std=` standard 指定C语言版本

```bash
gcc -std=c99 hello.c

$ ./a.out 
hello world
```

## IDE集成开发环境

1. Code::Block
2. Microsoft Visual C++ 2010
3. Microsoft Visual Studio
4. Clion

单文件运行插件: `c/c++ single file execution`

文件编码 `utf-8`






https://www.bilibili.com/video/BV1Bh4y1q7Nt/?p=7&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da