# 2.7、Golang 流程控制

- 顺序执行
- 选择执行
- 循环执行

## 顺序执行

示例

```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println("第一步")
	fmt.Println("第二步")
}

// 第一步
// 第二步

```

## 选择执行

### if...else

语法

```go
if 条件 {

} else{

}

// 多重判断
if 条件1 {

} else if 条件2 {

} else{

}


// 嵌套
if 条件1 {
	if 条件2 {

	}
}
```

示例

```go
package main

import (
	"fmt"
)

func main() {
	a := 1

    // 布尔表达式不需要括号
	if a > 10 {
		fmt.Println("a  > 10")
	} else {
		fmt.Println("a  <= 10")
	}
	// a  <= 10
}

```

Golang 中的特殊写法

```go
package main

import (
	"fmt"
)

func main() {

	// age处于局部作用域
	if age := 18; age > 18 {
		fmt.Println("age > 18")
	} else {
		fmt.Println("age <= 18")
	}
	// age <= 18
}
```

接收用户输入

```go
package main

import (
    "fmt"
)

func main() {

    var age int

    fmt.Printf("请输入age:\n")
    fmt.Scan(&age)

    fmt.Printf("age: %v\n", age)

}

```

命令行方式运行

```bash
$ go run main.go

请输入age:
23
age: 23
```

### switch...case

语法

```go
switch a {
	// 单值判断
	case 0:
		fmt.Println("a = 0")

	// 可以是多个值,逗号隔开
	case 1, 2, 3:
		fmt.Println("a = 1, 2, 3")

	// 表达式
	case a <= 10:
		fmt.Println("a > 10")

	// 向下执行
	case a > 10:
		fmt.Println("a > 10")
		fallthrough

	case a > 20:
		fmt.Println("a > 10")

	default:
		fmt.Println("default")
}
```

示例

```go
package main

import (
	"fmt"
)

func main() {
	a := 1

	switch a {
	case 0:
		fmt.Println("a = 0")

	case 1:
		fmt.Println("a = 1")

	default:
		fmt.Println("default")
	}

	// a = 1
}
```

> 注意：不能使用 0 和非 0 表示真假

## 循环执行

### for

语法

```go
for 初始语句; 条件表达式; 结束语句{
	循环体
}
```

示例

```go
package main

import (
	"fmt"
)

func main() {
	// for循环不加括号
	for i := 0; i < 5; i++ {
		fmt.Printf("%v ", i)
	}
	// 0 1 2 3 4

	// 初始条件写在for外边
	i := 0
	for ; i < 5; i++ {
		fmt.Printf("%v ", i)
	}

	// 只写判断条件
	i := 0
	for i < 5  {
		fmt.Printf("%v ", i)
		i++
	}

	// 永真循环
	for {

	}
}

```

### for...range

for...range 遍历数组、切片、字符串、map 及通道（channel）

返回值：

- 数组、切片、字符串：返回索引和值
- map：返回键和值
- 通道（channel）:只返回通道内的值

示例

```go
package main

import "fmt"

func main() {

	list := []int{1, 2, 3}

	for index, value := range list {
		fmt.Printf("%v=%v ", index, value)
	}
	// 0=1 1=2 2=3
}

```

遍历 map

```go
package main

import "fmt"

func main() {
	m := make(map[string]string)
	m["name"] = "Tom"
	m["age"] = "28"

	for key, value := range m {
		fmt.Printf("%v=%v", key, value)
	}
	// name=Tomage=28
}

```

### 关键字

- break
- continue
- goto

#### break

break 结束 for switch select 的代码块

break 注意事项

- 单独在 select 中使用 break，和不使用 break 没区别
- 单独在表达式 switch 语句，并且没有 falllthough，使用 break 和不使用 break 没区别
- 单独在表达式 switch 语句，并且有 falllthough，使用 break 能够终止 fallthough 后面的 case 语句
- 带标签的 break,可以跳出多层 select/switch 作用域，让 break 更加灵活，写法更加简单灵活，不需要使用控制变量一层一层跳出循环，没有带 break 的只能跳出当前语句块

示例

for

```go
package main

import "fmt"

func main() {

    for i := 0; i < 10; i++ {
        if i >= 3 {
            break
        }
        fmt.Printf("%v\t", i)
    }
    // 0    1   2
}

```

switch

```go
package main

import "fmt"

func main() {

    i := 1

    switch i {
    case 1:
        fmt.Println("1")
        fallthrough
    case 2:
        fmt.Println("2")
        // break
    case 3:
        fmt.Println("3")
        // break
    }
}

```

标签

```go
package main

import "fmt"

func main() {

LABEL:
    for i := 0; i < 10; i++ {
        fmt.Printf("%v ", i)

        if i >= 3 {
            break LABEL
        }
    }

    fmt.Println("end")
}
// 0 1 2 3 end

```

#### continue

只能用在 for 循环，终止本次循环，进行下次循环

```go
package main

import "fmt"

func main() {

    for i := 0; i < 10; i++ {

        if i%2 == 0 {
            continue
        } else {
            fmt.Printf("%v ", i)
        }
    }
    // 1 3 5 7 9
}

```

#### goto

通过标签进行代码之间的无条件跳转

```go
package main

import "fmt"

func main() {

    goto LABEL
    fmt.Println("label")

LABEL:
    fmt.Println("end")
}
// end

```
