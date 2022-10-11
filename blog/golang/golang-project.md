# 1.4、Golang 项目管理

## go项目管理工具

- version < golang1.11： gopath
- version >= golang1.11：gomod
- 第三方：govendor

# 编写go代码

```bash
# 初始化项目
go mod init <projectName>

# eg:
$ go mod init demo

$ tree 
.
├── go.mod
├── main.go
└── user
    └── user.go
```

main.go

```go
package main

import (
    "demo/user"
    "fmt"
)

func main() {
    // user.SayHello().var
    s := user.SayHello()
    // s.print
    fmt.Println(s)
}

```

user/user.go
```go
package user

func SayHello() string {
    return "Hello"
}

```

运行

```go
go run main.go
```
