# 第三章 Golang 开发环境搭建

## 安装 VSCode

Linux 建议安装到 /opt 目录

Mac 查看ssh服务

```bash
$ sudo launchctl list | grep ssh
-	0	com.openssh.sshd
```

## 安装 Golang

以Mac 环境为例

下载地址：

- https://golang.org/dl/
- https://golang.google.cn/dl/

下载解压

```bash
wget https://golang.google.cn/dl/go1.9.2.darwin-amd64.tar.gz

tar -zxvf go1.9.2.darwin-amd64.tar.gz
```

添加至 PATH 环境变量

```bash
vim ~/.bash_profile

export PATH="$PATH:/usr/local/golang/1.9.2/bin"
```

执行生效
```bash
$ source ~/.bash_profile

$ go version
go version go1.9.2 darwin/amd64
```

代码测试

```go
// demo.go
package main

import "fmt"

func main(){
	fmt.Println("Hello Golang")
}
```

执行
```bash
$ go run demo.go
Hello Golang
```