# 1.3、Golang 运行代码

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

## Dos 基本介绍

Dos Disk Operating System 磁盘操作系统

基本原理

```
终端 --> Dos操作系统 --> Windows目录
```

## Go常用命令

```bash
$ go help
bug         start a bug report
build       compile packages and dependencies
clean       remove object files and cached files
doc         show documentation for package or symbol
env         print Go environment information
fix         update packages to use new APIs
fmt         gofmt (reformat) package sources
generate    generate Go files by processing source
get         add dependencies to current module and install them
install     compile and install packages and dependencies
list        list packages or modules
mod         module maintenance
work        workspace maintenance
run         compile and run Go program
test        test packages
tool        run specified go tool
version     print Go version
vet         report likely mistakes in packages
```

管理依赖包

搜索包：https://pkg.go.dev

```bash
# 初始化模块
go mod init code

# 下载依赖
go get github.com/go-sql-driver/mysql
```