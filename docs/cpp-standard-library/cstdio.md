# cstdio

常用的函数

函数| 说明
|-|-
fopen | 打开文件
fclose | 关闭文件
fread | 从文件中读取数据
fwrite | 向文件中写入数据
fprintf | 向文件写入格式化输出
fscanf | 从文件中读取格式化输入
fgetc | 从文件中读取一个字符
fputc | 向文件写入一个字符
fgets | 从文件中读取一行
fputs | 向文件写入一行

更多 [stdio.h](../c-standard-library/stdio.h.md)

## fopen/fclose

打开和关闭文件

```cpp
FILE *fopen(const char *filename, const char *mode)
int fclose(FILE *stream);
```

示例

```cpp
#include <cstdio>

int main(int argc, char const *argv[])
{
    // 打开文件用于读取
    FILE *file = fopen("demo.txt", "r");

    if(file == NULL){
        perror("open error");
        return 1;
    }

    // 关闭文件
    fclose(file);

    return 0;
}
```

输出结果

```shell
open error: No such file or directory
```

## fprintf

向文件写入数据

```cpp
int fprintf(FILE *stream, const char *format, ...);
```

示例

```cpp
#include <cstdio>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "w");

    if(file == NULL){
        perror("open error");
        return 1;
    }

    fprintf(file, "%s\n", "hello");

    fclose(file);

    return 0;
}
```

输出结果

```shell
cat demo.txt
hello
```

## fscanf

格式化输入

```cpp
int fscanf(FILE *stream, const char *format, ...);
```

示例

```cpp
#include <cstdio>
#include <iostream>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "r");

    if (file == NULL)
    {
        perror("open error");
        return 1;
    }

    int value = 0;
    fscanf(file, "%d", &value);
    fclose(file);

    printf("%d\n", value);

    return 0;
}
```

输出结果

```shell
1024
```

## fgets

从文件读取数据

```cpp
char *fgets(char *buf, int size, FILE *file);
```

示例

```cpp
#include <cstdio>
#include <iostream>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "r");

    if (file == NULL)
    {
        perror("open error");
        return 1;
    }

    char buf[3];
    while (fgets(buf, 3, file) != NULL)
    {
        std::cout << buf << std::endl;
    }

    fprintf(file, "%s\n", "hello");

    fclose(file);

    return 0;
}
```

输出结果

```shell
he
ll
o
```

## fputs

写入字符串到文件

```cpp
int fputs(const char * str, FILE * stream);
```

示例

```cpp
#include <cstdio>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "w");
    fputs("hello world", file);
    fclose(file);

    return 0;
}

```

运行结果

```shell
% cat demo.txt
hello world
```

## fwrite

向文件中写入数据

```cpp
size_t fwrite(const void *buf, size_t size, size_t nitems, FILE *stream);
```

示例

```cpp
#include <cstdio>
#include <iostream>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "wb");

    if (file == NULL)
    {
        perror("open error");
        return 1;
    }

    int data = 1024;
    fwrite(&data, sizeof(int), 1, file);

    fclose(file);

    return 0;
}
```

## fread

从文件中读取数据

```cpp
size_t fread(void * ptr, size_t size, size_t nitems, FILE *stream);
```

示例

```cpp
#include <cstdio>
#include <iostream>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "rb");

    if (file == NULL)
    {
        perror("open error");
        return 1;
    }

    int data = 0;
    fread(&data, sizeof(int), 1, file);

    fclose(file);

    printf("data: %d\n", data);

    return 0;
}

```

输出结果

```shell
data: 1024
```

## fseek 和 ftell

在文件中移动文件指针和获取文件指针的位置

```cpp
int fseek(FILE *stream, long offset, int whence);
long ftell(FILE *stream);
```

示例

```cpp
#include <cstdio>
#include <iostream>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "rb");

    if (file == NULL)
    {
        perror("open error");
        return 1;
    }

    fseek(file, 0, SEEK_END);     // 移动到文件末尾
    long file_size = ftell(file); // 获取文件大小

    fclose(file);

    printf("file_size: %lu\n", file_size);

    return 0;
}

```

输出结果

```shell
file_size: 4
```

## fflush

刷新文件流，将缓冲区中的数据写入文件。

```cpp
int fflush(FILE *);
```

示例

```cpp
#include <cstdio>
#include <iostream>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "rb");

    if (file == NULL)
    {
        perror("open error");
        return 1;
    }

    fputs("hello world", file);
    fflush(file); // 确保数据立即写入文件

    fclose(file);

    return 0;
}
```

## printf

用于格式化输出到标准输出

```cpp
int printf(const char * format, ...);
```

示例

```cpp
#include <cstdio>

int main(int argc, char const *argv[])
{

    int value = 1024;
    printf("value: %d\n", value);

    return 0;
}

```

输出结果

```shell
value: 1024
```

## scanf

格式化输入从标准输入

```cpp
int scanf(const char * format, ...);
```

示例

```cpp
#include <cstdio>

int main(int argc, char const *argv[])
{
    int value = 0;
    scanf("%d", &value); // 从标准输入读取
    printf("value: %d\n", value);
    return 0;
}
```

输出结果

```shell
% g++ ./demo.cpp -o demo && ./demo
1024
value: 1024
```

## sprintf

用于格式化输出到字符串

```cpp
// deprecated
int sprintf(char * str, const char * format, ...);

int snprintf(char * str, size_t size, const char * format, ...);
```

示例

```cpp
#include <cstdio>

int main(int argc, char const *argv[])
{
    char buf[50];
    const char *name = "Tom";
    int age = 10;

    // 输出到字符串
    int n = snprintf(buf, sizeof(buf), "name: %s, age: %d", name, age);
    buf[n] = '\0';

    printf("len: %d, buf: %s\n", n, buf);
    return 0;
}
```

输出结果

```cpp
len: 18, buf: name: Tom, age: 10
```

## sscanf

用于格式化从字符串中读取

```cpp
int sscanf(const char * str, const char * format, ...);
```

示例

```cpp
#include <cstdio>

int main(int argc, char const *argv[])
{

    const char *buf = "name: Tom, age: 10";
    int age = 10;
    char name[5];

    // 从字符串读取
    sscanf(buf, "name: %s, age: %d", name, &age);

    printf("name: %s, age: %d\n", name, age);

    return 0;
}

```

输出结果

```shell
name: Tom,, age: 10
```

## getc

从文件中读取字符

```cpp
int fgetc(FILE * stream);
```

示例

```cpp
#include <cstdio>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "r");
    int value = fgetc(file); // 读取一个字符
    fclose(file);

    printf("value: %c\n", value);

    return 0;
}
```

输出结果

```shell
value: a
```

## putc

写入字符到文件

```cpp
int fputc(int n, FILE * stream);
```

示例

```cpp
#include <cstdio>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "w");
    fputc('a', file); // 写入一个字符
    fclose(file);

    return 0;
}
```

输出结果

```shell
% cat demo.txt
a
```

## feof/ferror

用于检测文件结束和文件错误。

```cpp
#include <cstdio>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "r");
    int n;
    while (!feof(file))
    {
        n = fgetc(file);
        printf("%c", n);
    }

    fclose(file);

    return 0;
}
```

输出结果

```shell
hello world�%
```

## EOF

表示文件结束标志

```cpp
#include <cstdio>

int main(int argc, char const *argv[])
{
    FILE *file = fopen("demo.txt", "r");
    int n;
    while (true)
    {
        n = fgetc(file);
        if (n == EOF)
        {
            break;
        }
        printf("%c", n);
    }

    fclose(file);

    return 0;
}
```

输出结果

```shell
g++ demo.cpp -o demo && ./demo
hello world%
```
