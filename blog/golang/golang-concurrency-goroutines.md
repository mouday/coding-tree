# 4.1、Golang 并发编程-协程

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
