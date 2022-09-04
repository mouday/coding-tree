Golang 运算符

- 算术运算符
- 关系运算符
- 逻辑运算符
- 位运算符
- 赋值运算符

## 算术运算符

运算符  | 描述
-| - 
`+`| 加
`-`| 减
`*`| 乘
`/`| 除
`%`| 取余

`++` 和 `--` 是单独的语句，并不是运算符

示例

```go
package main

import "fmt"

func main() {
    a := 2
    b := 5

    r := a + b
    fmt.Printf("r: %v\n", r)
    // r: 7

    r = b - a
    fmt.Printf("r: %v\n", r)
    // r: 3

    r = a * b
    fmt.Printf("r: %v\n", r)
    // r: 10

    r = b / a
    fmt.Printf("r: %v\n", r)
    // r: 2

    r = b % a
    fmt.Printf("r: %v\n", r)
    // r: 1

    a++
    fmt.Printf("a: %v\n", a)
    // a: 3

    a--
    fmt.Printf("a: %v\n", a)
    // a: 2
}
```


## 关系运算符

运算符 | 描述
-| -
`==`| 相等
`!=` |  不相等
`>` |  大于
`>=`  |  大于等于
`<` |  小于
`<=`  |  小于等于


逻辑运算符
位运算符
赋值运算符