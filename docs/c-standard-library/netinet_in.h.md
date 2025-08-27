# netinet/in.h

地址结构体

- IPv4地址用结构体`sockaddr_in`表示，该结构体中包含16位的端口号和32位的IP地址；
- IPv6地址用结构体`sockaddr_in6`表示，该结构体中包含16位的端口号、128位的IP地址和一些控制字段；
- Unix Domain Socket的地址格式定义在sys/un.h中，用结构体`sock_addr_un`表示。

```cpp
struct sockaddr {
    __uint8_t       sa_len;         /* total length */
    sa_family_t     sa_family;      /* [XSI] address family */
    char            sa_data[14];    /* [XSI] addr value */
};

struct sockaddr_in {
    __uint8_t       sin_len;
    sa_family_t     sin_family;
    in_port_t       sin_port;
    struct  in_addr sin_addr;
    char            sin_zero[8];
};

struct in_addr {
    in_addr_t s_addr;
};
```

各种socket地址结构体的开头都是相同的，前16位表示整个结构体的长度（并不是所有UNIX的实现都有长度字段，如Linux就没有），后16位表示地址类型。

IPv4、IPv6和Unix Domain Socket的地址类型分别定义为常数AF_INET、AF_INET6、AF_UNIX。

这样，只要取得某种sockaddr结构体的首地址，不需要知道具体是哪种类型的sockaddr结构体，就可以根据地址类型字段确定结构体中的内容。

也因此，socket API可以接受各种类型的sockaddr结构体指针做参数，例如bind()、accept()、connect()等函数，这些函数的参数应该设计成`void *`类型以便接收各种类型的指针，但是sock API的实现早于ANSI C标准化，那时还没有`void *`类型，因此这些函数的参数都用`struct sockaddr *`类型表示，在传递参数之前要强制类型转换一下，例如：

```cpp
struct sockaddr_in servaddr;
bind(listen_fd, (struct sockaddr *)&servaddr, sizeof(servaddr));
```
