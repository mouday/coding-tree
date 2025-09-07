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

```cpp
ssize_t recvfrom(int sockfd, void *buf, size_t len, int flags, 
    struct sockaddr *dest_addr, socklen_t *addrlen);
```

## recvmsg

```cpp
ssize_t recvmsg(int sockfd, struct msghdr *msg, int flags);
```

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

## UDP 示例

在创建socket时，若将socket()函数中的参数type设置为SOCK_DGRAM，程序将采用UDP传输协议，以数据包的形式传输数据。

编写C/S模式的程序，分别创建服务器和客户端。客户端的功能是从终端获取一个字符串发送给服务器，然后接收服务器返回的字符串并打印；服务器的功能是从客户端发来的字符，将每个字符转换为大写再返回给客户端。

服务器端

```cpp
// udpserver.c
#include <string.h>
#include <netinet/in.h>
#include <stdio.h>
#include <unistd.h>
#include <strings.h>
#include <arpa/inet.h>
#include <ctype.h>

#define MAXLINE 80     // 最大连接数
#define SERV_PORT 6666 // 服务器端口号

int main(void)
{
    struct sockaddr_in servaddr, cliaddr; // 定义服务器与客户端地址结构体
    socklen_t cliaddr_len;                // 客户端地址长度
    int sockfd;                           // 服务器socket文件描述符
    char buf[MAXLINE];
    char str[INET_ADDRSTRLEN];
    int i, n;

    // 创建服务器端套接字文件
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);

    // 初始化服务器端口地址
    bzero(&servaddr, sizeof(servaddr)); // 地址结构体清零
    servaddr.sin_family = AF_INET;      // 指定协议族
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servaddr.sin_port = htons(SERV_PORT); // 指定端口号

    // 绑定服务器端口地址
    bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    printf("Accepting connections ...\n");

    // 数据传输
    while (1)
    {
        cliaddr_len = sizeof(cliaddr);
        // 接收数据
        n = recvfrom(sockfd, buf, MAXLINE, 0,
                     (struct sockaddr *)&cliaddr, &cliaddr_len);

        if (n == -1)
        {
            perror("recvfrom error");
        }

        const char *pi = inet_ntop(AF_INET, &cliaddr.sin_addr, str, sizeof(str));
        printf("received from %s at PORT %d\n", pi, ntohs(cliaddr.sin_port));

        // 服务器端操作，小写转大写
        for (i = 0; i < n; i++)
            buf[i] = toupper(buf[i]);

        n = sendto(sockfd, buf, n, 0,
                   (struct sockaddr *)&cliaddr, sizeof(cliaddr));

        if (n == -1)
            perror("sendto error");
    }

    close(sockfd);

    return 0;
}
```

客户端

```cpp
// udpclient.c
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <strings.h>
#include <ctype.h>

#define MAXLINE 80
#define SERV_PORT 6666

int main(int argc, char *argv[])
{
    struct sockaddr_in servaddr;
    int sockfd, n;
    char buf[MAXLINE];

    sockfd = socket(AF_INET, SOCK_DGRAM, 0);

    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    inet_pton(AF_INET, "127.0.0.1", &servaddr.sin_addr);
    servaddr.sin_port = htons(SERV_PORT);

    // 发送数据到客户端
    while (fgets(buf, MAXLINE, stdin) != NULL)
    {
        n = sendto(sockfd, buf, strlen(buf), 0,
                   (struct sockaddr *)&servaddr, sizeof(servaddr));

        if (n == -1)
            perror("sendto error");

        // 接收客户端返回的数据
        n = recvfrom(sockfd, buf, MAXLINE, 0, NULL, 0);
        if (n == -1)
            perror("recvfrom error");
        
        buf[n] = '\0';

        // 将接收到的数据打印到终端
        printf("%s\n", buf);
    }
    close(sockfd);

    return 0;
}
```

运行结果

编译以上两端代码，打开两个终端窗口，先执行服务器端程序，再执行客户端程序，同时输入需要转换的字符串，服务器端和客户端对应的终端中分别打印如下信息：

```shell
# 服务端
$ gcc udpserver.c  -o udpserver && ./udpserver
Accepting connections ...
received from 127.0.0.1 at PORT 58396
received from 127.0.0.1 at PORT 58396

# 客户端
$ gcc udpclient.c  -o udpclient && ./udpclient
hello
HELLO

hi
HI
```

## socket本地通信

socket原本是为网络通讯设计的，但后来在socket框架的基础上发展出了一种IPC（进程通信）机制，即UNIX Domain Socket，专门用来实现使用socket实现的本地进程通信。其实socket原本便能实现本地通信功能，但使用Domain机制时，数据不需要再通过网络协议族，也无需进行拆包、计算校验和以及应答等网络通讯中涉及的一系列操作，只需将应用层的数据从本地的一个进程拷贝到另一个进程，因此相对借助网络通信机制实现的socket本地通信来说，Domain本地通信的效率和数据的正确性都得到了提升。

domain参数指定协议族，对于本地套接字来说，其值须被置为枚举值AF_UNIX；type参数指定套接字类型，本地套接字通信中的套接字类型仍可被设置为表示流式套接字通信的SOCK_STREAM，或表示数据报式套接字通信的SOCK_DGRAM；protocol参数指定具体协议，通常被设置为0；其返回值为生成的套接字描述符。

根据socket()函数中参数type的类型，本地通信的方式也分为面向连接和面向非连接这两种。当使用SOCK_STREAM作为type参数的值时，本地通信的流程与使用的接口与基于TCP协议的网络通信模型相同，其大致流程如下：

（1）调用socket()函数通信双方进程创建各自的socket文件；

（2）定义并初始化服务器端进程的地址，并使用bind()函数将其与服务器端进程绑定；

（3）调用listen()函数监听客户端进程请求；

（4）客户端调用connect()函数，根据已明确的客户端进程地址，向服务器发送请求；

（5）服务器端调用accept()函数，处理客户端进程的请求，若客户端与服务器端进程成功建立连接，则双方进程可开始通信；

（6）通信双方以数据流的形式通过已创建的连接互相发送和接收数据，进行通信；

（7）待通信结束后，通信双方各自调用close()函数关闭连接。

与socket网络通信不同的是，在本地通信中用到的套接字的结构体类型为socket sockaddr_un。

值得一提的是，使用数据报实现socket本地通信的双方在理论上虽仍有可能出现信息丢失、数据包次序错乱等问题，但由于其不必再经过多层复杂的协议，这种情况出现的概率相对网络中的数据报通信要低的多。

此外，基于数据流的本地套接字通信连接时间非常短，且通信双方在建立连接后可直接交互数据，因此在socket本地通信中，基于数据报的本地套接字应用场合相对少的多。本节将以基于流的本地套接字通信为例，来展示socket本地通信的实现方法。

服务端

```cpp
// dmserver.c
#include <stdlib.h>
#include <stdio.h>
#include <stddef.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <errno.h>
#include <strings.h>
#include <ctype.h>

#define QLEN 10

// 创建服务器进程，成功返回0，出错返回小于0的errno
int serv_listen(const char *name)
{
    int fd, len, err, rval;
    struct sockaddr_un un;

    // 创建本地domain套接字
    if ((fd = socket(AF_UNIX, SOCK_STREAM, 0)) < 0)
        return (-1);

    // 删除套接字文件，避免因文件存在导致bind()绑定失败
    unlink(name);
    // 初始化套接字结构体地址
    memset(&un, 0, sizeof(un));
    un.sun_family = AF_UNIX;
    strcpy(un.sun_path, name);
    len = offsetof(struct sockaddr_un, sun_path) + strlen(name);
    if (bind(fd, (struct sockaddr *)&un, len) < 0)
    {
        rval = -2;
        goto errout;
    }

    if (listen(fd, QLEN) < 0)
    {
        // 告知内核这是一个服务器进程
        rval = -3;
        goto errout;
    }

    return (fd);

errout:
    err = errno;
    close(fd);
    errno = err;
    return (rval);
}

int serv_accept(int listenfd, uid_t *uidptr)
{
    int clifd, err, rval;
    struct sockaddr_un un;
    socklen_t len; 
    struct stat statbuf;

    len = sizeof(un);
    if ((clifd = accept(listenfd, (struct sockaddr *)&un, &len)) < 0)
        return (-1);

    // 从调用地址获取客户端的uid
    len -= offsetof(struct sockaddr_un, sun_path); // 获取路径名长度
    un.sun_path[len] = 0;                          // 为路径名字符串添加终止符
    if (stat(un.sun_path, &statbuf) < 0)
    {
        rval = -2;
        goto errout;
    }

    if (S_ISSOCK(statbuf.st_mode) == 0)
    {
        rval = -3; // 若返回值为-3，说明这不是一个socket文件
        goto errout;
    }

    if (uidptr != NULL)
        *uidptr = statbuf.st_uid; // 返回uid的调用者指针

    // 到此成功获取路径名
    unlink(un.sun_path);
    return (clifd);
errout:
    err = errno;
    close(clifd);
    errno = err;
    return (rval);
}

int main(void)
{
    int lfd, cfd, n, i;
    uid_t cuid;
    char buf[1024];

    lfd = serv_listen("foo.socket");
    if (lfd < 0)
    {
        switch (lfd)
        {
        case -3:
            perror("listen");
            break;
        case -2:
            perror("bind");
            break;
        case -1:
            perror("socket");
            break;
        }
        exit(-1);
    }

    cfd = serv_accept(lfd, &cuid);
    if (cfd < 0)
    {
        switch (cfd)
        {
        case -3:
            perror("not a socket");
            break;
        case -2:
            perror("a bad filename");
            break;
        case -1:
            perror("accept");
            break;
        }
        exit(-1);
    }

    while (1)
    {
    r_again:
        n = read(cfd, buf, 1024);
        if (n == -1)
        {
            if (errno == EINTR)
                goto r_again;
        }
        else if (n == 0)
        {
            printf("the other side has been closed.\n");
            break;
        }
        for (i = 0; i < n; i++)
            buf[i] = toupper(buf[i]);
        write(cfd, buf, n);
    }
    close(cfd);
    close(lfd);
    return 0;
}
```
```cpp
// dmclient.c
#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <errno.h>
#include <strings.h>

#define CLI_PATH "/var/tmp/" /* +5 for pid = 14 chars */

// 创建客户端进程，成功返回0，出错返回小于0的errno
int cli_conn(const char *name)
{
    int fd, len, err, rval;
    struct sockaddr_un un;

    // 创建本地套接字domain
    if ((fd = socket(AF_UNIX, SOCK_STREAM, 0)) < 0)
        return (-1);

    // 使用自定义地址填充socket地址结构体
    memset(&un, 0, sizeof(un));
    un.sun_family = AF_UNIX;
    sprintf(un.sun_path, "%s%05d", CLI_PATH, getpid());
    len = offsetof(struct sockaddr_un, sun_path) + strlen(un.sun_path);
    unlink(un.sun_path); // 避免因文件已存在导致的bind()失败
    if (bind(fd, (struct sockaddr *)&un, len) < 0)
    {
        rval = -2;
        goto errout;
    }

    // 使用服务器进程地址填充socket地址结构体
    memset(&un, 0, sizeof(un));
    un.sun_family = AF_UNIX;
    strcpy(un.sun_path, name);
    len = offsetof(struct sockaddr_un, sun_path) + strlen(name);
    if (connect(fd, (struct sockaddr *)&un, len) < 0)
    {
        rval = -4;
        goto errout;
    }
    return (fd);
errout:
    err = errno;
    close(fd);
    errno = err;
    return (rval);
}

int main(void)
{
    int fd, n;
    char buf[1024];

    fd = cli_conn("foo.socket"); // 套接字文件为foo.socket
    if (fd < 0)
    { // 容错处理
        switch (fd)
        {
        case -4:
            perror("connect");
            break;
        case -3:
            perror("listen");
            break;
        case -2:
            perror("bind");
            break;
        case -1:
            perror("socket");
            break;
        }
        exit(-1);
    }

    while (fgets(buf, sizeof(buf), stdin) != NULL)
    {
        write(fd, buf, strlen(buf));
        n = read(fd, buf, sizeof(buf));
        write(STDOUT_FILENO, buf, n);
    }
    close(fd);

    return 0;
}
```

运行结果

```shell
# 服务端
gcc dmserver.c  -o dmserver && ./dmserver

# 客户端
% gcc dmclient.c  -o dmclient && ./dmclient
hi
HI
hello
HELLO
```

## 多进程并发服务器

在多进程并发服务器中，若有用户请求到达，服务器将会调用fork()函数，创建一个子进程，之后父进程将继续调用accept()，而子进程则去处理用户请求。下面将通过案例来展示使用多进程并发服务器实现网络通信的方法，并结合案例，对多进程并发服务器进行分析。

案例1：搭建多进程并发服务器，使服务器端可接收多个客户端的数据，并将接收到的数据转为大写，写回客户端；使客户端可向服务器发送数据，并将服务器返回的数据打印到终端。

案例实现如下：

服务器

```cpp
// fserver.c
#include <arpa/inet.h>
#include <signal.h>
#include <ctype.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <strings.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <sys/socket.h>

#define MAXLINE 80
#define SERV_PORT 8000

// 子进程回收函数
void do_sigchild(int num)
{
    while (waitpid(0, NULL, WNOHANG) > 0)
        ;
}

int main()
{
    struct sockaddr_in servaddr, cliaddr;
    socklen_t cliaddr_len;
    int listenfd, connfd;
    char buf[MAXLINE];
    char str[INET_ADDRSTRLEN];
    int i, n;
    pid_t pid;
    struct sigaction newact;

    newact.sa_handler = do_sigchild;
    sigaction(SIGCHLD, &newact, NULL); // 信号捕获与处理（回收子进程）

    listenfd = socket(AF_INET, SOCK_STREAM, 0);

    // 设置服务器端口地址
    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servaddr.sin_port = htons(SERV_PORT);
    // 使服务器与端口绑定
    bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    listen(listenfd, 20);
    printf("Accepting connections ...\n");

    while (1)
    {
        cliaddr_len = sizeof(cliaddr);
        connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &cliaddr_len);
        pid = fork(); // 创建子进程
        if (pid == 0)
        {
            // 子进程处理客户端请求
            close(listenfd);
            while (1)
            {
                n = read(connfd, buf, MAXLINE);
                if (n == 0)
                {
                    printf("the other side has been closed.\n");
                    break;
                }
                // 打印客户端端口信息
                const char *ip = inet_ntop(AF_INET, &cliaddr.sin_addr, str, sizeof(str));
                printf("received from %s at PORT %d\n", ip, ntohs(cliaddr.sin_port));

                for (i = 0; i < n; i++)
                    buf[i] = toupper(buf[i]);

                write(connfd, buf, n);
            }
            close(connfd);
            return 0;
        }
        else if (pid > 0)
        {
            close(connfd);
        }
        else
            perror("fork");
            exit(EXIT_FAILURE);
    }
    close(listenfd);
    return 0;
}
```

客户端

```cpp
// fclient.c
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <netinet/in.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <strings.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>

#define MAXLINE 80
#define SERV_PORT 8000

int main()
{
    struct sockaddr_in servaddr;
    char buf[MAXLINE];
    int sockfd, n;

    sockfd = socket(AF_INET, SOCK_STREAM, 0);

    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    inet_pton(AF_INET, "127.0.0.1", &servaddr.sin_addr);
    servaddr.sin_port = htons(SERV_PORT);
    connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr));

    while (fgets(buf, MAXLINE, stdin) != NULL)
    {
        write(sockfd, buf, strlen(buf));
        n = read(sockfd, buf, MAXLINE);
        if (n == 0)
            printf("the other side has been closed.\n");
        else
            write(STDOUT_FILENO, buf, n);
    }
    close(sockfd);
    return 0;
}
```

运行结果

```shell
# 服务器
% gcc fserver.c  -o fserver  && ./fserver
Accepting connections ...
received from 127.0.0.1 at PORT 59814
received from 127.0.0.1 at PORT 59814
received from 127.0.0.1 at PORT 59814

# 客户端
% gcc fclient.c  -o fclient  && ./fclient
he
HE
hi
HI
```

## 多线程并发服务器

考虑到每个进程可打开的文件描述符数量有限，且进程占用资源较多，系统中进程的数量又受到内存大小的限制，为在保证服务器效率的前提下，降低服务器的消耗，可利用多线程机制搭建并发服务器。

多线程并发服务器与多进程并发服务器类似，不同的是，当有请求到达时，服务器进程会创建一个子线程，并使子线程处理客户端请求。

下面通过一个案例，来展示使用多线程并发服务器实现网络通信的方法。

案例2：搭建多线程并发服务器，使服务器端可接收多个客户端的数据，并将接收到的数据转为大写，写回客户端；使客户端可向服务器发送数据，并将服务器返回的数据打印到终端。

案例实现如下：

服务器

```cpp
// pserver.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <ctype.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <pthread.h>

#define MAXLINE 80
#define SERV_PORT 8000

void throw_error(int ret, const char *msg)
{
    if (ret == -1)
    {
        printf("error: %s\n", msg);
        perror(msg);
        exit(EXIT_FAILURE);
    }
    else
    {
        printf("success: %s\n", msg);
    }
}

struct s_info
{
    struct sockaddr_in cliaddr;
    int connfd;
};

// 请求处理函数
void *do_work(void *arg)
{
    int n, i, ret;
    struct s_info *ts = (struct s_info *)arg;
    char buf[MAXLINE];
    char str[INET_ADDRSTRLEN];

    // 使子线程处于分离态，保证子线程资源可被回收
    pthread_detach(pthread_self());

    while (1)
    {
        n = read(ts->connfd, buf, MAXLINE);
        throw_error(n, "read");

        if (n == 0)
        {
            printf("the other side has been closed.\n");
            break;
        }

        printf("received from %s at PORT %d\n",
               inet_ntop(AF_INET, &(*ts).cliaddr.sin_addr, str, sizeof(str)),
               ntohs((*ts).cliaddr.sin_port));

        for (i = 0; i < n; i++)
            buf[i] = toupper(buf[i]);

        ret = write(ts->connfd, buf, n);
        throw_error(ret, "write");
    }
    ret = close(ts->connfd);
    throw_error(ret, "close");

    return NULL;
}

int main(void)
{
    struct sockaddr_in servaddr, cliaddr;
    socklen_t cliaddr_len;
    int listenfd, connfd, ret;
    int i = 0;
    pthread_t tid;
    struct s_info ts[383];
    char str[INET_ADDRSTRLEN];

    listenfd = socket(AF_INET, SOCK_STREAM, 0);
    throw_error(listenfd, "socket");

    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servaddr.sin_port = htons(SERV_PORT);
    ret = bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    throw_error(ret, "bind");

    ret = listen(listenfd, 20);
    throw_error(ret, "listen");

    printf("Accepting connections ...\n");

    while (1)
    {
        cliaddr_len = sizeof(cliaddr);
        connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &cliaddr_len);
        throw_error(connfd, "accept");

        const char *ip = inet_ntop(AF_INET, &cliaddr.sin_addr, str, sizeof(str));
        printf("received from %s at PORT %d\n", ip, ntohs(cliaddr.sin_port));

        ts[i].cliaddr = cliaddr;
        ts[i].connfd = connfd;
        // 创建子线程，处理客户端请求
        pthread_create(&tid, NULL, do_work, (void *)&ts[i]);
        i++;
    }
    return 0;
}
```

客户端

```cpp
// pclient.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define MAXLINE 80
#define SERV_PORT 8000

void throw_error(int err, const char *msg)
{
    if (err == -1)
    {
        printf("error: %s\n", msg);
        perror(msg);
        exit(EXIT_FAILURE);
    }
    else
    {
        printf("success: %s\n", msg);
    }
}

int main(int argc, char *argv[])
{
    struct sockaddr_in servaddr;
    char buf[MAXLINE];
    int sockfd, n, ret;

    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    throw_error(sockfd, "socket");

    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    inet_pton(AF_INET, "127.0.0.1", &servaddr.sin_addr);
    servaddr.sin_port = htons(SERV_PORT);
    ret = connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    throw_error(ret, "connect");

    while (fgets(buf, MAXLINE, stdin) != NULL)
    {
        ret = write(sockfd, buf, strlen(buf));
        throw_error(ret, "write");

        n = read(sockfd, buf, MAXLINE);
        throw_error(n, "read");

        if (n == 0)
            printf("the other side has been closed.\n");
        else
            write(STDOUT_FILENO, buf, n);
    }

    close(sockfd);
    throw_error(0, "close");

    return 0;
}
```

运行结果

```shell
# 服务端
% gcc pserver.c  -o pserver  && ./pserver
success: socket
success: bind
success: listen
Accepting connections ...
success: accept
received from 127.0.0.1 at PORT 64509
success: read
received from 127.0.0.1 at PORT 64509
success: write
success: read
received from 127.0.0.1 at PORT 64509
success: write

#  客户端
% gcc pclient.c -o pclient  && ./pclient
success: socket
success: connect
hi
success: write
success: read
HI
hello
success: write
success: read
HELLO
```

## 多路I/O转接服务器

- [sys/select.h](sys_select.h.md)
- [poll.h](poll.h.md)
- [sys/epoll.h](sys_epoll.h.md)
