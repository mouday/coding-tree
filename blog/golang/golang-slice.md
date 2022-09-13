# 第十三章 Golang 切片 slice

切片：可变长度的数组

- 自动扩容

## 切片声明

和数组类似，区别在于不添加长度

```go
var  identifier []type
```

切片是引用类型，可以使用`make` 函数创建切片

```go
// len是数组长度，也是切片的初始长度
var slice []type = make([]type, len)

// 简写
slice := make([]type, len)

// 指定容量
slice := make([]type, len, capacity)
```

示例

```go
package main

import "fmt"

func main() {
    
    // 数组 指定长度
    var arr = [...]int{}

    // 切片 不指定长度
    var slice = []int{}

    fmt.Printf("arr: %T\n", arr)
    // arr: [0]int

    fmt.Printf("slice: %T\n", slice)
    // slice: []int

}

```

使用make声明

```go
package main

import "fmt"

func main() {

    var slice = make([]int, 3)

    fmt.Printf("slice: %T\n", slice)
    // slice: []int

}

```

## 切片的长度和容量

```go
package main

import "fmt"

func main() {

    var slice = make([]int, 3)

    // 长度
    fmt.Printf("len(slice): %v\n", len(slice))
    // len(slice): 3

    // 容量
    fmt.Printf("cap(slice): %v\n", cap(slice))
    // cap(slice): 3

}

```
