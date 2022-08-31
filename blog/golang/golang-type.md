# 第八章 Golang 数据类型

## 数据类型

- 布尔型 true/false
- 字符串类型
- 数字类型 
    - 浮点型：
        - float32 
        - float64
        - complex32
        - complex64
    - 无符号
        - uint8
        - uint16
        - uint32
        - uint64
    - 有符号
        - int8
        - int16
        - int32
        - int64
    - 其他
        - byte 类似 uint8
        - rune 类似 int32
        - uintptr 存放指针
- 派生类型
    - 指针类型 Pointer
    - 数组类型
    - 结构化类型 struct
    - Channel类型
    - 函数类型
    - 切片类型
    - 接口类型interface
    - Map类型

示例

```go
package main

import "fmt"

func foo() {}

func main() {
	// 字符串
	name := "Tom"
	fmt.Printf("name: %T\n", name) // name: string

	// 数字
	age := 23
	fmt.Printf("age: %T\n", age) // age: int

	// 布尔
	isStudent := true
	fmt.Printf("isStudent: %T\n", isStudent) // isStudent: bool

	// 指针
	ptr := &age
	fmt.Printf("ptr: %T\n", ptr) // ptr: *int

	// 数组
	arr := [...]int{1, 2, 3}
	fmt.Printf("arr: %T\n", arr) // arr: [3]int

	// 切片
	slice := []int{1, 2, 3}
	fmt.Printf("slice: %T\n", slice) // slice: []int

	// 函数
	fmt.Printf("foo: %T\n", foo) // foo: func()
}

```

## 布尔类型

true/false

定义

```go
package main

import "fmt"

func main() {
    var b1 bool = true
    var b2 bool = false

    var b3 = true
    var b4 = false

    b5 := true
    b6 := false

    fmt.Printf("b1: %v\n", b1) // b1: true
    fmt.Printf("b2: %v\n", b2) // b2: false
    fmt.Printf("b3: %v\n", b3) // b3: true
    fmt.Printf("b4: %v\n", b4) // b4: false
    fmt.Printf("b5: %v\n", b5) // b5: true
    fmt.Printf("b6: %v\n", b6) // b6: false
}
``` 

应用

```go
package main

import "fmt"

func main() {
   // if 逻辑判断
    age := 18
    if age >= 18 {
        fmt.Println("age >= 18")
    } else {
        fmt.Println("age < 18")
    }

    // for循环
    count := 5
    for i := 0; i < count; i++ {
        fmt.Printf("i: %v\n", i)
    }
}

```

注意：不能使用 `0` 和 `非0` 表示真假

