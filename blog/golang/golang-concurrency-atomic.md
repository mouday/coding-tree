# 4.6、Golang 并发编程-atomic原子操作

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
