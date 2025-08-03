# string.h

`<string.h>` 是 C 标准库中的一个头文件，提供了一组用于处理字符串和内存块的函数。这些函数涵盖了字符串复制、连接、比较、搜索和内存操作等。

引入头文件

```cpp
#include <string.h>
```

## 数据结构

```cpp
// string.h

// 这是无符号整数类型
typedef unsigned long size_t

// 空指针常量
#define NULL ((void *)0)
```

## strcmp

字符串比较

```cpp
/**
 * 参数
 *   str1 -- 要进行比较的第一个字符串。
 *   str2 -- 要进行比较的第二个字符串。
 * 返回值
 *   该函数返回值如下：
 *     - 如果返回值小于 0，则表示 str1 小于 str2。
 *     - 如果返回值大于 0，则表示 str1 大于 str2。
 *     - 如果返回值等于 0，则表示 str1 等于 str2。
 */
int strcmp(const char *str1, const char *str2)
```

示例

```cpp
#include <string.h>
#include <stdio.h>

int main(int argc, char **argv)
{
    int ret = strcmp("abc", "ABC");

    printf("ret: %d\n", ret);

    return 0;
}

```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: 1
```

## strncmp

字符串比较，最多比较前 n 个字节。

```cpp
/**
 * 参数
 *   str1 -- 要进行比较的第一个字符串。
 *   str2 -- 要进行比较的第二个字符串。
 *   n -- 要比较的最大字符数。
 * 返回值
 *   如果返回值 < 0，则表示 str1 小于 str2。
 *   如果返回值 > 0，则表示 str1 大于 str2。
 *   如果返回值 = 0，则表示 str1 等于 str2。
 */
int strncmp(const char *str1, const char *str2, size_t n)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *a = "abcd";
    char *b = "abcD";

    int ret = strncmp(a, b, 3);

    printf("ret: %d\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: 0
```

## strcoll

本地化字符串比较，结果取决于 LC_COLLATE 的位置设置。

```cpp
/**
 * 参数
 *   str1 -- 要进行比较的第一个字符串。
 *   str2 -- 要进行比较的第二个字符串。
 * 返回值
 *   如果返回值 < 0，则表示 str1 小于 str2。
 *   如果返回值 > 0，则表示 str2 小于 str1。
 *   如果返回值 = 0，则表示 str1 等于 str2。
 */
int strcoll(const char *str1, const char *str2)
```

示例

```cpp
#include <stdio.h>
#include <string.h>
#include <locale.h>

int main()
{
    setlocale(LC_COLLATE, "en_US.UTF-8");

    char *str1 = "hello";
    char *str2 = "world";

    int ret = strcoll(str1, str2);

    printf("ret: %d\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: -30
```

检查可用区域

```cpp
system("locale -a");
```

## strcat

字符串拼接，将一个字符串（源字符串）追加到另一个字符串（目标字符串）的末尾。

```cpp
/**
 * 参数
 *   dest -- 指向目标数组，该数组包含了一个 C 字符串，且足够容纳追加后的字符串。
 *   src -- 指向要追加的字符串，该字符串不会覆盖目标字符串。
 * 返回值
 *   该函数返回一个指向最终的目标字符串 dest 的指针。
 */
char *strcat(char *dest, const char *src)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main()
{
    char *src = " world";
    char dest[50] = "hello"; // 必须有足够空间

    // 追加字符串
    strcat(dest, src);

    printf("dest: %s\n", dest);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
dest: hello world
```

## strncat

安全字符串拼接，它通过限制追加字符的数量来防止缓冲区溢出，是 strcat 的安全替代方案。

```cpp
/**
 * 参数
 *   dest -- 指向目标数组，足够容纳追加后的字符串，包括额外的空字符。
 *   src -- 要追加的字符串。
 *   n -- 要追加的最大字符数。
 * 返回值
 *   返回一个指向最终的目标字符串 dest 的指针。
 */
char *strncat(char *dest, const char *src, size_t n)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *src = " world!";
    char dest[20] = "hello"; // 必须有足够空间

    // 安全追加：最多追加14个字符（保留1个位置给终止符）
    strncat(dest, src, sizeof(dest) - strlen(dest) - 1);

    printf("dest: %s\n", dest);

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
dest: hello world
```

## strcpy

把 src 所指向的字符串复制到 dest。

```cpp
/**
 * 参数
 *   dest -- 指向用于存储复制内容的目标数组。
 *   src -- 要复制的字符串。
 * 返回值
 *   该函数返回一个指向最终的目标字符串 dest 的指针。
 */
char *strcpy(char *dest, const char *src)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *str = "hello world";
    char buffer[20];

    // clear the buffer
    memset(buffer, '\0', sizeof(buffer));

    strcpy(buffer, str);

    printf("buffer: %s\n", buffer);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
buffer: hello world
```

## strncpy

把 src 所指向的字符串复制到 dest，最多复制 n 个字符。

```cpp
/**
 * 参数
 *   dest -- 指向用于存储复制内容的目标数组。
 *   src -- 要复制的字符串。
 *   n -- 要从源中复制的字符数。
 * 返回值
 *   该函数返回最终复制的字符串。
 */
char *strncpy(char *dest, const char *src, size_t n)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *str = "hello world";
    char buffer[20];

    strncpy(buffer, str, sizeof(buffer) - 1); // 保留终止符位置
    buffer[sizeof(buffer) - 1] = '\0'; // 手动添加终止符

    printf("buffer: %s\n", buffer);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
buffer: hello world
```

## strchr

在参数 str 所指向的字符串中搜索第一次出现字符 c（一个无符号字符）的位置。

```cpp
/**
 * 参数
 *   str -- 要查找的字符串。
 *   c -- 要查找的字符。
 * 返回值
 *   如果在字符串 str 中找到字符 c，则返回指向该字符的指针
 *   如果未找到该字符则返回NULL。
 */
char *strchr(const char *str, int c)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *str = "hello world";

    char *ptr = strchr(str, 'o');

    printf("index: %ld\n", (ptr - str));

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
index: 4
```

## strrchr

在参数 str 所指向的字符串中搜索最后一次出现字符 c（一个无符号字符）的位置。

```cpp
/**
 * 参数
 *   str -- C 字符串。
 *   c -- 要搜索的字符，通常以整数形式传递（ASCII 值），但是最终会转换回 char 形式。
 * 返回值
 *   从字符串的末尾开始向前搜索，直到找到指定的字符或搜索完整个字符串。
 *   如果找到字符，它将返回一个指向该字符的指针，否则返回 NULL。
 */
char *strrchr(const char *str, int c)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *str = "hello world";

    char *ptr = strrchr(str, 'o');

    printf("right index: %ld\n", (ptr - str));

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
right index: 7
```

## strspn

包含字符集扫描

计算 str1 开头连续只包含 str2 中字符的字符数量

```cpp
/**
 * 参数
 *   str1 -- 要被检索的 C 字符串。
 *   str2 -- 该字符串包含了要在 str1 中进行匹配的字符列表。
 * 返回值
 *   返回 str1 中第一个不在字符串 str2 中出现的字符数量。
 */
size_t strspn(const char *str1, const char *str2)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *str1 = "hello;world";
    char *str2 = ";";

    size_t ret = strspn(str1, str2);

    printf("ret: %ld\n", ret);

    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
ret: 0
```

## strcspn

排除字符集扫描

计算 str1 开头连续不包含 str2 中任何字符的字符数量

```cpp
/**
 * 参数
 *   str1 -- 要被检索的 C 字符串。
 *   str2 -- 该字符串包含了要在 str1 中进行匹配的字符列表。
 * 返回值
 *   该函数返回 str1 开头连续都不含字符串 str2 中字符的字符数。
 */
size_t strcspn(const char *str1, const char *str2)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *str1 = "hello;world";
    char *str2 = ";";

    int ret = strcspn(str1, str2);

    printf("ret: %d\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: 5
```

## strpbrk

检索字符串 str1 中第一个匹配字符串 str2 中字符的字符，不包含空结束字符。

也就是说，依次检验字符串 str1 中的字符，当被检验字符在字符串 str2 中也包含时，则停止检验，并返回该字符位置。

```cpp
/**
 * 参数
 *   str1 -- 要被检索的 C 字符串。
 *   str2 -- 该字符串包含了要在 str1 中进行匹配的字符列表。
 * 返回值
 *   该函数返回 str1 中第一个匹配字符串 str2 中该字符位置，
 *   如果未找到字符则返回NULL。
 */
char *strpbrk(const char *str1, const char *str2)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *str1 = "hello;world";
    char *str2 = ";";

    char *ret = strpbrk(str1, str2);

    printf("ret: %ld\n", (ret - str1));

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: 5
```

## strstr

在字符串 haystack 中查找第一次出现字符串 needle（不包含空结束字符）的位置。

```cpp
/**
 * 参数
 *   haystack -- 要搜索的主字符串。
 *   needle -- 要查找的子字符串。
 * 返回值
 *   返回指向 haystack 中第一次出现 needle 的位置的指针。
 *   如果 needle 未在 haystack中找到，则返回 NULL。
 */
char *strstr(const char *haystack, const char *needle)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *str1 = "hello world";
    char *str2 = "world";

    char *ret = strstr(str1, str2);

    printf("ret: %ld\n", (ret - str1));

    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
ret: 6
```

## strtok

分解字符串 str 为一组字符串，delim 为分隔符。

```cpp
/**
 * 参数
 *   text: 要分割的字符串。
 *     在第一次调用时，传入要分割的字符串；
 *     后续调用时，传入 NULL，表示继续分割同一个字符串。
 *   delimiters: 分隔符字符串。strtok() 会根据这个字符串中的任意一个字符来分割 str。
 * 返回值
 *   返回指向下一个标记的指针。如果没有更多的标记，则返回 NULL。
 */
char *strtok(char *text, const char *delimiters)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char text[] = "this is a good day"; // 必须可修改
    char *delimiters = " ";             // 分隔符集合

    // 首次调用
    char *token = strtok(text, delimiters);

    while (token != NULL)
    {
        printf("token: %s\n", token);
        // 后续调用传入NULL
        token = strtok(NULL, delimiters);
    }

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
token: this
token: is
token: a
token: good
token: day
```

注意：

- 非线程安全
- 修改原始串：用 '\0' 替换分隔符
- 不可重入
- 线程安全替代方案 `strtok_r` (POSIX)


## strerror

从内部数组中搜索错误号 errnum，并返回一个指向错误消息字符串的指针。

```cpp
/**
 * 参数
 *   errnum -- 错误号，通常是 errno。
 * 返回值
 *   该函数返回一个指向错误字符串的指针，该错误字符串描述了错误 errnum。
 */
char *strerror(int errnum)
```

示例

```cpp
#include <stdio.h>
#include <string.h>
#include <errno.h>

int main()
{
    char *error_msg = strerror(ENOENT); // ENOENT = 2

    printf("error_msg: %s\n", error_msg);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
error_msg: No such file or directory
```

## strlen

计算字符串 str 的长度，直到空结束字符，但不包括空结束字符。

```cpp
/**
 * 参数
 *   str -- 要计算长度的字符串。
 * 返回值
 *   该函数返回字符串的长度。
 */
size_t strlen(const char *str)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *str = "hello";

    size_t ret = strlen(str);

    printf("ret: %ld\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: 5
```

## strxfrm

根据程序当前的区域选项中的 LC_COLLATE 来转换字符串 src 的前 n 个字符，并把它们放置在字符串 dest 中。

```cpp
/**
 * 参数
 *   dest -- 指向存储内容的目标数组的指针，如果参数 n 为 0，则它是一个空指针。
 *   src -- 要被转换为当前区域设置的 C 字符串。
 *   n -- 被复制到 str1 的最大字符数。
 * 返回值
 *   该函数返回被转换字符串的长度，不包括空结束字符。
 */
size_t strxfrm(char *dest, const char *src, size_t n)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <locale.h>

int main()
{
    // 设置区域
    setlocale(LC_COLLATE, "en_US.UTF-8");

    const char *src = "hello world";

    // 获取转换后的大小
    size_t len = strxfrm(NULL, src, 0);

    // 分配缓冲区 + '\0'
    char *buf = malloc(len + 1);

    // 执行转换
    strxfrm(buf, src, len + 1);
    
    printf("buf: %s\n", buf);

    free(buf);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
buf: 003?0038003G003G003K0013003]003K003T003G00370000003?0038003G003G003K0013003]003K003T003G0037
```

## strdup

创建字符串的副本（duplicate）

> 注意：非 C 标准库函数

```c
/**
 * 参数
 *   src：要复制的源字符串。
 * 返回值
 *   成功：返回指向新字符串的指针。
 *   失败：返回NULL（当内存分配失败时）。
 */
char *strdup(const char *src);
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main()
{
    char *src = "good luck!";
    char *copy;

    // 复制
    copy = strdup(src);
    if (copy == NULL)
    {
        perror("strdup failed");
        return EXIT_FAILURE;
    }

    printf("src = %s\n", src);
    printf("copy = %s\n", copy);

    // 必须释放内存
    free(copy);
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
src = good luck!
copy = good luck!
```

平台支持情况

| 平台/编译器    | 支持情况  | 头文件   | 注意事项
| - | - | -| -
| Linux (GCC)   | ✅ 支持  | `<string.h>`    | 需要定义 `_POSIX_C_SOURCE`
| Windows (MSVC)| ✅ 支持  | `<string.h>`    | 函数名为 `_strdup`
| macOS (Clang) | ✅ 支持  |   `<string.h>`  | 
| BSD 系统       | ✅ 支持  | `<string.h>`    | 
| 嵌入式系统      | ❌ 通常不支持 |  需要自定义实现
| ISO C 标准     | ❌ 不支持 |   | 

等效实现

```cpp
char *strdup(const char *s) {
    if (s == NULL) return NULL;
    
    size_t len = strlen(s) + 1;    // +1 用于终止空字符
    char *copy = malloc(len);      // 分配内存
    
    if (copy != NULL) {
        strcpy(copy, s);           // 复制内容
    }
    
    return copy;
}
```

## memcpy

将src指向的内存区域的n个字节复制到dest指向的内存区域。

如果区域重叠，行为是未定义的（可能引发数据损坏或崩溃）。

```cpp
/**
 * 参数
 *   str1 -- 指向用于存储复制内容的目标数组，类型强制转换为 void* 指针。
 *   str2 -- 指向要复制的数据源，类型强制转换为 void* 指针。
 *   n -- 要被复制的字节数。
 * 返回值
 *   该函数返回一个指向目标存储区 str1 的指针。
 */
void *memcpy(void *dest, const void *src, size_t n)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char buf[20];
    memcpy(buf, "Hello, World!", 13);
    printf("buf: %s\n", buf);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
buf: Hello, World!
```

## memmove

安全地将src的n个字节复制到dest，即使内存区域重叠。

```cpp
/**
 * 参数
 *   str1 -- 指向用于存储复制内容的目标数组，类型强制转换为 void* 指针。
 *   str2 -- 指向要复制的数据源，类型强制转换为 void* 指针。
 *   n -- 要被复制的字节数。
 * 返回值
 *   该函数返回一个指向目标存储区 str1 的指针。
 */
void *memmove(void *dest, const void *src, size_t n)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char dest[] = "hello world";
    memmove(dest, "xxx", 3);

    printf("dest: %s\n", dest);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
dest: xxxlo world
```

## memset

将指定的值 c 复制到 str 所指向的内存区域的前 n 个字节中。

```cpp
/**
 * 参数
 *   str -- 指向要填充的内存区域的指针。
 *   c -- 要设置的值，通常是一个无符号字符。
 *   n -- 要被设置为该值的字节数。
 * 返回值
 *   该值返回一个指向存储区 str 的指针。
 */
void *memset(void *str, int c, size_t n)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char buf[20];
    memset(buf, 'x', 5);
    buf[5] = '\0'; // 确保添加字符串终止符

    printf("buf: %s\n", buf);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
buf: xxxxx
```

## memchr

在参数 str 所指向的字符串的前 n 个字节中搜索第一次出现字符 c（一个无符号字符）的位置。

```cpp
/**
 * 参数
 *   str -- 指向要执行搜索的内存块。
 *   c -- 以 int 形式传递的值，但是函数在每次字节搜索时是使用该值的无符号字符形式。
 *   n -- 要被分析的字节数。
 * 返回值
 *   该函数返回一个指向匹配字节的指针，
 *   如果在给定的内存区域未出现字符，则返回 NULL。
 */
void *memchr(const void *str, int c, size_t n)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *buf = "hello;world";
    char *ret = (char *)memchr(buf, ';', strlen(buf));

    printf("ret: %ld\n", (ret - buf));

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: 5
```

## memcmp

把 str1 和 str2 的前 n 个字节进行比较。

```cpp
/**
 * 参数
 *   str1 -- 指向内存块的指针。
 *   str2 -- 指向内存块的指针。
 *   n -- 要被比较的字节数。
 * 返回值
 *   如果返回值 < 0，则表示 str1 小于 str2。
 *   如果返回值 > 0，则表示 str1 大于 str2。
 *   如果返回值 = 0，则表示 str1 等于 str2。
 */
int memcmp(const void *str1, const void *str2, size_t n)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main()
{
    char *a = "aaa";
    char *b = "AAA";

    int ret = memcmp(a, b, 3);

    printf("ret: %d\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: 32
```

## strsignal

返回信号描述字符串

```cpp
/**
 * 参数
 *   int signum：信号编号。
 * 返回值
 *   成功时返回指向描述信号的字符串的指针。
 *   失败时返回 NULL。
 */
char *strsignal(int sig);
```

示例

```cpp
#include <stdio.h>
#include <signal.h> // SIGINT
#include <string.h> // strsignal

int main()
{
    char *msg = strsignal(SIGINT);
    printf("msg: %s\n", msg);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
msg: Interrupt: 2
```
