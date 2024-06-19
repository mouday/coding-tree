# Golang实现base64编码的四种方式

go的encoding/base64有四种编码方式：

- StdEncoding 常规编码
- URLEncoding URL safe 编码，相当于替换掉字符串中的特殊字符，+ 和 /
- RawStdEncoding  常规编码，末尾不补 =
- RawURLEncoding  URL safe 编码，末尾不补 =

代码示例

```go
package main

import (
    "encoding/base64"
    "fmt"
)

func main() {
    msg := []byte("Hello world. 你好，世界！")

    // 1、标准编码
    encoded := base64.StdEncoding.EncodeToString(msg)
    fmt.Println(encoded)
    // SGVsbG8gd29ybGQuIOS9oOWlve+8jOS4lueVjO+8gQ==

    decoded, _ := base64.StdEncoding.DecodeString(encoded)
    fmt.Println(string(decoded))
    // Hello world. 你好，世界！

    // 2、常规编码，末尾不补 =
    encoded = base64.RawStdEncoding.EncodeToString(msg)
    fmt.Println(encoded)
    // SGVsbG8gd29ybGQuIOS9oOWlve+8jOS4lueVjO+8gQ

    decoded, _ = base64.RawStdEncoding.DecodeString(encoded)
    fmt.Println(string(decoded))
    // Hello world. 你好，世界！

    // 3、URL safe 编码
    encoded = base64.URLEncoding.EncodeToString(msg)
    fmt.Println(encoded)
    // SGVsbG8gd29ybGQuIOS9oOWlve-8jOS4lueVjO-8gQ==

    decoded, _ = base64.URLEncoding.DecodeString(encoded)
    fmt.Println(string(decoded))
    // Hello world. 你好，世界！

    // 4、URL safe 编码，末尾不补 =
    encoded = base64.RawURLEncoding.EncodeToString(msg)
    fmt.Println(encoded)
    // SGVsbG8gd29ybGQuIOS9oOWlve-8jOS4lueVjO-8gQ

    decoded, _ = base64.RawURLEncoding.DecodeString(encoded)
    fmt.Println(string(decoded))
    // Hello world. 你好，世界！
}
```

参考: [go实现base64编码的四种方式](https://www.jb51.net/article/277346.htm)