# C++网络编程

## 课程简介

- 介绍网络编程的基础知识，socket 的库函数
- 介绍网络通讯的原理
- I/O 服用的模型，select/poll/epoll/非阻塞 IO

## 文件描述符

存放每个进程打开的 fd: `/proc/进程id/fd`

进程 id 可以通过如下命令查找

```shell
ps -ef | grep demo.cpp
```

Linux 进程默认打开了 3 个文件描述符：

- 0-标准输入（键盘）cin
- 1-标准输出（显示器）cout
- 2-标准错误（显示器）cerr

示例：标准输入、输出、错误

```cpp
#include <iostream>

using namespace std;

int main(int argc, char const *argv[])
{
    int num;
    cin >> num;
    cout << "cout: " << num << endl;
    cerr << "cerr: " << num << endl;
    return 0;
}
```

接收一个输入，并输出两次

```shell
% g++ stdio_demo.cpp && ./a.out
100
cout: 100
cerr: 100
```

示例：关闭标准流

```cpp
#include <iostream>
#include <unistd.h>

using namespace std;

int main(int argc, char const *argv[])
{
    close(0); // stdin
    close(1); // stdout
    close(2); // stderr

    int num;
    cin >> num;
    cout << "cout: " << num << endl;
    cerr << "cerr: " << num << endl;
    return 0;
}
```

再次运行，没有任何输出

```shell
g++ stdio_demo.cpp && ./a.out
```

文件描述符分配规则：

找到最小的，没有被占用的文件描述符

结论：

- 对 Linux 来说，socket 操作与文件操作没有区别
- 在网络传输数据的过程中，可以使用文件的 I/O 函数
- 文件描述符是 Linux 分配给文件或者 socket 的整数

socket 的读写操作，可以替换为文件的读写操作

例如：

```cpp
// 文件读写
read(socket_fd, buffer, sizeof(buffer));
write(socket_fd, buffer, len);

// socket读写
recv(socket_fd, buffer, sizeof(buffer), 0);
send(socket_fd, buffer, len, 0);
```

查看可以打开的文件数

```shell
ulimit -a
```

## socket 使用方式

```cpp
// 服务端
socket 创建socket
bind 指定通信ip地址和端口
listen 监听
accept 接受客户端连接
recv/send 接收/发送数据
close 关闭连接

// 客户端
socket 创建socket
connect 向服务端发起连接请求
recv/send 接收/发送数据
close 关闭连接
```

服务端

```cpp
// server.c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <memory.h>
#include <assert.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

int main(int argc, char const *argv[])
{
    int ret = 0;

    // 1、创建socket
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    printf("socket ret: %d\n", server_fd);

    // 绑定前清理TIME_WAIT，查看：netstat -an | grep 8080
    int opt = 1;
    ret = setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    printf("setsockopt ret: %d\n", ret);

    // 2、绑定IP和端口
    struct sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    // 端口
    int listen_port = 8080;
    server_addr.sin_port = htons(listen_port);
    // IP
    char *listen_ip = "127.0.0.1";
    server_addr.sin_addr.s_addr = inet_addr(listen_ip);
    ret = bind(server_fd, (struct sockaddr *)&server_addr, sizeof(server_addr));
    printf("bind ret: %d\n", ret);
    assert(ret == 0);

    // 3、监听
    printf("listen ip: %s:%d\n", listen_ip, listen_port);
    ret = listen(server_fd, 1);
    printf("listen ret: %d\n", ret);

    // 4、接受客户端连接
    struct sockaddr_in client_addr;
    socklen_t client_addr_len = sizeof(client_addr);
    int client_fd = accept(server_fd, (struct sockaddr *)&client_addr, &client_addr_len);
    printf("accept ret: %d\n", client_fd);

    // 打印客户端IP和端口
    char ip[INET_ADDRSTRLEN];
    inet_ntop(AF_INET, &client_addr.sin_addr, ip, sizeof(ip));
    printf("client ip: %s:%d\n", ip, ntohs(client_addr.sin_port));

    // 5、接收数据
    char buf[1024];
    ssize_t n = recv(client_fd, buf, sizeof(buf) - 1, 0);
    printf("recv ret: %ld\n", n);
    buf[n] = '\0';
    printf("data: %s\n", buf);

    // 6、发送数据
    char *result = "hello client";
    ret = send(client_fd, result, strlen(result), 0);
    printf("send ret: %d\n", ret);

    // 7、关闭连接
    ret = close(client_fd);
    printf("close client_fd ret: %d\n", ret);
    ret = close(server_fd);
    printf("close server_fd ret: %d\n", ret);

    return 0;
}
```

客户端

```cpp
// client.c
#include <stdio.h>
#include <unistd.h>
#include <memory.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

int main(int argc, char const *argv[])
{
    int ret = 0;

    // 1、创建socket
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    printf("socket ret: %d\n", server_fd);

    // 2、连接服务端
    struct sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    // 端口
    int server_port = 8080;
    server_addr.sin_port = htons(server_port);
    // IP
    char *server_ip = "127.0.0.1";
    server_addr.sin_addr.s_addr = inet_addr(server_ip);
    printf("connect: %s:%d\n", server_ip, server_port);
    ret = connect(server_fd, (struct sockaddr *)&server_addr, sizeof(server_addr));
    printf("connect ret: %d\n", ret);

    // 3、发送数据
    char *data = "hello server";
    ret = send(server_fd, data, strlen(data), 0);
    printf("send ret: %d\n", ret);

    // 4、接收数据
    char buf[1024];
    ret = recv(server_fd, buf, sizeof(buf) - 1, 0);
    printf("recv ret: %d\n", ret);
    buf[ret] = '\0';
    printf("data: %s\n", buf);

    // 5、关闭连接
    ret = close(server_fd);
    printf("close ret: %d\n", ret);

    return 0;
}
```

```shell
# 服务端
% gcc server.c && ./a.out
socket ret: 3
setsockopt ret: 0
bind ret: 0
listen ip: 127.0.0.1:8080
listen ret: 0
accept ret: 4
client ip: 127.0.0.1:49469
recv ret: 12
data: hello server
send ret: 12
close client_fd ret: 0
close server_fd ret: 0

# 客户端
% gcc client.c && ./a.out
socket ret: 3
connect: 127.0.0.1:8080
connect ret: 0
send ret: 12
recv ret: 12
data: hello client
close ret: 0
```
