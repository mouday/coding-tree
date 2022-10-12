# 2.3、Golang 常量

常量: 程序`编译阶段`就确定下来的值，程序`运行时` 无法改变该值

## 定义常量

```go
// 定义的时候就要初始化
const constantName [type] = value
```

eg:

```go
const PI float32 = 3.14

// 简写
const PI = 3.14

// 批量定义
const (
    WIDTH = 200
    HEIGHT = 300    
)

const WIDTH, HEIGHT = 200, 300
```

## iota

可以被编译器修改的常量

默认值是0，每调用一次加1，遇到const关键字时被重置为0

```go
const (
    A = iota  // 0
    B = iota  // 1
)
```

使用下划线（_）跳过某些值

```go
const (
    A = iota  // 0
    _         // 1
    B = iota  // 2
)

```

中间插队

```go
const (
    A = iota  // 0
    B = 100
    C = iota  // 2
)

```
