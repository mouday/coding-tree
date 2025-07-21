# stdlib.h

引入头文件

```cpp
#include <stdlib.h>
```

## mkstemp

建立唯一的临时文件

```cpp
/**
 * 参数
 *   template 
 *     1、必须是一个字符数组，末尾6个字符必须是"XXXXXX"
 *     2、比如可以"test-XXXXXX"（不含目录）
 *     3、或者"/tmp/test.XXXXXX"（含目录）
 *     4、而且不能是字符串常量。因为函数会改变template最后6个字符，返回最终文件名
 * 返回值
 *   成功返回文件描述符
 *   失败返回-1，并且设置errno
 */
int mkstemp(char *template);
```

示例

```cpp
#include <stdio.h>  // printf
#include <errno.h>  // errno
#include <string.h> // strerror
#include <unistd.h> // close、unlink

int main(int argc, char **argv)
{
    char tempfile[20] = "temp-XXXXXX";
    int fd = mkstemp(tempfile);

    if (fd < 0)
    {
        printf("create temp file error, ret: %s\n", strerror(errno));
        return 1;
    }

    printf("create temp filename: %s\n", tempfile);

    unlink(tempfile); // 删除文件
    close(fd);

    return 0;
}

```

运行结果

```shell
gcc main.c -o main && ./main 
create temp filename: temp-GhUF2h
```

1	double atof(const char *str)
把参数 str 所指向的字符串转换为一个浮点数（类型为 double 型）。

3	long int atol(const char *str)
把参数 str 所指向的字符串转换为一个长整数（类型为 long int 型）。
4	double strtod(const char *str, char **endptr)
把参数 str 所指向的字符串转换为一个浮点数（类型为 double 型）。
5	long int strtol(const char *str, char **endptr, int base)
把参数 str 所指向的字符串转换为一个长整数（类型为 long int 型）。
6	unsigned long int strtoul(const char *str, char **endptr, int base)
把参数 str 所指向的字符串转换为一个无符号长整数（类型为 unsigned long int 型）。
7	void *calloc(size_t nitems, size_t size)
分配所需的内存空间，并返回一个指向它的指针。
8	void free(void *ptr)
释放之前调用 calloc、malloc 或 realloc 所分配的内存空间。
9	void *malloc(size_t size)
分配所需的内存空间，并返回一个指向它的指针。
10	void *realloc(void *ptr, size_t size)
尝试重新调整之前调用 malloc 或 calloc 所分配的 ptr 所指向的内存块的大小。
11	void abort(void)
使一个异常程序终止。
12	int atexit(void (*func)(void))
当程序正常终止时，调用指定的函数 func。
13	void exit(int status)
使程序正常终止。
14	char *getenv(const char *name)
搜索 name 所指向的环境字符串，并返回相关的值给字符串。
15	int system(const char *string)
由 string 指定的命令传给要被命令处理器执行的主机环境。




20	long int labs(long int x)
返回 x 的绝对值。
21	ldiv_t ldiv(long int numer, long int denom)
分子除以分母。
22	int rand(void)
返回一个范围在 0 到 RAND_MAX 之间的伪随机数。
23	void srand(unsigned int seed)
该函数播种由函数 rand 使用的随机数发生器。
24	int mblen(const char *str, size_t n)
返回参数 str 所指向的多字节字符的长度。
25	size_t mbstowcs(schar_t *pwcs, const char *str, size_t n)
把参数 str 所指向的多字节字符的字符串转换为参数 pwcs 所指向的数组。
26	int mbtowc(wchar_t *pwc, const char *str, size_t n)
检查参数 str 所指向的多字节字符。
27	size_t wcstombs(char *str, const wchar_t *pwcs, size_t n)
把数组 pwcs 中存储的编码转换为多字节字符，并把它们存储在字符串 str 中。
28	int wctomb(char *str, wchar_t wchar)
检查对应于参数 wchar 所给出的多字节字符的编码。



```cpp

```

示例

```cpp


```

运行结果

```shell

```

## atoi

把参数 str 所指向的字符串转换为一个整数（类型为 int 型）。

```cpp
/**
 * 参数
 *   str -- 要转换为整数的字符串。
 * 返回值
 *   该函数返回转换后的长整数
 *   如果没有执行有效的转换，则返回零。
 */
int atoi(const char *str)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    int ret = atoi("12345");
    printf("ret: %d\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: 12345
```

## div

除法取商和余数

```cpp
/**
 * 参数
 *   numer -- 除数
 *   denom -- 被除数
 * 返回值
 *   该函数返回 商和余数
 *   如 div_t: {int quot; int rem};
 */
div_t div(int numer, int denom)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    div_t result;

    result = div(27, 4);
    printf("quotient: %d\n", result.quot);
    printf("remainder: %d\n", result.rem);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
quotient: 6
remainder: 3
```

## abs


取绝对值。

```cpp
/**
 * 参数
 *   x -- 要计算绝对值的整数。
 * 返回值
 *   如果 x 是正数，则返回 x
 *   如果 x 是负数，则返回它的相反数，即 -x。
 *   如果 x 是 0，则返回 0。
 */
int abs(int x)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    int result;

    int ret = abs(-27);
    printf("abs(-27) == %d\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
abs(-27) == 27
```

## qsort

数组排序

```cpp
/**
 * 参数
 *   base: 指向待排序数组的第一个元素的指针。
 *   nitems: 数组中的元素数量。
 *   size: 数组中每个元素的大小（以字节为单位）。
 *   compar: 比较函数的指针，该函数用于比较两个元素。比较函数应当返回一个整数，表示比较结果：
 *       小于零：表示第一个元素小于第二个元素。
 *       等于零：表示两个元素相等。
 *       大于零：表示第一个元素大于第二个元素。
 * 返回值
 *   该函数不返回任何值。
 */
void qsort(void *base, size_t nitems, size_t size, 
    int (*compar)(const void *, const void *));
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int compare_int(const void *a, const void *b)
{
    return *(int *)a - *(int *)b;
}

int main(int argc, char **argv)
{
    int arr[] = {1, 4, 3, 5, 2};

    printf("before sorted: ");
    for (int i = 0; i < 5; i++)
    {
        printf("%d ", arr[i]);
    }

    qsort(arr, 5, sizeof(int), compare_int);

    printf("\nafter sorted : ");
    for (int i = 0; i < 5; i++)
    {
        printf("%d ", arr[i]);
    }

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
before sorted: 1 4 3 5 2 
after sorted : 1 2 3 4 5
```

## bsearch

二分查找

```cpp
/**
 * 参数
 *   key：指向要查找的目标元素的指针。
 *   base：指向数组起始位置的指针。
 *   nmemb：数组中的元素数量。
 *   size：每个元素的大小（以字节为单位）。
 *   compar：指向比较函数的指针，该函数用于比较两个元素。
 *       一个负值，如果 a 小于 b。
 *       零，     如果 a 等于 b。
 *       一个正值，如果 a 大于 b。
 * 返回值
 *   如果找到了匹配的元素，返回指向该元素的指针。
 *   如果没有找到匹配的元素，返回 NULL。
 */
void *bsearch(const void *key, const void *base, 
    size_t nitems, size_t size, 
    int (*compar)(const void *, const void *))
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int compare_int(const void *a, const void *b)
{
    return (*(int *)a - *(int *)b);
}

int main(int argc, char **argv)
{
    int arr[] = {1, 2, 3, 4, 5};
    int value = 2;
    int *ret;

    // 计算数组长度
    int arr_len = sizeof(arr) / sizeof(arr[0]);

    ret = (int *)bsearch(&value, arr, arr_len, sizeof(int), compare_int);

    if (ret == NULL)
    {
        printf("not found");
    }
    else
    {
        // 计算索引
        int index = (ret - arr);
        printf("found value: %d, index: %d\n", *ret, index);
    }

    return 0;
}
```

运行结果

```shell
$ $gcc main.c -o main && ./main
found value: 2, index: 1
```
