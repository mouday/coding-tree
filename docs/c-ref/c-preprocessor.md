# C 预处理器

C 预处理器(CPP)主要功能包括：

- 宏展开
- 文件包含
- 条件编译
- 特殊指令处理

C 预处理器只不过是一个`文本替换`工具而已，它们会指示编译器在实际编译之前完成所需的预处理。

## `#include`

`#include` 包含头文件

示例

```cpp
#include <stdio.h>
#include "myheader.h"
```

## `#define`

`#define` 定义宏（符号常量或函数式宏）  

示例

```cpp
#define PI 3.14159

#define MAX(a,b) ((a) > (b) ? (a) : (b))
```

## `#undef`

`#undef`  取消已定义的宏

```cpp
#undef PI
```

## `#ifdef`

`#ifdef`  如果宏已定义则编译后续代码

```cpp
#ifdef DEBUG
printf("Debug info\n");
#endif
```

## `#ifndef`

`#ifndef` 如果宏未定义则编译后续代码（常用于头文件保护）

```cpp
#ifndef HEADER_H
#define HEADER_H
/* 内容 */
#endif
```

## `#if`

`#if` 条件编译（可配合defined操作符使用）

```cpp
#if VERSION > 2
/* 新版代码 */
#endif
```

## `#else`

`#else` `#if/#ifdef/#ifndef` 的替代分支

```cpp
#ifdef WIN32
/* Windows代码 */
#else
/* 其他系统 */
#endif
```

## `#elif`

`#elif`  类似于else if

```cpp
#if defined(UNIX)
/* Unix代码 */
#elif defined(WIN32)
/* Windows代码 */
#endif
```

## `#endif`

`#endif`  结束条件编译块 如上例所示

## `#error`

`#error`  产生编译错误并输出消息

```cpp
#if !defined(C99)
#error "需要C99标准"
#endif
```

## `#pragma`

`#pragma` 编译器特定指令（非标准，各编译器不同）

```cpp
#pragma once
#pragma pack(1)
```

## 最佳实践建议

1、宏命名：

使用全大写字母和下划线命名宏

示例：

```cpp
#define MAX_SIZE 100
```

2、函数式宏注意事项：

- 每个参数和整个表达式都要用括号括起来
- 避免使用有副作用的参数

如

```cpp
#define square(x) ((x) * (x))
```

3、头文件保护：

```cpp
#ifndef MY_HEADER_H
#define MY_HEADER_H
/* 头文件内容 */
#endif
```

4、条件编译调试：

```cpp
#ifdef DEBUG
#define DEBUG_PRINT(fmt, ...) printf(fmt, ##__VA_ARGS__)
#else
#define DEBUG_PRINT(fmt, ...)
#endif
```

5、跨平台开发：

```cpp
#if defined(_WIN32)
// Windows特定代码
#elif defined(__linux__)
// Linux特定代码
#elif defined(__APPLE__)
// macOS特定代码
#endif
```

## 预定义宏

|宏 |  描述
|- |-
`__DATE__`  | 当前日期，一个以 "MMM DD YYYY" 格式表示的字符常量。
`__TIME__`  | 当前时间，一个以 "HH:MM:SS" 格式表示的字符常量。
`__FILE__`  | 这会包含当前文件名，一个字符串常量。
`__LINE__`  | 这会包含当前行号，一个十进制常量。
`__STDC__`  | 当编译器以 ANSI 标准编译时，则定义为 1。

示例

```cpp
#include <stdio.h>

/*
 * 预定义宏演示程序
 * 展示ANSI C标准中常用的预定义宏及其用途
 */
int main()
{
    // 打印当前源文件名（字符串常量）
    printf("当前文件: %s\n", __FILE__);

    // 打印当前行号（十进制整数）
    printf("当前行号: %d\n", __LINE__);

    // 打印编译日期（"MMM DD YYYY"格式）
    printf("编译日期: %s\n", __DATE__);

    // 打印编译时间（"HH:MM:SS"格式）
    printf("编译时间: %s\n", __TIME__);

    // 检查是否符合ANSI/ISO标准（1表示符合）
    printf("ANSI标准: %d\n", __STDC__);

    // 实用示例：调试信息输出
    printf("\n[调试信息] %s (第%d行) 编译于 %s %s\n",
           __FILE__, __LINE__, __DATE__, __TIME__);

    return 0;
}
```

运行结果

```shell
% gcc main.c  -o main && ./main
当前文件: main.c
当前行号: 13
编译日期: Aug  6 2025
编译时间: 00:06:57
ANSI标准: 1

[调试信息] main.c (第26行) 编译于 Aug  6 2025 00:06:57
```

## 换行 `\`

一个宏通常写在一个单行上。但是如果宏太长，一个单行容纳不下，则使用宏延续运算符（\）。例如：

```cpp
#define message_for(a, b) \
    printf(#a " and " #b ": We love you!\n")
```

## 字符串化 `#`

将参数转换为字符串字面量

```cpp
#define MAKE_VAR(name) #name

MAKE_VAR(tom); // 展开为: "tom";
```

## 字符串连接 `##`

拼接标识符

```cpp
#define MAKE_VAR(name, age) name##age

MAKE_VAR(tom, 18); // 展开为: tom18;
```

## defined

预处理器 defined 运算符是用在常量表达式中

用来确定一个标识符是否已经使用 `#define` 定义过。

如果指定的标识符已定义，则值为真（非零）。如果指定的标识符未定义，则值为假（零）。

```cpp
#include <stdio.h>
 
#if !defined (MESSAGE)
   #define MESSAGE "You wish!"
#endif
 
int main(void)
{
   printf("Here is the message: %s\n", MESSAGE);  
   return 0;
}
```

展开结果

```cpp
// gcc -E main.c
int main(void)
{
   printf("Here is the message: %s\n", "You wish!");
   return 0;
}
```

运行结果

```shell
 % gcc main.c  -o main && ./main
Here is the message: You wish!
```

## 参数化的宏

使用参数化的宏来模拟函数

例如，下面的代码是计算一个数的平方：

```cpp
int square(int x) {
   return x * x;
}

// 使用宏
#define square(x) ((x) * (x))
```

示例

```cpp
#include <stdio.h>
 
#define square(x) ((x) * (x))
 
int main(void)
{
   printf("square(2) = %d\n", square(2));
   return 0;
}
```

展开结果

```cpp
// gcc -E main.c
int main(void)
{
   printf("square(2) = %d\n", ((2) * (2)));
   return 0;
}
```

运行结果

```shell
gcc main.c  -o main && ./main
square(2) = 4
```

## `##__VA_ARGS__`

可变参数宏（C99）

- `__VA_ARGS__`：不会处理结尾多余逗号（,）
- `##__VA_ARGS__`：会处理结尾多余逗号（,）

`__VA_ARGS__` 示例

```cpp
#include <stdio.h>

#define PRINT_LOG(format, ...) \
    do                             \
    {                              \
        printf(format, __VA_ARGS__);      \
    } while (0)

int main(void)
{
    PRINT_LOG("log\n");
    PRINT_LOG("log %s\n", "test");

    return 0;
}
```

展开结果

```cpp
// gcc -E main.c
int main(void)
{
    do { printf("log\n", ); } while (0);
    do { printf("log %s\n", "test"); } while (0);

    return 0;
}
```

编译报错

`##__VA_ARGS__` 示例

```cpp
#include <stdio.h>

#define PRINT_LOG(format, ...) \
    do                             \
    {                              \
        printf(format, ##__VA_ARGS__);      \
    } while (0)

int main(void)
{
    PRINT_LOG("log\n");
    PRINT_LOG("log %s\n", "test");

    return 0;
}
```

展开结果

```cpp
// gcc -E main.c
int main(void)
{
    do { printf("log\n"); } while (0);
    do { printf("log %s\n", "test"); } while (0);

    return 0;
}
```

运行结果

```shell
gcc main.c  -o main && ./main
log
log test
```

## `##args`

`##args` 是GNU C的扩展写法

args 示例

```cpp
#include <stdio.h>

#define PRINT_LOG(format, args...) \
    do                             \
    {                              \
        printf(format, args);      \
    } while (0)

int main(void)
{
    PRINT_LOG("log\n");
    PRINT_LOG("log %s\n", "test");

    return 0;
}
```

展开结果

```cpp
// gcc -E main.c
int main(void)
{
    do { printf("log\n", ); } while (0);
    do { printf("log %s\n", "test"); } while (0);

    return 0;
}
```

编译报错

`##args` 示例

```cpp
#include <stdio.h>

#define PRINT_LOG(format, args...) \
    do                             \
    {                              \
        printf(format, ##args);      \
    } while (0)

int main(void)
{
    PRINT_LOG("log\n");
    PRINT_LOG("log %s\n", "test");

    return 0;
}
```

展开结果

```cpp
// gcc -E main.c
int main(void)
{
    do { printf("log\n"); } while (0);
    do { printf("log %s\n", "test"); } while (0);

    return 0;
}
```

运行结果

```shell
% gcc main.c  -o main && ./main
log
log test
```

## `do-while(0)`

在 C 语言宏中使用 `do { ... } while(0)` 是一种经典的安全编程技巧，它可以解决多语句宏的多种问题。以下是全面解析：

示例 1：使用`{}`

```cpp
#include <stdio.h>

#define SWAP(x, y)    \
    {                 \
        int temp = x; \
        x = y;        \
        y = temp;     \
    }

int main(void)
{
    int a = 5, b = 10;

    if (a < 10)
        SWAP(a, b);
    
    printf("a = %d, b = %d\n", a, b);
    return 0;
}
```

展开后结果

```cpp
int main(void)
{
    int a = 5, b = 10;

    if (a < 10)
        { int temp = a; a = b; b = temp; }; // 这里多了一个分号，可能会报错

    printf("a = %d, b = %d\n", a, b);
    return 0;
}
```

示例2：使用`do-while(0)`

```cpp
#include <stdio.h>

#define SWAP(x, y)    \
    do                \
    {                 \
        int temp = x; \
        x = y;        \
        y = temp;     \
    } while (0)

int main(void)
{
    int a = 5, b = 10;

    if (a < 10)
        SWAP(a, b);

    printf("a = %d, b = %d\n", a, b);
    return 0;
}
```

展开后结果

```cpp
int main(void)
{
    int a = 5, b = 10;

    if (a < 10)
        do { int temp = a; a = b; b = temp; } while (0);

    printf("a = %d, b = %d\n", a, b);
    return 0;
}
```