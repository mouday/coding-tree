# 3.3、Golang map

`key:value` 键值对的数据结构容器

## 语法格式

```go
// 声明变量，默认是nil
var map_variable map[key_data_type]value_data_type

// 使用make函数
var map_variable = make(map[key_data_type]value_data_type)
```

示例

```go
package main

import (
    "fmt"
)

func main() {
    // 声明
    var m map[string]string

    fmt.Printf("%v\n", m)
    // map[]

    fmt.Printf("%T\n", m)
    // map[string]string

    // 初始化
    m = make(map[string]string)

    m["name"] = "Steve"

    fmt.Printf("%v\n", m)
    // map[name:Steve]

}

```

声明并初始化

```go
package main

import (
    "fmt"
)

func main() {

    // 声明并初始化
    m1 := make(map[string]string)
    m1["name"] = "Tom"
    m1["age"] = "12"

    fmt.Printf("%v\n", m1)
    // map[age:12 name:Tom]

    // 声明并直接赋初始值
    m2 := map[string]string{
        "name": "Jack",
        "age":  "21",
    }

    fmt.Printf("%v\n", m2)
    // map[age:21 name:Jack]

}

```

## 访问数据

通过键key 获取值value

```go
package main

import (
    "fmt"
)

func main() {
    m := map[string]string{
        "name": "Jack",
        "age":  "21",
    }

    // 访问成员
    name := m["name"]

    fmt.Printf("%v\n", name)
    // Jack

}

```

## 成员检查

判断键是否存在

```go
value, ok = map[key]
```

示例
```go
package main

import (
    "fmt"
)

func main() {
    m := map[string]string{
        "name": "Jack",
        "age":  "21",
    }

    // 访问成员
    name, ok := m["name"]

    fmt.Printf("%v\n", name) // Jack
    fmt.Printf("%v\n", ok)   // true
}

```

## 遍历map

示例1

```go
package main

import (
    "fmt"
)

func main() {
    m := map[string]string{
        "name": "Jack",
        "age":  "21",
    }

    for key, value := range m {
        fmt.Printf("%v => %v\n", key, value)
    }
    // name => Jack
    // age => 21
}

```

示例2
```go
package main

import (
    "fmt"
)

func main() {
    m := map[string]string{
        "name": "Jack",
        "age":  "21",
    }

    for key := range m {
        fmt.Printf("%v => %v\n", key, m[key])
    }
    // name => Jack
    // age => 21
}

```
