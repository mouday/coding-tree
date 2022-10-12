# 4.3、Golang 并发编程-WaitGroup实现同步

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
