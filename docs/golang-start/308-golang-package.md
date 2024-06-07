# 3.8、Golang包 package

## Golang 包的定义和导入

通常，文件夹名称和包名称相同，并且，同一个文件夹下面只有一个包

定义包

service/user_service.go
```go
package service

```

导入包

main.go

```go
package main

import "service"

```

## golang包管理工具 go module

go module 是 golang1.11版本新加的特性，用来管理模块中包的依赖关系

```bash
$ go env
GO111MODULE="on"
```

go mod 的使用

```bash
# 初始化模块
# eg: go mod init 域名/项目名称
go mod init <项目模块名>

# 依赖关系处理，根据go.mod 文件
go mod tidy

# 将依赖包赋值到项目下的vendor目录
# 如果包被屏蔽（墙），可以使用这个命令, 随后使用go build -mod=vendor编译
go mod vendor

# 显示依赖关系
go list -m all

# 显示详细依赖关系
go list -m -json all

# 下载依赖
go mod download [path@version]
```

### 使用本地包

示例

```bash
# 初始化模块
go mod init mouday.com/project01
```

项目结构
```bash
$ tree 
.
├── go.mod
├── main.go
└── service
    └── user_service.go
```

service/user_service.go

```go
package service

import "fmt"

// 首字母大写，可供外部使用
func TestService() {
    fmt.Println("TestService")
}

```

main.go

```go
package main

import "mouday.com/project01/service"

func main() {
    service.TestService()
    // TestService
}

```

### 使用第三方包

搜索包：[https://pkg.go.dev](https://pkg.go.dev)

下载包

```bash
go get github.com/gin-gonic/gin
```

使用示例

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    r.GET("/ping", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "pong",
        })
    })
    r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

```

访问：http://127.0.0.1:8080/ping

响应
```json
{
"message": "pong"
}
```

