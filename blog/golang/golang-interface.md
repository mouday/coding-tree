# 3.7、Golang接口 interface

go语言中的接口，是一种新的类型定义，它把所有的具有共性的方法定义在一起，任何其他类型制药实现了这些方法就是实现了这个接口


语法

```go
// 定义接口
type interface_name interface {
    method_name [return_type]
    ...
}

// 定义结构体
type struct_name struct {
    
}

// 实现接口方法
func (struct_name_variable struct_name) method_name [return_type]{
    // 方法实现
}
```

接口示例

定义一个USB接口，有读read 写write两个方法

再定义一个电脑computer 和 手机Mobile 来实现这个接口

```go
package main

import "fmt"

// USB接口
type USB interface {
    read()
    write()
}

// Computer 结构体
type Computer struct {
}

// Mobile 结构体
type Mobile struct {
}

// Computer 实现USB方法
func (computer Computer) read() {
    fmt.Println("computer read")
}

func (computer Computer) write() {
    fmt.Println("computer write")
}

// Mobile 实现USB方法
func (mobile Mobile) read() {
    fmt.Println("mobile read")
}

func (mobile Mobile) write() {
    fmt.Println("mobile write")
}

func main() {

    computer := Computer{}
    computer.read()
    computer.write()
    // computer read
    // computer write

    mobile := Mobile{}
    mobile.read()
    mobile.write()
    // mobile read
    // mobile write

}

```

> 备注: 实现接口必须实现接口中的所有方法


## golang接口值类型接收者和指针类型接收者

示例

```go
package main

import "fmt"

// 定义接口
type Pet interface {
    eat()
}

// 定义结构体
type Dog struct {
    name string
}

func (dog Dog) eat() {
    fmt.Println("dog eat")
}

func main() {
    dog := Dog{name: "Tom"}
    dog.eat()
    // dog eat
}

```

## golang接口和类型的关系

- 一个类型可以实现多个接口
- 多个类型可以实现同一个接口（多态）


### 一个类型可以实现多个接口

示例

Music接口可以播放音乐
Video接口可以播放视频

手机Mobile实现这两个接口，即可以播放音乐，又可以播放视频

```go
package main

import "fmt"

// 定义接口
type Music interface {
    playMusic()
}

type Video interface {
    playVideo()
}

// 定义结构体
type Mobile struct {
}

func (m Mobile) playMusic() {
    fmt.Println("Mobile playMusic")
}

func (m Mobile) playVideo() {
    fmt.Println("Mobile playVideo")
}

func main() {
    m := Mobile{}
    m.playMusic()
    // Mobile playMusic
    m.playVideo()
    // Mobile playVideo

}

```

### 多个类型可以实现同一个接口（多态）

示例

一个宠物接口Pet，猫Cat和狗Dog都可以实现该接口

```go
package main

import "fmt"

// 定义接口
type Pet interface {
    eat()
}

// 定义结构体
type Dog struct {
}

type Cat struct {
}

func (dog Dog) eat() {
    fmt.Println("dog eat")
}

func (cat Cat) eat() {
    fmt.Println("cat eat")
}

func main() {
    dog := Dog{}
    dog.eat()
    // dog eat

    cat := Cat{}
    cat.eat()
    // cat eat

    // 声明接口变量
    var pet Pet
    pet = dog
    pet.eat()
    // dog eat

    pet = cat
    pet.eat()
    // cat eat
}

```

## golang接口嵌套

示例

飞鱼，既可以飞，也可以游泳，

飞鱼接口有两个接口组成：飞Fly接口，游泳Swim接口

```go
package main

import "fmt"

// 定义接口
type Flyer interface {
    fly()
}

// 定义接口
type Swimmer interface {
    swim()
}

// 组合接口
type FlyFish interface {
    Flyer
    Swimmer
}

// 结构体
type Fish struct{}

// 实现方法
func (fish Fish) fly() {
    fmt.Println("fish fly")
}

func (fish Fish) swim() {
    fmt.Println("fish swim")
}

func main() {
    var fly FlyFish

    fly = Fish{}
    fly.fly()
    // fish fly

    fly.swim()
    // fish swim
}

```

## 通过接口实现OCP设计原则

开闭原则 Open-Closed Principle

对扩展开放，对修改关闭

示例

```go
package main

import "fmt"

// 定义接口
type Pet interface {
    eat()
    sleep()
}

// 定义结构体
type Dog struct {
}

type Cat struct {
}

// Dog 实现 Pet接口
func (dog Dog) eat() {
    fmt.Println("dog eat")
}

func (dog Dog) sleep() {
    fmt.Println("dog sleep")
}

// Cat 实现 Pet接口
func (cat Cat) eat() {
    fmt.Println("cat eat")
}

func (cat Cat) sleep() {
    fmt.Println("cat sleep")
}

// 结构体
type Person struct{}

// 参数既可以是Dog 也可以是 Cat
func (person Person) care(pet Pet) {
    pet.eat()
    pet.sleep()
}

func main() {

    dog := Dog{}
    cat := Cat{}

    person := Person{}

    person.care(dog)
    // dog eat
    // dog sleep

    person.care(cat)
    // cat eat
    // cat sleep
}

```

## golang模拟OOP的属性和方法

golang中没有面向对象的概念，也没有封装的概念，但是可以通过而机构提struct和函数绑定来实现OOP的属性和方法

示例

Person类

- 属性： name、age 
- 方法：eat、sleep、work

```go
package main

import "fmt"

// 属性
type Person struct {
	name string
	age  int
}

// 方法
func (person Person) eat() {
	fmt.Println("person eat")
}

func (person Person) sleep() {
	fmt.Println("person sleep")
}

func (person Person) wrok() {
	fmt.Println("person wrok")
}

func main() {
	person := Person{
		name: "Tom",
		age:  23,
	}
	person.eat()
	// person eat

	person.sleep()
	// person sleep

	person.wrok()
	// person wrok
}

```

## golang继承

通过结构体嵌套来实现继承

```go
package main

import "fmt"

// 定义结构体
type Pet struct {
    name string
    age  int
}

func (pet Pet) eat() {
    fmt.Println("pet eat")
}

func (pet Pet) sleep() {
    fmt.Println("pet sleep")
}

// 定义结构体
type Dog struct {
    // 匿名
    Pet
}

type Cat struct {
    pet Pet
}

func main() {

    dog := Dog{
        Pet{name: "Tom", age: 23},
    }

    // 匿名直接调用
    dog.eat()
    // pet eat

    cat := Cat{
        pet: Pet{name: "Tom", age: 23},
    }

    // 通过属性pet 调用
    cat.pet.eat()
    // pet eat

}

```

## golang构造函数

golang中没有构造函数的概念，可以使用函数来模拟构造函数的功能

```go
package main

import "fmt"

type Person struct {
    name string
    age  int
}

func NewPerson(name string, age int) (*Person, error) {
    if name == "" {
        return nil, fmt.Errorf("name不能为空")
    }

    if age < 0 {
        return nil, fmt.Errorf("age不能小0")
    }

    return &Person{name: name, age: age}, nil
}

func main() {
    person, err := NewPerson("Tom", 23)
    if err == nil {
        fmt.Printf("%v\n", person)
        // &{Tom 23}
    } else {
        fmt.Printf("%v\n", err)
    }
}

```