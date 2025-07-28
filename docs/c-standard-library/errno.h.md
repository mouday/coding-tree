# errno.h

`<errno.h>` 是 C 标准库中用于错误报告的核心头文件，它提供了一种标准化的错误处理机制。通过全局变量 `errno` 和一系列错误代码宏，开发者可以诊断和处理运行时错误。

引入头文件

```cpp
#include <errno.h>
```

## errno 变量

- 全局错误指示器：errno 是一个线程局部的整型变量（左值）

- 函数行为：标准库函数在发生错误时设置 errno，成功时不修改

- 初始值：程序启动时为 0，表示无错误

- 重置：成功调用后不会自动重置，需手动置零

```cpp
// errno.h
extern int errno;

/*
 * Error codes
 */
#define ENOENT          2               /* No such file or directory */
// ...
```

最佳实践包括：

- 保存错误码后再调用其他函数

- 为应用定义专用错误范围

- 避免在性能关键路径频繁获取错误字符串

## errno使用

示例1: perror打印当前错误描述

```cpp
#include <stdio.h> // perror
#include <errno.h>

int main(int argc, char **argv)
{
    errno = ENOENT;
    perror("has errno");
    return 0;
}

```

运行结果

```shell
$  gcc main.c -o main && ./main
has errno: No such file or directory
```

示例2: strerror 将错误码转换为错误描述

```cpp
#include <string.h> // strerror
#include <stdio.h>
#include <errno.h>

int main(int argc, char **argv)
{
    char *error_message = strerror(ENOENT);
    printf("error_message: %s\n", error_message);

    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
error_message: No such file or directory
```

示例3: 文件操作错误

```cpp
#include <string.h> // strerror
#include <stdio.h>
#include <errno.h>

int main(int argc, char **argv)
{
    FILE *fp = fopen("invalid/file.txt", "r");
    if (fp == NULL)
    {
        int errnum = errno; // 保存错误码
        printf("error_no: %d\n", errnum);
        printf("error_message: %s\n", strerror(errnum));
    }
    else
    {
        fclose(fp);
    }

    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
error_no: 2
error_message: No such file or directory
```
