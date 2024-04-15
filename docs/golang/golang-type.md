# 2.4、Golang 数据类型

## 数据类型

- 布尔型 true/false
- 字符串类型
- 数字类型 
    - 浮点型：
        - float32 
        - float64
        - complex32
        - complex64
    - 无符号
        - uint8
        - uint16
        - uint32
        - uint64
    - 有符号
        - int8
        - int16
        - int32
        - int64
    - 其他
        - byte 类似 uint8
        - rune 类似 int32
        - uintptr 存放指针
- 派生类型
    - 指针类型 Pointer
    - 数组类型
    - 结构化类型 struct
    - Channel类型
    - 函数类型
    - 切片类型
    - 接口类型interface
    - Map类型

示例

```go
package main

import "fmt"

func foo() {}

func main() {
	// 字符串
	name := "Tom"
	fmt.Printf("name: %T\n", name) // name: string

	// 数字
	age := 23
	fmt.Printf("age: %T\n", age) // age: int

	// 布尔
	isStudent := true
	fmt.Printf("isStudent: %T\n", isStudent) // isStudent: bool

	// 指针
	ptr := &age
	fmt.Printf("ptr: %T\n", ptr) // ptr: *int

	// 数组
	arr := [...]int{1, 2, 3}
	fmt.Printf("arr: %T\n", arr) // arr: [3]int

	// 切片
	slice := []int{1, 2, 3}
	fmt.Printf("slice: %T\n", slice) // slice: []int

	// 函数
	fmt.Printf("foo: %T\n", foo) // foo: func()
}

```

## 布尔类型

true/false

定义

```go
package main

import "fmt"

func main() {
    var b1 bool = true
    var b2 bool = false

    var b3 = true
    var b4 = false

    b5 := true
    b6 := false

    fmt.Printf("b1: %v\n", b1) // b1: true
    fmt.Printf("b2: %v\n", b2) // b2: false
    fmt.Printf("b3: %v\n", b3) // b3: true
    fmt.Printf("b4: %v\n", b4) // b4: false
    fmt.Printf("b5: %v\n", b5) // b5: true
    fmt.Printf("b6: %v\n", b6) // b6: false
}
``` 

应用

```go
package main

import "fmt"

func main() {
   // if 逻辑判断
    age := 18
    if age >= 18 {
        fmt.Println("age >= 18")
    } else {
        fmt.Println("age < 18")
    }

    // for循环
    count := 5
    for i := 0; i < count; i++ {
        fmt.Printf("i: %v\n", i)
    }
}

```

注意：不能使用 `0` 和 `非0` 表示真假

## 数字类型

- 整型的零值是0
- 浮点型的零值是0.0

### 整型

```go
package main

import (
    "fmt"
    "math"
    "unsafe"
)

func main() {
    age := 18

    // 查看数据的大小
    fmt.Println(unsafe.Sizeof(age))
    // 8

    // 数据类型 int8 最大值和最小值
    fmt.Println(math.MinInt8, math.MaxInt8)
    // -128 127

}
```

### 进制格式化输出

```go
package main

import "fmt"

func main() {
    age := 18

    // 十进制
    fmt.Printf("%d \n", age)
    // 18

    // 二进制
    fmt.Printf("%b \n", age)
    // 10010

    // 八进制
    fmt.Printf("%o \n", age)
    // 22

    // 十六进制
    fmt.Printf("%x \n", age)
    // 12
}
```

### 浮点型

```go
package main

import (
    "fmt"
    "math"
)

func main() {

    // PI
    fmt.Printf("%f\n", math.Pi)
    // 3.141593

    // 保留两位小数点
    fmt.Printf("%.2f\n", math.Pi)
    // 3.14
}

```

## 字符串

字符串是一个任意字节的常量序列 [] byte

```go
package main

import (
    "fmt"
)

func main() {

    var s1 string = "Hello"
    var s2 = "Hello"
    s3 := "Hello"

    fmt.Printf("s1: %v\n", s1)
    // s1: Hello

    fmt.Printf("s2: %v\n", s2)
    // s2: Hello

    fmt.Printf("s3: %v\n", s3)
    // s3: Hello
}
```

### 多行字符串

```go
package main

import (
    "fmt"
)

func main() {

    var s string = `
<div>
    <div>Title</div>
</div>
    `

    fmt.Printf("%v\n", s)
}

```

### 使用 `+` 连接字符串

```go
package main

import (
    "fmt"
)

func main() {
    s1 := "Tom"
    s2 := "20"

    msg := s1 + s2
    fmt.Printf("msg: %v\n", msg)
    // msg: Tom20
}

```

### 使用 `Sprintf` 连接字符串

```go
package main

import (
    "fmt"
)

func main() {
    name := "Tom"
    age := "20"

    msg := fmt.Sprintf("name=%s, age=%s", name, age)
    fmt.Printf("msg: %v\n", msg)
    // msg: name=Tom, age=20
}

```

### 使用 `strings.Join()` 连接字符串

```go
package main

import (
    "fmt"
    "strings"
)

func main() {
    name := "Tom"
    age := "20"

    str := strings.Join([]string{name, age}, ",")
    fmt.Printf("str: %v\n", str)
    // str: Tom,20

}

```

### 使用 `bytes.Buffer` 拼接字符串

```go
package main

import (
    "bytes"
    "fmt"
)

func main() {
    var buffer bytes.Buffer

    buffer.WriteString("Tom")
    buffer.WriteString("Jack")
    buffer.WriteString("Steve")

    fmt.Println(buffer.String())
    // TomJackSteve

}

```

### 转义字符（escape char）

| 转义字符 | 说明
| - | - 
| `\r`  | 回车，光标移动到行首
| `\n`  | 换行符，光标移动到下一行
| `\t`| 制表位
| `\\` | 反斜杆
| `\"` | 双引号
| `\'` | 单引号


示例

```go
package main

import "fmt"

func main(){
    fmt.Println("Hello\tGolang")
    // Hello    Golang

    fmt.Println("Hello\nGolang")
    // Hello
    // Golang

    fmt.Println("Hello\rGolang")
    // Golang

    fmt.Println("Hello\\Golang")
    // Hello\Golang

    fmt.Println("Hello\"Golang")
    // Hello"Golang
}
```

### 字符串切片操作

```go
package main

import "fmt"

func main() {

    // H e l l o   W o r l d
    // 0 1 2 3 4 5 6 7 8 9 10
    str := "Hello World"

    n := 3
    m := 5

    // 获取索引位置字符串的原始字节
    fmt.Println(str[n])
    // 108

    // 获取字符显示
    fmt.Printf("%c\n", str[n])
    // l

    // 获取 [n, m)的子串
    fmt.Println(str[n:m])
    // lo

    // 获取 [n, len)的子串
    fmt.Println(str[n:])
    // lo World

    // 获取 [0, m)的子串
    fmt.Println(str[:m])
    // Hello

}

```

### 字符串函数

| 函数 | 说明
| - | -
| len(str) | 求长度
| + 或 fmt.Springf | 字符串拼接
strings.Contains | 判断是否包含
strings.HasPrefix| 前缀判断
strings.HasSuffix  | 后缀判断
strings.Index  | 子串位置
strings.LastIndex | 子串位置
strings.Split | 拆分
strings.Join() | 拼接
strings.ToLower() | 转小写
strings.ToUpper() | 转大写


示例
```go
package main

import (
    "fmt"
    "strings"
)

func main() {

    str := "Hello World"

    fmt.Println(len(str))
    // 11

    fmt.Printf("%q\n", strings.Split(str, " "))
    // ["Hello" "World"]

    fmt.Println(strings.Join([]string{"Hello", "World"}, " "))
    // Hello World

    fmt.Println(strings.Contains(str, "Hello"))
    // true

    fmt.Println(strings.HasPrefix(str, "Hello"))
    // true

    fmt.Println(strings.HasSuffix(str, "World"))
    // true

    fmt.Println(strings.Index(str, "World"))
    // 6

    fmt.Println(strings.LastIndex(str, "World"))
    // 6

    fmt.Println("Hello" + " " + "World")
    // Hello World

    newStr := fmt.Sprintf("%s %s", "Hello", "World")
    fmt.Println(newStr)
    // Hello World

    fmt.Println(strings.ToLower("Hello World"))
    // hello world

    fmt.Println(strings.ToUpper("Hello World"))
    // HELLO WORLD

}

```
