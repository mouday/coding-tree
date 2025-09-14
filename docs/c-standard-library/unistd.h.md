# unistd.h

注意事项

- 可移植性：unistd.h 是 POSIX 标准的一部分，在 Windows 系统中不可用（虽然有类似的实现如 io.h）
- 错误处理：大多数 unistd.h 函数在出错时返回 -1 并设置 errno
- 头文件依赖：通常需要与其他头文件如 fcntl.h、sys/types.h 等一起使用
- 权限问题：许多函数需要适当的权限才能执行特定操作

## 目录操作

### getcwd

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

// 改变当前工作目录
int chdir(const char *path);

## 进程控制

### fork

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

### _exit

进程终止

```cpp
void _exit(int status);
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{
    printf("before _exit\n");
    _exit(EXIT_SUCCESS);
    printf("after _exit\n");
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
before _exit

% echo $?
0
```

## 管道操作

### pipe

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

## 文件操作

### access

```cpp
/**
 * 参数
 *   path 文件名
 *   mode 检查项
 * 成功返回0，失败返回-1，并设置errno
 */ 
int access(const char *path, int mode);
```

mode可选：

- R_OK 读取权限
- W_OK 写权限
- X_OK 执行权限
- F_OK 存在检查

示例

```cpp
#include <stdio.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{
    // 检查文件是否存在
    int ret = access("main.c", F_OK);
    printf("ret=%d\n", ret);

    return 0;
}
```

执行结果

```shell
% gcc main.c  -o main && ./main
ret=0
```

### read

从文件描述符读取数据

```cpp
ssize_t read(int fd, void *buf, size_t count);
```

示例

```cpp
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{

    // 打开文件
    int fd = open("temp.txt", O_RDONLY);

    char buf[20];

    int n = read(fd, buf, sizeof(buf)); // 读取文件内容
    // 添加字符串结束符
    buf[n] = '\0';
    printf("buf=%s\n", buf);

    close(fd);

    return 0;
}
```

运行结果

```shell
% cat temp.txt 
Hello, World!

% gcc main.c -o main && ./main
buf=Hello, World!
```

### write

向文件描述符写入数据

```cpp
ssize_t write(int fd, const void *buf, size_t count);
```

示例

```cpp
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{

    // 创建并打开文件
    int fd = open("temp.txt", O_CREAT | O_WRONLY);
    if (fd == -1)
    {
        perror("open file error");
        return -1;
    }

    write(fd, "Hello, World!\n", 14); // 向文件写入数据

    close(fd);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main

% cat temp.txt 
Hello, World!
```

### lseek

移动文件指针

```cpp
/**
 * 参数
 * whence:
 *   - SEEK_SET 设置偏移
 *   - SEEK_CUR
 *   - SEEK_END 文件尾部
 */
off_t lseek(int fd, off_t offset, int whence);
```

示例

```cpp
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{

    // 打开文件
    int fd = open("temp.txt", O_RDONLY);

    char buf[20];
    int n = read(fd, buf, sizeof(buf)); // 读取文件内容
    // 添加字符串结束符
    buf[n] = '\0';
    printf("buf=%s\n", buf);

    // 将文件偏移量重新定位到文件开头
    lseek(fd, 0, SEEK_SET);
    n = read(fd, buf, sizeof(buf)); // 再次读取文件内容
    buf[n] = '\0';
    printf("buf=%s\n", buf);

    close(fd);

    return 0;
}
```

运行结果

```shell
 % gcc main.c -o main && ./main
buf=Hello, World!

buf=Hello, World!

```

// 创建符号链接
int symlink(const char *target, const char *linkpath);

// 读取符号链接
ssize_t readlink(const char *pathname, char *buf, size_t bufsiz);


## 系统信息

### getuid

获取用户ID

```cpp
uid_t getuid(void);
```

// 获取有效用户ID
uid_t geteuid(void);

// 获取组ID
gid_t getgid(void);

// 获取有效组ID
gid_t getegid(void);

// 获取主机名
int gethostname(char *name, size_t len);

```cpp

```

示例

```cpp

```

运行结果

```shell
$ gcc main.c -o main && ./main
```

## 时间延迟

### sleep

暂停执行一段时间

```cpp
/**
 * 单位： 秒
 */
unsigned int sleep(unsigned int seconds);
```

示例

```cpp
#include "log.h"
#include <unistd.h>

int main()
{
    // 初始化日志器
    Logger *logger = logger_init("", LOG_TO_CONSOLE, LOG_DEBUG);

    logger_log(logger, LOG_DEBUG, "start");

    sleep(3); // 暂停3秒

    logger_log(logger, LOG_DEBUG, "end");

    // 销毁日志器
    logger_destroy(logger);

    return 0;
}
```

其中，[log.h](../c-start/logger.md) 为日志模块

运行结果

```shell
% gcc main.c log.c -o main && ./main
[2025-08-28 08:22:05] [DEBUG] start
[2025-08-28 08:22:08] [DEBUG] end
```

不同延时函数的比较

函数 | 精度   | 可移植性   | 信号处理   | 推荐度
| - | - | - |- | - 
usleep  | 微秒级 (已过时)  |类 Unix 系统  |可能被信号中断，需手动处理  |⭐☆☆☆☆
nanosleep  | 纳秒级  |类 Unix 系统  |提供更明确的信号处理规范，可自动重试  |⭐⭐⭐⭐⭐
clock_nanosleep |   纳秒级  |类 Unix 系统|  可指定时钟源，稳定性更高  |⭐⭐⭐⭐☆
Sleep  | 毫秒级 |   Windows  |行为取决于系统  |⭐⭐⭐⭐☆ (Windows)

### usleep(废弃)

更精确的暂停

```cpp
/**
 * 微秒
 * 成功时返回 0
 * 如果被信号中断，则返回 -1，并设置 errno 为 EINTR
 * 1s = 1000000us
 */
int usleep(useconds_t usec);
```

示例

```cpp
#include "log.h"
#include <unistd.h>

int main()
{
    // 初始化日志器
    Logger *logger = logger_init("", LOG_TO_CONSOLE, LOG_DEBUG);

    logger_log(logger, LOG_DEBUG, "start");

    usleep(3000000); // 暂停3秒 1000000

    logger_log(logger, LOG_DEBUG, "end");

    // 销毁日志器
    logger_destroy(logger);

    return 0;
}
```

运行结果

```shell
% gcc main.c log.c -o main && ./main
[2025-08-28 08:25:35] [DEBUG] start
[2025-08-28 08:25:38] [DEBUG] end
```

## 文件描述符

### dup

复制文件描述符

```cpp
/**
 * 参数
 *   oldfd 要复制的文件描述符
 * 成功返回文件描述符，失败返回-1，并设置errno
*/
int dup(int oldfd);
```

示例

```cpp
#include <unistd.h> // close/dup
#include <fcntl.h>  // open

int main(int argc, char const *argv[])
{

    int fd = open("demo.txt", O_WRONLY | O_CREAT, 0644);

    // dup_fd和 fd指向同一个文件
    int dup_fd = dup(fd);
    write(fd, "hello", 5);
    write(dup_fd, "world\n", 6);

    close(dup_fd);
    close(fd);

    return 0;
}
```

运行结果

```shell
% cat demo.txt
helloworld
```

### dup2

重定向，修改文件描述符指向

```cpp
/**
 * 参数
 *   oldfd 要复制的文件描述符
 *   newfd 指定新的文件描述符
 * 返回
 *   成功 返回newfd
 *   失败 返回-1，并设置errno
*/
int dup2(int oldfd, int newfd);
```

示例

```cpp
#include <unistd.h> // close/dup
#include <fcntl.h>  // open
#include <stdio.h>

int main(int argc, char const *argv[])
{

    int fd = open("demo.txt", O_WRONLY | O_CREAT, 0644);

    // 将标准输出冲定向到文件fd
    dup2(fd, STDOUT_FILENO);
    printf("hello world\n");

    close(fd);

    return 0;
}
```

运行结果

```shell
% cat demo.txt   
hello world
```

### close

关闭文件描述符

```cpp
/**
 * 参数：
 * fd 文件描述符
 * 成功返回0，失败返回-1，并设置errno
*/
int close(int fd);
```

示例

```cpp
#include <unistd.h> // close
#include <fcntl.h>  // open

int main(int argc, char const *argv[])
{

   int fd = open("demo.txt", O_WRONLY, 0644);

   close(fd);

    return 0;
}
```
