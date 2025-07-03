# stdlib.h

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