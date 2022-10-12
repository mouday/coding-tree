# 3.4、Golang 函数

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


## 匿名函数

语法格式

```go
// 没有函数名称
func (参数列表)(返回值){
    
}
```

示例1

```go
package main

import "fmt"

func main() {
    sum := func(a int, b int) int {
        return a + b
    }

    ret := sum(1, 1)
    fmt.Printf("%v", ret)
    // 2
}

```

示例2

```go
package main

import "fmt"

func main() {
    ret := func(a int, b int) int {
        return a + b
    }(1, 1)

    fmt.Printf("%v", ret)
    // 2
}

```

## 闭包

闭包可以理解成：定义在一个函数内部的函数，本质上是将函数内部和函数外部连接起来的桥梁

```
闭包 = 函数 + 引用环境
```

示例1

```go
package main

import (
    "fmt"
)

// 返回一个函数
func add() func(int) int {
    var a int
    return func(b int) int {
        a += b
        return a
    }
}

func main() {
    f := add()
    fmt.Println(f(1)) // 1
    fmt.Println(f(1)) // 2
    fmt.Println(f(1)) // 3

    f2 := add()
    fmt.Println(f2(1)) // 1
    fmt.Println(f2(1)) // 2
    fmt.Println(f2(1)) // 3
}

```

示例2
```go
package main

import (
    "fmt"
    "strings"
)

// 返回一个函数
func makeSuffixFunc(suffix string) func(string) string {
    return func(name string) string {
        if strings.HasSuffix(name, suffix) {
            return name
        } else {
            return name + suffix
        }
    }
}

func main() {
    txtFunc := makeSuffixFunc(".txt")
    jpgFunc := makeSuffixFunc(".jpg")

    fmt.Println(txtFunc("test")) // test.txt
    fmt.Println(jpgFunc("test")) // test.jpg
}

```

示例3

```go
package main

import (
    "fmt"
)

// 返回两个函数
func calc(base int) (func(int) int, func(int) int) {

    add := func(i int) int {
        return base + i
    }

    sub := func(i int) int {
        return base - i
    }

    return add, sub
}

func main() {
    f1, f2 := calc(10)
    fmt.Println(f1(1), f2(2))
    // 11 8
}

```

## 递归

递归函数：函数内部调用函数自身的函数

递归函数特点

- 递归就是自己调用自己
- 必须定义退出条件，否则就会成为死循环
- 递归很可能会出现栈空间内存溢出

示例：阶乘

for循环实现

```go
package main

import "fmt"

// 阶乘
func foo(n int) int {
    ret := 1
    for i := 1; i <= n; i++ {
        ret *= i
    }

    return ret
}

func main() {
    // 5! = 5 x 4 x 3 x 2 x 1
    ret := foo(5)
    fmt.Println(ret)
    // 120
}

```

递归实现

```go
package main

import "fmt"

// 阶乘
func foo(n int) int {
    
    if n == 1 {
        // 退出条件
        return 1
    } else {
        // 自己调用自己
        return n * foo(n-1)
    }
}

func main() {
    // 5! = 5 x 4 x 3 x 2 x 1
    ret := foo(5)
    fmt.Println(ret)
    // 120
}

```

菲波那切数列

计算公式

```
f(n) = f(n-1) + f(n-2) 
且
f(2) = f(1) = 1
```

代码实现

```go
package main

import "fmt"

// 菲波那切数列
func foo(n int) int {
    if n == 1 || n == 2 {
        // 退出条件
        return 1
    } else {
        // 递归表达式
        return foo(n-1) + foo(n-2)
    }
}

func main() {
    // foo(5) = foo(4) + foo(3) = 3 + 2 = 5
    // foo(4) = foo(3) + foo(2) = 2 + 1 = 3
    // foo(3) = foo(2) + foo(1) = 1 + 1 = 2
    // foo(2) = 1
    // foo(1) = 1

    ret := foo(5)
    fmt.Println(ret)
    // 5
}

```

## defer语句

defer语句后面的语句延迟处理，在defer归属的函数即将返回时，将延迟处理的语句按照defer定义的逆序进行执行

也就是说，先定义的defer语句最后执行；后定义的defer语句，先执行

defer特性

- 关键字defer用于注册延迟调用
- 这些调用知道return前才被执行，可以用来做资源清理
- 多个defer语句，按照先进后出的顺序执行
- defer语句中的变量，defer声明时就决定了

defer用途

- 关闭文件句柄
- 锁资源释放
- 数据库连接释放

示例

```go
package main

import "fmt"

func main() {
    fmt.Println("start")

    defer fmt.Println("defer1")
    defer fmt.Println("defer2")
    defer fmt.Println("defer3")

    fmt.Println("end")

    // start
    // end
    // defer3
    // defer2
    // defer1
}

```

## init函数

init函数是特殊函数，会先于main函数执行，实现包级别的`初始化操作`

init函数特点

- init函数先于main函数`自动执行`，不能被其他函数调用
- init函数没有输入参数，没有返回值
- 每个包可以有多个init函数
- 包的每个源文件也可以有多个init函数
- 同一个包的init执行顺序，golang没有明确意义
- 不同胞的init函数按照包导入的依赖关系决定执行顺序


golang初始化顺序

```
变量初始化 -> init() -> main()
```

示例

```go
package main

import "fmt"

var i int = initVar()

func initVar() int {
    fmt.Println("initVar")
    return 100
}

func init() {
    fmt.Println("init")
}

func main() {
    fmt.Println("main")
}

// initVar
// init
// main

```
