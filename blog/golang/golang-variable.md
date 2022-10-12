# 2.2、Golang变量

变量是计算机语言中能够存储计算结果或能表示值的抽象概念，不同的变量保存的数据类型可能不一样

## 声明变量

go语言中的变量需要声明后再使用，且必须使用

语法

```go
var identifier type
```

eg:

```go
var name string
var age int
var isMan bool
```

批量声明

```go
var (
    name string
    age int
    isMan bool
)
```

## 变量的初始化

语法
```go
var 变量名 类型 = 表达式
```

eg:

```go
var name string = "Tom"
var age int = 20
```

类型推断: 可以省略类型

```go
var name = "Tom"
var age = 20
```

初始化多个变量

```go
var name, age = "Tom", 23
```

## 短变量声明

`函数内部` 使用`:=` 运算符进行声明变量

```go
func main() {
    name := "Tom"
    age := 20
}
```

## 匿名变量

```go
func getNameAndAge() (string, int){
    return "Tom", 20
}

func main(){
    name, age := getNameAndAge()

    // 使用下划线丢弃
    name, _ := getNameAndAge()
}
```