# 第二十章 Golang 并发编程

## 协程

共语言中的并发是`函数`相互独立运行的能力。goroutines 是并发运行的函数

创建协程

```go
go task()
```

示例 1

```go
package main

import (
    "fmt"
    "time"
)

func showMessage(message string) {
    for i := 0; i < 5; i++ {
        fmt.Println(message)
        time.Sleep(time.Millisecond * 100)
    }
}

func main() {
    showMessage("Tom")
    showMessage("Jack")
}

```

输出

```
Tom
Tom
Tom
Tom
Tom
Jack
Jack
Jack
Jack
Jack
```

```go
func main() {
    go showMessage("Tom")
    showMessage("Jack")
}
```

输出

```go
Jack
Tom
Tom
Jack
Jack
Tom
Tom
Jack
Jack
Tom
```

示例 2

```go
package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "time"
)

func responseSize(url string) {
    fmt.Println("step1: ", url)
    response, err := http.Get(url)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("step2: ", url)
    defer response.Body.Close()

    fmt.Println("step3: ", url)
    body, err := ioutil.ReadAll(response.Body)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("step4: ", len(body))
}

func main() {
    go responseSize("https://www.baidu.com/")
    go responseSize("https://www.jd.com/")
    go responseSize("https://www.taobao.com/")
    time.Sleep(time.Second * 10)
}

```

输出

```
step1:  https://www.baidu.com/
step1:  https://www.jd.com/
step1:  https://www.taobao.com/
step2:  https://www.jd.com/
step3:  https://www.jd.com/
step4:  160260
step2:  https://www.baidu.com/
step3:  https://www.baidu.com/
step4:  227
step2:  https://www.taobao.com/
step3:  https://www.taobao.com/
step4:  87347
```

## channel

Go提供了一种通道机制，用于goroutine之间`共享数据`

通道需要指定`数据类型`

通道分类：
- 无缓冲通道 同步通讯
- 缓冲通道   异步通讯

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

## WaitGroup实现同步

示例1

```go
package main

import (
    "fmt"
)

func showMessage(i int) {
    fmt.Printf("i: %v\n", i)
}

func main() {
    for i := 0; i < 10; i++ {
        showMessage(i)
    }
}

```

输出
```go
i: 0
i: 1
i: 2
i: 3
i: 4
i: 5
i: 6
i: 7
i: 8
i: 9
```

示例 2

```go
package main

import (
    "fmt"
)

func showMessage(i int) {
    fmt.Printf("i: %v\n", i)
}

func main() {
    for i := 0; i < 10; i++ {
        // 启动协程来执行
        go showMessage(i)
    }

    // 主协程执行结束
    fmt.Println("end")
}

```


输出
```go
i: 0
end
```

示例 3

```go
package main

import (
    "fmt"
    "sync"
)

var wp sync.WaitGroup

func showMessage(i int) {
    defer wp.Done()

    fmt.Printf("i: %v\n", i)
}

func main() {
    for i := 0; i < 10; i++ {
        go showMessage(i)
        wp.Add(1)
    }

    wp.Wait()

    fmt.Println("end")
}

```

输出
```
i: 4
i: 1
i: 0
i: 5
i: 7
i: 8
i: 2
i: 3
i: 9
i: 6
end
```

## runtime包

runtime定义了协程管理的包

### Gosched

让出执行权限

示例

```go
package main

import (
    "fmt"
)

func show() {
    for i := 0; i < 2; i++ {
        fmt.Printf("show i: %v\n", i)
    }
}

func main() {
    go show()

    for i := 0; i < 2; i++ {
        fmt.Printf("main i: %v\n", i)
    }

    fmt.Println("end")
}

```

输出

```
main i: 0
main i: 1
end
```

示例 2

```go
package main

import (
    "fmt"
    "runtime"
)

func show() {
    for i := 0; i < 2; i++ {
        fmt.Printf("show i: %v\n", i)
    }
}

func main() {
    go show()

    for i := 0; i < 2; i++ {

        // 让出执行权限，给其他子协程执行
        runtime.Gosched()

        fmt.Printf("main i: %v\n", i)
    }

    fmt.Println("end")
}

```

输出
```
show i: 0
main i: 0
main i: 1
end
```

### Goexit

退出当前协程

示例

```go
package main

import (
    "fmt"
    "runtime"
    "time"
)

func show() {
    for i := 0; i < 10; i++ {
        fmt.Printf("show i: %v\n", i)
        if i >= 5 {
            runtime.Goexit()
        }
    }
}

func main() {
    go show()

    time.Sleep(time.Second)

    fmt.Println("end")
}

```

输出
```
show i: 0
show i: 1
show i: 2
show i: 3
show i: 4
show i: 5
end
```

### GOMAXPROCS

设置CPU数量

```go
package main

import (
    "fmt"
    "runtime"
    "time"
)

func show(name string) {
    for i := 0; i < 10; i++ {
        fmt.Printf("%v i: %v\n", name, i)
    }
}

func main() {

    // 查看CPU核数
    fmt.Printf("runtime.NumCPU(): %v\n", runtime.NumCPU())
    // runtime.NumCPU(): 8

    // 设置CPU数量
    runtime.GOMAXPROCS(2)

    go show("A")
    go show("B")

    time.Sleep(time.Second)

    fmt.Println("end")
}

```

## Mutex 互斥锁实现同步

示例

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

var value = 100
var wg sync.WaitGroup

var lock sync.Mutex

func add() {
    defer wg.Done()

    lock.Lock()
    time.Sleep(time.Millisecond * 2)

    value += 1
    fmt.Printf("i++: %v\n", value)
    lock.Unlock()
}

func sub() {
    defer wg.Done()

    lock.Lock()

    time.Sleep(time.Millisecond * 10)

    value -= 1
    fmt.Printf("i--: %v\n", value)

    lock.Unlock()
}

func main() {
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go add()

        wg.Add(1)
        go sub()
    }

    wg.Wait()
    fmt.Printf("end: %v\n", value)
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

## select switch

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

## Timer

定时器，可以实现一些定时操作，内部通过channel实现

示例

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    timer := time.NewTimer(time.Second * 2)
    fmt.Printf("time.Now(): %v\n", time.Now())
    // time.Now(): 2022-09-29 22:31:16.348683 +0800 CST m=+0.000252176

    // 阻塞，直到到达指定时间
    c := <-timer.C
    fmt.Printf("c: %v\n", c)
    // c: 2022-09-29 22:31:18.35269 +0800 CST m=+2.004256507
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
    timer := time.NewTimer(time.Second * 2)
    fmt.Printf("time.Now(): %v\n", time.Now())
    // time.Now(): 2022-09-29 22:32:25.585226 +0800 CST m=+0.000134248

    // 阻塞，直到到达指定时间
    <-timer.C
    fmt.Printf("time.Now(): %v\n", time.Now())
    // time.Now(): 2022-09-29 22:32:27.585439 +0800 CST m=+2.000219266
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

    fmt.Printf("time.Now(): %v\n", time.Now())
    // time.Now(): 2022-09-29 22:34:08.764178 +0800 CST m=+0.000082405

    time.Sleep(time.Second * 2)

    fmt.Printf("time.Now(): %v\n", time.Now())
    // time.Now(): 2022-09-29 22:34:10.765022 +0800 CST m=+2.000924537
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

    fmt.Printf("time.Now(): %v\n", time.Now())
    // time.Now(): 2022-09-29 22:34:41.029391 +0800 CST m=+0.000077713

    <-time.After(time.Second * 2)

    fmt.Printf("time.Now(): %v\n", time.Now())
    // time.Now(): 2022-09-29 22:34:43.031081 +0800 CST m=+2.001766091
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
    timer := time.NewTimer(time.Second * 1)

    go func() {
        <-timer.C
        fmt.Println("func")
    }()

    // 停止定时器
    stop := timer.Stop()

    if stop {
        fmt.Println("stop")
    }

    time.Sleep(time.Second * 2)

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
    timer := time.NewTimer(time.Second * 5)

    // 重新设置定时器时间
    timer.Reset(time.Second * 1)

    <-timer.C

    fmt.Println("end")

}

```

## Ticker

Timer只执行一次，Ticker可以周期的执行

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

## 原子变量

不加锁示例

```go
package main

import (
    "fmt"
    "time"
)

var value = 100

func add() {
    value++
}

func sub() {
    value--
}

func main() {

    for i := 0; i < 100; i++ {
        go add()
        go sub()
    }

    time.Sleep(time.Second * 2)
    fmt.Printf("value: %v\n", value)
    // value: 101

}

 ```

 加锁示例

 ```go
 package main

import (
    "fmt"
    "sync"
    "time"
)

var value = 100

var lock sync.Mutex

func add() {
    lock.Lock()
    value++
    lock.Unlock()
}

func sub() {
    lock.Lock()
    value--
    lock.Unlock()
}

func main() {

    for i := 0; i < 100; i++ {
        go add()
        go sub()
    }

    time.Sleep(time.Second * 2)
    fmt.Printf("value: %v\n", value)
    // value: 100

}

```

atomic示例

cas: compare and swap (old new)

```go
package main

import (
    "fmt"
    "sync/atomic"
    "time"
)

var value int32 = 100

func add() {
    atomic.AddInt32(&value, 1)
}

func sub() {
    atomic.AddInt32(&value, -1)
}

func main() {

    for i := 0; i < 100; i++ {
        go add()
        go sub()
    }

    time.Sleep(time.Second * 2)
    fmt.Printf("value: %v\n", value)
    // value: 100

}
```

## 原子操作详解

atomic 提供的原子操作能够确保任一时刻，只有一个goroutine对变量进行操作

善用atomic能够避免程序中出现大量的锁操作

atomic常见的操作有：

- 增减
- 载入 read
- 比较并交换cas
- 交换
- 存储 write

### 增减

```go
package main

import (
    "fmt"
    "sync/atomic"
)

func main() {

    var value int32 = 100
    atomic.AddInt32(&value, 1)
    fmt.Printf("value: %v\n", value)
    // value: 101

    atomic.AddInt32(&value, -1)
    fmt.Printf("value: %v\n", value)
    // value: 100

}

```

### 读写

```go
package main

import (
    "fmt"
    "sync/atomic"
)

func main() {

    var value int32 = 100

    // read
    atomic.LoadInt32(&value)
    fmt.Printf("value: %v\n", value)
    // value: 100

    // write
    atomic.StoreInt32(&value, 200)
    fmt.Printf("value: %v\n", value)
    // value: 200

}

```

### 比较并交换cas

```go
package main

import (
    "fmt"
    "sync/atomic"
)

func main() {

    var value int32 = 100

    // cas
    ret := atomic.CompareAndSwapInt32(&value, 100, 200)

    fmt.Printf("ret: %v\n", ret)
    // ret: true

    fmt.Printf("value: %v\n", value)
    // value: 200

}

```

### 交换

```go
package main

import (
    "fmt"
    "sync/atomic"
)

func main() {

    var value int32 = 100

    // 直接交换
    atomic.SwapInt32(&value, 200)

    fmt.Printf("value: %v\n", value)
    // value: 200

}

```
