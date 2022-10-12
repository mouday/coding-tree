# 4.5、Golang 并发编程-Mutex 互斥锁实现同步

Mutex 互斥锁实现同步

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
