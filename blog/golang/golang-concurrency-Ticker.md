# 4.9、Golang 并发编程-Ticker 周期执行

Timer 只执行一次，Ticker 可以周期的执行

示例

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 执行五次打印
    ticker := time.NewTicker(time.Second)

    count := 0
    for _ = range ticker.C {
        fmt.Println("ticker")
        count++

        if count >= 5 {
            ticker.Stop()
            break
        }
    }

}

```

示例

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ticker := time.NewTicker(time.Second)
    chanInt := make(chan int)

    // 定时向管道随机发送一个数
    go func() {
        for _ = range ticker.C {
            select {
            case chanInt <- 1:
            case chanInt <- 2:
            case chanInt <- 3:
            }
        }
    }()

    // 接收管道数据
    sum := 0
    for v := range chanInt {
        fmt.Printf("v: %v\n", v)
        sum += v
        if sum >= 10 {
            break
        }
    }

}

```
