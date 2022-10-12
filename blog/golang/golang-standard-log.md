# 5.5、Golang标准库-log

log包，实现了简单的日志服务

log包中有3个系列的日志打印函数

函数系列 | 作用
- | -
print | 单纯的打印日志
panic | 打印日志，抛出panic异常
fatal  | 打印日志，强制结束程序`os.Exit(1)`, `defer` 函数不会执行

Print 示例

```go
package main

import (
    "log"
)

func main() {
    log.Print("Hello")
    // 2022/10/07 15:24:38 Hello

    log.Println("Hello")
    // 2022/10/07 15:25:08 Hello\n

    log.Printf("Hello %d", 20)
    // 2022/10/07 15:25:08 Hello 20
}

```

Panic 示例

```go
package main

import (
    "fmt"
    "log"
)

func main() {
    defer fmt.Println("defer")

    log.Panic("Hello")

    fmt.Println("after Panic")
    // 2022/10/07 15:27:10 Hello
    // defer
    // panic: Hello
}

```

Fatal 示例

```go
package main

import (
    "fmt"
    "log"
)

func main() {
    defer fmt.Println("defer")

    log.Fatal("Hello")

    fmt.Println("after Panic")
    // 2022/10/07 15:28:48 Hello
    // exit status 1
}

```

log配置

```go
package main

import (
    "log"
    "os"
)

func init() {
    // 输出格式 长日期 长时间 短文件名
    log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

    // 设置前缀
    log.SetPrefix("main: ")

    // 设置日志输出文件
    f, err := os.OpenFile("demo.log", os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0664)
    // defer f.Close()

    if err != nil {
        log.Fatal("日志文件打开错误")
    }

    log.SetOutput(f)

}

func main() {
    log.Print("Hello")
    // main: 2022/10/07 15:35:13 main.go:16: Hello

}

```

自定义logger

```go
package main

import (
    "log"
    "os"
)

var logger *log.Logger

func init() {
    // func New(out io.Writer, prefix string, flag int) *Logger
    logger = log.New(os.Stdout, "main: ", log.Ldate|log.Ltime|log.Lshortfile)
}

func main() {
    logger.Print("Hello")
    // main: 2022/10/07 15:35:13 main.go:16: Hello

}

```