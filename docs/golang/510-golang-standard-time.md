# 5.10、Golang标准库-time

time包提供测量和显示时间

## 获取时间

示例

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 获取当前时间
    now := time.Now()
    fmt.Printf("now: %v\n", now)
    // now: 2022-10-09 22:26:46.28154 +0800 CST m=+0.000130816

    // 年 月 日 时 分 秒
    year := now.Year()
    month := now.Month()
    day := now.Day()
    hour := now.Hour()
    minute := now.Minute()
    second := now.Second()

    fmt.Printf("%d-%02d-%02d %02d:%02d:%02d\n", year, month, day, hour, minute, second)
    // 2022-10-09 22:28:48

    fmt.Printf("%T, %T, %T, %T, %T, %T, %T\n", now, year, month, day, hour, minute, second)
    // time.Time, int, time.Month, int, int, int, int

}

```

## 时间戳

1970年1月1日 至当前时间的总毫秒数

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 获取当前时间
    now := time.Now()

    // 毫秒时间戳
    fmt.Printf("now: %T %v\n", now.Unix(), now.Unix())
    // now: int64 1665325944

    // 纳秒时间戳
    fmt.Printf("now: %T %v\n", now.UnixNano(), now.UnixNano())
    // now: int64 1665326004937102000
}

```

## 时间格式和时间戳转换

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 获取当前时间
    now := time.Now()

    // 时间格式获取时间戳
    timestamp := now.Unix()
    fmt.Printf("timestamp: %v\n", timestamp)
    // timestamp: 1665326148

    // 时间戳转为时间格式
    t := time.Unix(timestamp, 0)
    fmt.Printf("t: %v\n", t)
    // t: 2022-10-09 22:35:48 +0800 CST
}

```

## 操作时间

常量枚举

```go
const (
    Nanosecond  Duration = 1
    Microsecond          = 1000 * Nanosecond
    Millisecond          = 1000 * Microsecond
    Second               = 1000 * Millisecond
    Minute               = 60 * Second
    Hour                 = 60 * Minute
)
```

示例

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 获取当前时间
    now := time.Now()
    fmt.Printf("now: %v\n", now)
    // now: 2022-10-09 22:38:21.99582 +0800 CST m=+0.000247516

    // 增加 3 分钟
    t := now.Add(time.Minute * 3)
    fmt.Printf("t: %v\n", t)
    // t: 2022-10-09 22:41:21.99582 +0800 CST m=+180.000247516

    // 时间差
    diff := t.Sub(now)
    fmt.Printf("diff: %v\n", diff)
    // diff: 3m0s

    // 时间比较 相等
    ret1 := t.Equal(now)
    fmt.Printf("ret1: %v\n", ret1)
    // ret1: false

    // 时间比较 之前
    ret2 := t.Before(now)
    fmt.Printf("ret2: %v\n", ret2)
    // ret2: false

    // 时间比较 之后
    ret3 := t.After(now)
    fmt.Printf("ret3: %v\n", ret3)
    // ret3: true
}

```

## 定时器

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 每隔两秒执行一次
    ticker := time.Tick(time.Second * 2)
    for i := range ticker {
        fmt.Printf("i: %v\n", i)
    }

    // i: 2022-10-09 22:45:37.026807 +0800 CST m=+2.000242470
    // i: 2022-10-09 22:45:39.030351 +0800 CST m=+4.003789519
    // i: 2022-10-09 22:45:41.03117 +0800 CST m=+6.004610715

}

```

## 时间格式化

golang诞生时间： 2006年1月2日 15点04分，记忆口诀：2006 12345

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    now := time.Now()
    fmt.Printf("now.Format(): %v\n", now.Format("2006-01-02 15:04:05"))
    // now.Format(): 2022-10-09 22:49:20
}

```

## 解析字符串格式的时间

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    now := time.Now()
    fmt.Printf("now: %v\n", now)
    // now: 2022-10-09 22:54:22.004375 +0800 CST m=+0.000089638

    // 加载时区
    loc, err := time.LoadLocation("Asia/Shanghai")
    if err != nil {
        fmt.Printf("err: %v\n", err)
        return
    }

    // 按照指定时区指定格式解析字符串格式的时间
    t, err2 := time.ParseInLocation("2006-01-02 15:04:05", "2022-10-09 22:49:20", loc)
    if err2 != nil {
        fmt.Printf("err2: %v\n", err2)
        return
    }

    fmt.Printf("t: %v\n", t)
    // t: 2022-10-09 22:49:20 +0800 CST
}

```
