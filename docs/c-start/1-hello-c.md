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

## 3、第一个C程序

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

## 4、IDE集成开发环境

1. Code::Block
2. Microsoft Visual C++ 2010
3. Microsoft Visual Studio
4. Clion

单文件运行插件: `c/c++ single file execution`

文件编码 `utf-8`

## 5、代码解释

注释comment

```c
// 单行注释

/**
* 多行注释
*/
```

头文件、标准库

```c
// stdio standard input & output
// 编译系统在系统头文件目录搜索
// 一般用于系统头文件
#include <stdio.h>


// 编译系统先在当前源文件目录中查找
// 如果找不到，再去系统头文件目录搜索
// 一般用于用户头文件
#include "stdio.h"
```

## 6、printf

标准格式

```c
printf(格式控制字符串，输出列表);
```

```c
// \n 表示换行
printf("hello world\n");
```

eg:
```c
printf("num is 5\n");

printf("num is %d\n", 5);

int num = 10;
printf("num is %d\n", num);
```

常见的占位符

| 占位符 | 说明
| - | -
`%d` | 十进制int整数
`%ld` | 十进制long整数
`%u` | 十进制无符号整数
`%f` | 浮点数float
`%lf` | 浮点数double
`%c` | 字符
`%s` | 字符串
`%p` | 指针
`%o` | 八进制整数
`%x` | 十六进制整数
`%#o` | 显示前缀`0`的八进制整数
`%#x` | 显示前缀`0x`的十六进制整数
`%#X` | 显示前缀`0X`的十六进制整数


eg：

```c
printf("%d, %c\n", 10, 'A');
// 10, A
```


输出格式

```c
// 1、限定宽度
printf("|%5d|\n", 123);
// |  123|


// 2、左对齐
printf("|%-5d|\n", 123);
// |123  |


// 3、显示正负号
printf("%+d\n", 10);
// +10

printf("%d\n", -10);
// -10


// 4、限定小数位数
printf("%f\n", 3.14159);
// 默认6位小数：3.141590

printf("%.2f\n", 3.14159);
// 修改为2位小数：3.14

printf("|%6.2f|\n", 3.14159);
// 占6位保留2位小数：|  3.14|
```
