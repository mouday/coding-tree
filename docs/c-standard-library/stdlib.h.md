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

## atoi

字符串转换为整数（类型为 int 型）。

ASCII to integer

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

## atof

字符串转换为浮点数（类型为 double 型）。

```cpp
/**
 * 参数
 *   str -- 要转换为浮点数的字符串。
 * 返回值
 *   函数返回转换后的双精度浮点数
 *   如果没有执行有效的转换，则返回零（0.0）。
 */
double atof(const char *str)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    double ret = atof("3.14");
    printf("value: %f\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
value: 3.140000
```

## atol

字符串转换为长整数（类型为 long int 型）。

```cpp
/**
 * 参数
 *   str -- 要转换为长整数的字符串。
 * 返回值
 *   该函数返回转换后的长整数
 *   如果没有执行有效的转换，则返回零。
 */
long int atol(const char *str)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    long ret = atol("666");
    printf("value: %ld\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
value: 666
```

## strtod

把参数 str 所指向的字符串转换为一个浮点数（类型为 double 型）。

```cpp
/**
 * 参数
 *   str -- 要转换为双精度浮点数的字符串。
 *   endptr -- 对类型为 char* 的对象的引用，其值由函数设置为 str 中数值后下一个字符。
 * 返回值
 *   该函数返回转换后的双精度浮点数，如果没有执行有效的转换，则返回零（0.0）。
 */
double strtod(const char *str, char **endptr)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    char *ptr;
    double ret = strtod("666 is test value", &ptr);
    printf("value: %f\n", ret);
    printf("other: %s\n", ptr);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
value: 666.000000
other:  is test value
```

## strtol

把参数 str 所指向的字符串转换为一个长整数（类型为 long int 型）。

```cpp
/**
 * 参数
 *   str -- 要转换为长整数的字符串。
 *   endptr -- 对类型为 char* 的对象的引用，其值由函数设置为 str 中数值后的下一个字符。
 *   base -- 基数，必须介于 2 和 36（包含）之间，或者是特殊值 0。
 *     如果 base 为 0，则会根据字符串的前缀来判断进制：
 *       - 如果字符串以 '0x' 或 '0X' 开头，则将其视为十六进制；
 *       - 如果字符串以 '0' 开头，则将其视为八进制；
 *       - 否则将其视为十进制。
 * 返回值
 *   函数返回被转换的长整型整数值。
 *     - 如果输入字符串不符合数字格式，strtol() 将返回 0
 *     - 如果转换结果超出了 long 整数的表示范围，那么将产生溢出，并设置 errno 为 ERANGE
 */
long int strtol(const char *str, char **endptr, int base)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    char *ptr;
    long int ret;

    ret = strtol("666 is test value", &ptr, 10);
    printf("value: %ld\n", ret);
    printf("other: %s\n", ptr);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
value: 666
other:  is test value
```

## strtoul

把参数 str 所指向的字符串转换为一个无符号长整数（类型为 unsigned long int 型）。

```cpp
/**
 * 参数
 *   str -- 要转换为无符号长整数的字符串。
 *   endptr -- 对类型为 char* 的对象的引用，其值由函数设置为 str 中数值后的下一个字符。
 *   base -- 基数，必须介于 2 和 36（包含）之间，或者是特殊值 0。
 * 返回值
 *   该函数返回转换后的长整数，如果没有执行有效的转换，则返回一个零值。
 */
unsigned long int strtoul(const char *str, char **endptr, int base)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    char *ptr;
    unsigned long ret;

    ret = strtoul("666 is test value", &ptr, 10);
    printf("value: %ld\n", ret);
    printf("other: %s\n", ptr);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
value: 666
other:  is test value
```

## calloc

分配所需的内存空间，并返回一个指向它的指针。

malloc 和 calloc 之间的不同点是:

- malloc 不会设置内存为零
- calloc 会设置分配的内存为零

```cpp
/**
 * 参数
 *   nitems -- 要被分配的元素个数。
 *   size -- 元素的大小。
 * 返回值
 *   该函数返回一个指针，指向已分配的内存
 *   如果请求失败，则返回 NULL。
 */
void *calloc(size_t nitems, size_t size)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    int *arr;
    int arr_len = 3;

    arr = (int *)calloc(arr_len, sizeof(int)); // 申请内存

    for (int i = 0; i < arr_len; i++)
    {
        arr[i] = i * i;
    }

    for (int i = 0; i < arr_len; i++)
    {
        printf("arr[%d]=%d\n", i, arr[i]);
    }

    free(arr); // 释放内存

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
arr[0]=0
arr[1]=1
arr[2]=4
```

## free

释放之前调用 calloc、malloc 或 realloc 所分配的内存空间。

```cpp
/**
 * 参数
 *   ptr -- 指针指向一个要释放内存的内存块。
 *     如果传递的参数是一个空指针，则不会执行任何动作。
 * 返回值
 *   该函数不返回任何值。
 */
void free(void *ptr)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    int *arr;
    int arr_len = 3;

    arr = (int *)malloc(arr_len * sizeof(int)); // 申请内存

    for (int i = 0; i < arr_len; i++)
    {
        arr[i] = i * i;
    }

    for (int i = 0; i < arr_len; i++)
    {
        printf("arr[%d]=%d\n", i, arr[i]);
    }

    free(arr); // 释放内存
    arr = NULL;

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
arr[0]=0
arr[1]=1
arr[2]=4
```

注意事项

1. 释放正确的内存：只能释放通过动态内存分配函数分配的内存，不能释放由其他方式分配的内存（例如局部变量或全局变量）。

2. 避免重复释放：同一个内存块不能多次释放，否则可能导致未定义行为。

3. 释放后指针处理：释放内存后，指针仍然指向已释放的内存位置。为了避免悬空指针，可以将指针设为 NULL。

4. 检查空指针：调用 free() 前最好检查指针是否为空，以确保程序稳定性。

5. 内存泄漏：如果动态分配的内存没有被释放或丢失了对其的引用，内存将无法再被程序使用，造成内存泄漏。

6. 悬空指针：指向已释放内存的指针称为悬空指针。如果悬空指针被再次访问，会导致未定义行为，可能引起程序崩溃或数据损坏。

7. 避免重复释放：同一个内存块不能多次释放，否则可能导致未定义行为。

```cpp
if (array != NULL) {
    free(array);
    array = NULL;
}
```

## malloc

分配所需的内存空间，并返回一个指向它的指针。

```cpp
/**
 * 参数
 *   size -- 内存块的大小，以字节为单位。
 * 返回值
 *   该函数返回一个指针 ，指向已分配大小的内存。如果请求失败，则返回 NULL。
 */
void *malloc(size_t size)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char **argv)
{
    char *str;

    str = (char *)malloc(10); // 申请内存

    strcpy(str, "Hello");
    printf("%s\n", str);

    free(str); // 释放内存
    str = NULL;

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
Hello
```

## realloc

尝试重新调整之前调用 malloc 或 calloc 所分配的 ptr 所指向的内存块的大小。

- realloc() 可能会将内存块移动到新的位置（如果在原位置没有足够的空间容纳新的大小）。如果移动成功，ptr 会指向新位置。需要特别注意，旧的 ptr 指针需要被更新为 realloc() 返回的新地址。
- 如果内存分配失败，realloc() 返回 NULL，而原始的内存块不会被释放。为避免内存泄漏，应该使用一个临时指针来接收 realloc() 的返回值，并检查是否为 NULL。

```cpp
/**
 * 参数
 *   ptr -- 指针指向一个要重新分配内存的内存块
 *     该内存块之前是通过调用 malloc、calloc 或 realloc 进行分配内存的。
 *     如果为空指针，则会分配一个新的内存块，且函数返回一个指向它的指针。
 *   size -- 内存块的新的大小，以字节为单位。
 *     如果大小为 0，且 ptr 指向一个已存在的内存块，则 ptr 所指向的内存块会被释放，并返回一个空指针。
 * 返回值
 *   如果成功，realloc() 返回指向新内存块的指针。
 *   如果失败，返回 NULL，并且原来的内存块仍然保持不变（并没有释放）。
 */
void *realloc(void *ptr, size_t size)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char **argv)
{
    char *str;
    char *new_str;

    // 申请内存
    str = (char *)malloc(10);

    if (str == NULL)
    {
        perror("Failed to allocate memory");
        return 1;
    }

    strcpy(str, "Hello");
    printf("%s\n", str);

    // 重新分配内存
    new_str = (char *)realloc(str, 20);
    if (new_str == NULL)
    {
        perror("Failed to reallocate memory");
        free(str); // 释放原来的内存
        return 1;
    }

    strcat(new_str, ", World!");
    printf("%s\n", new_str);

    free(new_str); // 释放新分配的内存
    str = NULL;

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
Hello
Hello, World!
```

注意事项

- 检查返回值：总是检查 realloc() 的返回值。如果返回 NULL，不要直接丢弃原有指针。
- 内存泄漏：如果 realloc() 返回 NULL，原来的内存块不会释放。此时应释放原有内存并处理错误情况。
- 指针失效：如果你直接使用原指针来接收 realloc() 返回的新指针，可能会导致内存泄漏，尤其是在 realloc() 失败时。因此，通常先用临时指针接收返回值。

## abort

使一个异常程序终止。

```cpp
/**
 * 参数
 *   abort 函数不接受任何参数。
 * 返回值
 *   abort 函数没有返回值，因为它不会正常返回。
 */
void abort(void)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    printf("before abort\n");
    abort();
    printf("after abort\n");

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main     
before abort
zsh: abort (core dumped)  ./main
```

注意事项

- abort 函数用于立即终止程序执行，并产生一个核心转储文件。
- 使用 abort 函数时，不会执行任何 atexit 注册的函数或对象析构函数。
- 通常用于在检测到不可恢复的错误时终止程序。
- abort 函数会立即终止程序，不会进行任何清理工作。
- 如果希望在程序终止前执行一些清理操作，可以使用 exit 函数代替 abort。
- 核心转储文件可以用于调试，帮助开发者分析程序异常终止的原因。

## atexit

当程序正常终止时，调用指定的函数 func。

```cpp
/**
 * 参数
 *   func -- 在程序终止时被调用的函数。
 * 返回值
 *   如果函数成功注册，则该函数返回零，否则返回一个非零值。
 */
int atexit(void (*func)(void))
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

void cleanup()
{
    printf("cleanup\n");
}

int main(int argc, char **argv)
{
    printf("before atexit\n");
    atexit(cleanup);
    printf("after atexit\n");

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
before atexit
after atexit
cleanup
```

## exit

使程序正常终止。

```cpp
/**
 * 参数
 *   status -- 返回给父进程的状态值。
 * 返回值
 *   该函数不返回值。
 */
void exit(int status)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    printf("before exit\n");
    exit(0);
    printf("after exit\n");

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
before exit

$ echo $?
0
```

## getenv

搜索 name 所指向的环境字符串，并返回相关的值给字符串。

```cpp
/**
 * 参数
 *   name -- 包含被请求变量名称的 C 字符串。
 * 返回值
 *   该函数返回一个以 null 结尾的字符串，该字符串为被请求环境变量的值。
 *   如果该环境变量不存在，则返回 NULL。
 */
char *getenv(const char *name)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    char *HOME = getenv("HOME");

    printf("HOME: %s\n", HOME);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
HOME: /Users/user
```

## system

由 string 指定的命令传给要被命令处理器执行的主机环境。

```cpp
/**
 * 参数
 *   command -- 包含被请求变量名称的 C 字符串。
 * 返回值
 *   如果发生错误，则返回值为 -1，否则返回命令的状态。
 */
int system(const char *string)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    int ret = system("echo 'hi'");

    printf("ret: %d\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
hi
ret: 0
```





```cpp

```

示例

```cpp

```

运行结果

```shell

```





```cpp

```

示例

```cpp

```

运行结果

```shell

```






```cpp

```

示例

```cpp

```

运行结果

```shell

```






```cpp

```

示例

```cpp

```

运行结果

```shell

```











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
