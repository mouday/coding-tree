# 4.8、Golang 并发编程-Timer定时器

定时器，可以实现一些定时操作，内部通过 channel 实现

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
