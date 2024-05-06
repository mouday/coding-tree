# 5.7、Golang 标准库-bytes

bytes 包提供了对字节切片进行读写操作的一系列函数

## 类型转换

byte 和 int 类型转换

```go
package main

import "fmt"

func main() {
    var i int = 10
    var b byte = 100
    fmt.Printf("i: %v\n", i)
    // i: 10
    fmt.Printf("b: %v\n", b)
    // b: 100

    i = int(b)
    fmt.Printf("i: %v\n", i)
    // i: 100

    b = byte(i)
    fmt.Printf("b: %v\n", b)
    // b: 100

}

```

byte 和 string 类型转换

```go
package main

import "fmt"

func main() {
    var s string = "Hello world"
    b := []byte(s)
    fmt.Printf("b: %v\n", b)
    // b: [72 101 108 108 111 32 119 111 114 108 100]

    s = string(b)
    fmt.Printf("s: %v\n", s)
    // s: Hello world
}

```

## 常用函数

Contains 包含

```go
package main

import (
    "bytes"
    "fmt"
)

func main() {
    b := []byte("hello world")

    b1 := []byte("HELLO")
    b2 := []byte("hello")

    b3 := bytes.Contains(b, b1)
    fmt.Printf("b3: %v\n", b3)
    // b3: false

    b4 := bytes.Contains(b, b2)
    fmt.Printf("b4: %v\n", b4)
    // b4: true
}

```

Count 统计出现次数

```go
package main

import (
    "bytes"
    "fmt"
)

func main() {
    b := []byte("hello world hello world")

    b1 := []byte("hello")

    i := bytes.Count(b, b1)
    fmt.Printf("i: %v\n", i)
    // i: 2

}

```

Repeat 重复

```go
package main

import (
    "bytes"
    "fmt"
)

func main() {
    b := []byte("x")

    b1 := bytes.Repeat(b, 3)
    fmt.Printf("b1: %v\n", string(b1))
    // b1: xxx

}

```

Replace 替换

```go
package main

import (
    "bytes"
    "fmt"
)

func main() {
    b := []byte("hello")
    old := []byte("l")
    new := []byte("x")

    // 第三个参数是替换次数
    b1 := bytes.Replace(b, old, new, 1)
    fmt.Printf("b1: %v\n", string(b1))
    // b1: hexlo

}

```

Runes 转换汉字

```go
package main

import (
    "bytes"
    "fmt"
)

func main() {
    b := []byte("你好世界")
    r := bytes.Runes(b)

    fmt.Printf("len(b): %v\n", len(b))
    // len(b): 12

    fmt.Printf("len(r): %v\n", len(r))
    // len(r): 4

}

```

join 字节切片连接

```go
package main

import (
    "bytes"
    "fmt"
)

func main() {
    b := [][]byte{
        []byte("你好"),
        []byte("世界"),
    }

    s := []byte("#")
    b2 := bytes.Join(b, s)

    fmt.Printf("b2: %v\n", string(b2))
    // b2: 你好#世界
}

```

## Reader 类型

Reader 实现的接口

```go
io.Reader
io.ReaderAt
io.WriterTo
io.Seeker
io.ByteScanner
io.RuneScanner
```

示例

```go
package main

import (
    "bytes"
    "fmt"
)

func main() {
    data := "1234567890"

    // 创建一个Reader
    br := bytes.NewReader([]byte(data))

    // 返回未读取部分的长度
    fmt.Printf("br.Len(): %v\n", br.Len())
    // br.Len(): 10

    // 返回底层数据总长度
    fmt.Printf("br.Size(): %v\n", br.Size())
    // br.Size(): 10

    // 每次读取两个字节
    buf := make([]byte, 2)
    for {
        n, err := br.Read(buf)
        if err != nil {
            break
        }
        fmt.Printf("string(buf[:n]): %v\n", string(buf[:n]))
    }

    // 设置偏移量，定位到文件头
    br.Seek(0, 0)

    // 一个字节一个字节的读取
    for {
        b, err := br.ReadByte()
        if err != nil {
            break
        }
        fmt.Printf("b: %v\n", string(b))
    }

    br.Seek(0, 0)
    off := int64(0)
    for {
        // 指定偏移量读取
        n, err := br.ReadAt(buf, off)
        if err != nil {
            break
        }

        fmt.Println(off, string(buf[:n]))

        off += int64(n)

    }
}

```

## Buffer类型

缓冲区是具有读取和写入方法可变大小的字节缓冲区

声明Buffer的4中方法

```go
// 直接定义一个Buffer变量，不用初始化，可以直接使用
var buf bytes.Buffer

// 使用New返回Buffer变量
b := new(bytes.Buffer)

// 从[]byte切片，构造一个Buffer
b := bytes.NewBuffer(s []byte)

// 从string变量，构造一个Buffer
b := bytes.NewBufferString(s string)
```

示例

```go
package main

import (
    "bytes"
    "fmt"
)

func main() {
    var buf bytes.Buffer
    fmt.Printf("buf: %v\n", buf)
    // buf: {[] 0 0}

    b := bytes.NewBuffer([]byte("hello"))
    fmt.Printf("b: %v\n", b)
    // b: hello

    b2 := bytes.NewBufferString("hello")
    fmt.Printf("b2: %v\n", b2)
    // b2: hello
}

```

向Buffer写入数据

```go
package main

import (
    "bytes"
    "fmt"
)

func main() {
    var buf bytes.Buffer
    n, _ := buf.WriteString("hello")

    fmt.Printf("n: %v\n", n)
    // n: 5
    fmt.Printf("buf: %v\n", string(buf.Bytes()))
    // buf: hello
}

```

从Buffer读取数据

```go
package main

import (
    "bytes"
    "fmt"
    "io"
)

func main() {
    b := bytes.NewBufferString("hello world")

    // 循环读取，每次读取2个字节
    buf := make([]byte, 2)

    for {
        n, err := b.Read(buf)

        // 到达文件尾部
        if err == io.EOF {
            break
        }

        fmt.Printf("n: %v\n", n)
        // n: 2
        fmt.Printf("buf: %v\n", string(buf[0:n]))
        // buf: he
    }

}

```