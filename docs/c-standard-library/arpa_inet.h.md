# arpa/inet.h

头文件

```cpp
#include <arpa/inet.h>
```

## 网络字节序

- 若将数据的高字节保存在内存的低地址，将数据的低字节保存在内存的高地址，这种存放方式称为`大端模式`；
- 若将数据的高字节保存在内存的高地址，将数据的低字节保存在内存的低地址，这种存放方式就称为`小端模式`。

TCP/IP协议规定，网络数据流应采用大端模式存储，即低地址存储高字节。

需要注意的是，若主机使用大端模式，这些函数不做转换，将参数原样返回，也就是说，只有主机使用小端模式时，参数的字节顺序才会被修改。

h代表主机host，n代表网络network，l代表32位长整型，s表示16位短整型

### htonl

```cpp
/**
 * 将参数hostlong从主机字节序转换为网络字节序
 */
uint32_t htonl(uint32_t hostlong);
```

### ntohl

```cpp
/**
 * 将参数netlong从网络字节序转换为主机字节序
 */
uint32_t ntohl(uint32_t netlong);
```

### htons

```cpp
uint16_t htons(uint16_t hostshort);
```

### ntohs

```cpp
uint16_t ntohs(uint16_t netshort);
```

## IP地址转换函数

常见的IP地址格式类似“192.168.10.1”，这是一个标准的IPv4格式的地址，但这种格式是为了方便用户对其进行操作，若要使计算机能够识别，需先将其转换为二进制格式

```cpp
int inet_aton(const char *cp, struct in_addr *inp);
in_addr_t inet_addr(const char *cp);
char *inet_ntoa(struct in_addr in);
```

以上函数只能处理IPv4的ip地址，且它们都是不可重入函数

### inet_pton

先将字符串src转换为af地址族中的网络地址结构，进而将转换后网络地址结构存储到参数dest所指的缓冲区中，其中参数af的值必须是AF_INET或AF_INET6。

```cpp
int inet_pton(int af, const char *src, void *dst);
```

### inet_ntop

会将af地址族中的网络地址结构arc转换为字符串，再将获得的地址字符串存储到参数dest所指的缓冲区中。

```cpp
const char *inet_ntop(int af, const void *src, char *dst, socklen_t size);
```

这两个函数不但能转换IPv4格式的地址in_addr，还能转换IPv6格式的地址in_addr6

以上两个函数需要转换IPv4和IPv6这两种形式的地址，因此用来传递地址的参数类型为void*。
