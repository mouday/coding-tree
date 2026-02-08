# python socket 网络编程

## Echo示例

服务端

```python
"""
server.py
服务端
"""

import socket

def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('0.0.0.0', 8080))
        s.listen()
        conn, addr = s.accept()
        with conn:
            print('Connected by', addr)
            while True:
                data = conn.recv(1024)
                if not data:
                    break
                conn.sendall(data)


if __name__ == '__main__':
    main()
```

运行

```shell
$ python server.py
Connected by ('127.0.0.1', 65042)
```

使用netcat作为客户端来测试服务端代码

```shell
nc 127.0.0.1 8080
hello
hello
```

客户端

```python
"""
client.py
客户端
"""
import socket


def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect(('127.0.0.1', 8080))
        s.sendall(b"hello world")
        data = s.recv(1024)
        print(data)


if __name__ == '__main__':
    main()
```

运行

```shell
$ python server.py
Connected by ('127.0.0.1', 65042)

$ python client.py
b'hello world'
```

## 多线程处理并发问题

客户端不需要修改，修改服务端代码，增加多线程处理客户端请求

```python
"""
服务端
"""

import socket
import threading


def handle_client(client, addr):
    print('Connected by', addr)
    with client:
        while True:
            data = client.recv(1024)
            if not data:
                break
            client.sendall(data)


def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('0.0.0.0', 8080))
        s.listen()
        while True:
            client, addr = s.accept()
            print(dir(client))
            t = threading.Thread(target=handle_client, args=(client, addr))
            t.start()


if __name__ == '__main__':
    main()
```

现在可以同时处理多个客户端请求

```shell
# 客户端1
$ nc 127.0.0.1 8080
hello
hello


# 客户端2
$ nc 127.0.0.1 8080
hello
hello
```

## 实现简易HTTP服务

代码实现

```python
"""
服务端
"""

import socket


def handle_client(client, addr):
    print('Connected by', addr)
    with client:
        data = client.recv(1024)
        print(data.split(b"\r\n")[0].decode("utf-8"))
        client.sendall(b"HTTP/1.0 200 OK\r\nContent-Type: text/html\r\n\r\nhello")


def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('0.0.0.0', 8081))
        s.listen()
        while True:
            client, addr = s.accept()
            handle_client(client, addr)


if __name__ == '__main__':
    main()
```

访问

```shell
curl http://127.0.0.1:8081/
hello
```
