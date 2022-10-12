# 2.1、Golang标识符、关键字、命名规则

标识符 identifier

- 数字、字母、下划线（_）
- 只能是字符和下划线（_）开头
- 标识符区分大小写

eg:

```go
var name string
var age int
var _sys int
```

关键字25个
```
break   default func    interface   select
case    defer   go  map struct
chan    else    goto    package switch
const   fallthrough if  range   type
continue    for import  return  var
```

36 个预定义标识符

```
append
bool false true
nil
make    new
byte 
cap
close 
copy  
complex   complex64   complex128  
float32 float64 
imag    real
int  int8  int16   int32    int64
uint uint8 uint16  uint32   uint64
iota    len   panic   
print   println     
recover 
string
uintptr
```

命名规则

- 包名称：和目录保持一致、小写
- 文件名：小写下划线
- 结构体：大驼峰命名法
- 接口命名：大驼峰命名法，单个函数以`er` 结尾
- 变量命名：驼峰命名法，
    - 大写字母开头: 公有
    - 小写字母开头: 私有
    - bool类型：has/is/can/allow
- 常量：大写下划线
- 单元测试：`*_test.go` 
- 测试用例：`Test*`

错误处理

```go
if err != nill {
    // 错误处理
    return 
}

```
