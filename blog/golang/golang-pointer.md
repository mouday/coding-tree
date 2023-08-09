# 3.5、Golang 指针

## 指针

- 取地址：`&`
- 取值：`*`


指针地址：每一个变量都有一个地址，地址代表变量在内存中的位置

Go语言中的值类型（int、float、bool、string、array、struct）

对应的指针类型（*int、*int64、*string）

指针变量定义语法

```go
// 指针变量名 指针类型
var var_name *var_type
```

示例

```go
package main

import "fmt"

func main() {
    // 声明指针变量
    var ip *int
    fmt.Printf("%v\n", ip) // <nil>
    fmt.Printf("%T\n", ip) // *int

    // 声明int变量
    var i int = 10

    // 取地址
    ip = &i

    fmt.Printf("%v\n", ip)
    // 0xc0000ae010

    // 取值
    fmt.Printf("%v\n", *ip)
    // 10
}

```

## 指向数组的指针

定义语法

```go
// 表示数组里面的元素类型是指针类型
var ptr [MAX]*int;
```

示例

```go
package main

import "fmt"

func main() {
	arr := [...]int{1, 2, 3}
	var ptr [len(arr)]*int

	fmt.Printf("%v\n", ptr)
	// [<nil> <nil> <nil>]

	for i := 0; i < len(arr); i++ {
		ptr[i] = &arr[i]
	}

	fmt.Printf("%v\n", ptr)
	// [0xc000022090 0xc000022098 0xc0000220a0]

	for i := 0; i < len(ptr); i++ {
		fmt.Printf("%v\t", *ptr[i])
	}
	// 1	2	3
}

```

