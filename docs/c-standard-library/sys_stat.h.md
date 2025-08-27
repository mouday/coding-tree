# sys/stat.h

头文件

```cpp
#include <sys/stat.h>
```

## mkfifo

命名管道

```cpp
/**
 * 参数
 *   pathname 管道文件的路径名
 *   mode 指定FIFO的权限
 * 
 * 返回
 *   成功返回0
 *   失败返回-1，并适当设置errno
 */
int mkfifo(const char *pathname, mode_t mode);
```

示例：如何使用FIFO实现无关进程间的通信

fifo_write.c

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main(int argc, char *argv[])
{

    char *fifoname = "./tmp_fifo";

    // 判断fifo文件是否存在
    int ret = access(fifoname, F_OK);

    // 若fifo不存在就创建fifo
    if (ret == -1)
    {
        int r = mkfifo(fifoname, 0664);
        if (r == -1)
        {
            // 判断文件是否创建成功
            perror("mkfifo");
            exit(1);
        }
        else
        {
            printf("fifo create success!\n");
        }
    }

    int fd = open(fifoname, O_WRONLY); // 以读写的方式打开文件

    // 循环写入数据
    while (1)
    {
        char *p = "hello,world!";
        write(fd, p, strlen(p) + 1);
        printf("write success\n");
        sleep(1);
    }
    close(fd);

    return 0;
}
```

fifo_read.c

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main(int argc, char *argv[])
{
    char *fifoname = "./tmp_fifo";

    int ret = access(fifoname, F_OK); // 判断文件是否存在
    if (ret == -1)                    // 若文件不存在则创建文件
    {
        int r = mkfifo(fifoname, 0664);
        if (r == -1)
        {
            perror("mkfifo");
            exit(1);
        }
        else
        {
            printf("fifo creat success!\n");
        }
    }

    // 打开文件
    int fd = open(fifoname, O_RDONLY);
    if (fd == -1)
    {
        perror("open");
        exit(1);
    }

    // 不断读取fifo中的数据并打印
    while (1)
    {
        char buf[1024] = {0};
        read(fd, buf, sizeof(buf));
        printf("buf=%s\n", buf);
    }

    close(fd); // 关闭文件
    return 0;
}
```

运行结果

```shell
# 写入端
% gcc fifo_write.c  -o fifo_write && ./fifo_write
write success
write success
write success

# 读取端
% gcc fifo_read.c  -o fifo_read  && ./fifo_read
buf=hello,world!
buf=hello,world!
buf=hello,world!
```