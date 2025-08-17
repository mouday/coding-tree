# sys/ipc.h

头文件

```cpp
#include <sys/ipc.h>
```

## ftok

当在进程中使用System V IPC系列的接口进行通信时，必须指定一个key值，这是一个key_t类型的变量，通常不会直接使用具体数值，而是通过Linux系统中的一个函数——ftok()来获取。

```cpp
/**
 * 参数
 *   pathname表示路径名，一般会设置为当前目录“.”
 *   proj_id由用户指定，为一个整型数据，一般设置为0。
 */
key_t ftok(const char *pathname, int proj_id);
```

当ftok()函数被调用时，该函数首先会获取目录的inode，其次将十进制的inode及参数proj_id否转换为十六进制，最后将这两个十六进制数链接，生成一个key_t类型的返回值。

例如，当前目录的inode值为65538，转换为十六进制为0x01002；指定的proj_id值为24，转换为十六进制为0x18，那么ftok()返回的key值则为0x18010002。

```cpp
#include <stdio.h>
#include <sys/ipc.h>

int main(int argc, char const *argv[])
{
    key_t key = ftok(".", 0);
    printf("key: %d\n", key);

    return 0;
}

```

运行结果

```shell
% gcc main.c  -o main && ./main
key: 275659
```
