# 5.6、Golang标准库-builtin

这个包不需要导入，可以直接使用

这个包提供了一些类型声明、变量和常量声明，还有一些便利函数

## append

可以在slice后添加元素

```go
package main

import "fmt"

func main() {
    s := []int{1, 2, 3}

    slice := append(s, 100)
    fmt.Printf("slice: %v\n", slice)
    // slice: [1 2 3 100]

    s2 := []int{100, 200}
    slice2 := append(s, s2...)
    fmt.Printf("slice2: %v\n", slice2)
    // slice2: [1 2 3 100 200]

}

```

## len

返回数组、切片、字符串、通道的长度

```go
package main

import "fmt"

func main() {
    s := []int{1, 2, 3}

    fmt.Printf("len(s): %v\n", len(s))
    // len(s): 3

    s2 := "hello"
    fmt.Printf("len(s2): %v\n", len(s2))
    // len(s2): 5

}

```

## print、println

打印输出到控制台

```go
package main

func main() {
    print("name", " ", 23, "\n")
    // name 23

    println("name", " ", 23)
    // name   23

}

```

## panic

抛出一个panic异常

```go
package main

import "fmt"

func main() {
    // defer 会被执行
    defer fmt.Println("defer panic")
    panic("panic")
    fmt.Println("after panic")
    // defer panic
    // panic: panic
}

```

## new 和 make

new 和 make区别：

1. make只能用来分配及初始化类型为slice，map，channel 的数据；new可以分配任意类型的数据
2. new分配返回的是指针，即类型`*T`；make会返回引用，即`T`
3. new分配的空间被清零，make分配后，会进行初始化

```go
package main

import "fmt"

func main() {
    b := new(bool)
    fmt.Printf("b: %T\n", b)
    // b: *bool
    fmt.Printf("b: %v\n", b)
    // b: 0xc000124002
    fmt.Printf("b: %v\n", *b)
    // b: false
}

```

```go
package main

import "fmt"

func main() {
    // 完整写法
    var p *[]int = new([]int)
    *p = make([]int, 0, 100)
    fmt.Printf("p: %v\n", p)
    // p: &[]

    // 习惯写法
    v := make([]int, 0)
    fmt.Printf("v: %v\n", v)
    // v: []

}

```
