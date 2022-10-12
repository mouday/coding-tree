# 5.11、Golang标准库-json

对json编码和解码

## 两个核心函数

```go
// struct 转 json
func Marshal(v any) ([]byte, error) {}

// json 转 struct
func Unmarshal(data []byte, v any) error {}
```

示例

```go
package main

import (
    "encoding/json"
    "fmt"
)

type Person struct {
    Name  string
    Age   int
    Email string
}

func main() {
    person := Person{
        Name:  "Tom",
        Age:   23,
        Email: "123@qq.com",
    }

    // 序列化
    b, _ := json.Marshal(person)
    fmt.Printf("b: %v\n", string(b))
    // b: {"Name":"Tom","Age":23,"Email":"123@qq.com"}

    // 反序列化
    str := `{"Name":"Tom","Age":23,"Email":"123@qq.com"}`
    var p Person
    json.Unmarshal([]byte(str), &p)
    fmt.Printf("p: %v\n", p)
    // p: {Tom 23 123@qq.com}
}

```

解析嵌套类型

```go
package main

import (
    "encoding/json"
    "fmt"
)

type Person struct {
    Name string
    Age  int
    Pets []string
}

func main() {

    person := Person{
        Name: "Tom",
        Age:  23,
        Pets: []string{"dog", "cat"},
    }

    // 序列化
    b, _ := json.Marshal(person)
    fmt.Printf("b: %v\n", string(b))
    // b: {"Name":"Tom","Age":23,"Pets":["dog","cat"]}

    // 反序列化
    str := `{"Name":"Tom","Age":23,"Pets":["dog","cat"]}`
    var p Person
    json.Unmarshal([]byte(str), &p)
    fmt.Printf("p: %v\n", p)
    // p: {Tom 23 [dog cat]}
}

```

## 两个核心结构体

```go
// io流 Reader
type Decoder struct {}

// io流 Writer
type Encoder struct {}
```

从文件中读取

person.json
```json
{
  "Name": "Tom",
  "Age": 23,
  "Pets": ["dog", "cat"]
}

```

```go
package main

import (
    "encoding/json"
    "fmt"
    "os"
)

func main() {

    // 从文件中读取
    f, _ := os.Open("person.json")
    defer f.Close()

    decoder := json.NewDecoder(f)

    var m map[string]interface{}

    decoder.Decode(&m)

    fmt.Printf("m: %v\n", m)
    // m: map[Age:23 Name:Tom Pets:[dog cat]]

}

```

写入文件

```go
package main

import (
    "encoding/json"
    "os"
)

type Person struct {
    Name string
    Age  int
    Pets []string
}

func main() {
    person := Person{
        Name: "Tom",
        Age:  23,
        Pets: []string{"dog", "cat"},
    }

    // 写入文件
    f, _ := os.OpenFile("person.json", os.O_WRONLY|os.O_CREATE, 0777)
    defer f.Close()

    encoder := json.NewEncoder(f)

    encoder.Encode(person)

}

```

输出结果 person.json

```json
{"Name":"Tom","Age":23,"Pets":["dog","cat"]}

```