# sys/select.h

使用select搭建的多路I/O转接服务器是一种基于非阻塞的服务器：

当有客户端连接请求到达时，accept会返回一个文件描述符，该文件描述符会被存储到由select监控的文件描述符表中，每个文件描述符对应的文件都可进行I/O操作，因此select可通过监控表中各个文件描述符，来获取对应的客户端I/O状态。

若每路程序中都没有数据到达，线程将阻塞在select上；否则select将已就绪客户端程序的数量返回到服务器。

```cpp
int select(int nfds, fd_set *readfds, fd_set *writefds,
​         fd_set *exceptfds, struct timeval *timeout);
```

说明

- 参数nfds用来设置select监控的文件描述符的范围，需设置为文件描述符最大值加1。
- 参数readfds 可读取数据的文件描述符集，参数类型fd_set实质为长整型，这些集合中的每一位都对应一个文件描述符的状态，若集合参数被设置为NULL，表示不关心文件的对应状态。
- 参数writefds 可写入数据的文件描述符集
- 参数exceptfds 发生异常的文件描述符集
- 参数timeout用于设置select的阻塞时长，其取值有如下几种情况：
  - 若timeval=NULL，表示永远等待；
  - 若timeval>0，表示等待固定时长；
  - 若timeval=0，select将在检查过指定文件描述符后立即返回（轮询）。

返回值有3种：

- 若返回值大于0，表示已就绪文件描述符的数量，此种情况下某些文件可读写或有错误信息；
- 若返回值等于0，表示等待超时，没有可读写或错误的文件；
- 若返回值-1，表示出错返回，同时errno将被设置。

Linux系统中提供了一系列用于操作文件描述符集的函数，这些函数的定义与功能如表1所示。

函数声明 | 函数功能
-|-
void FD_CLR(int fd,fd_set *set);| 将集合中的文件描述符fd清除（将fd位置为0）
int FD_ISSET(int fd,fd_set *set);| 测试集合中文件描述符fd是否存在于集合中，若存在则返回非0
void FD_SET(int fd,fd_set *set);| 将文件描述符fd添加到集合中（将fd位置为1）
void FD_ZERO(fd_set *set); | 清除集合中所有的文件描述符（所有位置0）

select可监控的进程数量是有限的，该数量受到两个因素的限制。

- 第一个因素是进程可打开的文件数量
- 第二个因素是select中的集合fd_set的容量。

进程可打开文件的上限可通过`ulimit –n`命令或setrlimit函数设置，但系统所能打开的最大文件数也是有限的；select中集合fd_set的容量由宏FD_SETSIZE（定义在linux/posix_types.h中）指定，一般为1024，但即便通过重新编译内核的方式修改FD_SETSIZE，也不一定能提升select服务器的性能，因为若select一次监测的进程过多，单轮询便要耗费大量的时间。

案例：使用select模型搭建多路I/O转接服务器，使服务器可接收客户端数据，并将接收到的数据转为大写，写回客户端；使客户端可向服务器发送数据，并将服务器返回的数据打印到终端。

服务器

```cpp
// select_s.c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <ctype.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define MAXLINE 80 // 设置监控的进程数上限
#define SERV_PORT 8000

void result_check(int ret, const char *msg)
{
    if (ret == -1)
    {
        printf("error %s, ret: %d\n", msg, ret);
        perror(msg);
        exit(EXIT_FAILURE);
    }
    else
    {
        printf("success %s, ret: %d\n", msg, ret);
    }
}

int main()
{
    int i, maxi, maxfd, listenfd, connfd, sockfd, ret;
    int nready, client[FD_SETSIZE]; // FD_SETSIZE 默认为1024
    ssize_t n;
    fd_set rset, allset;
    char buf[MAXLINE];
    char str[INET_ADDRSTRLEN]; // #define INET_ADDRSTRLEN 16
    socklen_t cliaddr_len;
    struct sockaddr_in cliaddr, servaddr;

    listenfd = socket(AF_INET, SOCK_STREAM, 0);
    result_check(listenfd, "socket");

    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servaddr.sin_port = htons(SERV_PORT);
    ret = bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    result_check(ret, "bind");

    ret = listen(listenfd, 20); // 默认最大128
    result_check(ret, "listen");
    maxfd = listenfd;
    maxi = -1;
    // 初始化监控列表
    for (i = 0; i < FD_SETSIZE; i++)
        client[i] = -1; // 使用-1初始化client[]中元素

    FD_ZERO(&allset);
    FD_SET(listenfd, &allset); // 将listenfd添加到文件描述符集中

    // 循环监测处于连接状态进程的文件描述符
    for (;;)
    {
        // 使用变量rset获取文件描述符集合
        rset = allset;
        // 记录就绪进程数量
        nready = select(maxfd + 1, &rset, NULL, NULL, NULL);
        result_check(nready, "select");

        if (FD_ISSET(listenfd, &rset))
        {
            // 有新连接请求到达则进行连接便处理连接请求
            cliaddr_len = sizeof(cliaddr);
            connfd = accept(listenfd, (struct sockaddr *)&cliaddr,
                            &cliaddr_len);
            result_check(connfd, "accept");

            printf("received from %s at PORT %d\n",
                   inet_ntop(AF_INET, &cliaddr.sin_addr, str, sizeof(str)),
                   ntohs(cliaddr.sin_port));

            for (i = 0; i < FD_SETSIZE; i++)
                if (client[i] < 0)
                {
                    client[i] = connfd; // 将文件描述符connfd保存到client[]中
                    break;
                }

            if (i == FD_SETSIZE)
            { // 判断连接数是否已达上限
                fputs("too many clients\n", stderr);
                exit(1);
            }
            FD_SET(connfd, &allset); // 添加新文件描述符到监控信号集中
            if (connfd > maxfd)      // 更新最大文件描述符
                maxfd = connfd;
            if (i > maxi) // 更新client[]最大下标值
                maxi = i;
            // 若无文件描述符就绪，便返回select，继续阻塞监测剩余的文件描述符
            if (--nready == 0)
                continue;
        }
        // 遍历文件描述符集，处理已就绪的文件描述符
        for (i = 0; i <= maxi; i++)
        {
            if ((sockfd = client[i]) < 0)
                continue;
            if (FD_ISSET(sockfd, &rset))
            {
                // n=0，client就绪但未读到数据，表示client将关闭连接
                if ((n = read(sockfd, buf, MAXLINE)) == 0)
                {
                    // 关闭服务器端连接
                    close(sockfd);
                    FD_CLR(sockfd, &allset); // 清除集合中对应的文件描述符
                    client[i] = -1;
                }
                else
                { // 处理获取的数据
                    int j;
                    for (j = 0; j < n; j++)
                        buf[j] = toupper(buf[j]);
                    write(sockfd, buf, n);
                }
                if (--nready == 0)
                    break;
            }
        }
    }
    ret = close(listenfd);
    result_check(ret, "close");
    return 0;
}
```

客户端

```cpp
// select_c.c

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define MAXLINE 80
#define SERV_PORT 8000

void result_check(int ret, const char *msg)
{
    if (ret == -1)
    {
        printf("error %s, ret: %d\n", msg, ret);
        perror(msg);
        exit(EXIT_FAILURE);
    }
    else
    {
        printf("success %s, ret: %d\n", msg, ret);
    }
}

int main()
{
    struct sockaddr_in servaddr;
    char buf[MAXLINE];
    int sockfd, n, ret;

    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    result_check(sockfd, "socket");

    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    inet_pton(AF_INET, "127.0.0.1", &servaddr.sin_addr);
    servaddr.sin_port = htons(SERV_PORT);
    ret = connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    result_check(ret, "connect");

    while (fgets(buf, MAXLINE, stdin) != NULL)
    {
        ret = write(sockfd, buf, strlen(buf));
        result_check(ret, "write");

        n = read(sockfd, buf, MAXLINE);
        if (n == 0)
            printf("the other side has been closed.\n");
        else
            write(STDOUT_FILENO, buf, n);
    }
    ret = close(sockfd);
    result_check(ret, "close");
    return 0;
}
```

运行结果

```shell
# 服务器
$ gcc select_s.c  -o select_s  && ./select_s

success socket, ret: 3
success bind, ret: 0
success listen, ret: 0
success select, ret: 1
success accept, ret: 4
received from 127.0.0.1 at PORT 49926
success select, ret: 1
success select, ret: 1
received from 127.0.0.1 at PORT 49967
success select, ret: 1

# 客户端（可以运行多个）
% gcc select_c.c -o select_c  && ./select_c
success socket, ret: 3
success connect, ret: 0
hello
success write, ret: 6
HELLO
hi
success write, ret: 3
HI
```
