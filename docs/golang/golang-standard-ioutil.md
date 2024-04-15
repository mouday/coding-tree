# 5.3、Golang标准库-ioutil

| 函数名 | 作用
| - | -
| ReadAll  | 读取数据，返回读到的字节slice 
| ReadDir | 读取一个目录，返回目录入口数组 []os.FileInfo
| ReadFile | 读取文件，返回文件内容（字节slice）
| WriteFile| 根据文件路径，写入字节slice
| TempDir| 在一个目录中创建指定前缀名的临时目录，返回新临时目录的路径
| TempFile| 在一个目录中创建指定前缀名的临时文件，返回os.File


示例

```go
package main

import (
    "fmt"
    "io/ioutil"
    "strings"
)

func main() {
    r := strings.NewReader("Hello world")
    b, err := ioutil.ReadAll(r)

    if err != nil {
        fmt.Printf("err: %v\n", err)
    } else {
        fmt.Printf("string(b): %v\n", string(b))
        // string(b): Hello world
    }
}

```

从文件中读取

```go
package main

import (
    "fmt"
    "io/ioutil"
    "os"
)

func main() {
    f, _ := os.Open("demo.txt")
    defer f.Close()

    b, err := ioutil.ReadAll(f)

    if err != nil {
        fmt.Printf("err: %v\n", err)
    } else {
        fmt.Printf("string(b): %v\n", string(b))
        // string(b): Hello world
    }
}

```

读取当前目录下所有文件

```go
package main

import (
    "fmt"
    "io/ioutil"
)

func main() {

    fi, _ := ioutil.ReadDir(".")

    for _, v := range fi {
        fmt.Printf("v.Name(): %v\n", v.Name())
    }

}

```

读取文件

```go
package main

import (
    "fmt"
    "io/ioutil"
)

func main() {

    b, _ := ioutil.ReadFile("demo.txt")

    fmt.Printf("string(b): %v\n", string(b))

}

```

写入文件内容

```go
package main

import (
    "io/ioutil"
)

func main() {

    ioutil.WriteFile("demo.txt", []byte("hello"), 0644)

}

```

临时文件

```go
package main

import (
    "io/ioutil"
    "log"
    "os"
)

func main() {

    // 创建临时文件
    tempfile, err := ioutil.TempFile("", "temp")

    if err != nil {
        log.Fatal(err)
    }

    // 函数结束移除临时文件
    defer os.Remove(tempfile.Name()) // clean up

    // 向临时文件写入字节数组
    content := []byte("hello world")

    if _, err := tempfile.Write(content); err != nil {
        log.Fatal(err)
    }

    if err := tempfile.Close(); err != nil {
        log.Fatal(err)
    }

}

```