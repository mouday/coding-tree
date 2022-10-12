# 5.4、Golang标准库-bufio

bufio库实现了有缓冲的I/O

读示例

```go
package main

import (
    "bufio"
    "fmt"
    "strings"
)

func main() {
    reader := strings.NewReader("hello world")

    bufReader := bufio.NewReader(reader)

    s, _ := bufReader.ReadString('\n')
    fmt.Printf("s: %v\n", s)
    // s: hello world
}

```

写示例

```go
package main

import (
    "bufio"
    "os"
)

func main() {
    f, _ := os.OpenFile("demo.txt", os.O_RDWR, 0777)
    defer f.Close()

    w := bufio.NewWriter(f)
    w.WriteString("hello")
    w.Flush()
}

```

Scanner 示例

```go
package main

import (
    "bufio"
    "fmt"
    "strings"
)

func main() {
    r := strings.NewReader("AAA BBB CCC")
    s := bufio.NewScanner(r)
    s.Split(bufio.ScanWords)
    for s.Scan() {
        fmt.Printf("s.Text(): %v\n", s.Text())
    }
    // s.Text(): AAA
    // s.Text(): BBB
    // s.Text(): CCC
}

```
