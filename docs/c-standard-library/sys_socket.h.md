# sys/socket.h

头文件

```cpp
#include <sys/socket.h>
```

## socket

创建套接字，打开网络通讯端口，该函数类似与文件操作中的open()函数

```cpp
/**
 * 参数
 *   domain用于指定通信域，选择通信时的协议族
 *   type用于指定socket的连接类型
 *   protocol一般设置为0，表示使用默认协议
 * 
 * 返回
 *   成功，返回一个文件描述符
 *   失败会返回-1，并设置errno
 */
int socket(int domain, int type, int protocol);
```

domain

- `AF_INET`针对因特网，使用IPv4格式的IP地址，以此参数建立的socket可与远程的通信端连接并进行通信；
- `AF_UNIX`则针对本地进程，以此参数建立的socket可在本地系统进程间进行通信。

type

- `SOCK_STREAM`表示套接字使用TCP协议，提供按顺序、可靠、双向、面向连接且基于比特流的通信；
- `SOCK_DGRAM`表示套接字使用UDP协议，提供定长、不可靠、无连接且基于数据报的通信；
- `SOCK_RAW`表示套接字使用ICMP协议，提供单一的网络访问，一般用于开发人员需自行设置数据报格式或参数时。

## bind

使服务器端的一个socket文件与网络中的一个进程进行绑定，因为文件描述符可标识socket文件，“主机名+端口号”可标识网络中的唯一进程，因此bind()函数实际上是将服务器端的socket文件与网络中的进程地址进程绑定。

```cpp
/**
 * 参数
 *   sockfd指代socket文件的文件描述符，一般由socket()函数返回
 *   addr指代需要与服务器进行通信进程的地址
 *   addrlen表示参数addr的长度
 * 
 * 调用成功，则返回0；否则返回-1，并设置errno。
 */
int bind(int sockfd, const struct sockaddr *addr,socklen_t addrlen);
```

[地址结构体sockaddr](netinet_in.h.md)

## listen

用于服务器端，使已绑定的socket监听对应客户端进程状态

```cpp
/**
 * 参数
 *   sockfd表示socket文件描述符;
 *   backlog用于设置请求队列的最大长度
 * 
 * 调用成功则返回0，表示监听成功；否则返回-1，并设置errno。
 */
int listen(int sockfd, int backlog);
```

典型的服务器可同时服务于多个客户端，当有客户端发起连接请求时，服务器调用的accept()函数将返回，并`接受`这个连接；

若发起连接请求的客户端过多，服务器来不及处理，尚未建立连接的客户端就会处于`等待`连接状态。

listen()函数中的参数backlog便用于限制建立的连接数量，若已有backlog个客户端连接到服务器，服务器就会`忽略`之后接收到的连接请求。

## accept

阻塞等待客户端的连接请求

```cpp
/**
 * 参数sockfd表示socket文件描述符。
 * 参数addr是一个传出参数，表示客户端的地址，该参数也可设置为NULL，表示不关心客户端的地址。
 * 参数addrlen是一个传入传出参数，
 *   - 传入时为函数调用者提供的缓冲区addr的长度，
 *   - 传出时为客户端地址结构体的实际长度。
 * 
 * 调用成功，则返回一个文件描述符；否则返回-1，并设置errno。
 */
int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);
```

当传输层使用TCP协议时，服务器与客户端在创建连接前，会先经过“三次握手”机制测试连接，“三次握手”完成后，服务器调用accept()函数处理连接请求，此时若还没有客户端的请求到达，便阻塞等待调用accept()函数的进程，直到接收到客户端发来的请求，且服务器中已创建的连接数未达到backlog，accept()函数才会返回，并传出客户端的地址。

## connect

用于客户端，向服务器发起连接请求

```cpp
/**
 * 参数
 *   sockfd指代socket文件的文件描述符，一般由socket()函数返回
 *   addr指代需要与服务器进行通信进程的地址
 *   addrlen表示参数addr的长度
 * 
 * 调用成功则返回0，否则返回-1，并设置errno。
 */
int connect(int sockfd, const struct sockaddr *addr,socklen_t addrlen);
```

connect()函数的参数与bind()函数中参数的形式一致，区别在于bind()中的参数为客户端进程地址，而connect的参数为服务器端地址。

## send

用于向处于连接状态的套接字中发送数据

```cpp
/**
 * 参数sockfd表示接收端的socket文件描述符；
 * 参数buf为指向要发送数据的缓冲区指针；
 * 参数len表示缓冲区buf中数据的长度；
 * 参数flags表示调用的执行方式（阻塞/非阻塞），当flags设置为0时，可使用write()函数替代send()函数。
 * 
 * 成功，则返回发送字节数；否则返回-1，并设置errno。
 */
ssize_t send(int sockfd, const void *buf, size_t len, int flags);
```

## sendto


```cpp
/**
 * 前4个参数与send()函数的参数相同
 * 参数dest_addr用于设置接收数据进程的地址
 * 参数addrlen用于设置接收数据进程的地址长度
 * 
 * 调用成功都返回0，否则返回-1，并设置errno
 */
ssize_t sendto(int sockfd, const void *buf, size_t len, int flags,
​           const struct sockaddr *dest_addr, socklen_t addrlen);
```

sendto()函数和 sendmsg()函数，这两个函数不但能发送数据给已连接的套接字，还可向未连接的套接字发送数据

若sendto()函数和sendmsg()函数向已连接的套接字中发送信息，则忽略参数dest_addr、addrlen和msg结构体中用于传递地址的成员，此时若参数dest_addr和addrlen不为NULL可能会返回错误EISCONN或0

## sendmsg

```cpp
/**
 * 参数msg用于传入目标进程的地址、地址的长度等信息。
 * 调用成功都返回0，否则返回-1，并设置errno
 */
ssize_t sendmsg(int sockfd, const struct msghdr *msg, int flags);
```

## recv

从已连接的套接字中接收信息

```cpp
/**
 * 参数
 *   sockfd：套接字文件描述符。
 *   buf：指向缓冲区的指针，用于存放接收的数据。
 *   len：缓冲区的大小。
 *   flags：修改接收行为的标志，如MSG_PEEK、MSG_WAITALL等。通常设为0。
 * 
 * 返回值：
 *   成功时返回接收到的字节数。
 *   返回0表示对方已关闭连接。
 *   返回-1表示出错，并设置errno。
 */
ssize_t recv(int sockfd, void *buf, size_t len, int flags);
```

flags：接收标志，用于控制接收行为，常见值包括：

- 0：默认行为
- MSG_PEEK：查看数据但不从接收队列中移除
- MSG_WAITALL：等待所有请求的数据到达
- MSG_DONTWAIT：非阻塞接收

参数列表与send()函数的参数列表形式相同，代表含义也基本对应，只是其参数sockfd表示发送信息的socket文件描述符。

recvfrom()函数和recvmsg()函数也可用于接收信息，两个函数的功能与sendto()、sendmsg()相对

## recvfrom

## recvmsg

## close

用于释放系统分配给套接字的资源，该函数即文件操作中常用于关闭文件的函数

```cpp
/**
 * 参数fd为文件描述符，当其用于scoket编程中时，需传入socket文件描述符。
 * 调用成功则返回0，否则返回-1，并设置errno。
 */
int close(int fd);
```

## socket通信流程

根据进程在网络通信中使用的协议，可将socket通信方式分为两种：一种是面向连接、基于TCP协议的通信；另一种是面向无连接、基于UDP协议的通信。

这两种通信方式的流程大致相同，区别在于面向连接的流程在通信前需要先与对方套接字进行绑定。

当使用面向连接的方式进行通信时

1. 服务器和客户机先各自创建socket文件，服务器端调用bind()函数绑定服务器端口地址；
2. 之后服务器端的socket通过接口listen()监听客户端；
3. 若客户端需要与服务器端进行交换，客户端会调用connect()函数，向已知的服务器地址端口发送连接请求，并阻塞等待服务器应答；
4. 服务器在收到客户端发来的connect()请求后，会调用accept()函数试图进行连接，若服务器端连接的进程数量未达到最大连接数，便成功建立连接，此后客户端解除阻塞，两端可正常进行通信，否则服务器忽略本次连接请求，继续监听客户端。
5. 最后当通信完成之后，双方各自调用close()函数，关闭socket文件，释放资源。

当使用面向无连接的方式进行通信时

1. 服务器和客户机同样先各自创建自己的socket文件，再由服务器端调用bind()函数绑定服务器端口地址。
2. 之后通信双方可直接开始通信，需要注意的是，因为服务器和客户机并未建立连接，所以客户端再向服务器发送数据时，需额外指定服务器的端口地址，同样的，若服务器需要向客户端发送数据，服务器也需额外指定客户端的端口地址。
3. 通信结束之后，通信双方同样需要调用close()函数，关闭socket文件，释放资源。

![](https://mouday.github.io/img/2025/08/27/ayu102h.png)

## TCP 示例


编写C/S模式的程序，分别创建服务器和客户端。客户端的功能是从终端获取一个字符串发送给服务器，然后接收服务器返回的字符串并打印；服务器的功能是从客户端发来的字符，将每个字符转换为大写再返回给客户端。案例实现如下。

服务器端程序
```cpp
// tcpserver.c

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <ctype.h>
#include <stdbool.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define MAXLINE 80       // 最大数据长度
#define SERVER_PORT 6666 // 服务器监听端口号

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

int main(void)
{
    struct sockaddr_in servaddr, cliaddr; // 定义服务器与客户端地址结构体
    socklen_t cliaddr_len;                // 客户端地址长度
    int listenfd, connfd;
    char buf[MAXLINE];
    char str[INET_ADDRSTRLEN];
    int i, n, ret;

    // 创建服务器端套接字文件
    listenfd = socket(AF_INET, SOCK_STREAM, 0);
    result_check(listenfd, "socket");

    // 初始化服务器端口地址
    bzero(&servaddr, sizeof(servaddr)); // 将服务器端口地址清零
    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servaddr.sin_port = htons(SERVER_PORT);
    // 将套接字文件与服务器端口地址绑定
    ret = bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    result_check(ret, "bind");

    // 监听，并设置最大连接数未20
    ret = listen(listenfd, 10);
    result_check(ret, "listen");

    // 接收客户端数据，并处理请求
    while (true)
    {
        // 接收客户端连接
        cliaddr_len = sizeof(cliaddr);
        connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &cliaddr_len);
        result_check(ret, "accept");

        // 打印客户端的地址与端口号
        const char *ip = inet_ntop(AF_INET, &cliaddr.sin_addr, str, sizeof(str));
        uint16_t port = ntohs(cliaddr.sin_port);
        printf("received from %s at PORT %d\n", ip, port);

        // 接收客户端发送的数据

        n = recv(connfd, buf, MAXLINE - 1, 0);
        if (n == 0)
        {
            printf("Server closed the connection\n");
            continue;
        }
        else if (n < 0)
        {
            perror("recv error");
            continue;
        }

        buf[n] = '\0';
        printf("received %d bytes: %s\n", n, buf);

        // 将小写字母转换为大写字母
        for (i = 0; i < n; i++)
            buf[i] = toupper(buf[i]);

        // 发送转换后的数据到客户端
        ret = send(connfd, buf, n, 0);
        result_check(ret, "send");

        // 关闭连接
        ret = close(connfd);
        result_check(ret, "close");
    }
    return 0;
}
```

客户端程序
```cpp
// tcpclient.c 

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define MAXLINE 80
#define SERVER_IP "127.0.0.1"
#define SERVER_PORT 6666

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

int main(int argc, char *argv[])
{
    struct sockaddr_in servaddr; // 定义服务器地址结构体
    char buf[MAXLINE];
    int sockfd, n, ret;
    char *str = "hello world";

    // 创建客户端套接字文件
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    result_check(sockfd, "socket");

    // 初始化服务器端口地址
    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    inet_pton(AF_INET, SERVER_IP, &servaddr.sin_addr);
    servaddr.sin_port = htons(SERVER_PORT);
    // 请求链接
    ret = connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    result_check(ret, "connect");

    // 发送数据
    ret = send(sockfd, str, strlen(str), 0);
    result_check(ret, "send");

    // 接收客户端返回的数据
    n = recv(sockfd, buf, MAXLINE, 0);
    result_check(n, "recv");

    // 将客户端返回的数据打印到终端
    buf[n] = '\0';
    printf("recv msg from server: %s, size: %d\n", buf, n);

    // 关闭连接
    ret = close(sockfd);
    result_check(ret, "close");

    return 0;
}
```

运行结果

```shell
% gcc tcpserver.c  -o tcpserver && ./tcpserver
success socket, ret: 3
success bind, ret: 0
success listen, ret: 0
success accept, ret: 0
received from 127.0.0.1 at PORT 59738
received 11 bytes: hello world
success send, ret: 11
success close, ret: 0
success accept, ret: 0
received from 127.0.0.1 at PORT 59739
received 11 bytes: hello world
success send, ret: 11
success close, ret: 0
```

客户端连接了2次

```shell
# 第一次
% gcc tcpclient.c  -o tcpclient && ./tcpclient
success socket, ret: 3
success connect, ret: 0
success send, ret: 11
success recv, ret: 11
recv msg from server: HELLO WORLD, size: 11
success close, ret: 0

# 第二次
% gcc tcpclient.c  -o tcpclient && ./tcpclient
success socket, ret: 3
success connect, ret: 0
success send, ret: 11
success recv, ret: 11
recv msg from server: HELLO WORLD, size: 11
success close, ret: 0
```
