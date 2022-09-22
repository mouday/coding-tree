# 第十八章 Golang接口 interface

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


