# netinet/in.h

头文件

```cpp
#include <netinet/in.h>
```

地址结构体

- IPv4 地址用结构体`sockaddr_in`表示，该结构体中包含 16 位的端口号和 32 位的 IP 地址；
- IPv6 地址用结构体`sockaddr_in6`表示，该结构体中包含 16 位的端口号、128 位的 IP 地址和一些控制字段；
- Unix Domain Socket 的地址格式定义在 sys/un.h 中，用结构体`sock_addr_un`表示。

```cpp
struct sockaddr {
    __uint8_t       sa_len;         /* total length */
    sa_family_t     sa_family;      /* [XSI] address family */
    char            sa_data[14];    /* [XSI] addr value */
};

struct sockaddr_in {
    __uint8_t       sin_len;
    sa_family_t     sin_family;  // 协议族，同socket函数第一个参数，一般填 AF_INET
    in_port_t       sin_port;    // 2字节的端口
    struct in_addr  sin_addr;    // 4字节的ip地址
    char            sin_zero[8]; // 长度填充
};

// IP地址结构体
struct in_addr {
    in_addr_t s_addr;  // 4字节的ip地址
};
```

使用示例

```cpp
// htons转为网络字节序
sin_port=hton(6632)
```

IP地址赋值

```cpp
// 1、监听所有端口
servaddr.sin_addr.s_addr = htonl(INADDR_ANY);

// 2、监听指定端口
// 方式1，使用inet_addr 
// 只能用字符串格式的IP
servaddr.sin_addr.s_addr = inet_addr("127.0.0.1");

// 方式2，使用gethostbyname
// 支持：域名/主机名/字符串格式的IP
#include <netdb.h>
struct hostent *host_net = gethostbyname("127.0.0.1");
memcpy(&socket_address.sin_addr, host_net->h_addr, host_net->h_length);

```

各种 socket 地址结构体的开头都是相同的，前 16 位表示整个结构体的长度（并不是所有 UNIX 的实现都有长度字段，如 Linux 就没有），后 16 位表示地址类型。

IPv4、IPv6 和 Unix Domain Socket 的地址类型分别定义为常数：

- AF_INET
- AF_INET6
- AF_UNIX

这样，只要取得某种 sockaddr 结构体的首地址，不需要知道具体是哪种类型的 sockaddr 结构体，就可以根据地址类型字段确定结构体中的内容。

也因此，socket API 可以接受各种类型的 sockaddr 结构体指针做参数，例如 bind()、accept()、connect()等函数，这些函数的参数应该设计成`void *`类型以便接收各种类型的指针，但是 sock API 的实现早于 ANSI C 标准化，那时还没有`void *`类型，因此这些函数的参数都用`struct sockaddr *`类型表示，在传递参数之前要强制类型转换一下，例如：

```cpp
#include <netinet/in.h>

struct sockaddr_in servaddr;
bind(listen_fd, (struct sockaddr *)&servaddr, sizeof(servaddr));
```
