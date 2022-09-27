# 第二十章 golang 并发编程

## golang 并发编程之协程

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

## golang并发编程之channel

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

## golang并发编程之WaitGroup实现同步

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

## golang并发编程之runtime包

runtime定义了协程管理的包

## Gosched

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

## golang并发编程之Mutex 互斥锁实现同步

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

