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
