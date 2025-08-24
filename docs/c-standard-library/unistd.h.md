# unistd.h

## getcwd

获取当前工作目录的绝对路径

```cpp
/**
 * 参数
 *   buf 存储路径的缓冲区指针，若为NULL,则函数自动分配内存（需要手动释放）
 *   size 缓冲区大小，若路径长度大于size,会返回NULL,并设置errno  
 */
char *getcwd(char *buf, size_t size);
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void)
{

    char *cwd = getcwd(NULL, 0);
    if (cwd != NULL)
    {
        printf("cwd: %s\n", cwd);
        free(cwd);
    }
    else
    {
        perror("cwd error");
    }

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
/Users/tom/workspace
```

## fork

创建子进程

```cpp
/**
 * 父进程返回子进程PID
 * 子进程返回0
 */
pid_t fork(void)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void)
{

    pid_t pid = fork();
    if (pid == 0)
    {
        printf("child pid: %d\n", getpid());
    }
    else
    {
        printf("parent pid: %d\n", getpid());
        wait(NULL);
    }

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
parent pid: 56606
child pid: 56607
```




```cpp

```

示例

```cpp

```

运行结果

```shell
$ gcc main.c -o main && ./main
```

## pipe

创建匿名管道

> 注意：匿名管道只能在有亲缘关系的进程间使用

```cpp
/**
 * 参数
 *      pipefd 文件描述符
 *  成功返回0，失败返回-1
 */ 
int pipe(int pipefd[2]);
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

#define READ_END 0
#define WRITE_END 1

int main(int argc, char const *argv[])
{
    // 定义文件描述符数组
    int fds[2];

    // 创建管道
    if (pipe(fds) == -1)
    {
        perror("pipe error");
        return -1;
    }

    pid_t pid = fork();
    if (pid == 0)
    {
        // 子进程—写入
        close(fds[READ_END]); // 关闭读端

        const char *msg = "Hello World!";

        // 写数据
        write(fds[WRITE_END], msg, strlen(msg) + 1);
        close(fds[WRITE_END]); // close write end
        exit(0);
    }
    else if (pid > 0)
    {
        // 父进程—读取
        close(fds[WRITE_END]); // 关闭写端

        char buffer[100];
        read(fds[READ_END], buffer, sizeof(buffer));
        printf("Received message: %s\n", buffer);
        close(fds[READ_END]); // close read end
        wait(NULL);
    }

    return 0;
}

```

运行结果

```shell
% gcc main.c  -o main && ./main
Received message: Hello World!
```

## dup2

```cpp
int dup2(int oldfd, int newfd);
```
