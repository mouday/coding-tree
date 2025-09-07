# poll.h

poll机制的工作原理及流程与select类似，但poll可监控的进程数量不受select中第二个因素——fd_set集合容量的限制，用户可在程序中自行设置被监测的文件描述符集的容量，当然poll在阻塞模式下也采用轮询的方式监测文件描述符集，因此应合理设置poll中监控进程的数量。poll机制主要通过poll()函数实现，下面对poll()函数进行讲解。

poll()函数存在于函数库poll.h中，其声明如下：

```cpp
#include <poll.h>

int poll(struct pollfd *fds, nfds_t nfds, int timeout);
```

参数fds是一个struct pollfd类型的指针，主要用于传入被监测的多个文件描述符

```cpp
struct pollfd {
  int fd;          // 文件描述符
  short events;    // 等待的事件
  short revents;   // 实际发生的事件
}
```

该结构体中的成员fd表示文件描述符，当将fd设置为-1时，表示取消对该文件描述符的监测；成员events用于设置程序等待的事件，该值由用户主动设置；成员revents用于设置文件描述符的操作结果对应的事件，该值在函数返回时被设置。poll可能涉及的事件及其对应的宏如表1所示。

| 事件 | 事件说明
|-|-
POLLIN | 文件描述符中有数据可读（包括普通数据或优先数据）
POLLRDNORM | 文件描述符中有普通数据可读
POLLRDBAND | 文件描述符中有优先数据可读
POLLPRI | 文件描述符中高优先级数据可读
POLLOUT | 文件描述符中有数据可写（包括普通数据或优先数据）
POLLWRNORM | 文件描述符中可写入普通数据
POLLWRBAND | 文件描述符中可写入优先数据
POLLERR | 发生错误事件
POLLHUP | 发生挂起事件
POLLNVAL | 非法请求

参数nfds等同于select()函数中的参数nfds，用来设置poll 监控的文件描述符的范围，需设置为文件描述符最大值加1；

参数timeout的取值及其对应含义如下：

- 当timeout=-1时，poll()函数阻塞等待；
- 当timeout=0时，poll()函数将立即返回，以轮询的方式监测文件描述符表；
- 当timeout>0时，等待指定时长（单位为毫秒，若当前系统时间精度不够毫秒则向上取值）。

返回

- 调用成功将返回就绪文件描述符数量；
- 若等待超时，将返回0，表示没有已就绪的文件描述符；
- 若调用出错，将返回-1，并设置errno。

案例4：使用poll模型搭建多路I/O转接服务器，使服务器可接收客户端数据，并将接收到的数据转为大写，写回客户端；使客户端可向服务器发送数据，并将服务器返回的数据打印到终端。

案例实现如下：

服务器

```cpp
// poll_s.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <poll.h>
#include <errno.h>
#include <unistd.h>
#include <ctype.h>

#define MAXLINE 80
#define SERV_PORT 8000
#define OPEN_MAX 1024

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
    int i, j, maxi, listenfd, connfd, sockfd;
    int nready, ret;
    ssize_t n;
    char buf[MAXLINE], str[INET_ADDRSTRLEN];
    socklen_t clilen;
    struct pollfd client[OPEN_MAX]; // 文件描述符与事件集合
    struct sockaddr_in cliaddr, servaddr;

    listenfd = socket(AF_INET, SOCK_STREAM, 0);
    result_check(listenfd, "socket");

    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servaddr.sin_port = htons(SERV_PORT);
    ret = bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    result_check(ret, "bind");

    ret = listen(listenfd, 20);
    result_check(ret, "listen");

    // 初始化poll()的参数fds
    client[0].fd = listenfd;
    client[0].events = POLLRDNORM; // 设置listenfd监听普通读事件

    // 将client[]中其余元素的fd成员初始化为-1
    for (i = 1; i < OPEN_MAX; i++)
        client[i].fd = -1;

    maxi = 0; // 记录client[]数组有效元素中最大元素下标

    // 使用poll()机制循环检测文件描述符集合
    for (;;)
    {
        nready = poll(client, maxi + 1, -1); // 阻塞等待请求到达

        // 通过listenfd状态判断是否有客户端连接请求，如有则建立连接
        if (client[0].revents & POLLRDNORM)
        {
            clilen = sizeof(cliaddr);
            connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &clilen);
            result_check(connfd, "accept");

            printf("received from %s at PORT %d\n",
                   inet_ntop(AF_INET, &cliaddr.sin_addr, str, sizeof(str)),
                   ntohs(cliaddr.sin_port));

            // 将accept返回的connfd存放到client[]中的空闲位置
            for (i = 1; i < OPEN_MAX; i++)
            {
                if (client[i].fd < 0)
                {
                    client[i].fd = connfd;
                    break;
                }
            }
            if (i == OPEN_MAX)
                result_check(-1, "too many clients");

            client[i].events = POLLRDNORM; // 设置刚刚返回的connfd，监控读事件
            if (i > maxi)                  // 更新client[]中最大元素下标
                maxi = i;
            if (--nready <= 0) // 若无就绪事件,回到poll阻塞
                continue;
        }
        // 检测client[]，处理有就绪事件的文件描述符
        for (i = 1; i <= maxi; i++)
        {
            if ((sockfd = client[i].fd) < 0)
                continue;
            if (client[i].revents & (POLLRDNORM | POLLERR))
            {
                n = read(sockfd, buf, MAXLINE);
                if (n < 0)
                {
                    // 比较errno，若为RST则表示连接中断
                    if (errno == ECONNRESET)
                    {
                        printf("client[%d] aborted connection\n", i);
                        close(sockfd);
                        client[i].fd = -1;
                    }
                    else
                        result_check(-1, "read");
                }
                else if (n == 0)
                {
                    // 连接由客户端关闭
                    printf("client[%d] closed connection\n", i);
                    close(sockfd);
                    client[i].fd = -1;
                }
                else
                { // 若成功读取数据，则对数据进行操作
                    for (j = 0; j < n; j++)
                        buf[j] = toupper(buf[j]);
                    ret = write(sockfd, buf, n);
                    result_check(ret, "write");
                }
                // 当就绪文件描述符数量为0时，终止循环
                if (--nready <= 0)
                    break;
            }
        }
    }
    return 0;
}
```

客户端

```cpp
// poll_c.c
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
        result_check(n, "read");

        write(STDOUT_FILENO, buf, n);
    }

    close(sockfd);
    return 0;
}
```

gcc poll_s.c -o poll_s  && ./poll_s
gcc poll_c.c -o poll_c  && ./poll_c


% gcc poll_s.c -o poll_s  && ./poll_s
success socket, ret: 3
success bind, ret: 0
success listen, ret: 0
success accept, ret: 4
received from 127.0.0.1 at PORT 57357
success write, ret: 6
success write, ret: 3
success accept, ret: 5
received from 127.0.0.1 at PORT 57385
success write, ret: 6
success write, ret: 3


 % gcc poll_c.c -o poll_c  && ./poll_c
success socket, ret: 3
success connect, ret: 0
hello
success write, ret: 6
success read, ret: 6
HELLO
hi
success write, ret: 3
success read, ret: 3
HI

% gcc poll_c.c -o poll_c  && ./poll_c
success socket, ret: 3
success connect, ret: 0
hello
success write, ret: 6
success read, ret: 6
HELLO
hi
success write, ret: 3
success read, ret: 3
HI
