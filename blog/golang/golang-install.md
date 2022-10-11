# 1.2、Golang 环境安装

## Go语言开发工具

- VSCode [https://code.visualstudio.com/](https://code.visualstudio.com/)
- VSCode网页版 [https://vscode.dev/](https://vscode.dev/)
- Sublime Text [https://www.sublimetext.com/](https://www.sublimetext.com/)
- Vim
- Emacs
- Eclipse
- LiteIDE
- GoLand [https://www.jetbrains.com/go/](https://www.jetbrains.com/go/)

建议：初学者使用文本编辑器，工作时使用IDE

## 安装 VSCode

Linux 建议安装到 /opt 目录

Mac 查看 ssh 服务

```bash
$ sudo launchctl list | grep ssh
-	0	com.openssh.sshd
```

vscode快捷键：

- 快速复制一行：shift + option + 方向键向下
- 字体大小修改：command +/-
- 行注释：command + /
- 块注释：shift + option + a
- 全选：command + a
- 复制：command + c
- 粘贴：command + v
- 删除行：command + shift + k
- 命令行：command + shift + p
- 整体向右移动 tab 
- 整体向左移动 shift + tab

快捷输入

```go
// pkgm 
package main

func main() {
	
}

// fmain
func main() {
	
}

// for
for i := 0; i < count; i++ {
		
}

// forr
for _, v := range v {
		
}

// fp
fmt.Println("")

// ff
fmt.Printf("", var)

// var.print
fmt.Printf("var: %v\n", var)
```

安装插件

- [https://marketplace.visualstudio.com/items?itemName=golang.Go](https://marketplace.visualstudio.com/items?itemName=golang.Go)
- [https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)

## 安装 Golang1.9.2

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

## 安装Golang 1.19

```bash
# 查看版本
$ go version
go version go1.19 darwin/amd64

# 查看环境变量
go env

# 使用go mod管理库
$ go env -w GO111MODULE=on
$ go env -w GOPROXY=https://goproxy.cn,direct
```

Go Module代理仓库服务

- 七牛云 https://goproxy.cn/
- 百度： https://goproxy.bj.bcebos.com/


安装git：https://git-scm.com/

配置环境变量
```bash
# Linux
vim /etc/profile

# Mac
vim ~/.bash_profile

export GOROOT=/usr/local
export PATH=$PATH:$GOROOT/bin
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

编译后再执行
```bash
$ go build demo.go

$ ls
demo    demo.go

$ ./demo
Hello Golang
```
