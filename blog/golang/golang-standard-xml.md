# 5.12、Golang标准库-xml

对xml解析

## 两个核心函数

```go
// struct 转 xml
func Marshal(v any) ([]byte, error) {}

// xml 转 struct
func Unmarshal(data []byte, v any) error {}
```

## 两个核心结构体

```go
// 从输入流读取并解析xml
type Decoder struct {}

// 将xml写入到输出流
type Encoder struct {}
```

序列化

```go
package main

import (
    "encoding/xml"
    "fmt"
)

type Person struct {
    XMLName xml.Name `xml:"person"`
    Name    string   `xml:"name"`
    Age     int      `xml:"age"`
    Email   string   `xml:"email"`
}

func main() {
    person := Person{
        Name:  "Tom",
        Age:   23,
        Email: "123@qq.com",
    }

    b, _ := xml.Marshal(person)
    fmt.Printf("b: %v\n", string(b))
    // b: <person><name>Tom</name><age>23</age><email>123@qq.com</email></person>

    // 带缩进格式
    b2, _ := xml.MarshalIndent(person, " ", " ")
    fmt.Printf("%v\n", string(b2))
    //  <person>
    //   <name>Tom</name>
    //   <age>23</age>
    //   <email>123@qq.com</email>
    //  </person>
}

```

反序列化

```go
package main

import (
    "encoding/xml"
    "fmt"
)

type Person struct {
    XMLName xml.Name `xml:"person"`
    Name    string   `xml:"name"`
    Age     int      `xml:"age"`
    Email   string   `xml:"email"`
}

func main() {
    str := `
    <person>
        <name>Tom</name>
        <age>23</age>
        <email>123@qq.com</email>
    </person>
    `

    b := []byte(str)
    var person Person
    xml.Unmarshal(b, &person)
    fmt.Printf("person: %v\n", person)
    // person: {{ person} Tom 23 123@qq.com}
}

```

## 读写xml文件

从文件读取

person.xml

```xml
<person>
    <name>Tom</name>
    <age>23</age>
    <email>123@qq.com</email>
</person>
```

```go
package main

import (
    "encoding/xml"
    "fmt"
    "os"
)

type Person struct {
    XMLName xml.Name `xml:"person"`
    Name    string   `xml:"name"`
    Age     int      `xml:"age"`
    Email   string   `xml:"email"`
}

func main() {
    content, _ := os.ReadFile("person.xml")

    b := []byte(content)
    var person Person
    xml.Unmarshal(b, &person)
    fmt.Printf("person: %v\n", person)
    // person: {{ person} Tom 23 123@qq.com}
}

```

写入到文件

```go
package main

import (
    "encoding/xml"
    "os"
)

type Person struct {
    XMLName xml.Name `xml:"person"`
    Name    string   `xml:"name"`
    Age     int      `xml:"age"`
    Email   string   `xml:"email"`
}

func main() {
    person := Person{
        Name:  "Tom",
        Age:   23,
        Email: "123@qq.com",
    }

    f, _ := os.OpenFile("person.xml", os.O_WRONLY|os.O_CREATE, os.ModePerm)
    defer f.Close()

    encoder := xml.NewEncoder(f)
    encoder.Encode(person)
}

```

输出结果 person.xml
```xml
<person><name>Tom</name><age>23</age><email>123@qq.com</email></person>
```
