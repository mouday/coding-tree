# 5.8、Golang 标准库-errors

errors包实现了操作错误的函数

error结构

```go
type error interface {
    Error() string
}
```

使用示例

```go
package main

import (
    "errors"
    "fmt"
)

func check(str string) (string, error) {
    if str == "" {
        err := errors.New("字符串不能为空")
        return "", err
    } else {
        return str, nil
    }
}

func main() {
    s, err := check("")
    if err != nil {
        fmt.Printf("err: %v\n", err.Error())
    } else {
        fmt.Printf("s: %v\n", s)
    }
    // err: 字符串不能为空
}

```

自定义异常

```go
package main

import (
    "fmt"
    "time"
)

type MyError struct {
    When time.Time
    What string
}

func (err MyError) Error() string {
    return fmt.Sprintf("%v: %v", err.When, err.What)
}

func oops() error {
    return MyError{
        time.Date(2000, 01, 02, 03, 04, 05, 0, time.UTC),
        "my error",
    }
}

func main() {
    err := oops()

    if err != nil {
        fmt.Printf("err: %v\n", err.Error())
    }
    // err: 2000-01-02 03:04:05 +0000 UTC: my error
}

```