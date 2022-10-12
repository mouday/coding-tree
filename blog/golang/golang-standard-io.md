# 5.2、Golang标准库-io输入输出

io包封装了如下操作

- io 为IO原语操作（I/O primitives）提供基本的接口 os、File、Reader、Writer
- io/ioutil 封装了一些实用函数
- fmt 实现了格式化I/O，类似C语言中的printf 和 scanf
- bufio 实现带缓冲的I/O

基本的IO接口

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}
```

以下类型实现了Reader和Writer接口

```go
os.File (Reader和Writer)
strings.Reader (Reader)
bufio.Reader (Reader)
bufio.Writer (Writer)
bytes.Buffer (Reader和Writer)
bytes.Reader (Reader)
compress/gzip.Reader (Reader)
compress/gzip.Writer (Writer)
crypto/cipher.StreamReader (Reader)
crypto/cipher.StreamWriter (Writer)
crypto/tls.Conn (Reader和Writer)
encoding/csv.Reader (Reader)
encoding/csv.Writer (Writer)
```

示例

```go
package main

import (
    "fmt"
    "strings"
)

func main() {
    r := strings.NewReader("Hello world")
    buf := make([]byte, 5)
    n, err := r.Read(buf)
    if err != nil {
        fmt.Printf("err: %v\n", err)
    } else {
        fmt.Printf("n: %v\n", n)
        // n: 5
        fmt.Printf("buf: %v\n", string(buf))
        // buf: Hello
    }

}

```

reader拷贝到writer

```go
package main

import (
    "fmt"
    "io"
    "os"
    "strings"
)

func main() {
    r := strings.NewReader("Hello world")

    // 复制到标准输出流，实际效果为：打印到控制台
    _, err := io.Copy(os.Stdout, r)
    if err != nil {
        fmt.Printf("err: %v\n", err)
    }
    // Hello world
}

```

带缓冲区的拷贝

```go
package main

import (
    "fmt"
    "io"
    "os"
    "strings"
)

func main() {
    r := strings.NewReader("Hello world")
    buf := make([]byte, 8)

    _, err := io.CopyBuffer(os.Stdout, r, buf)
    if err != nil {
        fmt.Printf("err: %v\n", err)
    }
    // Hello world
}

```
