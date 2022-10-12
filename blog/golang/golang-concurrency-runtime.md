# 4.4、Golang 并发编程-runtime包

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

## Goexit

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

## GOMAXPROCS

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
