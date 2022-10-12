# 2.5、Golang 格式化输出

普通

占位符 | 说明
- | -
`%v` | var 相应值的默认格式
`%#v` | 相应值的Go语法表示
`%T` | 相应值的类型
`%%` | 字面`%`
`%t` | 布尔占位符

整型

占位符 | 说明
- | -
`%c` | unicode码所表示的字符
`%U` | unicode格式U+1234
`%b` | 二进制
`%d` | 十进制
`%o` | 八进制
`%x` | 十六进制a-f
`%X` | 十六进制A-F
`%q` | 单引号围绕的字符字面量值

浮点型

占位符 | 说明
- | -
`%b` | 无小数部分
`%e` | 科学计数法
`%E` | 科学计数法
`%f` | 有小数点而无指数
`%g` | 根据情况选择
`%G` | 根据情况选择

字符串与字节切片

占位符 | 说明
- | -
`%s` | 字符串表示
`%q` | 双引号围绕的字符串
`%x` | 十六进制a-f
`%X` | 十六进制A-F

指针
占位符 | 说明
- | -
`%p` | 十六进制表示

示例
```go
package main

import "fmt"

type WebSite struct {
	name string
}

func main() {
	webSite := WebSite{name: "Tom"}

	fmt.Printf("webSite: %v\n", webSite)
	// webSite: {Tom}

	fmt.Printf("webSite: %#v\n", webSite)
	// webSite: main.WebSite{name:"Tom"}

	fmt.Printf("webSite: %T\n", webSite)
	// webSite: main.WebSite

	fmt.Printf("webSite: %%\n")
	// webSite: %

	fmt.Printf("bool: %t\n", true)
	// bool: true
}

```