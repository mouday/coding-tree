# Golang 流程控制

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

for...range遍历数组、切片、字符串、map及通道（channel）

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

遍历map

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
