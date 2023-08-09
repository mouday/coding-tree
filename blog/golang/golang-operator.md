# 2.6、Golang 运算符

- 算术运算符
- 关系运算符
- 逻辑运算符
- 位运算符
- 赋值运算符

## 算术运算符

| 运算符 | 描述 |
| ------ | ---- |
| `+`    | 加   |
| `-`    | 减   |
| `*`    | 乘   |
| `/`    | 除   |
| `%`    | 取余 |

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

| 运算符 | 描述     |
| ------ | -------- |
| `==`   | 相等     |
| `!=`   | 不相等   |
| `>`    | 大于     |
| `>=`   | 大于等于 |
| `<`    | 小于     |
| `<=`   | 小于等于 |

示例

```go
package main

import (
	"fmt"
)

func main() {
	a := 1
	b := 2

	fmt.Printf("%v\n", a == b)
	// false

	fmt.Printf("%v\n", a > b)
	// false

	fmt.Printf("%v\n", a >= b)
	// false

	fmt.Printf("%v\n", a < b)
	// true

	fmt.Printf("%v\n", a <= b)
	// true

	fmt.Printf("%v\n", a != b)
	// true
}

```

## 逻辑运算符

| 运算符 | 描述   |
| ------ | ------ |
| `&&`   | 逻辑与 |
| `\|\|` | 逻辑或 |
| `!`    | 逻辑非 |

示例

```go
package main

import (
	"fmt"
)

func main() {
	a := true
	b := false

	fmt.Printf("%v\n", a && b)
	// false

	fmt.Printf("%v\n", a || b)
	// true

	fmt.Printf("%v\n", !a)
	// false
}
```

## 位运算符

| 运算符 | 描述     |
| ------ | -------- |
| `&`    | 按位与   |
| `\|`   | 按位或   |
| `^`    | 按位异或 |
| `<<`   | 左移     |
| `>>`   | 右移     |

示例

```go
package main

import (
	"fmt"
)

func main() {
	a := 4
	b := 8

	fmt.Printf("a: %b\n", a)
	// a: 100

	fmt.Printf("b: %b\n", b)
	// b: 1000

	r := a & b
	fmt.Printf("r: %v\n", r)
	// r: 0

	r = a | b
	fmt.Printf("r: %v\n", r)
	// r: 12

	r = a ^ b
	fmt.Printf("r: %v\n", r)
	// r: 12

	r = a << 2
	fmt.Printf("r: %v\n", r)
	// r: 16

	r = a >> 2
	fmt.Printf("r: %v\n", r)
	// r: 1

}

```

## 赋值运算符

| 运算符 | 描述                           |
| ------ | ------------------------------ |
| `=`    | 赋值（右边的值赋值给左边变量） |
| `+=`   | 相加后赋值                     |
| `-=`   | 相减后赋值                     |
| `*=`   | 相乘后赋值                     |
| `/=`   | 相除后赋值                     |
| `%=`   | 取余后赋值                     |
| `<<=`  | 左移后赋值                     |
| `>>=`  | 右移后赋值                     |
| `&=`   | 按位与后赋值                   |
| `\|=`  | 按位或后赋值                   |
| `^=`   | 按位异或后赋值                 |

示例

```go
package main

import (
	"fmt"
)

func main() {
	a := 1

	a += 1 // 等价于 a = a + 1
	fmt.Printf("a: %v\n", a)
	// a: 2

}

```
