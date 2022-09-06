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

Golang中的特殊写法

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

> 注意：不能使用0和非0表示真假

## 循环执行

### for

示例

```go
package main

import (
	"fmt"
)

func main() {
	for i := 0; i < 5; i++ {
		fmt.Printf("%v ", i)
	}
	// 0 1 2 3 4
}

```

### for...range

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

### 关键字 

- break
- continue
- goto