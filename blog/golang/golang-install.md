# 第三章 Golang 开发环境搭建

## 安装 VSCode

Linux 建议安装到 /opt 目录

Mac 查看 ssh 服务

```bash
$ sudo launchctl list | grep ssh
-	0	com.openssh.sshd
```

## 安装 Golang

SDK：Software Development Kit 软件开发工具包

下载地址：

- https://golang.org/dl/
- https://golang.google.cn/dl/

系统对应版本

| 操作系统 | 32 位系统| 64 位系统 | 图形化安装包  |
| - | -| - | - |
| Mac  | -  | darwin-amd64.tar.gz  | darwin-amd64.pkg |
| Unix     | freebsd-386.tar.gz | freebsd-amd64.tar.gz | -                |
| Linux    | linux-386.tar.gz   | linux-amd64.tar.gz   | - |
| Windows  | windows-386.zip    | windows-amd64.zip    | windows-386.msi/windows-amd64.msi |

下载解压

```bash
wget https://golang.google.cn/dl/go1.9.2.darwin-amd64.tar.gz

tar -zxvf go1.9.2.darwin-amd64.tar.gz
```

> 建议：安装目录不要包含中文或者特殊字符


环境变量：告诉操作系统，查找执行程序的路径

| 变量| 说明|
| - | -|
| GOROOT | 指定SDK的安装路径|
| PATH | 添加bin目录|
| GOPATH | 工作目录|

Linux 环境

```bash
$ vim /etc/profile

export GOROOT=/opt/go
export PATH=$PATH:$GOROOT/bin
export GOPATH=$HOME/goproject

执行生效
$ source /etc/profile
```

Mac 环境


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
