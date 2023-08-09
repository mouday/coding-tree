# 5.9、Golang标准库-sort

sort包提供了切片排序

排序示例

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    s := []int{3, 4, 1, 2}

    sort.Ints(s)

    fmt.Printf("s: %v\n", s)
    // s: [1 2 3 4]
}

```

## 接口

```go
type Interface interface {
    Len() int

    Less(i, j int) bool

    Swap(i, j int)
}

```

## 自定义排序

实现接口示例

```go
package main

import (
    "fmt"
    "sort"
)

type NewInts []uint

func (n NewInts) Len() int {
    return len(n)
}

func (n NewInts) Less(i, j int) bool {
    return n[i] < n[j]
}

func (n NewInts) Swap(i, j int) {
    n[i], n[j] = n[j], n[i]
}

func main() {
    s := []uint{3, 4, 1, 2}

    sort.Sort(NewInts(s))

    fmt.Printf("s: %v\n", s)
    // s: [1 2 3 4]
}

```

## 浮点数切片

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    s := []float64{3.1, 4.2, 1.9, 2.0}

    sort.Float64s(s)

    fmt.Printf("s: %v\n", s)
    // s: [1.9 2 3.1 4.2]
}


```

## 字母字符串切片

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    s := []string{"tom", "jack", "steve"}

    sort.Strings(s)

    fmt.Printf("s: %v\n", s)
    // s: [jack steve tom]
}

```

## 数字字符串切片

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    s := []string{"23", "12", "54"}

    sort.Strings(s)

    fmt.Printf("s: %v\n", s)
    // s: [12 23 54]
}

```

## 中文字符串切片

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    s := []string{"喔", "啊", "饿"}

    sort.Strings(s)

    fmt.Printf("s: %v\n", s)
    // s: [啊 喔 饿]

    for _, v := range s {
        fmt.Printf("v: %v %v\n", v, []byte(v))
    }
    // 一个汉字占3个字节
    // v: 啊 [229 149 138]
    // v: 喔 [229 150 148]
    // v: 饿 [233 165 191]
}

```

## 二维切片排序

```go
package main

import (
    "fmt"
    "sort"
)

type Array [][]int

// 实现接口
func (array Array) Len() int {
    return len(array)
}

func (array Array) Less(i, j int) bool {
    // 按照第二个值进行比较
    return array[i][1] < array[j][1]
}

func (array Array) Swap(i, j int) {
    array[i], array[j] = array[j], array[i]
}

func main() {
    s := [][]int{
        {1, 2},
        {3, 6},
        {4, 5},
    }

    sort.Sort(Array(s))

    fmt.Printf("s: %v\n", s)
    // s: [[1 2] [4 5] [3 6]]
}

```

## map切片排序

```go
package main

import (
    "fmt"
    "sort"
)

type MapSlice []map[string]int

// 实现接口
func (ml MapSlice) Len() int {
    return len(ml)
}

func (ml MapSlice) Less(i, j int) bool {
    // 按照age 年龄值进行比较
    return ml[i]["age"] < ml[j]["age"]
}

func (ml MapSlice) Swap(i, j int) {
    ml[i], ml[j] = ml[j], ml[i]
}

func main() {
    s := MapSlice{
        {"money": 10, "age": 21},
        {"money": 11, "age": 20},
        {"money": 12, "age": 22},
    }

    sort.Sort(s)

    fmt.Printf("s: %v\n", s)
    // s: [
    // map[age:20 money:11]
    // map[age:21 money:10]
    // map[age:22 money:12]
    // ]
}

```

## 结构体切片排序

```go
package main

import (
    "fmt"
    "sort"
)

type People struct {
    Name string
    Age  int
}

type PeopleSlice []People

// 实现接口
func (s PeopleSlice) Len() int {
    return len(s)
}

func (s PeopleSlice) Less(i, j int) bool {
    // 按照age 年龄值进行比较
    return s[i].Age < s[j].Age
}

func (s PeopleSlice) Swap(i, j int) {
    s[i], s[j] = s[j], s[i]
}

func main() {
    s := PeopleSlice{
        {Name: "Tom", Age: 21},
        {Name: "Jack", Age: 20},
        {Name: "Steve", Age: 22},
    }

    sort.Sort(s)

    fmt.Printf("s: %v\n", s)
    // s: [{Jack 20} {Tom 21} {Steve 22}]
}

```