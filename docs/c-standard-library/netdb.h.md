# netdb.h

头文件

```cpp
#include <netdb.h>
```

## gethostbyname

```cpp
// 字符串pi地址转为结构体
struct hostent *gethostbyname(const char *);
```

结构体 `struct hostent`

```cpp
struct hostent {
    /* 主机名 */
    char    *h_name;    /* official name of host */
    /* 别名字符串数组 */
    char    **h_aliases;    /* alias list */
    /* 地址类型，例如：IPV4 为 AF_INET */
    int h_addrtype; /* host address type */
    /* IP地址长度，IPV4地址4，IPV6地址16 */
    int h_length;   /* length of address */
    /* 网络字节序存储的ip地址 */
    char    **h_addr_list;  /* list of addresses from name server */
    #define h_addr  h_addr_list[0]  /* address, for backward compatibility */
};
```

示例

```cpp
#include <stdio.h>
#include <netdb.h>

int main(int argc, char const *argv[])
{
    // 字符串pi地址转为结构体，失败返回nullptr
    struct hostent *host_net = gethostbyname("127.0.0.1");

    return 0;
}
```

完整使用示例

```cpp
#include <stdio.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <sys/socket.h>
#include <unistd.h>
#include <memory.h>

int main(int argc, char const *argv[])
{
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);

    // 配置网络信息
    struct sockaddr_in socket_address;
    memset(&socket_address, 0, sizeof(socket_address));
    // 协议族
    socket_address.sin_family = AF_INET;
    // 端口
    socket_address.sin_port = htons(6666);
    // 字符串pi地址转为结构体，失败返回nullptr
    struct hostent *host_net = gethostbyname("127.0.0.1");
    memcpy(&socket_address.sin_addr, host_net->h_addr, host_net->h_length);

    connect(server_fd, (struct sockaddr *)&socket_address, sizeof(socket_address));

    char *buf = "666";
    send(server_fd, buf, strlen(buf), 0);
    close(server_fd);
    return 0;
}
```
