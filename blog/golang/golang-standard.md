# 第二十一章 Golang标准库

标准库文档：https://pkg.go.dev/std

## os模块

os模块实现了平台无关的编程接口

创建文件

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    // 会覆盖原有文件
    file, err := os.Create("demo.txt")

    if err != nil {
        fmt.Printf("err: %v\n", err)
    } else {
        fmt.Printf("file.Name(): %v\n", file.Name())
        // file.Name(): demo.txt
    }
} 

```

创建目录

```go
package main

import (
    "fmt"
    "os"
)

func main() {

    // 权限777
    err := os.Mkdir("demo", os.ModePerm)

    if err != nil {
        fmt.Printf("err: %v\n", err)
    }
}

```

创建多级目录

```go
package main

import (
    "fmt"
    "os"
)

func main() {

    // 权限777
    err := os.MkdirAll("a/b/demo", os.ModePerm)

    if err != nil {
        fmt.Printf("err: %v\n", err)
    }
}

```

移除文件或空目录

```go
package main

import (
    "fmt"
    "os"
)

func main() {

    err := os.Remove("demo.txt")

    if err != nil {
        fmt.Printf("err: %v\n", err)
    }
}

```

移除目录下所有文件

```go
package main

import (
    "fmt"
    "os"
)

func main() {

    err := os.RemoveAll("a")

    if err != nil {
        fmt.Printf("err: %v\n", err)
    }
}
```

工作目录

```go
package main

import (
    "fmt"
    "os"
)

func main() {

    // 获取当前工作目录
    dir, _ := os.Getwd()

    fmt.Printf("dir: %v\n", dir)
    // dir: /Users/mo/Desktop/go_code

    // 修改当前工作目录
    os.Chdir("../")

    // 再次获取当前工作目录
    dir, _ = os.Getwd()

    fmt.Printf("dir: %v\n", dir)
    // dir: /Users/mo/Desktop
}

```

获取临时目录

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    temp := os.TempDir()
    fmt.Printf("temp: %v\n", temp)
    // temp: /var/folders/43/llymqbps19d74q2h_bgb00mr0000gn/T/
}

```

重命名文件

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    err := os.Rename("demo.txt", "demo.2.txt")
    if err != nil {
        fmt.Printf("err: %v\n", err)
    }
}

```

读取文件

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    content, err := os.ReadFile("demo.txt")
    if err != nil {
        fmt.Printf("err: %v\n", err)
    } else {
        fmt.Printf("content: %v\n", string(content[:]))
        // content: Hello World
    }
}

```

写文件

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    err := os.WriteFile("demo.txt", []byte("hello"), os.ModePerm)
    if err != nil {
        fmt.Printf("err: %v\n", err)
    }
}

```

### File文件读写操作

打开现有文件

```go

package main

import (
    "fmt"
    "os"
)

func main() {
    f, err := os.Open("demo.txt")

    if err != nil {
        fmt.Printf("err: %v\n", err)
    } else {
        fmt.Printf("f.Name(): %v\n", f.Name())
        // f.Name(): demo.txt
        f.Close()
    }
}

```

如果不存在则创建

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    // 如果不存在则创建
    f, err := os.OpenFile("demo.txt", os.O_RDWR|os.O_CREATE, os.ModePerm)

    if err != nil {
        fmt.Printf("err: %v\n", err)
    } else {
        fmt.Printf("f.Name(): %v\n", f.Name())
        // f.Name(): demo.txt
        f.Close()
    }
}

```

其他方法

```go
// 等价于：OpenFile(name, O_RDWR|O_CREATE|O_TRUNC, 0666)
f, err := os.Create("demo.txt")


// 创建临时文件
f, _ := os.CreateTemp("", "test")
fmt.Printf("f.Name(): %v\n", f.Name())
// f.Name(): /var/folders/43/llymqbps19d74q2h_bgb00mr0000gn/T/test218970504


// 从指定字节数开始读取
n, err := f.ReadAt(buf, 3)

// 定位光标
f.Seek(3, 0)
```

按照字节数去取文件

```go
package main

import (
    "fmt"
    "io"
    "os"
)

func main() {
    f, _ := os.Open("demo.txt")

    for {
        // 字节缓冲区
        buf := make([]byte, 3)

        n, err := f.Read(buf)

        if err == io.EOF {
            break
        }

        fmt.Printf("n: %v\n", n)
        fmt.Printf("string(buf): %v\n", string(buf))
    }

    f.Close()
}

```

遍历目录

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    dirs, _ := os.ReadDir("./")
    for _, dir := range dirs {
        // 判断是否是目录
        fmt.Printf("dir: %v\n", dir.IsDir())
        // 输出名称
        fmt.Printf("dir: %v\n", dir.Name())
    }
}

```