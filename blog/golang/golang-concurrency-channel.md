# 4.2、Golang 并发编程-channel

Go 提供了一种通道机制，用于 goroutine 之间`共享数据`

通道需要指定`数据类型`

通道分类：

- 无缓冲通道 同步通讯
- 缓冲通道 异步通讯

语法

```go
// 整型无缓冲通道，默认零值
Unbuffered := make(chan int)

// 整型缓冲通道
buffered := make(chan int, 10)
```

通道数据交换

```go
channel := make(chan string, 5)

// 将值发送到通道
channel <- "hello"

// 从通道接收值
data := <- channel
```

通道的发送和接收特性

- 同一通道，发送操作之间是互斥的，接收操作之间也是互斥的
- 发送操作和接收操作中对元素值的处理都是不可分割的
- 发送操作在完全完成之前会被阻塞，接收操作也是如此

示例

```go
package main

import (
    "fmt"
    "math/rand"
    "time"
)

// 创建一个int类型的通道
var value = make(chan int)

func send() {

    // 向通道发送一个随机值
    rand.Seed(time.Now().UnixNano())
    v := rand.Intn(10)

    time.Sleep(time.Second * 3)
    value <- v
}

func main() {
    // 关闭通道
    defer close(value)

    go send()

    fmt.Println("wait...")

    // 从通道接收值
    v := <-value

    fmt.Printf("v: %v\n", v)
}

```

## Channel遍历

示例

```go
package main

import "fmt"

var c = make(chan int)

func main() {
	go func() {
		for i := 0; i < 2; i++ {
			c <- i
		}
		// 不关闭可能出现死锁
		close(c)
	}()

	// 方式一
	// for i := 0; i < 2; i++ {
	// 	v := <-c
	// 	fmt.Printf("v: %v\n", v)
	// }

	// 方式二
	// for v := range c {
	// 	fmt.Printf("v: %v\n", v)
	// }

	// 方式三
	for {
		v, ok := <-c
		if ok {
			fmt.Printf("v: %v\n", v)
		} else {
			break
		}
	}
}

```
