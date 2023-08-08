# 5.13、Golang 标准库-math

math 包提供了一些常量和一些有用的数学计算函数

## 常量

示例

```go
package main

import (
    "fmt"
    "math"
)

func main() {
    fmt.Printf("math.Pi: %v\n", math.Pi)
    // math.Pi: 3.141592653589793

    fmt.Printf("math.MinInt: %v\n", math.MinInt)
    // math.MinInt: -9223372036854775808

    fmt.Printf("math.MaxInt: %v\n", math.MaxInt)
    // math.MaxInt: 9223372036854775807

}

```

## 数学函数

```go
package main

import (
    "fmt"
    "math"
)

func main() {

    // 取绝对值
    fmt.Printf("math.Abs(-10): %v\n", math.Abs(-10))
    // math.Abs(-10): 10

    // x的y次方
    fmt.Printf("math.Pow(2, 3): %v\n", math.Pow(2, 3))
    // math.Pow(2, 3): 8

    // 10的n次方
    fmt.Printf("math.Pow10(3): %v\n", math.Pow10(3))
    // math.Pow10(3): 1000

    // 开平方
    fmt.Printf("math.Sqrt(64): %v\n", math.Sqrt(64))
    // math.Sqrt(64): 8

    // 开立方
    fmt.Printf("math.Cbrt(27): %v\n", math.Cbrt(27))
    // math.Cbrt(27): 3

    // 向上取整
    fmt.Printf("math.Ceil(3.14): %v\n", math.Ceil(3.14))
    // math.Ceil(3.14): 4

    // 向下取整
    fmt.Printf("math.Floor(8.75): %v\n", math.Floor(8.75))
    // math.Floor(8.75): 8

    // 取余
    fmt.Printf("math.Mod(10, 3): %v\n", math.Mod(10, 3))
    // math.Mod(10, 3): 1

    // 分别取整数和小数部分
    fmt.Println(math.Modf(3.14))
    // 3 0.14000000000000012
}

```

随机数

```go
package main

import (
    "fmt"
    "math/rand"
    "time"
)

func init() {
    // 设置随机数种子
    rand.Seed(time.Now().UnixNano())
}

func main() {

    // 随机数
    fmt.Println(rand.Int())
    // 422547814534915217

    // 指定随机数范围[0,n)
    fmt.Println(rand.Intn(10))
    // 8
}

```
