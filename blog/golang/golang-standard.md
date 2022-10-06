# 第二十一章 Golang标准库

标准库文档：https://pkg.go.dev/std

## os模块-文件目录操作

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

## os模块-文件读写操作

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


写入字节数组

```go
package main

import (
    "os"
)

func main() {
    // 追加写入
    f, _ := os.OpenFile("demo.txt", os.O_RDWR|os.O_APPEND, 0775)

    f.Write([]byte("hello"))

    f.Close()
}

```

写入字符串
```go
package main

import (
    "os"
)

func main() {
    // 覆盖写入 
    f, _ := os.OpenFile("demo.txt", os.O_RDWR|os.O_TRUNC, 0775)

    f.WriteString("hello")

    f.Close()
}

```

指定起始点

```go
package main

import (
    "os"
)

func main() {
    f, _ := os.OpenFile("demo.txt", os.O_RDWR, 0775)

    f.WriteAt([]byte("hello"), 3)

    f.Close()
}

```

## os模块-进程相关操作

示例

```go
package main

import (
	"fmt"
	"os"
	"time"
)

func main() {
	// 获得当前进程id
	fmt.Printf("os.Getpid(): %v\n", os.Getpid())
	// os.Getpid(): 92729

	// 获得父进程id
	fmt.Printf("os.Getppid(): %v\n", os.Getppid())
	// os.Getppid(): 92713

	// 设置进程属性
	attr := &os.ProcAttr{
		// files指定新进程继承的活动文件对象
		// 参数：标准输入、标准输出、标准错误输出
		Files: []*os.File{os.Stdin, os.Stdout, os.Stderr},
		// 新进程的环境变量
		Env: os.Environ(),
	}

	// 开启新进程 (name string, argv []string, attr *ProcAttr)
	p, _ := os.StartProcess("/Users/user/Applications/golang/1.19/bin/go",
		[]string{"/Users/user/Applications/golang/1.19/bin/go", "run", "hello.go"},
		attr)

	fmt.Printf("p: %v\n", p)
	// p: &{94937 0 0 {{0 0} 0 0 0 0}}

	fmt.Printf("p.Pid: %v\n", p.Pid)
	// p.Pid: 94937

	// 通过进程id查找进程
	p2, _ := os.FindProcess(p.Pid)
	fmt.Printf("p2: %v\n", p2)
	// p2: &{95057 0 0 {{0 0} 0 0 0 0}}

	// 等待10秒执行函数
	time.AfterFunc(time.Second*10, func() {
		// 向p进程发送退出信号
		p.Signal(os.Kill)
	})

	// 等待进程p 退出，返回进程状态
	ps, _ := p.Wait()
	fmt.Printf("ps.String(): %v\n", ps.String())
	// ps.String(): exit status 0
}

```

## os模块-环境变量相关

示例

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    // 获取所有环境变量
    s := os.Environ()
    fmt.Printf("s: %v\n", s)

    // 获取某个环境变量
    s2 := os.Getenv("GOROOT")
    fmt.Printf("s2: %v\n", s2)

    // 设置环境变量
    os.Setenv("GO_EVN_VAR", "go_evn_var")

    // 查找环境变量
    s3, _ := os.LookupEnv("GO_EVN_VAR")
    fmt.Printf("s3: %v\n", s3)
    // s3: go_evn_var

    // 表达式替换
    s4 := os.ExpandEnv("var: $GO_EVN_VAR")
    fmt.Printf("s4: %v\n", s4)
    // s4: var: go_evn_var

    // 清空环境变量
    // os.Clearenv()
}

```

## io模块-输入输出

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