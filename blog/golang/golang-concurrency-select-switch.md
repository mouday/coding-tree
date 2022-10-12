# 4.7、Golang 并发编程-select switch

select 是go中的一个控制结构，类似于switch语句，用于处理异步IO操作

select 会监听case语句中channel的读写操作，当case中channel读写操作为非阻塞状态（即能读写）时，将会触发相应的动作

sekect 中的case语句必须是一个channel操作

select 中的default子句总是可运行的

如果有多个case都可以运行，select会`随机`公平地选出一个执行，其他不会执行

如果没有可运行的case语句，且有default语句，那么就会执行default语句

如果没有可运行的case语句，且没有default语句，select将`阻塞`，知道某个case通信可以运行

示例

```go
package main

import (
    "fmt"
    "time"
)

var chanInt = make(chan int)
var chanString = make(chan string)

func main() {
    go func() {
        chanInt <- 10
        chanString <- "Tom"
        defer close(chanInt)
        defer close(chanString)
    }()

    for {
        select {
        case i := <-chanInt:
            fmt.Printf("int: %v\n", i)
        case i := <-chanString:
            fmt.Printf("string: %v\n", i)
        default:
            fmt.Println("default")

        }

        time.Sleep(time.Second)
    }
}

```
