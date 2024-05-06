# 3.2、Golang 切片 slice

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

## 切片初始化

直接初始化

```go
s := []int{1, 2, 3, 4, 5}
fmt.Printf("s: %v\n", s)
// s: [1 2 3 4 5]
```

使用数组初始化

```go
arr := [...]int{1, 2, 3, 4, 5}

s := arr[:]
fmt.Printf("s: %v\n", s)
// s: [1 2 3 4 5]
```

空切片

```go
var s []int
```


切片操作

```go
package main

import (
    "fmt"
)

func main() {
    s := []int{1, 2, 3, 4, 5}
    fmt.Printf("s: %v\n", s)
    // s: [1 2 3 4 5]

    // [0, 3)
    s1 := s[0:3]
    fmt.Printf("s1: %v\n", s1)
    // s1: [1 2 3]

    // [3, 最后)
    s2 := s[3:]
    fmt.Printf("s2: %v\n", s2)
    // s2: [4 5]

    // [开始，3)
    s3 := s[:3]
    fmt.Printf("s3: %v\n", s3)
    // s3: [1 2 3]

    // 拷贝
    s4 := s[:]
    fmt.Printf("s4: %v\n", s4)
    // s4: [1 2 3 4 5]
}

```

## 切片的遍历

for循环

```go
package main

import "fmt"

func main() {
    var s = []int{1, 2, 3, 4}
    length := len(s)

    for i := 0; i < length; i++ {
        fmt.Printf("s[%v]=%v\n", i, s[i])
    }
    // s[0]=1
    // s[1]=2
    // s[2]=3
    // s[3]=4
}

```

for...range

```go
package main

import "fmt"

func main() {
    var s = []int{1, 2, 3, 4}

    for index, value := range s {
        fmt.Printf("s[%v]=%v\n", index, value)
    }

    // s[0]=1
    // s[1]=2
    // s[2]=3
    // s[3]=4
}
```

## 切片的CURD(添加、删除、修改、查询)

切片是动态数组

添加元素

```go
package main

import "fmt"

func main() {
    var s = []int{}

    // 添加单个元素
    s = append(s, 1)

    // 添加多个元素
    s = append(s, 2, 3)

    fmt.Printf("s: %v\n", s)
    // s: [1 2 3]

}

```

删除元素

```go
package main

import "fmt"

func main() {
    var s = []int{1, 2, 3, 4, 5}

    // 删除元素3，索引为2
    // 公式：s = append(s[:index], s[index+1:]...)
    s = append(s[:2], s[3:]...)

    fmt.Printf("s: %v\n", s)
    // s: [1 2 4 5]
}

```

修改元素

```go
package main

import (
    "fmt"
)

func main() {
    var s = []int{1, 2, 3, 4, 5}

    s[2] = 6
    fmt.Printf("s: %v\n", s)
    // s: [1 2 6 4 5]
}

```

查询元素

```go
package main

import (
    "fmt"
)

func main() {
    var s = []int{1, 2, 3, 4, 5}

    // 查询元素的索引
    for index, value := range s {
        if value == 3 {
            fmt.Printf("index: %v\n", index)
            break
        }
    }
    // index: 2
}

```

## 切片的复制 copy

浅拷贝

```go
package main

import (
    "fmt"
)

func main() {
    var s1 = []int{1, 2, 3, 4, 5}

    // 浅拷贝，地址引用，指向同一个对象
    var s2 = s1

    s2[0] = 6

    fmt.Printf("s1: %v\n", s1)
    // s1: [6 2 3 4 5]

    fmt.Printf("s2: %v\n", s2)
    // s2: [6 2 3 4 5]

}

```

深拷贝

```go
package main

import (
    "fmt"
)

func main() {
    var s1 = []int{1, 2, 3, 4, 5}

    // copy目标容器，没有足够的空间接收数据
    var s2 = []int{}
    copy(s2, s1)

    fmt.Printf("s2: %v\n", s2)
    // s2: []

    // copy目标容器，需要预先开辟足够的内存空间
    var s3 = make([]int, len(s1))
    copy(s3, s1)
    s3[0] = 6

    // s1没有被修改
    fmt.Printf("s1: %v\n", s1)
    // s1: [1 2 3 4 5]

    // s3被修改了
    fmt.Printf("s3: %v\n", s3)
    // s3: [6 2 3 4 5]

}

```
