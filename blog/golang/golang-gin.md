# Go语言Web框架之gin

测试完整代码

https://github.com/mouday/gin-demo

Go语言Web框架：

- [gin](https://gin-gonic.com/zh-cn/)
- beego
- iris

下载安装

```bash
go get -u github.com/gin-gonic/gin

# 等价于
git clone https://github.com/gin-gonic/gin.git
```

初始化项目
```bash
go mod init com/app
```

## 返回json数据

```go
package main

import (
    "github.com/gin-gonic/gin"
)

func main() {
    // 创建一个服务
    server := gin.Default()

    // 处理请求
    server.GET("/json", func(ctx *gin.Context) {
        // 返回json数据
        ctx.JSON(200, gin.H{"msg": "Hello"})
    })


    // 启动服务
    server.Run(":8000")
}

```

## 使用中间件

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/thinkerou/favicon"
)

func main() {
    // 创建一个服务
    server := gin.Default()

    // set favicon middleware
    server.Use(favicon.New("./favicon.ico"))

    // 处理请求
    server.GET("/json", func(ctx *gin.Context) {
        // 返回json数据
        ctx.JSON(200, gin.H{"msg": "Hello"})
    })

    // 启动服务
    server.Run(":8000")
}

```

## 处理POST请求

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    // 创建一个服务
    server := gin.Default()

    // 处理请求
    server.GET("/json", func(ctx *gin.Context) {
        // 返回json数据
        ctx.JSON(200, gin.H{"msg": "Hello"})
    })

    // post请求
    server.POST("/post", func(ctx *gin.Context) {
        // 返回json数据
        ctx.JSON(200, gin.H{"msg": "Hello"})
    })

    // 启动服务
    server.Run(":8000")
}

```
## 返回html页面

项目结构

```bash
$ tree
.
├── favicon.ico
├── go.mod
├── go.sum
├── main.go
├── static
│   ├── css
│   │   └── index.css
│   └── js
│       └── main.js
└── templates
    └── index.html
```    
templates/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <!-- 加载静态资源 -->
    <link rel="stylesheet" href="/static/css/index.css" />
    <script src="/static/js/main.js"></script>
  </head>
  <body>
    <h1>Hello {{.name}}</h1>
  </body>
</html>
```

static/css/index.css
```css
body {
  background-color: green;
}

```

static/js/main.js

```js
console.log("hello");

```

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/thinkerou/favicon"
)

func main() {
    // 创建一个服务
    server := gin.Default()

    // set favicon middleware
    server.Use(favicon.New("./favicon.ico"))

    // 加载模板文件
    server.LoadHTMLGlob("templates/*")

    // 静态资源
    server.Static("/static", "./static")

    // 处理请求
    server.GET("/", func(ctx *gin.Context) {
        // 返回json数据
        ctx.HTML(
            http.StatusOK,
            "index.html",
            gin.H{
                "name": "Golang",
            })
    })

    // 启动服务
    server.Run(":8000")
}


```

### 接收参数

路由参数
```go
// 接收路由参数
// http://127.0.0.1:8000/user/100
server.GET("/user/:userId", func(ctx *gin.Context) {

    userId := ctx.Param("userId")

    ctx.JSON(200, gin.H{
        "userId": userId,
    })
})
```

查询参数

```go
// 接收查询参数
// http://127.0.0.1:8000/get?name=Tom&age=20
server.GET("/get", func(ctx *gin.Context) {

    name := ctx.Query("name")
    age := ctx.Query("age")

    ctx.JSON(200, gin.H{
        "name": name,
        "age":  age,
    })
})
```

表单参数
```go
// POST http://127.0.0.1:8000/post-form
// "age"="20"&"name"="Tom"

server.POST("/post-form", func(ctx *gin.Context) {
    name := ctx.PostForm("name")
    age := ctx.PostForm("age")

    // 返回json数据
    ctx.JSON(http.StatusOK, gin.H{
        "name": name,
        "age":  age,
    })
})
```

json参数
```go
// POST http://127.0.0.1:8000/json
// {
//  "name": "Tom",
//  "age": 20
// }
server.POST("/json", func(ctx *gin.Context) {

    // 解析json数据
    rawData, _ := ctx.GetRawData()
    var data gin.H
    json.Unmarshal(rawData, &data)

    // 返回json数据
    ctx.JSON(http.StatusOK, data)
})
```

### 路由

```go
// 重定向 301
server.GET("/redirect", func(ctx *gin.Context) {
    ctx.Redirect(http.StatusMovedPermanently, "https://www.baidu.com")
})

// not found 404
server.NoRoute(func(ctx *gin.Context) {
    ctx.HTML(http.StatusNotFound, "404.html", nil)
})

// 路由组
userGroup := server.Group("/user")
{
    userGroup.POST("/add", func(ctx *gin.Context) {
    })

    userGroup.GET("/delete", func(ctx *gin.Context) {
    })
}
```

### 中间件

```go
func userMiddleware() gin.HandlerFunc {
    return func(ctx *gin.Context) {
        ctx.Set("userId", "100")
    }
}

// 全局使用中间件
server.Use(userMiddleware())

// 单个路由使用中间件
server.GET("/user", userMiddleware(), func(ctx *gin.Context) {

    userId := ctx.GetString("userId")

    ctx.JSON(http.StatusOK, gin.H{
        "userId": userId,
    })
})
```

