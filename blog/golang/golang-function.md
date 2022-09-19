# 第十五章 Golang 函数

## Go语言函数特性

1. 函数分类：
- 普通函数
- 匿名函数
- 方法

2. 函数不能重载，即不允许函数同名
3. 函数不能嵌套函数，但可以嵌套匿名函数
4. 函数可以赋值给变量
5. 函数可以作为参数传递给另一个函数
6. 函数的返回值可以是一个函数
7. 函数传参传递是参数的副本
8. 函数参数可以没有名称

## 函数定义

```go
func function_name([parameter list])[return_type] {
    // 函数体
}
```

示例

```go
package main

import "fmt"

func sum(a int, b int) (ret int) {
    return a + b
}

func main() {
    r := sum(1, 1)
    fmt.Printf("%v", r)
    // 2
}

```

## 函数返回值

没有返回值

```go
func foo(){
    fmt.Println("Hello")
}
```

一个返回值

```go
func sum(a int, b int) (ret int) {
    return a + b
}
```

多个返回值

```go
func foo() (name string, age int) {
    return "Tom", 23
}

// 省略命名
func foo() (string, int) {
    return "Tom", 23
}
```

多值返回常用于函数返回错误
```
value, exists
value, ok
value, err
```

返回值过多（4个以上），通常放在容器中返回

```
同类型 slice
不同类型 map
```

返回值不想使用，可以使用 `_` 丢弃

## 函数参数

参数类型：
- 形参 声明函数时的参数列表
- 实参 调用时传递的参数

特点：

- 参数可以0个或者有多个，需要指定数据类型
- 函数是传值的方式进行传参
- 可以使用变长参数`...`

示例
```go
package main

import "fmt"

// a， b形参
func sum(a int, b int) (ret int) {
    return a + b
}

func main() {
    // 1, 1 实参
    r := sum(1, 1)
    fmt.Printf("%v", r)
    // 2
}

```

注意：

- map、slice、interface、channel数据类型是指针，拷贝的是指针，有可能会改变原始数据

```go
package main

import "fmt"

func foo(arr []int) {
    arr[0] = 100
}

func main() {

    a := []int{1, 2, 3}

    foo(a)

    fmt.Printf("%v", a)
    // [100 2 3]
}

```

变长参数

```go
package main

import "fmt"

func foo(args ...int) {
    for _, value := range args {
        fmt.Printf("%v ", value)
    }
}

func main() {

    foo(1, 2, 3)

    // 1 2 3
}

```


多种参数混合使用

```go
package main

func foo(name string, isMan bool, arr ...int) {

}

func main() {

    foo("Tom", true, 1, 2, 3)

}

```

## 函数类型与函数变量

定义函数类型
```go
// 示例：接收两个参数，返回一个参数
type function_name func(int, int) int
```

示例

```go
package main

import "fmt"

// 定义函数类型
type foo func(int, int) int

func sum(a int, b int) int {
    return a + b
}

func max(a int, b int) int {
    if a > b {
        return a
    } else {
        return b
    }
}

func main() {
    // 声明
    var f foo

    f = sum
    s := f(1, 2)
    fmt.Printf("%v\n", s) // 3

    f = max
    m := f(1, 2)
    fmt.Printf("%v\n", m) // 2

}

```

## 高阶函数

go语言的函数，可以作为函数的参数，也可以作为函数返回值

函数作为参数

```go
package main

import "fmt"

func sayHello(name string) {
    fmt.Printf("Hello %s", name)
}

func foo(name string, fun func(string)) {
    fun(name)
}

func main() {

    foo("Tom", sayHello)
    // Hello Tom

}

```

函数作为返回值
```go
package main

import "fmt"

func sum(a int, b int) int {
    return a + b
}

func sub(a int, b int) int {
    return a - b
}

func calc(name string) func(a int, b int) int {
    switch name {
    case "+":
        return sum
    case "-":
        return sub
    default:
        return nil
    }
}

func main() {
    sum := calc("+")
    r := sum(1, 1)
    fmt.Printf("%v", r)
    // 2
}

```


