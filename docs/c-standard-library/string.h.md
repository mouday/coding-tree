# string.h

`<string.h>` 是 C 标准库中的一个头文件，提供了一组用于处理字符串和内存块的函数。这些函数涵盖了字符串复制、连接、比较、搜索和内存操作等。


```cpp

```

示例

```cpp

```

运行结果

```shell

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


```cpp

```

示例

```cpp

```

运行结果

```shell

```


1	void *memchr(const void *str, int c, size_t n)
在参数 str 所指向的字符串的前 n 个字节中搜索第一次出现字符 c（一个无符号字符）的位置。
2	int memcmp(const void *str1, const void *str2, size_t n)
把 str1 和 str2 的前 n 个字节进行比较。
3	void *memcpy(void *dest, const void *src, size_t n)
从 src 复制 n 个字符到 dest。
4	void *memmove(void *dest, const void *src, size_t n)
另一个用于从 src 复制 n 个字符到 dest 的函数。
5	void *memset(void *str, int c, size_t n)
将指定的值 c 复制到 str 所指向的内存区域的前 n 个字节中。


8	char *strchr(const char *str, int c)
在参数 str 所指向的字符串中搜索第一次出现字符 c（一个无符号字符）的位置。
9	int strcmp(const char *str1, const char *str2)
把 str1 所指向的字符串和 str2 所指向的字符串进行比较。
10	int strncmp(const char *str1, const char *str2, size_t n)
把 str1 和 str2 进行比较，最多比较前 n 个字节。
11	int strcoll(const char *str1, const char *str2)
把 str1 和 str2 进行比较，结果取决于 LC_COLLATE 的位置设置。
12	char *strcpy(char *dest, const char *src)
把 src 所指向的字符串复制到 dest。
13	char *strncpy(char *dest, const char *src, size_t n)
把 src 所指向的字符串复制到 dest，最多复制 n 个字符。
14	size_t strcspn(const char *str1, const char *str2)
检索字符串 str1 开头连续有几个字符都不含字符串 str2 中的字符。
15	char *strerror(int errnum)
从内部数组中搜索错误号 errnum，并返回一个指向错误消息字符串的指针。
16	size_t strlen(const char *str)
计算字符串 str 的长度，直到空结束字符，但不包括空结束字符。
17	char *strpbrk(const char *str1, const char *str2)
检索字符串 str1 中第一个匹配字符串 str2 中字符的字符，不包含空结束字符。也就是说，依次检验字符串 str1 中的字符，当被检验字符在字符串 str2 中也包含时，则停止检验，并返回该字符位置。
18	char *strrchr(const char *str, int c)
在参数 str 所指向的字符串中搜索最后一次出现字符 c（一个无符号字符）的位置。
19	size_t strspn(const char *str1, const char *str2)
检索字符串 str1 中第一个不在字符串 str2 中出现的字符下标。
20	char *strstr(const char *haystack, const char *needle)
在字符串 haystack 中查找第一次出现字符串 needle（不包含空结束字符）的位置。
21	char *strtok(char *str, const char *delim)
分解字符串 str 为一组字符串，delim 为分隔符。
22	size_t strxfrm(char *dest, const char *src, size_t n)
根据程序当前的区域选项中的 LC_COLLATE 来转换字符串 src 的前 n 个字符，并把它们放置在字符串 dest 中。

