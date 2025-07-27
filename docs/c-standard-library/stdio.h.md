# stdio.h

stdio.h 头文件定义了3个变量类型、一些宏和各种函数来执行输入和输出。

引入头文件

```cpp
#include <stdio.h>
```

## 数据结构

```cpp
// stdio.h

// 无符号整数类型
typedef unsigned long size_t;

// 文件流类型，适合存储文件流信息的对象类型。
typedef struct __sFILE {} FILE;

// 文件位置类型，适合存储文件中任何位置的对象类型。
typedef long long fpos_t;

// 已经到达文件结束的负整数
#define  EOF  (-1)

// 空指针常量
#define  NULL  (0)

// 适用于 setvbuf 函数的第三个参数
#define _IOFBF 0 /* setvbuf should set fully buffered */
#define _IOLBF 1 /* setvbuf should set line buffered */
#define _IONBF 2 /* setvbuf should set unbuffered */

// setbuf 函数使用的缓冲区大小
#define BUFSIZ 1024 /* size of buffer used by setbuf */

// 系统可以同时打开的文件数量
#define FOPEN_MAX 20 /* must be <= OPEN_MAX <sys/syslimits.h> */

// 字符数组可以存储的文件名的最大长度
#define FILENAME_MAX 1024 /* must be <= PATH_MAX <sys/syslimits.h> */

#define P_tmpdir "/var/tmp/"

// 字符数组可以存储的由 tmpnam 函数创建的临时文件名的最大长度
#define L_tmpnam 1024 /* XXX must be == PATH_MAX */

// tmpnam 函数可生成的独特文件名的最大数量
#define TMP_MAX 308915776

// 在 fseek 函数中使用，用于在一个文件中定位不同的位置
#define SEEK_SET        0       /* set file offset to offset */
#define SEEK_CUR        1       /* set file offset to current plus offset */
#define SEEK_END        2       /* set file offset to EOF plus offset */

// 分别对应于标准错误、标准输入和标准输出流
#define stdin __stdinp
#define stdout __stdoutp
#define stderr __stderrp
```

## printf

发送格式化输出到标准输出 stdout。

```cpp
/**
 * 参数
 *   format -- 这是字符串，包含了要被写入到标准输出 stdout 的文本
 *   附加参数 -- 参数的个数应与 % 标签的个数相同。
 * 返回值
 *   如果成功，则返回写入的字符总数，
 *   否则返回一个负数。
 */
int printf(const char *format, ...)
```

format 标签属性是 

```cpp
%[flags][width][.precision][length]specifier
```

具体讲解如下：

(1) flags（标识）

| flags（标识） | 描述
|-|-
| `-`  | 在给定的字段宽度内左对齐，默认是右对齐（参见 width 子说明符）。
| `+` | 强制在结果之前显示加号或减号（+ 或 -），即正数前面会显示 + 号。<br/>默认情况下，只有负数前面会显示一个 - 号。
| `(space)` | 空格, 如果没有写入任何符号，则在该值前面插入一个空格。
| `#`  | 与 o、x 或 X 说明符一起使用时，非零值前面会分别显示 0、0x 或 0X。<br/>与 e、E 和 f 一起使用时，会强制输出包含一个小数点，即使后边没有数字时也会显示小数点。<br/>默认情况下，如果后边没有数字时候，不会显示显示小数点。<br/>与 g 或 G 一起使用时，结果与使用 e 或 E 时相同，但是尾部的零不会被移除。
| `0` | 在指定填充 padding 的数字左边放置零（0），而不是空格（参见 width 子说明符）。

（2）width（宽度）

|width（宽度）| 描述
|-|-
| `(number)` | 要输出的字符的最小数目。如果输出的值短于该数，结果会用空格填充。如果输出的值长于该数，结果不会被截断。
| `*` | 宽度在 format 字符串中未指定，但是会作为附加整数值参数放置于要被格式化的参数之前。

（3）precision（精度）

|.precision（精度）| 描述
|-|-
|`.number` | 对于整数说明符（d、i、o、u、x、X）：precision 指定了要写入的数字的最小位数。<br/>如果写入的值短于该数，结果会用前导零来填充。<br/>如果写入的值长于该数，结果不会被截断。精度为 0 意味着不写入任何字符。<br/>对于 e、E 和 f 说明符：要在小数点后输出的小数位数。<br/>对于 g 和 G 说明符：要输出的最大有效位数。<br/>对于 s: 要输出的最大字符数。默认情况下，所有字符都会被输出，直到遇到末尾的空字符。<br/>对于 c 类型：没有任何影响。<br/>当未指定任何精度时，默认为 1。<br/>如果指定时不带有一个显式值，则假定为 0。
|`.*`  | 精度在 format 字符串中未指定，但是会作为附加整数值参数放置于要被格式化的参数之前。

（4）length（长度）

|length（长度）| 描述
|-|-
| h | 参数被解释为短整型或无符号短整型（仅适用于整数说明符：i、d、o、u、x 和 X）。
| l | 参数被解释为长整型或无符号长整型，适用于整数说明符（i、d、o、u、x 和 X）及说明符 c（表示一个宽字符）和 s（表示宽字符字符串）。
| L | 参数被解释为长双精度型（仅适用于浮点数说明符：e、E、f、g 和 G）。

（5）specifier（说明符）

|specifier（说明符）| 输出
| - | -
|c | 字符
| d 或 i| 有符号十进制整数
| e | 使用 e 字符的科学科学记数法（尾数和指数）
| E | 使用 E 字符的科学科学记数法（尾数和指数）
| f | 十进制浮点数
| g | 自动选择 %e 或 %f 中合适的表示法
| G | 自动选择 %E 或 %f 中合适的表示法
| o | 有符号八进制
| s | 字符的字符串
| u | 无符号十进制整数
| x | 无符号十六进制整数
| X | 无符号十六进制整数（大写字母）
| p | 指针地址
| n | 无输出
| % | 字符%

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    char *text = "hello world";
    printf("%s\n", text);

    return 0;
}
```

输出

```shell
$ gcc main.c -o main -g && ./main 
hello world
```

## vprintf

使用参数列表发送格式化输出到标准输出 stdout。

```cpp
/**
 * 参数
 *   format -- 这是字符串，包含了要被写入到标准输出 stdout 的文本
 *   arg -- 一个表示可变参数列表的对象。这应被 <stdarg> 中定义的 va_start 宏初始化。
 * 返回值
 *   如果成功，则返回写入的字符总数，
 *   否则返回一个负数。
 */
int vprintf(const char *format, va_list arg)

```

示例

```cpp
#include <stdio.h>
#include <stdarg.h>

void print_values(char *format, ...)
{
    va_list args;
    va_start(args, format);
    vprintf(format, args);
    va_end(args);
}

int main(int argc, char **argv)
{
    print_values("%c=%d\n", 'a', 'a');

    return 0;
}

```

输出

```shell
$ gcc main.c -o main -g && ./main 
a=97
```

## sprintf

发送格式化输出到字符串。

```cpp
/**
 * 参数
 *   str -- 这是指向一个字符数组的指针，该数组存储了 C 字符串。
 *   format -- 这是字符串，包含了要被写入到字符串 str 的文本。
 *   附加参数 -- 根据不同的 format 字符串，函数可能需要一系列的附加参数，每个参数包含了一个要被插入的值，替换了 format 参数中指定的每个 % 标签。参数的个数应与 % 标签的个数相同。
 * 返回值
 *   如果成功，则返回写入的字符总数，不包括字符串追加在字符串末尾的空字符。
 *   如果失败，则返回一个负数。
 */
int sprintf(char *str, const char *format, ...)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    char text[20];
    sprintf(text, "%c=%d", 'a', 'a');
    printf("%s\n", text);

    return 0;
}

```

输出

```shell
$ gcc main.c -o main -g && ./main 
a=97
```

## vsprintf

使用参数列表发送格式化输出到字符串。

```cpp
/**
 * 参数
 *   str -- 这是指向一个字符数组的指针，该数组存储了 C 字符串。
 *   format -- 这是字符串，包含了要被写入到字符串 str 的文本。
 *   arg -- 一个表示可变参数列表的对象。这应被 <stdarg> 中定义的 va_start 宏初始化。
 * 返回值
 *   成功：返回写入的字符总数
 *   失败：返回一个负数
 */
int vsprintf(char *str, const char *format, va_list arg)
```

示例

```cpp
#include <stdio.h>
#include <stdarg.h>

int print_values(char text[], const char *format, ...)
{
    va_list args;
    va_start(args, format);
    int ret = vsprintf(text, format, args);
    va_end(args);
    return ret;
}

int main(int argc, char **argv)
{
    char text[20];
    int ret = print_values(text, "%c=%d", 'a', 'a');
    printf("ret=%d, text=%s\n", ret, text);

    return 0;
}

```

输出

```shell
$ gcc main.c -o main -g && ./main 
ret=4, text=a=97
```

## snprintf

格式字符串到 str 中。

与 sprintf() 函数不同的是，snprintf() 函数提供了一个参数 size，可以防止缓冲区溢出

```cpp
/**
 * 参数
 *   str -- 目标字符串，用于存储格式化后的字符串的字符数组的指针。
 *   size -- 字符数组的大小。超过 size 会被截断，最多写入 size-1 个字符，并在字符串的末尾添加一个空字符（\0）以表示字符串的结束
 *   format -- 格式化字符串。
 *   ... -- 可变参数，可变数量的参数根据 format 中的格式化指令进行格式化。
 * 返回值
 *   成功，返回将要写入的字符数（不包括结尾的空字符），即使这个值大于 size。
 *   错误，返回负值。
 */
int snprintf(char *str, size_t size, const char *format, ...)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    char text[5];
    int ret = snprintf(text, 5, "%s", "hello world");
    printf("ret: %d, text: %s\n", ret, text);

    return 0;
}

```

运行结果

```shell
% gcc main.c -o main -g && ./main 
ret: 11, text: hell
```

如果使用`sprintf`，会出现程序异常

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    char text[5];
    int ret = sprintf(text, "%s", "hello world");
    printf("ret: %d, text: %s\n", ret, text);

    return 0;
}
```

```shell
$ gcc main.c -o main -g && ./main 
illegal hardware instruction  ./main
```

## fprintf

发送格式化输出到流 stream 中。

```cpp
/**
 * 参数
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象标识了流。
 *   format -- 这是 C 字符串，包含了要被写入到流 stream 中的文本。
 * 返回值
 *   如果成功，则返回写入的字符总数，
 *   否则返回一个负数。
 */
int fprintf(FILE *stream, const char *format, ...)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file = fopen("demo.txt", "w");

    fprintf(file, "%s\n", "hello world");

    fclose(file);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main -g && ./main

$ cat demo.txt 
hello world
```

## vfprintf

使用参数列表发送格式化输出到流 stream 中。

```cpp
/**
 * 参数
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象标识了流。
 *   format -- 这是 C 字符串，包含了要被写入到流 stream 中的文本
 *   arg -- 一个表示可变参数列表的对象。这应被 <stdarg> 中定义的 va_start 宏初始化。
 * 返回值
 *   成功：返回写入的字符总数，
 *   失败：返回一个负数。
 */
int vfprintf(FILE *stream, const char *format, va_list arg)
```

示例

```cpp
#include <stdio.h>
#include <stdarg.h>

void print_values(FILE *file, const char *format, ...)
{
    va_list args;

    va_start(args, format);
    vfprintf(file, format, args);
    va_end(args);
}

int main(int argc, char **argv)
{
    FILE *file;

    file = fopen("demo.txt", "w");
    print_values(file, "%s\n", "hello world");
    fclose(file);

    return 0;
}

```

运行结果

```shell
$ gcc main.c -o main -g && ./main 

$ cat demo.txt 
hello world
```

## fwrite

把 ptr 所指向的数组中的数据写入到给定流 stream 中。

```cpp
/**
 * 参数
 *   ptr -- 这是指向要被写入的元素数组的指针。
 *   size -- 这是要被写入的每个元素的大小，以字节为单位。
 *   nmemb -- 这是元素的个数，每个元素的大小为 size 字节。
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象指定了一个输出流。
 * 返回值
 *   如果成功，该函数返回一个 size_t 对象，表示元素的总数，该对象是一个整型数据类型。
 *   如果该数字与 nmemb 参数不同，则会显示一个错误。
 */
size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream)
```

```cpp
#include <stdio.h>  // printf
#include <errno.h>  // errno
#include <string.h> // strerror

int main(int argc, char **argv)
{
    FILE *fd;
    char text[] = "hello world";

    fd = fopen("demo.txt", "w");

    fwrite(text, sizeof(text), 1, fd);

    fclose(fd);

    return 0;
}
```

## putc

把参数 char 指定的字符（一个无符号字符）写入到指定的流 stream 中，并把位置标识符往前移动。

```cpp
/**
 * 参数
 *   char -- 这是要被写入的字符。该字符以其对应的 int 值进行传递。
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象标识了要被写入字符的流。
 * 返回值
 *   该函数以无符号 char 强制转换为 int 的形式返回写入的字符，
 *   如果发生错误则返回 EOF。
 */
int putc(int char, FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *fd = fopen("demo.txt", "w");

    putc('H', fd);

    fclose(fd);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main

$ cat demo.txt
H
```

## fputc

把参数 char 指定的字符（一个无符号字符）写入到指定的流 stream 中，并把位置标识符往前移动。

```cpp
/**
 * 参数
 *   char -- 这是要被写入的字符
 *   stream -- 这是指向 FILE 对象的指针
 * 返回值
 *   成功：则返回被写入的字符。
 *   错误：则返回 EOF，并设置错误标识符。
 */
int fputc(int char, FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file;

    file = fopen("demo.txt", "w");

    fputc('A', file);

    fclose(file);

    return 0;
}

```

运行结果

```shell
$ gcc main.c -o main && ./main

$ cat demo.txt
A
```

## putchar

把参数 char 指定的字符（一个无符号字符）写入到标准输出 stdout 中。

```cpp
/**
 * 参数
 *   char -- 这是要被写入的字符。该字符以其对应的 int 值进行传递。
 * 返回值
 *   该函数以无符号 char 强制转换为 int 的形式返回写入的字符
 *   如果发生错误则返回 EOF。
 */
int putchar(int char)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    putchar('A');

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
A                                 
```

## ungetc

把字符 char（一个无符号字符）推入到指定的流 stream 中，以便它是下一个被读取到的字符。

```cpp
/**
 * 参数
 *   char -- 这是要被推入的字符。该字符以其对应的 int 值进行传递。
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象标识了输入流。
 * 返回值
 *   如果成功，则返回被推入的字符
 *   否则返回 EOF，且流 stream 保持不变。
 */
int ungetc(int char, FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    ungetc('H', stdin);
    int ret = fgetc(stdin);

    printf("ret: %c\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: H
```

## puts

把一个字符串写入到标准输出 stdout，直到空字符，但不包括空字符。换行符会被追加到输出中。

```cpp
/**
 * 参数
 *   str -- 这是要被写入的 C 字符串。
 * 返回值
 *   如果成功，该函数返回一个非负值为字符串长度（包括末尾的 \0）
 *   如果发生错误则返回 EOF。
 */
int puts(const char *str)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    puts("hello world");

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
hello world
```

## fputs

把字符串写入到指定的流 stream 中，但不包括空字符。

```cpp
/**
 * 参数
 *   str -- 这是一个数组，包含了要写入的以空字符终止的字符序列。
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象标识了要被写入字符串的流。
 * 返回值
 *   成功：该函数返回一个非负值
 *   失败：发生错误则返回 EOF。
 */
int fputs(const char *str, FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file;

    file = fopen("demo.txt", "w");

    fputs("hello world", file);

    fclose(file);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main

$ cat demo.txt
hello world
```

## fflush

刷新流 stream 的输出缓冲区。

```cpp
/**
 * 参数
 *    stream -- 指向 FILE 类型的指针
 *      如果 stream 为 NULL，则会刷新所有输出流的缓冲区。
 *      如果 stream 是文件指针，则刷新该文件流的输出缓冲区。
 * 返回值
 *    成功刷新缓冲区，返回 0。
 *    错误，返回 EOF，并且设置错误标识符（ferror）。
 */
int fflush(FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *fp = fopen("demo.txt", "w");

    fprintf(fp, "%s\n", "hello world");

    if (fflush(fp) == 0)
    {
        printf("flush success\n");
    }
    else
    {
        printf("flush error\n");
    }

    fclose(fp);

    return 0;
}

```

执行结果

```shell
$ gcc main.c -o main && ./main
flush success
```

## scanf

从标准输入 stdin 读取格式化输入。

```cpp
/**
 * 参数
 *   format -- 这是 C 字符串
 *   附加参数 -- 参数的个数应与 % 标签的个数相同。
 * 返回值
 *   成功，返回成功匹配和赋值的个数。
 *   到达文件末尾或发生读错误，返回 EOF。
 */
int scanf(const char *format, ...)
```

format 说明符形式为:

```cpp
[%[*][width][modifiers]type]
```

具体讲解如下：

|参数 | 符号 | 描述
|-|-|-
| 星号`*`说明符 | `*` | 读取数据但不存储
| 宽度说明符 | width | 指定读取的最大字符数
| 长度修饰符 | modifiers | 为对应的附加参数所指向的数据指定一个不同于整型（针对 d、i 和 n）、无符号整型（针对 o、u 和 x）或浮点型（针对 e、f 和 g）的大小
| 格式说明符 | type | 指定要读取的数据类型和格式

modifiers 长度修饰符

| 符号 | 描述
|-|-
| h  | 短整型（针对 d、i 和 n），或无符号短整型（针对 o、u 和 x） 
|l  | 长整型（针对 d、i 和 n），或无符号长整型（针对 o、u 和 x），或双精度型（针对 e、f 和 g）
| L | 长双精度型（针对 e、f 和 g）

type 类型说明符：

|类型 | 合格的输入 | 参数的类型
|-|-|- 
|%a、%A  | 读入一个浮点值(仅 C99 有效)。| float *
|%c |单个字符：读取下一个字符。如果指定了一个不为 1 的宽度 width，函数会读取 width 个字符，并通过参数传递，把它们存储在数组中连续位置。在末尾不会追加空字符。  |  char *
|%d |十进制整数：数字前面的 + 或 - 号是可选的。 |    int *
%e、%E、%f、%F、%g、%G   | 浮点数：包含了一个小数点、一个可选的前置符号 + 或 -、一个可选的后置字符 e 或 E，以及一个十进制数字。两个有效的实例 -732.103 和 7.12e4   |  float *
|%i |读入十进制，八进制，十六进制整数 。  |   int *
|%o |八进制整数。 |    int *
|%s |字符串。这将读取连续字符，直到遇到一个空格字符（空格字符可以是空白、换行和制表符）。   |  char *
|%u    |无符号的十进制整数。  |   unsigned int *
|%x、%X    |十六进制整数。  |   int *
|%p    |读入一个指针 。  | 
|`%[]`    |扫描字符集合 。| 
|`%%`    |读 % 符号。  | 

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    int a;
    
    printf("please input 1 number:\n");
    scanf("%d", &a);

    printf("input number: %d\n", a);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main

please input 1 number:
16
input number: 16
```

## sscanf

从字符串读取格式化输入。

```cpp

/**
 * 参数
 *   str -- 这是 C 字符串，是函数检索数据的源。
 *   format -- 这是 C 字符串
 *   附加参数 -- 参数与 % 标签的顺序相同
 * 返回值
 *   如果成功，该函数返回成功匹配和赋值的个数。
 *   如果到达文件末尾或发生读错误，则返回 EOF。
 */
int sscanf(const char *str, const char *format, ...)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main(int argc, char **argv)
{
    char text[20];
    int year, month, day;

    strcpy(text, "2025-10-01");

    sscanf(text, "%d-%d-%d", &year, &month, &day);

    printf("Year: %d, Month: %d, Day: %d\n", year, month, day);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
Year: 2025, Month: 10, Day: 1
```

## fscanf

从流 stream 读取格式化输入。

```cpp
/**
 * 参数
 *  stream -- 这是指向 FILE 对象的指针
 *  format -- 这是 C 字符串，包含了以下各项中的一个或多个
 *  附加参数 -- 参数的个数应与 % 标签的个数相同
 * 返回值
 *  成功：返回成功匹配和赋值的个数
 *  到达文件末尾或发生读错误，返回 EOF
 */
int fscanf(FILE *stream, const char *format, ...)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *fp;
    char text[20];

    fp = fopen("demo.txt", "r");

    fscanf(fp, "%s", text);
    printf("read text: %s\n", text);

    fclose(fp);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
read text: hello
```

## getc

从指定的流 stream 获取下一个字符（一个无符号字符），并把位置标识符往前移动。

```cpp
/**
 * 参数
 *   stream -- 这是指向 FILE 对象的指针
 * 返回值
 *   该函数以无符号 char 强制转换为 int 的形式返回读取的字符
 *   如果到达文件末尾或发生读错误，则返回 EOF。
 */
int getc(FILE *stream)
```
示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    int value;

    printf("please input a char\n");
    value = getc(stdin);
    printf("input: %c\n", value);

    return 0;
}

```

运行结果

```shell
$ gcc main.c -o main && ./main
please input a char
A
input: A
```

## getchar

从标准输入 stdin 获取一个字符（一个无符号字符）。同于 `getc(stdin)`

```cpp

/**
 * 参数
 *   NA
 * 返回值
 *   该函数以无符号 char 强制转换为 int 的形式返回读取的字符
 *   如果到达文件末尾或发生读错误，则返回 EOF。
 */
int getchar(void);
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    int value;

    printf("please input a char\n");
    value = getchar();
    printf("input: %c\n", value);

    return 0;
}

```

运行结果

```shell
$ gcc main.c -o main && ./main
please input a char
A
input: A
```

## fgetc

从指定的流 stream 获取下一个字符（一个无符号字符），并把位置标识符往前移动。

```cpp
/**
 * 参数
 *   stream -- 指向 FILE 对象的指针
 * 返回值
 *   该函数以无符号 char 强制转换为 int 的形式返回读取的字符
 *   如果到达文件末尾或发生读错误，则返回 EOF
 */
int fgetc(FILE *stream)
```

示例

```cpp
// main.c
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file = fopen("demo.txt", "r");
    if (file == NULL)
    {
        perror("file open error");
        return 1;
    }

    int c;
    while (1)
    {
        c = fgetc(file);
        if (feof(file))
        {
            break;
        }
        printf("%c", c);
    }

    fclose(file);

    return 0;
}
```

文件内容

```shell
$ cat demo.txt

hello
```

运行结果

```shell
$ gcc main.c -o main && ./main
hello
```

## gets(deprecated)

从标准输入 stdin 读取一行，并把它存储在 str 所指向的字符串中。当读取到换行符时，或者到达文件末尾时，它会停止，具体视情况而定。

```cpp
/**
 * 参数
 *   str -- 这是指向一个字符数组的指针，该数组存储了 C 字符串。
 * 返回值
 *   如果成功，该函数返回 str。
 *   如果发生错误或者到达文件末尾时还未读取任何字符，则返回 NULL。
 */
char *gets(char *str)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    char text[20];

    printf("please input a string:\n");
    
    gets(text);

    printf("input: %s\n", text);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
warning: this program uses gets(), which is unsafe.

please input a string:
hello world
input: hello world
```

## fgets

从指定的流 stream 读取一行，并把它存储在 str 所指向的字符串内。

当读取 (n-1) 个字符时，或者读取到换行符时，或者到达文件末尾时，它会停止，具体视情况而定。

```cpp
/**
 * 参数
 *   str -- 这是指向一个字符数组的指针，该数组存储了要读取的字符串。
 *   n -- 这是要读取的最大字符数（包括最后的空字符）。通常是使用以 str 传递的数组长度。
 *   stream -- 指向 FILE 对象的指针
 * 返回值
 *   如果成功，该函数返回相同的 str 参数。
 *   如果到达文件末尾或者没有读取到任何字符，str 的内容保持不变，并返回一个空指针。
 *   如果发生错误，返回一个空指针。
 */
char *fgets(char *str, int n, FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file;
    char buf[10];
    int max_len;

    // open file
    file = fopen("demo.txt", "r");
    if (file == NULL)
    {
        perror("file open error");
        return 1;
    }

    // read file by line
    while (1)
    {
        if (fgets(buf, 10, file) == NULL)
        {
            break;
        }
        printf("%s\n", buf);
    }

    // close file
    fclose(file);

    return 0;
}

```

文件内容

```shell
$ cat demo.txt

hello world
hi boy!
```

运行结果

```shell
$ gcc main.c -o main && ./main

hello wor
ld

hi boy!
```

## fread

从给定流 stream 读取数据到 ptr 所指向的数组中。

```cpp
/**
 * 参数
 *   ptr -- 指向带有最小尺寸 size * nmemb 字节的内存块的指针。
 *   size -- 要读取的每个元素的大小，以字节为单位。
 *   nmemb -- 元素的个数，每个元素的大小为 size 字节。
 *   stream -- 指向 FILE 对象的指针
 * 返回值
 *   成功读取的元素总数会以 size_t 对象返回，size_t 对象是一个整型数据类型。
 *   如果总数与 nmemb 参数不同，则可能发生了一个错误或者到达了文件末尾。
 */
size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file;
    char buf[20];
    size_t ret;

    // open file
    file = fopen("demo.txt", "r");

    ret = fread(buf, 1, 20, file);
    printf("ret: %lu\n", ret);

    buf[ret] = '\0'; // 添加字符串结束符
    printf("buf: %s\n", buf);

    // close file
    fclose(file);

    return 0;
}
```

文件内容

```shell
$ cat demo.txt

hello world
```

运行结果

```shell
$ gcc main.c -o main && ./main  
ret: 11
buf: hello world
```

## fopen

使用给定的模式 mode 打开 filename 所指向的文件。

```cpp
/**
 * 参数:
 *   filename -- 字符串，表示要打开的文件名称。
 *   mode -- 字符串，表示文件的访问模式，
 * 返回值
 *   该函数返回一个 FILE 指针。否则返回 NULL，且设置全局变量 errno 来标识错误。
 */
FILE *fopen(const char *filename, const char *mode)
```

mode 可以是以下表格中的值：

|模式  | 作用 | 描述
|-|- |-
|r  | 只读 | read, 打开一个用于读取的文件。该文件`必须存在`
|w  | 只写 | write, 若文件存在则文件长度清为0，即该文件内容会消失。\n若文件不存在则建立该文件
|a  | 追加写 | append, 追加到一个文件。写操作向文件末尾追加数据。\n如果文件不存在，则创建文件。

可选组合：

- `t`表示打开文件的类型是文本文件text（默认）
- `+`号表示对文件既可以读也可以写
- `b`表示以二进制模式打开文件binary

写入示例

```cpp
#include <stdio.h>

int main(int argc, char **argv) {
    FILE *file = fopen("demo.txt", "w");

    fprintf(file, "%s\n", "hello world");

    fclose(file);

    return 0;
}
```

读取写入的文件

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file = fopen("demo.txt", "r");
    int ch;

    while (1)
    {
        ch = fgetc(file);
        if (feof(file))
        {
            break;
        }
        printf("%c", ch);
    }

    fclose(file);

    return 0;
}
```

## freopen

把一个新的文件名 filename 与给定的打开的流 stream 关联，同时关闭流中的旧文件。

```cpp
/**
 * 参数
 *   filename -- 这是 C 字符串，包含了要打开的文件名称。
 *   mode -- 这是 C 字符串，包含了文件访问模式
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象标识了要被重新打开的流。
 * 返回值
 *   如果文件成功打开，则函数返回一个指针，指向用于标识流的对象。
 *   否则，返回空指针。
 */
FILE *freopen(const char *filename, const char *mode, FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file;

    file = freopen("demo.txt", "w", stdout);

    // 该文本重定向到 demo.txt
    printf("Hello, World!\n");
    
    fclose(file);

    return 0;
}

```

运行结果

```shell
$ gcc main.c -o main && ./main

$ cat demo.txt 
Hello, World!
```

## fclose

关闭流 stream。刷新所有的缓冲区。

```cpp
/**
 * 参数:
 *   stream -- 指向 FILE 对象的指针
 * 
 * 返回值
 *   成功 返回 0
 *   失败 返回 EOF
 */
int fclose(FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv) {
    FILE *file = fopen("demo.txt", "w");

    fprintf(file, "%s\n", "hello world");

    fclose(file);

    return 0;
}
```


## fgetpos

获取流 stream 的当前文件位置，并把它写入到 pos。

```cpp
/**
 * 参数
 *   stream -- 这是指向 FILE 对象的指针
 *   pos -- 这是指向 fpos_t 对象的指针
 * 返回值
 *   成功，返回零
 *   错误，返回非零值
 */
int fgetpos(FILE *stream, fpos_t *pos)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file;
    fpos_t position;
    file = fopen("demo.txt", "w");

    // first
    fgetpos(file, &position);
    printf("Current position in file: %ld\n", (long)position);

    fprintf(file, "hello world\n");

    // second
    fgetpos(file, &position);
    printf("Current position in file: %ld\n", (long)position);

    fclose(file);

    return 0;
}

```

运行结果

```shell
$ gcc main.c -o main && ./main
Current position in file: 0
Current position in file: 12
```

## fsetpos

设置给定流 stream 的文件位置为给定的位置。参数 pos 是由函数 fgetpos 给定的位置。

```cpp
/**
 * 参数
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象标识了流。
 *   pos -- 这是指向 fpos_t 对象的指针，该对象包含了之前通过 fgetpos 获得的位置。
 * 返回值
 *   如果成功，该函数返回零值，
 *   否则返回非零值，并设置全局变量 errno 为一个正值，该值可通过 perror 来解释。
 */
int fsetpos(FILE *stream, const fpos_t *pos)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *fp;
    fpos_t postion;

    fp = fopen("demo.txt", "w");

    fgetpos(fp, &postion);
    fputs("hello world", fp);

    fsetpos(fp, &postion);
    fputs("good study", fp);

    fclose(fp);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main

$ cat demo.txt
good studyd
```

## rewind

设置文件位置为给定流 stream 的文件的开头。

```cpp
/**
 * 参数
 *   stream -- 这是指向 FILE 对象的指针
 * 返回值
 *   该函数不返回任何值。
 */
void rewind(FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *fd = fopen("demo.txt", "r");
    int ch;

    // 第一次读取
    while (1)
    {
        ch = fgetc(fd);
        if (feof(fd))
        {
            break;
        }

        printf("%c", ch);
    }

    printf("\n");

    // 将读取位置重置到文件开头
    // 等价于 fseek(fd, 0, SEEK_SET);
    rewind(fd);

    // 第二次读取
    while (1)
    {
        ch = fgetc(fd);
        if (feof(fd))
        {
            break;
        }

        printf("%c", ch);
    }

    printf("\n");

    fclose(fd);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
hello world
hello world
```

## fseek

设置流 stream 的文件位置为给定的偏移 offset，参数 offset 意味着从给定的 whence 位置查找的字节数。

```cpp
/**
 * 参数
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象标识了流。
 *   offset -- 这是相对 whence 的偏移量，以字节为单位。
 *   whence -- 这是表示开始添加偏移 offset 的位置
 * 返回值
 *   成功：返回零
 *   失败：返回非零值
 */
int fseek(FILE *stream, long int offset, int whence)
```

`whence` 一般指定为下列常量之一：

|常量 | 描述
|-|-
|SEEK_SET | 文件的开头
|SEEK_CUR | 文件指针的当前位置
|SEEK_END | 文件的末尾

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{

    FILE *fd = fopen("demo.txt", "r");
    int ch;

    // 第一次读取
    while (1)
    {
        ch = fgetc(fd);
        if (feof(fd))
        {
            break;
        }

        printf("%c", ch);
    }

    printf("\n");

    // 将读取位置重置到文件开头
    // 等价于 rewind(fd);
    fseek(fd, 0, SEEK_SET);

    // 第二次读取
    while (1)
    {
        ch = fgetc(fd);
        if (feof(fd))
        {
            break;
        }

        printf("%c", ch);
    }

    printf("\n");

    fclose(fd);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
hello world
hello world
```

## ftell

返回给定流 stream 的当前文件位置。

```cpp
/**
 * 参数
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象标识了流。
 * 返回值
 *   该函数返回位置标识符的当前值。
 *   如果发生错误，则返回 -1L，全局变量 errno 被设置为一个正值。
 */
long int ftell(FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *fd = fopen("demo.txt", "r");

    fseek(fd, 0, SEEK_END);

    int pos = ftell(fd);
    printf("pos: %d\n", pos);

    fclose(fd);

    return 0;
}
```

运行结果

```shell
$ cat demo.txt
Hello World!

$ gcc main.c -o main && ./main
pos: 13
```

## feof

测试给定流 stream 的文件结束标识符。

```cpp
/**
 * 参数
 *   stream -- 指向 FILE 对象的指针
 * 返回值
 *   当设置了与流关联的文件结束标识符时，该函数返回一个非零值，否则返回零。
 */
int feof(FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file = fopen("demo.txt", "r");
    int ch;

    while (1)
    {
        ch = fgetc(file);

        if (feof(file))
        {
            printf("EOF: %d\n", feof(file));
            // EOF: 1
            break;
        }
    }

    fclose(file);

    return 0;
}

```

## ferror

测试给定流 stream 的错误标识符。

```cpp
/**
 * 参数
 *   stream -- 指向 FILE 对象的指针
 * 返回值
 *   如果设置了与流关联的错误标识符，该函数返回一个非零值，否则返回一个零值。
 */
int ferror(FILE *stream)
```

示例

假设我们有一个文本文件 demo.txt，它是一个空文件。

因为试图读取一个以只写模式打开的文件，这将产生以下结果。

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file = fopen("demo.txt", "w");
    int ch;

    ch = fgetc(file);

    if (ferror(file))
    {
        printf("ferror: %d\n", ferror(file));
        // ferror: 1
    }

    fclose(file);

    return 0;
}

```

## clearerr

清除给定流 stream 的文件结束和错误标识符。

```cpp
/**
 * 参数
 *   stream -- 指向 FILE 对象的指针
 * 返回值
 *   这不会失败，且不会设置外部变量 errno，
 *   但是如果它检测到它的参数不是一个有效的流，则返回 -1，并设置 errno 为 EBADF。
 */
void clearerr(FILE *stream)
```

示例

假设我们有一个文本文件 demo.txt，它是一个空文件。

因为试图读取一个以只写模式打开的文件，这将产生以下结果。

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file = fopen("demo.txt", "w");
    int ch;

    ch = fgetc(file);

    if (ferror(file))
    {
        printf("ferror1: %d\n", ferror(file));
        // ferror1: 1
    }
    
    clearerr(file);

    if (ferror(file))
    {
        printf("ferror2: %d\n", ferror(file));
        // 该语句无输出
    }

    fclose(file);

    return 0;
}
```

## perror

把一个描述性错误消息输出到标准错误 stderr。

首先输出字符串 str，后跟一个冒号，然后是一个空格。

```cpp
/**
 * 参数
 *   str -- 这是 C 字符串，包含了一个自定义消息，将显示在原本的错误消息之前。
 * 返回值
 *   该函数不返回任何值
 */
void perror(const char *str)
```

示例：只读方式打开一个不存在的文件

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file;

    // open file
    file = fopen("foo.txt", "r");
    if (file == NULL)
    {
        perror("file open error");
        return 1;
    }

    // close file
    fclose(file);

    return 0;
}

```

运行结果

```shell
$ gcc main.c -o main && ./main 
file open error: No such file or directory
```

## remove

删除给定的文件名 filename，以便它不再被访问。

```cpp
/**
 * 参数
 *   filename -- 这是 C 字符串，包含了要被删除的文件名称。
 * 返回值
 *   如果成功，则返回零。
 *   如果错误，则返回 -1，并设置 errno。
 */
int remove(const char *filename)
```

示例

```cpp
#include <stdio.h>
#include <errno.h>
#include <string.h>

int main(int argc, char **argv)
{
    int ret;
    const char *filename = "demo.txt";

    ret = remove(filename);
    if (ret == 0)
    {
        printf("success, ret: %d\n", ret);
    }
    else
    {
        printf("error, ret: %d, %s\n", ret, strerror(errno));
    }

    return 0;
}
```

运行

```shell
# 创建文件
$ touch demo

# 移除文件
$ gcc main.c -o main && ./main  
success, ret: 0

# 再次移除，文件不存在
$ gcc main.c -o main && ./main  
error, ret: -1, No such file or directory
```

## rename

修改文件名

```cpp
/**
 * 参数
 *   old_filename -- 文件名称
 *   new_filename -- 文件的新名称
 * 返回值
 *   如果成功，则返回零。
 *   如果错误，则返回 -1，并设置 errno。
 */
int rename(const char *old_filename, const char *new_filename)
```

示例

```cpp
#include <stdio.h>
#include <errno.h>
#include <string.h>

int main(int argc, char **argv)
{
    int ret;
    const char *oldname = "old.txt";
    const char *newname = "new.txt";

    ret = rename(oldname, newname);
    if (ret == 0)
    {
        printf("success, ret: %d\n", ret);
    }
    else
    {
        printf("error, ret: %d, %s\n", ret, strerror(errno));
    }

    return 0;
}

```

运行

```shell
$ touch old.txt

# 修改成功
$ gcc main.c -o main && ./main  
success, ret: 0

# 修改失败
$ gcc main.c -o main && ./main  
error, ret: -1, No such file or directory
```

## tmpfile

以二进制更新模式(wb+)创建临时文件。

```cpp
/**
 * 参数
 *   NA
 * 返回值
 *   如果成功，该函数返回一个指向被创建的临时文件的流指针。
 *   如果文件未被创建，则返回 NULL。
 */
FILE *tmpfile(void)
```

示例

```cpp
#include <stdio.h>
#include <errno.h>
#include <string.h>

int main(int argc, char **argv)
{
    FILE *file;
    file = tmpfile();

    if (file == NULL)
    {
        printf("create temp file error, ret: %s\n", strerror(errno));
        return 1;
    }

    printf("create temp file success\n");

    fclose(file);

    return 0;
}

```

运行

```shell
$ gcc main.c -o main && ./main  
create temp file success
```

## tmpnam(deprecated)

生成并返回一个有效的临时文件名，该文件名之前是不存在的。

如果 str 为空，则只会返回临时文件名。

> 注意：`tmpnam`已经被标记为过时了，推荐使用 `mkstemp`

```cpp
/**
 * 参数
 *   str -- 这是一个指向字符数组的指针，其中，临时文件名将被存储为 C 字符串。
 * 返回值
 *   一个指向 C 字符串的指针，该字符串存储了临时文件名。如果 str 是一个空指针，则该指针指向一个内部缓冲区，缓冲区在下一次调用函数时被覆盖。
 *   如果 str 不是一个空指针，则返回 str。如果函数未能成功创建可用的文件名，则返回一个空指针。
 */
char *tmpnam(char *str)
```

示例

```cpp
#include <stdio.h>
#include <errno.h>
#include <string.h>

int main(int argc, char **argv)
{
    char buffer[L_tmpnam];

    if (tmpnam(buffer) == NULL)
    {
        printf("create temp file error, ret: %s\n", strerror(errno));
        return 1;
    }

    printf("create temp filename: %s\n", buffer);

    return 0;
}

```

运行结果

```shell
$ gcc main.c -o main && ./main 
create temp filename: /var/tmp/tmp.0.d2gq1d
```

## setbuf

定义流 stream 应如何缓冲。

```cpp
/**
 * 参数
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象标识了一个打开的流。
 *   buffer -- 这是分配给用户的缓冲，它的长度至少为 BUFSIZ 字节，BUFSIZ 是一个宏常量，表示数组的长度。
 * 返回值
 *   该函数不返回任何值。
 */
void setbuf(FILE *stream, char *buffer)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    char buffer[BUFSIZ];

    setbuf(stdout, buffer);
    puts("hello world");
    fflush(stdout);

    return 0;
}
```

运行结果

```shell
$ $gcc main.c -o main && ./main
hello world
```

## setvbuf

另一个定义流 stream 应如何缓冲的函数。

```cpp
/**
 * 参数
 *   stream -- 这是指向 FILE 对象的指针，该 FILE 对象标识了一个打开的流。
 *   buffer -- 这是分配给用户的缓冲。如果设置为 NULL，该函数会自动分配一个指定大小的缓冲。
 *   mode -- 这指定了文件缓冲的模式
 *   size --这是缓冲的大小，以字节为单位。
 * 返回值
 *   如果成功，则该函数返回 0
 *   否则返回非零值。
 */
int setvbuf(FILE *stream, char *buffer, int mode, size_t size)
```

文件缓冲的模式mode

| 模式 | 描述
|-|-
|_IOFBF	| 全缓冲：<br/>对于输出，数据在缓冲填满时被一次性写入。<br/>对于输入，缓冲会在请求输入且缓冲为空时被填充。
|_IOLBF	| 行缓冲：<br/>对于输出，数据在遇到换行符或者在缓冲填满时被写入，具体视情况而定。<br/>对于输入，缓冲会在请求输入且缓冲为空时被填充，直到遇到下一个换行符。
|_IONBF	| 无缓冲：<br/>不使用缓冲。每个 I/O 操作都被即时写入。buffer 和 size 参数被忽略。

示例

```cpp
#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main(int argc, char **argv)
{
    char buffer[BUFSIZ];
    memset(buffer, '\0', sizeof(buffer));

    setvbuf(stdout, buffer, _IOFBF, sizeof(buffer));

    fputs("hello", stdout);

    fflush(stdout);

    sleep(3);

    fputs("world", stdout);

    return 0;
}
```

运行结果

```shell
# 2次输出之间会停顿一下
$ gcc main.c -o main && ./main
helloworld
```
