# arpa/inet.h

头文件

```cpp
#include <arpa/inet.h>
```

## 网络字节序

- 若将数据的高字节保存在内存的低地址，将数据的低字节保存在内存的高地址，这种存放方式称为`大端模式`；
- 若将数据的高字节保存在内存的高地址，将数据的低字节保存在内存的低地址，这种存放方式就称为`小端模式`。

TCP/IP 协议规定，网络数据流应采用`大端模式`存储，即低地址存储高字节。

需要注意的是，若主机使用大端模式，这些函数不做转换，将参数原样返回，也就是说，只有主机使用小端模式时，参数的字节顺序才会被修改。

缩写：

- h 代表主机 host
- n 代表网络 network
- l 代表 long（4 字节，32 位长整型）
- s 表示 short（2 字节，16 位短整型）

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

## IP 地址转换函数

常见的 IP 地址格式类似“192.168.10.1”，这是一个标准的 IPv4 格式的地址，但这种格式是为了方便用户对其进行操作，若要使计算机能够识别，需先将其转换为二进制格式

```cpp
in_addr_t inet_addr(const char *cp);

int inet_aton(const char *cp, struct in_addr *inp);

char *inet_ntoa(struct in_addr in);
```

以上函数只能处理 IPv4 的 ip 地址，且它们都是不可重入函数

### inet_addr

声明

```cpp
in_addr_t inet_addr(const char *cp);
```

示例

```cpp
#include <stdio.h>
#include <arpa/inet.h>

int main(int argc, char const *argv[])
{
    in_addr_t in_addr = inet_addr("127.0.0.1");
    printf("in_addr: %d\n", in_addr);
    return 0;
}
```

输出结果

```shell
in_addr: 16777343
```

### inet_pton

先将字符串 src 转换为 af 地址族中的网络地址结构，进而将转换后网络地址结构存储到参数 dest 所指的缓冲区中，其中参数 af 的值必须是 AF_INET 或 AF_INET6。

```cpp
int inet_pton(int af, const char *src, void *dst);
```

### inet_ntop

会将 af 地址族中的网络地址结构 arc 转换为字符串，再将获得的地址字符串存储到参数 dest 所指的缓冲区中。

```cpp
const char *inet_ntop(int af, const void *src, char *dst, socklen_t size);
```

这两个函数不但能转换 IPv4 格式的地址 in_addr，还能转换 IPv6 格式的地址 in_addr6

以上两个函数需要转换 IPv4 和 IPv6 这两种形式的地址，因此用来传递地址的参数类型为 void\*。

示例

```cpp
#include <stdio.h>
#include <arpa/inet.h>

int main(int argc, char const *argv[])
{
    // 将ip字符串转为网络地址结构
    int ret;
    struct in_addr sin_addr;
    ret = inet_pton(AF_INET, "127.0.0.1", &sin_addr);
    printf("ret: %d\n", ret);
    printf("sin_addr.s_addr: %d\n", sin_addr.s_addr);

    // 网络地址结构arc转换为字符串
    char str[INET_ADDRSTRLEN];
    const char *ip = inet_ntop(AF_INET, &sin_addr, str, sizeof(str));

    printf("str: %s\n", str);
    printf("ip: %s\n", ip);
    printf("ip == str: %s\n", ip == str ? "true": "false");

    return 0;
}
```

运行结果

```shell
ret: 1
sin_addr.s_addr: 16777343

str: 127.0.0.1
ip: 127.0.0.1
ip == str: true
```
