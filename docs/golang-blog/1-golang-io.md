# Golang实现IO操作

## 目录

1. 输入输出的底层原理
2. 文件操作相关API 
3. 打开和关闭文件
4. 写文件
5. 读文件
6. 拷贝文件
7. bufio
8. ioutil工具包
9. 例子

## 1. 输入输出的底层原理

终端其实是一个文件(Linux下一切皆文件)，相关实例如下：

- os.Stdin：标准输出的文件实例，类型为`*File`
- os.Stdout：标准输入的文件实例，类型为`*File`
- os.Stderr：标准错误输出的文件实例，类型为`*File`

以文件方式操作终端：

```go
package main
 
import (
    "os"
)
 
func main() {
    var buf []byte

    // 从标准输入中读取
    os.Stdin.Read(buf[:])             

    // 写入标准输入
    os.Stdin.WriteString(string(buf)) 
}
```

## 2. 文件操作相关API 

根据提供的文件名创建新的文件，返回一个文件对象，默认权限0666，任何人可读可写，不可执行，如果文件存在，则会截断它(为空文件)，如果成功，返回的文件对象可用于I/O；

对应的文件描述符具有O_RDWR模式。如果出错，错误底层类型是`*PathError`。

```go
func Create(name string) (file *File, err error)
```

NewFile使用给出的Unix文件描述符和名称创建一个文件。 

```go
func NewFile(fd uintptr, name string) *File
```

只读方式打开一个名称为name文件。

```go
func Open(name string) (file *File, err error)
```

打开一个名为name的文件，flag是打开方式，只读或只写，不存在创建等，perm文件权限。 

```go
func OpenFile(name string, flag int, perm FileMode) (file *File, err error)
```

在指定位置(相对于文件起始位置)，写入byte类型的数据到文件，它返回写入的字节数和可能遇到的任何错误。如果返回值n!=len(b)，本方法会返回一个非nil的错误。

```go
func (f *File) WriteAt(b []byte, off int64) (n int, err error)
```
向文件中写入string类型的信息到文件。

```go
func (f *File) WriteString(s string) (ret int, err error)
```

从f中读取最多len(b)字节数的数据到b。

```go
func (f *File) Read(b []byte) (n int, err error)
```

从f的指定位置(相对于文件起始位置)，读取len(b)字节数并写入b。

```go
func (f *File) ReadAt(b []byte, off int64) (n int, err error)
```

删除name指定的文件或目录。

```go
func Remove(name string) error
```

## 3. 打开和关闭文件

os.Open()函数能够打开一个文件，返回一个*File和一个err。对得到的文件实例调用close()方法能够关闭文件。

```go
package main
 
import (
    "log"
    "os"
)
 
func main() {
    //只读的方式打开文件
    f, err := os.Open("./main.go")
    if err != nil {
        log.Println("open main.go file fail")
        return
    }
    //关闭文件
    defer f.Close()
}
```

## 4. 写文件

```go
package main
 
import (
    "log"
    "os"
)
 
func main() {
    //可读可写的方式创建一个文件
    f, err := os.Create("./xx.txt")
    if err != nil {
        log.Println("create file fail")
        return
    }
    defer f.Close()
 
    for i := 0; i < 5; i++ {
        f.Write([]byte("ab\n"))
        f.WriteString("ab\n")
    }
}
```

## 5. 读文件


文件读取可以用file.Read()和file.ReadAt()，读到文件末尾会返回io.EOF的错误。
```go
package main
 
import (
    "fmt"
    "io"
    "log"
    "os"
)
 
func main() {
    f, err := os.Open("./xx.txt")
    if err != nil {
        log.Println("open file fail")
        return
    }
    defer f.Close()
 
    var content []byte
    for {
        var buf [128]byte
        n, err := f.Read(buf[:])
        if err == io.EOF {
            //读到文件末尾
            break
        }
        if err != nil {
            log.Println("Read file fail", err)
            return
        }
        content = append(content, buf[:n]...) //buf[:n]切片被打散传入
    }
    fmt.Println(string(content))
}
```

`...`的用法：三个点`...`其实是go的一种语法糖（糖衣语法）

第一个用法主要是用于函数有多个不定参数的情况，表示为可变参数，可以接受任意个数但相同类型的参数。
第二个用法是slice可以被打散进行传递。

## 6. 拷贝文件

```go
package main
 
import (
    "io"
    "log"
    "os"
)
 
func main() {
    f1, err := os.Open("./xx.txt")
    if err != nil {
        log.Println("open xx.txt file fail", err)
        return
    }
    defer f1.Close()
    f2, err := os.Create("./abc.txt")
    if err != nil {
        log.Println("create file fail ", err)
        return
    }
    defer f2.Close()
 
    for {
        var buf [128]byte
        n, err := f1.Read(buf[:])
        if err == io.EOF {
            log.Println("读取完毕")
            break
        }
        if err != nil {
            return
        }
 
        f2.Write(buf[:n])
    }
}
```

## 7. bufio

bufio包实现了带缓冲区的读写，是对文件读写的封装。
bufio缓冲写数据。


bufio读数据 ，bufio先把数据读/写到缓冲区，达到某一上限，会刷新到文件中，也可以强制刷新。
```go

package main
 
import (
    "bufio"
    "fmt"
    "io"
    "log"
    "os"
)
 
func wr() {
    f, err := os.OpenFile("./xxx.txt", os.O_CREATE|os.O_WRONLY, 0664)
    if err != nil {
        log.Println("open file fail ", err)
        return
    }
    defer f.Close()
    //获取writer对象
    writer := bufio.NewWriter(f)
    for i := 0; i < 5; i++ {
        writer.WriteString("hello\n")
    }
    //刷新缓冲区，强制写入
    writer.Flush()
}
 
func rd() {
    f, err := os.Open("./xxx.txt")
    if err != nil {
        log.Println("open file fail")
        return
    }
    defer f.Close()
 
    //获取reader对象
    reader := bufio.NewReader(f)
    var content []byte
    for {
        line, _, err := reader.ReadLine()
        if err == io.EOF {
            log.Println("读取完毕")
            break
        }
        if err != nil {
            return
        }
        content = append(content, line...)
    }
    fmt.Println(string(content))
}
 
func main() {
    wr()
    rd()
}
```

## 8. ioutil工具包

工具包写文件

工具包读文件

```go
package main
 
import (
    "fmt"
    "io/ioutil"
    "log"
)
 
func wr() {
    err := ioutil.WriteFile("./xxxx.txt", []byte("hello world!"), 0666)
    if err != nil {
        log.Println("err")
        return
    }
}
 
func rd() {
    data, err := ioutil.ReadFile("./xxxx.txt")
    if err != nil {
        log.Println("err")
        return
    }
    fmt.Println(string(data))
}
 
func main() {
    wr()
    rd()
}
```

## 9. 例子

实现cat命令

```go
package main
 
import (
    "bufio"
    "flag"
    "fmt"
    "io"
    "log"
    "os"
)
 
func cat(reader *bufio.Reader) {
    for {
        buf, err := reader.ReadBytes('\n') //注意是字符
        if err == io.EOF {
            break
        }
        fmt.Fprintf(os.Stdout, "%s", string(buf))
    }
}
 
func main() {
    flag.Parse()
    if flag.NArg() == 0 {
        cat(bufio.NewReader(os.Stdin))
    } else {
        for i := 0; i &lt; flag.NArg(); i++ {
            f, err := os.Open(flag.Arg(i))
            if err != nil {
                log.Printf("open file %s fail, err %v\n", flag.Arg(i), err)
                continue
            }
            cat(bufio.NewReader(f))
            f.Close()
        }
    }
}
```

原文地址：https://www.jb51.net/jiaoben/3210657qu.htm