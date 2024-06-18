# 详解go如何优雅的使用接口与继承

## 目录
- 引言
- Go接口的使用
- 接口核心要点
- Go继承的使用
- 推荐使用接口和组合而不是嵌套

## 引言

Go语言中的接口和嵌套结构体是两种重要的代码设计方式。接口定义了一组方法签名，使得不同的类型能够以相同的方式进行交互。而嵌套结构体则像面向对象编程中的继承，允许基于已有类型定义新的类型，并自动继承其字段和方法。对于推荐的Go编程习惯是优先使用接口和组合，而避免过多的嵌套，以降低代码耦合，增强可维护性


## Go接口的使用

在Go语言中，接口（interface）是定义一组方法的集合，任何对象只要实现了这些方法就是这个接口的实现类

- 定义接口：接口通过关键字interface来定义，其后跟随一对花括号，包含一系列方法的声明
- 实现接口：在Go语言中，接口的实现是隐式的，只要一个类型包含了接口中所需要的所有方法，那么这个类型就算实现了这个接口
- 使用接口变量：接口变量可以存储所有实现了该接口的实例
- 空接口：空接口interface{}，可以接收任何类型的值，因此可以用来实现通用函数


代码示例：

```go
package main

import (
    "fmt"
)

// 加法接口
type Adder interface {
    Add(a, b int) int
}

// 实现加法的类
type Calc struct{}

// 实现Adder接口的Add方法
func (c Calc) Add(a, b int) int {
    return a + b
}

func main() {
    var a Adder
    c := Calc{}
    a = c

    result := a.Add(1, 2)

    fmt.Println(result)
}


```


## 接口核心要点

- 在 Go语言中，如果一个接口定义了多个方法，而某个结构体只实现了这个接口的部分方法，那么这个结构体不算是这个接口的实现者
- Go语言的接口是静态的，一旦定义就不能再添加或删除方法，对于需要动态改变的需求可能无法满足
- 接口未初始化时，其值为nil，调用其方法会引发panic。接口值可以被认为是包含两个部分的元组（tuple），一个具体类型和该类型的值。当我们声明了一个接口值却没有进行初始化（也就是没有赋值），那么这个接口的类型和值都是nil。在Go中，调用值为nil的函数是非法的，所以如果尝试在这样的接口值上调用方法，那么程序将触发运行时错误
```go
type MyInterface interface {
    MyMethod()
}

func main() {
    var mi MyInterface // 声明一个接口，但未进行初始化
    mi.MyMethod()     // 运行时错误：在nil的接口值上调用方法
}

```


如果接口的值为nil，那么我们可以通过类型断言来判断接口的动态类型是否为nil，从而避免panic

```go
type MyInterface interface {
    MyMethod()
}

func main() {
    var mi MyInterface // 声明一个接口，但未进行初始化
    if mi != nil {
        mi.MyMethod()
    }
}

```


让接口值包含了一个具体的类型，但是该类型的值为nil，那么是完全合法的，因为类型信息仍然存在

```go
type MyInterface interface {
    MyMethod()
}

type MyType struct{}

func (mt *MyType) MyMethod() {
    if mt == nil {
        fmt.Println("nil receiver value")
    }
}

func main() {
    var mt *MyType    //声明并初始化为nil值
    var mi MyInterface = mt //将nil值赋给接口
    mi.MyMethod()     // "nil receiver value"
}

```

空接口(interface{}) 和 类型断言: Go语言中，空接口(interface{})可以表示任何类型，是Go语言中的一种“万能”类型。由于空接口可以表示任何类型，因此我们如果不确定关于接口值具体类型，就需要使用类型断言来判断接口值的类型

```go
var i interface{} = "a string"
s := i.(string)  // 类型断言
fmt.Println(s)

s, ok := i.(string)
if ok {
    fmt.Println(s)
} else {
    // 当类型断言失败时，可以做一些别的操作
    fmt.Println("Not a string")
} 

```


每个类型实现的接口并不需要在该类型中显式声明。这可能导致开发人员在不经意间“实现”了一个接口，然后当该接口发生更改时，损坏现有的代码。总的来说，Go的这种接口实现方式提供了很大的灵活性，但也可能带来隐藏的陷阱

Go语言的接口中并没有标识符，如果一个类型实现了多个接口，并且这些接口中有同名的方法，可能会造成某些问题

Go的接口是隐式实现的，只要类型实现的方法满足接口定义，那么就算实现了该接口，不需要显式地声明这一点
```go
type InterfaceA interface {
    DoSomething()
}

type InterfaceB interface {
    DoSomething()
}

```
```go
type MyType struct{}

func (m MyType) DoSomething() {
    fmt.Println("Doing something")
}

```


在这个例子中，MyType钟都实现了InterfaceA和InterfaceB，即使它们都有一个同名的方法DoSomething

然而，如果接口有同名但签名不同的方法，那么该类型就不能同时实现这两个接口
```go
type InterfaceA interface {
    DoSomething(int)
}

type InterfaceB interface {
    DoSomething(string)
}

```


在这种情况下，你不能让一个类型同时实现这两个接口，因为无法确保一个方法同时满足两个签名。要解决这个问题，你可以让你的类型实现一个方法，该方法接受一个空接口参数（可以接受任何类型），然后在方法内部检查并处理不同类型的参数：

```go
type MyType struct{}

func (m MyType) DoSomething(value interface{}) {
    switch v := value.(type) {
    case int:
        fmt.Printf("Doing something with int: %d\n", v)
    case string:
        fmt.Printf("Doing something with string: %s\n", v)
    default:
        fmt.Printf("Don't know how to do something with %T\n", v)
    }
}

```


这种解决办法并不完美，它会使代码变得复杂且难以理解，因此尽可能地避免在不同的接口中使用同名但签名不同的方法。在设计接口时，应尽量保证接口的方法是唯一的，并且清晰地表达了其行为


## Go继承的使用

Go语言的继承是通过字段嵌套的方式实现的，所谓嵌套，是指一个结构体作为另一个结构体的字段。内嵌结构体的所有字段和方法都成为了外部结构体的成员

- 定义被嵌套的结构体：被继承的结构体需要先定义，包含一系列字段和方法
- 定义继承结构体：在新定义的结构体中，包含被继承的结构体作为匿名字段
- 使用继承：被继承的结构体的所有字段和方法都可以被新的结构体使用，就好像它自己拥有的一样


代码示例：

```go
// 定义Animal类型
type Animal struct {
    Name string
    Age  int
}

// 创建一个Animal的方法，打印动物叫的声音
func (a *Animal) Sound() {
    fmt.Println("I am an animal, I don't have a specific sound.")
}

// 创建Dog类型，包含Animal类型，这就是Go中的嵌套，类似于其他语言中的继承
type Dog struct {
    Animal // 嵌入Animal
}

// 为Dog类型创建一个Sound方法，打印狗叫的声音
func (d *Dog) Sound() {
    fmt.Println("Woof woof!")
}

```

Dog类型中也定义了一个Sound方法，这样，当你调用Dog类型的Sound方法时，其实是调用的Dog自身定义的Sound，而不是Animal中的Sound。这就实现了方法的覆盖（override），也和其他面向对象语言中的继承效果类似

在很多面向对象的语言中，如Java，都有"super"关键字可以用来调用父类的方法或属性。但是Go语言并没有"super"关键字。如果需要调用被嵌套结构体的同名方法，需要显式地指定结构体的类型
```go
type B struct{}

func (b B) Print() {
    fmt.Println("B")
}

type A struct {
    B
}

func (a A) Print() {
    fmt.Println("A")
    a.B.Print() // 显示调用被嵌套结构体（相当于父类）的同名方法
}

```


在Go语言中不推荐使用大量的嵌套，因为这会使代码结构变得复杂，不易维护和阅读。当需要代码复用时，更倾向于使用接口（interface）和组合。这样可以减少代码之间的耦合，保持代码的简洁和清晰。


## 推荐使用接口和组合而不是嵌套

假设我们现在要设计一些不同类型的动物，并让它们都能叫。有的是猫，有的是狗。如果我们使用传统的嵌套结构体，代码可能会这样写：

```go
type Animal struct {
    Name string
}

func (a *Animal) Sound() {
    fmt.Println(a.Name + " makes a sound.")
}

type Dog struct {
    Animal
}

type Cat struct {
    Animal
}

```


然后，如果我们需要增加如“让动物跑”的功能，但猫和狗跑的方式是不同的，就会显得很麻烦，因为我们需要在Dog和Cat结构体中单独去实现。

相反，如果我们使用接口和组合，代码可以设计得更优雅些：

```go
type Animal interface {
    Sound() // 所有的动物都会叫
    Run()   // 所有的动物都会跑
}

type BasicAnimal struct{
    Name string
}

func (a *BasicAnimal) Sound() {
    fmt.Println(a.Name + " makes a sound.")
}

type Dog struct {
    BasicAnimal // 使用组合而不是嵌套
}

func (d *Dog) Run() {
    fmt.Println("Dog runs happily.")
}

type Cat struct {
    BasicAnimal // 使用组合而不是嵌套
}

func (c *Cat) Run() {
    fmt.Println("Cat runs gracefully.")
}

```

在这个例子中，动物都实现了Animal接口。我们定义的Dog和Cat都使用了组合，它们都有一个BasicAnimal字段。这样就实现了代码的复用：不用复写Sound()方法。

此外，当跑的行为对于不同动物有不同的实现时，我们就在相应的结构体中分别实现Run()方法，从而体现出各自的个

总结一下，使用接口和组合的好处：

- 将公共的行为定义在一起，避免代码重复。
- 保持代码解耦，各个结构体只负责自己的行为。
- 易于扩展，当你需要增加新的动物，并增加新的行为时，无需修改已有的代码，只需新实现相应的接口方法即可。
