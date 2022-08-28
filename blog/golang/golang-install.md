# 第二章 Golang 快速开始和特性

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

> vscode快捷键：
> 快速复制一行：shift + option + 方向键向下
> 字体大小修改：command +/-
> 注释/取消注释：command + /
> 整体向右移动 tab 
> 整体向左移动 shift + tab

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

编译后再执行
```bash
$ go build demo.go

$ ls
demo    demo.go

$ ./demo
Hello Golang
```

## Golang执行流程

```bash
# go build
.go 源文件 --> 【编译】 --> 可执行文件 --> 【运行】 -->  结果

# go run
.go 源文件 --> 【编译运行】 -->  结果
```

两种执行流程的区别

- 源文件需要在Go开发环境中才能运行
- 编译后生成可执行文件，可以在没有Go开发环境的机器上运行
- 编译时，会将依赖的库文件包含到可执行文件中，所以，可执行文件比源文件大很多

## 编译运行

- 编译器将go源文件编译成可识别的二进制文件

1、编译

```bash
$ ls
demo.go

# 直接编译文件
$ go build demo.go

$ ls
demo    demo.go

# 指定生成的二进制文件名
$ go build -o run demo.go

# windows 下需要制定后缀名 .exe
$ go build -o run.exe demo.go

$ ls
demo    demo.go run
```

2、运行

```bash
# 运行可执行文件
./demo

# 直接运行go源文件
go run demo.go
```

## Go语言开发的特点

- 源文件以`.go` 为扩展名
- Go应用程序执行入口是`main()` 方法
- Go语言严格区分大小写
- GO语句后不需要分号，一行写一条语句
- Go语言`定义的变量` 或者`import的包` 没有使用到，代码不能编译通过
- 大括号成对出现


## Golang 转义字符（escape char）

| 转义字符 | 说明
| - | - 
| `\t`| 制表位
| `\n`  | 换行符，光标移动到下一行
| `\\` | 斜杆
| `\"` | 引号
| `\r`  | 回车，光标移动到行首


示例

```go
package main

import "fmt"

func main(){
    fmt.Println("Hello\tGolang")
    // Hello    Golang

    fmt.Println("Hello\nGolang")
    // Hello
    // Golang

    fmt.Println("Hello\rGolang")
    // Golang

    fmt.Println("Hello\\Golang")
    // Hello\Golang

    fmt.Println("Hello\"Golang")
    // Hello"Golang
}
```

示例：使用一行语句输出类似表格布局的数据

```go
package main

import "fmt"

func main(){
    fmt.Println("姓名\t年龄\t籍贯\t住址\nTom\t24\t河北\t北京")
    // 姓名   年龄    籍贯    住址
    // Tom    24     河北    北京
}
```

## 注释 comment

提高代码可读性

```go
// 行注释

/* 块注释 */
```

推荐使用：行注释

## 代码风格

gofmt 格式化

```bash
# 格式化并写入原文件
$ gofmt -w demo.go
```

- 正确的缩进空格
- 函数的左大括号，放在函数名后面（不换行）
- 运算符两边加空格
- 每行代码字符不超过80个字

## Golang 标准库API

[https://studygolang.com/pkgdoc](https://studygolang.com/pkgdoc)

```
包 <==>  文件夹 / 原文件 / 函数
```

