# 3.6、Golang 结构体 struct

## 类型定义和类型别名

类型定义的语法

```go
type NewType Type
```

示例

```go
package main

import "fmt"

func main() {
    // 定义类型
    type MyInt int

    var i MyInt

    i = 100
    fmt.Printf("%T", i)
    // main.MyInt
}

```


类型别名语法
```go
type NewType = Type
```

示例

```go
package main

import "fmt"

func main() {
    // 定义类型别名
    type MyInt = int

    var i MyInt

    i = 100
    fmt.Printf("%T", i)
    // int
}

```

类型定义和类型别名的区别

- 类型定义相当于定义了一个全新的类型
- 类型别名只会在代码中存在，编译完成后并不会存在
- 类型别名可以使用原来类型所有的方法

## Golang结构体

golang中没有面向对象的概念，但是可以使用结构体来实现，面向对象编程的一些特性，例如：继承、组合等

结构体的定义

```go
type struct_variable_type struct {
    // 成员
    member definition;
    member definition;
    ...
    member definition;
}
```

示例

```go
// 定义一个结构体Person
type Person struct {
    id    int
    name  string
    age   int
    email string
}

// 可以把相同类型的成员合并到一行
type Person struct {
    id, age     int
    name, email string
}
```

声明结构体变量

```go
var tom Person

fmt.Printf("%v", tom)
// {0 0  }

jack := Person{}
fmt.Printf("%v", jack)
// {0 0  }
```

访问结构体成员

```go
package main

import "fmt"

// 定义一个结构体Person

// 可以把相同类型的成员合并到一行
type Person struct {
    id, age     int
    name, email string
}

func main() {
    var tom Person

    tom.id = 12
    tom.name = "Tom"
    tom.age = 23
    tom.email = "123@qq.com"

    fmt.Printf("%v", tom)
    // {12 23 Tom 123@qq.com}

}

```

匿名结构体

```go
package main

import "fmt"


func main() {
    var dog struct {
        id   int
        name string
    }

    dog.id = 12
    dog.name = "Tom"

    fmt.Printf("%v", dog)
    // {12 Tom}

}

```
## Golang结构体的初始化

未初始化的结构体，成员都是零值

使用键值对的方式初始化

```go
package main

import "fmt"

// 定义一个结构体Person
type Person struct {
    id    int
    age   int
    name  string
    email string
}

func main() {
    tom := Person{
        id:    12,
        age:   23,
        name:  "Tom",
        email: "123@qq.com",
    }

    fmt.Printf("%v", tom)
    // {12 23 Tom 123@qq.com}

}

```

使用值的列表初始化

```go
package main

import "fmt"

// 定义一个结构体Person
type Person struct {
    id    int
    age   int
    name  string
    email string
}

func main() {
    tom := Person{
        12,
        23,
        "Tom",
        "123@qq.com",
    }

    fmt.Printf("%v", tom)
    // {12 23 Tom 123@qq.com}

}

```

部分成员初始化

```go
package main

import "fmt"

// 定义一个结构体Person
type Person struct {
    id    int
    age   int
    name  string
    email string
}

func main() {
    tom := Person{
        id:   12,
        name: "Tom",
    }

    fmt.Printf("%v", tom)
    // {12 0 Tom }

}

```




## Golang结构体的指针

普通指针

```go
package main

import "fmt"

// 定义一个结构体Person
type Person struct {
    id    int
    age   int
    name  string
    email string
}

func main() {
    // 定义字符串变量
    var name string
    name = "Tom"

    // 定义字符串类型的指针变量
    var name_ptr *string
    name_ptr = &name

    // 变量的值
    fmt.Printf("%v\n", name)
    // Tom

    // 指针地址
    fmt.Printf("%v\n", name_ptr)
    // 0xc000014250

    // 指针指向的变量值
    fmt.Printf("%v\n", *name_ptr)
    // Tom
}

```

结构体的指针

```go
package main

import "fmt"

// 定义一个结构体Person
type Person struct {
    id    int
    age   int
    name  string
    email string
}

func main() {

    // 结构体变量
    person := Person{
        id:    11,
        name:  "Tom",
        age:   23,
        email: "123@qq.com",
    }

    // 指针变量
    var person_ptr *Person
    person_ptr = &person

    // 变量的值
    fmt.Printf("%v\n", person)
    // {11 23 Tom 123@qq.com}

    // 指针地址
    fmt.Printf("%p\n", person_ptr)
    // 0xc00009a180

    // 指针指向的变量值
    fmt.Printf("%v\n", *person_ptr)
    // {11 23 Tom 123@qq.com}
}

```

使用new关键字创建结构体指针

```go
package main

import "fmt"

// 定义一个结构体Person
type Person struct {
    id    int
    age   int
    name  string
    email string
}

func main() {

    var person = new(Person)

    // 访问结构体指针成员，可以省略*
    // 自动解引用
    (*person).age = 23
    person.id = 12
    person.name = "Tom"

    fmt.Printf("%T\n", person)
    // *main.Person

    fmt.Printf("%v\n", person)
    // &{12 0 Tom }

    fmt.Printf("%v\n", *person)
    // {12 0 Tom }
}

```

## 结构体作为函数参数

结构体作为参数传递给函数

- 直接传递结构体，传递的是副本，函数内部不能改变外部结构体内容
- 传递结构体指针，函数内部能改变外部结构体内容

值传递

```go
package main

import "fmt"

type Person struct {
    age  int
    name string
}

// 值传递，拷贝了一份副本
func showPerson(person Person) {
    person.age = 12
    person.name = "Jakc"

    fmt.Printf("%v\n", person)
}

func main() {

    person := Person{
        age:  11,
        name: "Tom",
    }

    fmt.Printf("%v\n", person)
    // {11 Tom}

    showPerson(person)
    // {12 Jakc}

    fmt.Printf("%v\n", person)
    // {11 Tom}
}

```

指针传递

```go
package main

import "fmt"

type Person struct {
    age  int
    name string
}

// 指针传递
func showPerson(person *Person) {
    person.age = 12
    person.name = "Jakc"

    fmt.Printf("%v\n", *person)
}

func main() {

    person := Person{
        age:  11,
        name: "Tom",
    }

    fmt.Printf("%v\n", person)
    // {11 Tom}

    showPerson(&person)
    // {12 Jakc}

    fmt.Printf("%v\n", person)
    // {12 Jakc}
}

```
## 结构体的嵌套

示例

```go
package main

import "fmt"

type Dog struct {
    age  int
    name string
}

type Person struct {
    age  int
    name string
    dog  Dog
}

func main() {
    dog := Dog{
        age:  1,
        name: "dog",
    }

    person := Person{
        dog:  dog,
        age:  11,
        name: "Tom",
    }

    fmt.Printf("%v\n", person)
    // {11 Tom {1 dog}}

    fmt.Printf("%v\n", person.dog.name)
    // dog
}


```

## 方法

golang中，方法是一种特殊的函数

定义与struct之上（与struct关联、绑定），被称为struct的接受者（receiver）

通俗讲，方法就是有接收者的函数

语法格式

```go
type struct_name struct{}

func (recv struct_name) method_name(param_type) return_type{}

func (recv *struct_name) method_name(param_type) return_type{}
```



```go
package main

import "fmt"

// 属性和方法分开写
type Person struct {
    age  int
    name string
}

// Person 接收者 receiver
func (person Person) eat() {
    fmt.Printf("%v eat\n", person.name)
}

func (person Person) sleep() {
    fmt.Printf("%v sleep\n", person.name)
}

func main() {

    person := Person{
        age:  11,
        name: "Tom",
    }

    person.eat()
    // Tom eat

    person.sleep()
    // Tom sleep
}

```

go语言方法的注意事项

- 方法的receiver type可以是类型别名、struct、slice、map、channel、func等
- struct结合它的方法等价于面向对象中的类，只不过struct可以和它的方法分开写，并非一定要属于同一个文件，但是，必须属于同一个包
- 方法有两种接收类型`(T type)` 和 `(T *Type)`，它们之间有区别
- 方法就是函数，所有Go中没有方法重载overload的说法，也就是说同一个类型中的所有方法名必须唯一
- 如果receiver是一个指针类型，则会自动解除引用
- 方法和type是分开的，意味着实例的行为behavior和数据存储field是分开的，但它们通过receiver建立起关联关系

## 方法接收者类型

- 值类型：复制结构体副本
- 指针类型：不复制

```go
package main

import "fmt"

// Person 接收者 receiver
type Person struct {
    age  int
    name string
}

// 值传递，拷贝了一份副本
func (person Person) showPersonByValue() {
    person.age = 12
    person.name = "Jack"

    fmt.Printf("%v\n", person)
}

// 指针传递
func (person *Person) showPersonByPointer() {
    person.age = 12
    person.name = "Jack"

    fmt.Printf("%v\n", person)
}

func main() {

    person := Person{
        age:  11,
        name: "Tom",
    }

    fmt.Printf("%v\n", person)
    // {11 Tom}

    // 接收者类型是变量，值没有被修改
    person.showPersonByValue()
    // {12 Jack}

    fmt.Printf("%v\n", person)
    // {11 Tom}

    // 接收者类型是指针，值被修改
    person.showPersonByPointer()
    // &{12 Jack}

    fmt.Printf("%v\n", person)
    // {12 Jack}
}
```