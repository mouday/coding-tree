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