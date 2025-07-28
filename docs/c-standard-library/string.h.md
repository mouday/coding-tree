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
6	char *strcat(char *dest, const char *src)
把 src 所指向的字符串追加到 dest 所指向的字符串的结尾。
7	char *strncat(char *dest, const char *src, size_t n)
把 src 所指向的字符串追加到 dest 所指向的字符串的结尾，直到 n 字符长度为止。
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