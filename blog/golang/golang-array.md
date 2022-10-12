# 3.1、Golang 数组

数组：相同数据类型的一组数据的集合

- 数组长度不能修改
- 数组可以通过下标（索引）访问元素
- 数组默认初始化为零值

## 定义

```go
var variable_name [SIZE] variable_type
```

示例

```go
package main

import "fmt"

func main() {
    var arr1 [2]string
    var arr2 [3]int

    fmt.Printf("arr1: %v\n", arr1) // arr1: [ ]
    fmt.Printf("arr1: %T\n", arr1) // arr1: [2]string

    fmt.Printf("arr2: %v\n", arr2) // arr2: [0 0 0]
    fmt.Printf("arr2: %T\n", arr2) // arr2: [3]int

}

```

## 初始化

示例

```go
package main

import "fmt"

func main() {
    var arr1 = [2]string{"Tom", "Jack"}
    var arr2 = [3]int{1, 2, 3}
    var arr3 = [2]bool{true, false}

    fmt.Printf("arr1: %v\n", arr1)
    // arr1: [Tom Jack]

    fmt.Printf("arr2: %v\n", arr2)
    // arr2: [1 2 3]

    fmt.Printf("arr3: %v\n", arr3)
    // arr3: [true false]
}

```

可以省略长度

```go
var arr1 = [...]int{1, 2, 3}

// 等价于
// var arr1 = [3]int{1, 2, 3}

fmt.Printf("len: %v\n", len(arr1))
// len: 3
```

指定索引值

```go
package main

import "fmt"

func main() {
    // 未指定的值初始化为零值
    var arr1 = [...]int{0: 1, 2: 3}

    fmt.Printf("arr1: %v\n", arr1)
    // arr1: [1 0 3]

}

```

## 访问数组元素

示例

```go
package main

import "fmt"

func main() {

    var arr1 [3]int
    fmt.Printf("arr1: %v\n", arr1)
    // arr1: [0 0 0]

    // 赋值
    arr1[0] = 1
    arr1[2] = 2
    fmt.Printf("arr1: %v\n", arr1)
    // arr1: [1 0 2]

    // 取值
    fmt.Printf("arr1[0]: %v\n", arr1[0])
    // arr1[0]: 1

    // 获取数组长度
    fmt.Printf("len(arr1): %v\n", len(arr1))
    // len(arr1): 3

    // 数组长度越界
    fmt.Printf("arr1[0]: %v\n", arr1[3])
    // invalid argument: index 3 out of bounds [0:3]
}
```

## 遍历数组

方式一：for

```go
package main

import "fmt"

func main() {

    var arr = [...]int{100, 200, 300}

    // 快捷键for + tab
    for i := 0; i < len(arr); i++ {
        fmt.Printf("arr[%v]=%v\n", i, arr[i])
    }

    // arr[0]=100
    // arr[1]=200
    // arr[2]=300
}

```

方式二：for...range

```go
package main

import "fmt"

func main() {

    var arr = [...]int{100, 200, 300}

    // 快捷键forr + tab
    // 索引, 值
    for index, value := range arr {
        fmt.Printf("arr[%v]=%v\n", index, value)
    }

    // arr[0]=100
    // arr[1]=200
    // arr[2]=300
}

```



