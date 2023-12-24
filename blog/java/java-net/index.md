# Java 网络多线程专题-韩顺平

包括 TCP UDP Socket编程 多线程 并发处理 文件传输 新闻推送 游戏 io 线程 网络 等内容

相关Java包：java.net

## 1、网络相关概念

网络：两台或多台设备通过一定物理设备连接起来构成网络

网络分类：局域网（机房）、城域网（城市）、广域网（万维网）

网络通信：将数据通过网络从一台设备传输到另一台设备

## 2、IP地址

IP地址：用于唯一标识网络中的每台计算机/主机

查看IP地址：

- windows: ipconfig
- linux/macos: ifconfig

IPV4：4个字节（32位）表示：

```
0-255.0-255.0-255.0-255
```

备注：1个字节=8个位（一个字节的取值范围：0-255）

IP地址的组成：网络地址+主机地址

例如：192.168.10.1

IPV4地址分类

```
A类  0      网络号7      主机号24  1字节网络号 + 3字节主机号 0.0.0.0 ~ 127.255.255.255
B类  10     网络号14     主机号16  2字节网络号 + 2字节主机号 128.0.0.0 ~ 191.255.255.255
C类  110    网络号21     主机号8   3字节网络号 + 1字节主机号 192.0.0.0 ~ 223.255.255.255
D类  1110   多播组号28                                   224.0.0.0 ~ 239.255.255.255
E类  11110  留用27                                      140.0.0.0 ~ 247.255.255.255
```

特殊：127.0.0.1 表示本机地址


IPV6：16个字节（128位）

IPv6有3种表示方法

1、冒分十六进制表示法

每2个字节用冒号分隔

```
ABCD:EF01:2345:6789:ABCD:EF01:2345:6789
```

2、0位压缩表示法

可以把连续的一段0压缩为“::”

```
FF01:0:0:0:0:0:0:1101 → FF01::1101
```

3、内嵌IPv4地址表示法

前96b采用冒分十六进制表示，而最后32b地址则使用IPv4的点分十进制表示

```
::192.168.0.1
::FFFF:192.168.0.1
```

## 3、域名和端口号

域名：将IP地址映射成域名

端口号：用于标识计算机上某个特定的网络程序

表示形式：整数形式

范围：0~65535（2个字节）0~2^16-1

不建议使用：0~1024端口

常见端口：

- ssh 22 
- ftp 21 
- smtp 25
- http 80
- https 443
- tomcat 8080
- mysql 3306
- oracle 1521
- sqlserver 1433

## 4、网络通信协议

TCP/IP协议

TCP/IP（Transmission Control Protocol/Internet Protocol，传输控制协议/网际协议）是指能够在多个不同网络间实现信息传输的协议簇

OSI模型：应用层 表示层 会话层 传输层 网络层 数据链路层 物理层

TCP/IP模型：

- 应用层 HTTP、FTP、Telnet、DNS
- 传输层 TCP、UDP 
- 网络层 IP、ICMP、ARP
- 物理+数据链路层

## 5、TCP和UDP

1、TCP协议

可靠、效率低

传输完毕，需要释放资源

三次握手

- Client SYN seq=x
- Server SYN-ACK ack=x+1 seq=y
- Client ACK ack=y+1 seq=x+1

2、UDP协议

不可靠、速度快

每个数据包大小限制：64k

传输完毕，无需释放资源


## InetAddress

示例

```java
package io.github.mouday.javanet;

import java.net.InetAddress;
import java.net.UnknownHostException;

public class JavaNet {
    public static void main(String[] args) throws UnknownHostException {
        // 获取本机地址
        InetAddress localHost1 = InetAddress.getLocalHost();
        System.out.println(localHost1);
        // MacBook-Pro.local/192.168.0.105

        // 获取回环地址
        InetAddress localHost2 = InetAddress.getLoopbackAddress();
        System.out.println(localHost2);
        // localhost/127.0.0.1

        // 根据主机名获取 InetAddress
        InetAddress localHost3 = InetAddress.getByName("www.baidu.com");
        System.out.println(localHost3);
        // www.baidu.com/39.156.66.18

        // 获取主机名
        String hostName = localHost3.getHostName();
        System.out.println(hostName);
        // www.baidu.com

        // 获取主机地址
        String hostAddress = localHost3.getHostAddress();
        System.out.println(hostAddress);
        // 39.156.66.18

    }
}
```

https://www.bilibili.com/video/BV1j54y1b7qv/?p=5&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da